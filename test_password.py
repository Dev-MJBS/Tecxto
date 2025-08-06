#!/usr/bin/env python3
import os
import sys
sys.path.append('/home/job/redacao_IA/api')

from flask_bcrypt import Bcrypt
from dotenv import load_dotenv

# Carregar .env
load_dotenv('/home/job/redacao_IA/.env')

bcrypt = Bcrypt()

# Verificar a senha do .env
admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')
print(f"Senha do ambiente: '{admin_password}'")

# Criar hash da senha
password_hash = bcrypt.generate_password_hash(admin_password).decode('utf-8')
print(f"Hash gerado: {password_hash}")

# Testar verificação
test_passwords = [
    '!Band9al7',  # Sua senha
    admin_password,  # Senha do ambiente
    'admin123'  # Senha padrão
]

for test_pass in test_passwords:
    result = bcrypt.check_password_hash(password_hash, test_pass)
    print(f"Teste senha '{test_pass}': {'✓' if result else '✗'}")
