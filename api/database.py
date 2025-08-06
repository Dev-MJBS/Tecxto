import sqlite3
from datetime import datetime, timedelta
import os
import tempfile

class Database:
    def __init__(self, db_path=None):
        # No Vercel, usar diretório temporário
        if db_path is None:
            if os.getenv('VERCEL'):
                # Em produção no Vercel, usar /tmp
                self.db_path = '/tmp/tecxto_ia.db'
            else:
                # Em desenvolvimento local
                self.db_path = os.getenv('DATABASE_PATH', 'tecxto_ia.db')
        else:
            self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Inicializa o banco de dados criando as tabelas"""
        self.create_tables()
    
    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    def create_tables(self):
        """Cria as tabelas se não existirem"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Tabela de usuários
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1,
            is_admin BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')
        
        # Tabela de códigos de pagamento
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS payment_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE NOT NULL,
            user_id INTEGER,
            days_duration INTEGER NOT NULL,
            price REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_used BOOLEAN DEFAULT FALSE,
            used_at TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        ''')
        
        # Tabela de assinaturas ativas
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            payment_code_id INTEGER NOT NULL,
            start_date TIMESTAMP NOT NULL,
            end_date TIMESTAMP NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            usage_count INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (payment_code_id) REFERENCES payment_codes (id)
        )
        ''')
        
        # Tabela de logs de uso
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS usage_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            file_type TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        ''')
        
        conn.commit()
        conn.close()
        
        # Criar usuário administrador se não existir
        self.create_admin_user()

    def create_admin_user(self):
        """Cria o usuário administrador se não existir"""
        from flask_bcrypt import Bcrypt
        bcrypt = Bcrypt()
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Verificar se o admin já existe
        cursor.execute('SELECT id FROM users WHERE email = ?', ('mateus.job@outlook.com',))
        if cursor.fetchone():
            # Apenas garantir que é admin
            cursor.execute('UPDATE users SET is_admin = 1 WHERE email = ?', ('mateus.job@outlook.com',))
            conn.commit()
        else:
            # Buscar senha do admin das variáveis de ambiente
            admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')  # Senha padrão temporária
            password_hash = bcrypt.generate_password_hash(admin_password).decode('utf-8')
            cursor.execute('''
            INSERT INTO users (username, email, password_hash, is_admin, is_active)
            VALUES (?, ?, ?, 1, 1)
            ''', ('admin', 'mateus.job@outlook.com', password_hash))
            conn.commit()
            print("Usuário administrador criado com sucesso!")
        
        conn.close()
    
    def is_admin(self, user_id):
        """Verifica se o usuário é administrador"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT is_admin FROM users WHERE id = ?', (user_id,))
        result = cursor.fetchone()
        
        conn.close()
        
        return result[0] if result else False
    
    def get_all_users(self):
        """Lista todos os usuários (apenas para admin)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
        SELECT u.id, u.username, u.email, u.created_at, u.is_active,
               s.end_date, s.usage_count,
               CASE WHEN s.end_date > datetime('now') THEN 1 ELSE 0 END as has_subscription
        FROM users u
        LEFT JOIN subscriptions s ON u.id = s.user_id AND s.is_active = 1
        ORDER BY u.created_at DESC
        ''')
        
        users = cursor.fetchall()
        conn.close()
        
        return users
    
    def activate_user_subscription(self, user_id, days_duration, activated_by_admin_id):
        """Ativa assinatura de um usuário manualmente (admin)"""
        from datetime import datetime, timedelta
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Desativar assinaturas anteriores
            cursor.execute('UPDATE subscriptions SET is_active = 0 WHERE user_id = ?', (user_id,))
            
            # Criar nova assinatura
            start_date = datetime.now()
            end_date = start_date + timedelta(days=days_duration)
            
            cursor.execute('''
            INSERT INTO subscriptions (user_id, payment_code_id, start_date, end_date, is_active, usage_count)
            VALUES (?, 0, ?, ?, 1, 0)
            ''', (user_id, start_date, end_date))
            
            # Log da ação administrativa
            cursor.execute('''
            INSERT INTO usage_logs (user_id, action, file_type)
            VALUES (?, ?, ?)
            ''', (activated_by_admin_id, f"admin_activate_user_{user_id}_for_{days_duration}_days", "ADMIN"))
            
            conn.commit()
            return True, f"Usuário ativado com sucesso por {days_duration} dias"
            
        except Exception as e:
            conn.rollback()
            return False, f"Erro ao ativar usuário: {str(e)}"
        finally:
            conn.close()
    
    def create_payment_code(self, code, days_duration, price):
        """Cria um código de pagamento"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
            INSERT INTO payment_codes (code, days_duration, price)
            VALUES (?, ?, ?)
            ''', (code, days_duration, price))
            
            conn.commit()
            return True
        except sqlite3.IntegrityError:
            return False
        finally:
            conn.close()
    
    def use_payment_code(self, code, user_id):
        """Usa um código de pagamento para ativar assinatura"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Verificar se o código existe e não foi usado
            cursor.execute('''
            SELECT id, days_duration FROM payment_codes 
            WHERE code = ? AND is_used = FALSE
            ''', (code,))
            
            result = cursor.fetchone()
            if not result:
                return False, "Código inválido ou já utilizado"
            
            code_id, days_duration = result
            
            # Marcar código como usado
            cursor.execute('''
            UPDATE payment_codes 
            SET is_used = TRUE, used_at = CURRENT_TIMESTAMP, user_id = ?
            WHERE id = ?
            ''', (user_id, code_id))
            
            # Criar/atualizar assinatura
            start_date = datetime.now()
            end_date = start_date + timedelta(days=days_duration)
            
            cursor.execute('''
            INSERT OR REPLACE INTO subscriptions 
            (user_id, payment_code_id, start_date, end_date, is_active)
            VALUES (?, ?, ?, ?, TRUE)
            ''', (user_id, code_id, start_date, end_date))
            
            conn.commit()
            return True, f"Assinatura ativada por {days_duration} dias"
            
        except Exception as e:
            conn.rollback()
            return False, f"Erro: {str(e)}"
        finally:
            conn.close()
    
    def check_user_subscription(self, user_id):
        """Verifica se o usuário tem assinatura ativa"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
        SELECT end_date, usage_count FROM subscriptions 
        WHERE user_id = ? AND is_active = TRUE AND end_date > CURRENT_TIMESTAMP
        ''', (user_id,))
        
        result = cursor.fetchone()
        conn.close()
        
        if result:
            end_date, usage_count = result
            return True, end_date, usage_count
        
        return False, None, 0
    
    def log_usage(self, user_id, action, file_type=None):
        """Registra uso da API"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
        INSERT INTO usage_logs (user_id, action, file_type)
        VALUES (?, ?, ?)
        ''', (user_id, action, file_type))
        
        # Incrementar contador de uso
        cursor.execute('''
        UPDATE subscriptions 
        SET usage_count = usage_count + 1
        WHERE user_id = ? AND is_active = TRUE
        ''', (user_id,))
        
        conn.commit()
        conn.close()
