#!/usr/bin/env python3
import os
import sys
sys.path.append('/home/job/redacao_IA/api')

from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
from database import Database
from datetime import datetime, timedelta

# Carregar .env
load_dotenv('/home/job/redacao_IA/.env')

bcrypt = Bcrypt()
db = Database()

# Criar usuário de teste JobAdmin
username = 'JobAdmin'
email = 'mjobbrito@gmail.com'
password = 'admin1234'

conn = db.get_connection()
cursor = conn.cursor()

try:
    # Verificar se o usuário já existe
    cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        user_id = existing_user[0]
        print(f"Usuário {username} já existe com ID: {user_id}")
        
        # Atualizar senha
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        cursor.execute('UPDATE users SET password_hash = ?, is_admin = 1 WHERE id = ?', (password_hash, user_id))
        print("Senha atualizada e privilégios de admin concedidos")
    else:
        # Criar novo usuário
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        cursor.execute('''
        INSERT INTO users (username, email, password_hash, is_admin, is_active)
        VALUES (?, ?, ?, 1, 1)
        ''', (username, email, password_hash))
        user_id = cursor.lastrowid
        print(f"Usuário {username} criado com sucesso! ID: {user_id}")
    
    # Remover assinaturas anteriores
    cursor.execute('UPDATE subscriptions SET is_active = 0 WHERE user_id = ?', (user_id,))
    
    # Criar assinatura de 10 anos (acesso praticamente ilimitado)
    start_date = datetime.now()
    end_date = start_date + timedelta(days=3650)  # 10 anos
    
    cursor.execute('''
    INSERT INTO subscriptions (user_id, payment_code_id, start_date, end_date, is_active, usage_count)
    VALUES (?, 0, ?, ?, 1, 0)
    ''', (user_id, start_date, end_date))
    
    # Log da criação
    cursor.execute('''
    INSERT INTO usage_logs (user_id, action, file_type)
    VALUES (?, ?, ?)
    ''', (user_id, "admin_create_test_user_unlimited_access", "ADMIN"))
    
    conn.commit()
    
    print("\n✅ Usuário de teste criado com sucesso!")
    print(f"📧 Email: {email}")
    print(f"👤 Username: {username}")  
    print(f"🔑 Senha: {password}")
    print(f"⏰ Acesso até: {end_date.strftime('%d/%m/%Y')}")
    print("🚀 Status: Admin com acesso ilimitado")
    
except Exception as e:
    conn.rollback()
    print(f"❌ Erro ao criar usuário: {str(e)}")
finally:
    conn.close()
