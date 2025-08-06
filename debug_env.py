#!/usr/bin/env python3
"""
Script de diagnóstico para verificar problemas de ambiente no Vercel
"""
import os
from datetime import datetime
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

def check_environment():
    """Verifica variáveis de ambiente críticas"""
    print("🔍 DIAGNÓSTICO DE AMBIENTE - VERCEL")
    print("=" * 50)
    print(f"⏰ Data/Hora: {datetime.now()}")
    print(f"🐍 Python Path: {os.getcwd()}")
    print(f"🌍 VERCEL env: {os.getenv('VERCEL', 'Não detectado')}")
    print()
    
    # Variáveis críticas
    critical_vars = [
        'JWT_SECRET_KEY',
        'ADMIN_PASSWORD',
        'OPENROUTER_API_KEY',
        'GOOGLE_API_KEY'
    ]
    
    print("🔑 VARIÁVEIS DE AMBIENTE:")
    for var in critical_vars:
        value = os.getenv(var)
        if value:
            # Mostrar apenas primeiros 10 chars por segurança
            display_value = value[:10] + "..." if len(value) > 10 else value
            print(f"✅ {var}: {display_value}")
        else:
            print(f"❌ {var}: NÃO ENCONTRADA")
    
    print()
    
    # Testar banco de dados
    print("💾 TESTE DE BANCO DE DADOS:")
    try:
        import sys
        sys.path.append('api')
        from database import Database
        db = Database()
        print("✅ Classe Database importada com sucesso")
        
        # Verificar caminho do banco
        print(f"📁 Caminho do banco: {db.db_path}")
        
        # Testar conexão
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        conn.close()
        print("✅ Conexão com banco de dados OK")
        
    except Exception as e:
        print(f"❌ Erro no banco: {str(e)}")
    
    print()
    
    # Testar auth
    print("🔐 TESTE DE AUTENTICAÇÃO:")
    try:
        import sys
        sys.path.append('api')
        from auth import AuthManager
        print("✅ AuthManager importado com sucesso")
        
        # Testar bcrypt
        from flask_bcrypt import Bcrypt
        bcrypt = Bcrypt()
        test_hash = bcrypt.generate_password_hash("teste123").decode('utf-8')
        print("✅ Bcrypt funcionando")
        
    except Exception as e:
        print(f"❌ Erro na autenticação: {str(e)}")

if __name__ == "__main__":
    check_environment()
