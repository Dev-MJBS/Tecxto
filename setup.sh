#!/bin/bash

echo "🚀 Configurando ambiente para Corretor de Redações IA"

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale o Python 3.9+"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"

# Criar ambiente virtual se não existir
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativar ambiente virtual e instalar dependências Python
echo "📦 Instalando dependências Python no ambiente virtual..."
source venv/bin/activate
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ Dependências Python instaladas com sucesso"
else
    echo "❌ Erro ao instalar dependências Python"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm não encontrado. Por favor, instale o Node.js"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Instalar dependências Node.js
echo "📦 Instalando dependências Node.js..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências Node.js instaladas com sucesso"
else
    echo "❌ Erro ao instalar dependências Node.js"
    exit 1
fi

# Verificar se arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando a partir do exemplo..."
    cp .env.example .env
    echo "📝 Configure sua OPENROUTER_API_KEY no arquivo .env"
else
    echo "✅ Arquivo .env encontrado"
fi

echo ""
echo "🎉 Configuração concluída!"
echo ""
echo "Para executar o projeto, use os scripts:"
echo "  Backend:  ./start-backend.sh"
echo "  Frontend: ./start-frontend.sh"
echo ""
echo "Não esqueça de configurar sua OPENROUTER_API_KEY no arquivo .env"
