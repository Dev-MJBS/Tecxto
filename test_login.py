#!/usr/bin/env python3
import requests
import json

# Testar login do usuário JobAdmin
login_data = {
    "username": "mjobbrito@gmail.com",
    "password": "admin1234"
}

print("🔄 Testando login do usuário JobAdmin...")

try:
    response = requests.post('http://localhost:5000/auth/login', json=login_data)
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Login realizado com sucesso!")
        print(f"📧 Usuário: {data['data']['username']}")
        print(f"🔐 Admin: {data['data']['is_admin']}")
        print(f"💳 Assinatura: {data['data']['has_subscription']}")
        print(f"⏰ Expira em: {data['data']['subscription_end']}")
        print(f"🎟️ Token: {data['data']['access_token'][:50]}...")
    else:
        print(f"❌ Erro no login: {response.status_code}")
        print(f"📄 Resposta: {response.text}")
        
except Exception as e:
    print(f"❌ Erro de conexão: {str(e)}")
    print("🔍 Verifique se o servidor Flask está rodando na porta 5000")
