from flask import request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, verify_jwt_in_request
from flask_bcrypt import Bcrypt
from functools import wraps
from datetime import timedelta
import sqlite3
from database import Database

bcrypt = Bcrypt()

class AuthManager:
    @staticmethod
    def register_user(username, email, password):
        """Registra um novo usuário"""
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        try:
            password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
            
            cursor.execute('''
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
            ''', (username, email, password_hash))
            
            conn.commit()
            user_id = cursor.lastrowid
            
            return True, user_id, "Usuário registrado com sucesso"
            
        except sqlite3.IntegrityError as e:
            if 'username' in str(e):
                return False, None, "Nome de usuário já existe"
            elif 'email' in str(e):
                return False, None, "Email já está em uso"
            else:
                return False, None, "Erro ao registrar usuário"
        finally:
            conn.close()
    
    @staticmethod
    def login_user(username, password):
        """Autentica um usuário"""
        db = Database()
        conn = db.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
        SELECT id, username, password_hash, is_active, is_admin FROM users 
        WHERE username = ? OR email = ?
        ''', (username, username))
        
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            return False, None, "Usuário não encontrado"
        
        user_id, username, password_hash, is_active, is_admin = result
        
        if not is_active:
            return False, None, "Conta desativada"
        
        if bcrypt.check_password_hash(password_hash, password):
            # Verificar se tem assinatura ativa
            has_subscription, end_date, usage_count = db.check_user_subscription(user_id)
            
            # Administradores têm acesso ilimitado
            if is_admin:
                has_subscription = True
                if not end_date:
                    from datetime import datetime, timedelta as td
                    end_date = datetime.now() + td(days=3650)  # 10 anos
            
            access_token = create_access_token(
                identity=user_id,
                expires_delta=timedelta(days=30)
            )
            
            # Converter end_date para formato ISO se for datetime object
            end_date_iso = None
            if end_date:
                if hasattr(end_date, 'isoformat'):
                    end_date_iso = end_date.isoformat()
                else:
                    # Se for string do banco, manter como está
                    end_date_iso = str(end_date)
            
            return True, {
                'access_token': access_token,
                'user_id': user_id,
                'username': username,
                'is_admin': is_admin,
                'has_subscription': has_subscription,
                'subscription_end': end_date_iso,
                'usage_count': usage_count
            }, "Login realizado com sucesso"
        
        return False, None, "Senha incorreta"

def require_subscription(f):
    """Decorator que verifica se o usuário tem assinatura ativa"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        
        db = Database()
        
        # Verificar se é administrador (tem acesso ilimitado)
        if db.is_admin(current_user_id):
            # Log do uso para admin
            action = f.__name__
            db.log_usage(current_user_id, f"admin_{action}")
            return f(*args, **kwargs)
        
        # Para usuários normais, verificar assinatura
        has_subscription, end_date, usage_count = db.check_user_subscription(current_user_id)
        
        if not has_subscription:
            return jsonify({
                'error': 'Assinatura necessária',
                'message': 'Você precisa de uma assinatura ativa para usar este serviço',
                'subscription_required': True
            }), 403
        
        # Log do uso
        action = f.__name__
        db.log_usage(current_user_id, action)
        
        return f(*args, **kwargs)
    
    return decorated_function

def require_auth(f):
    """Decorator que verifica apenas se o usuário está logado"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        return f(*args, **kwargs)
    
    return decorated_function

def require_admin(f):
    """Decorator que verifica se o usuário é administrador"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        
        db = Database()
        if not db.is_admin(current_user_id):
            return jsonify({
                'error': 'Acesso negado',
                'message': 'Esta função requer privilégios de administrador'
            }), 403
        
        return f(*args, **kwargs)
    
    return decorated_function
