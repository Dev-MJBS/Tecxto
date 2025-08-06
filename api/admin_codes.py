#!/usr/bin/env python3
"""
Script administrativo para gerar códigos de pagamento
Uso: python admin_codes.py [quantidade] [dias_duracao]
"""

import sys
import os
from database import Database

def generate_payment_codes(quantity=1, duration_days=30):
    """Gera códigos de pagamento para venda"""
    db = Database()
    db.create_tables()
    
    codes = []
    
    print(f"Gerando {quantity} códigos com duração de {duration_days} dias...\n")
    
    for i in range(quantity):
        code = db.create_payment_code(duration_days, 0.0)  # Preço 0 para códigos administrativos
        if code:
            codes.append(code)
            print(f"Código {i+1}: {code}")
        else:
            print(f"Erro ao gerar código {i+1}")
    
    print(f"\n✅ {len(codes)} códigos gerados com sucesso!")
    print(f"📅 Duração: {duration_days} dias cada")
    print(f"💰 Venda estes códigos para seus alunos")
    
    return codes

def list_active_codes():
    """Lista códigos ainda não utilizados"""
    db = Database()
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT code, duration_days, created_at FROM payment_codes 
    WHERE is_used = 0 
    ORDER BY created_at DESC
    ''')
    
    codes = cursor.fetchall()
    conn.close()
    
    if not codes:
        print("❌ Nenhum código disponível para venda")
        return
    
    print(f"📋 Códigos disponíveis para venda ({len(codes)}):\n")
    for code, duration, created_at in codes:
        print(f"Código: {code}")
        print(f"Duração: {duration} dias")
        print(f"Criado em: {created_at}")
        print("-" * 40)

def show_usage():
    """Mostra como usar o script"""
    print("Uso:")
    print("  python admin_codes.py generate [quantidade] [dias]")
    print("  python admin_codes.py list")
    print("\nExemplos:")
    print("  python admin_codes.py generate 10 30    # Gera 10 códigos de 30 dias")
    print("  python admin_codes.py generate 5 7      # Gera 5 códigos de 7 dias") 
    print("  python admin_codes.py list              # Lista códigos disponíveis")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        show_usage()
        sys.exit(1)
    
    command = sys.argv[1].lower()
    
    if command == "generate":
        quantity = int(sys.argv[2]) if len(sys.argv) > 2 else 1
        duration = int(sys.argv[3]) if len(sys.argv) > 3 else 30
        
        if quantity > 100:
            print("❌ Máximo 100 códigos por vez")
            sys.exit(1)
        
        if duration > 365:
            print("❌ Duração máxima: 365 dias")
            sys.exit(1)
        
        generate_payment_codes(quantity, duration)
    
    elif command == "list":
        list_active_codes()
    
    else:
        print(f"❌ Comando '{command}' não reconhecido")
        show_usage()
        sys.exit(1)
