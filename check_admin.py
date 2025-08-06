#!/usr/bin/env python3
import sqlite3
import os
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv

# Carregar .env
load_dotenv('/home/job/redacao_IA/.env')

bcrypt = Bcrypt()

# Conectar ao banco
db_path = 'tecxto_ia.db'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Verificar usuário admin
cursor.execute('SELECT id, username, email, password_hash FROM users WHERE email = ?', ('mateus.job@outlook.com',))
result = cursor.fetchone()

if result:
    user_id, username, email, stored_hash = result
    print(f"Usuário encontrado:")
    print(f"ID: {user_id}")
    print(f"Username: {username}")
    print(f"Email: {email}")
    print(f"Hash armazenado: {stored_hash}")
    
    # Testar senhas
    test_passwords = ['!Band9al7', 'admin123']
    for password in test_passwords:
        is_valid = bcrypt.check_password_hash(stored_hash, password)
        print(f"Senha '{password}': {'✓ VÁLIDA' if is_valid else '✗ INVÁLIDA'}")
        
    # Atualizar senha se necessário
    correct_password = os.getenv('ADMIN_PASSWORD', '!Band9al7')
    new_hash = bcrypt.generate_password_hash(correct_password).decode('utf-8')
    cursor.execute('UPDATE users SET password_hash = ? WHERE email = ?', (new_hash, 'mateus.job@outlook.com'))
    conn.commit()
    print(f"\n✅ Senha atualizada com: {correct_password}")
    
else:
    print("❌ Usuário admin não encontrado no banco!")

conn.close()
