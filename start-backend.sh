#!/bin/bash
echo "🚀 Iniciando servidor backend..."
cd "$(dirname "$0")"
source venv/bin/activate
python api/index.py
