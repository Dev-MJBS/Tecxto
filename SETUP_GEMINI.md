# Configuração da API Google Gemini

Para utilizar a funcionalidade de análise de redações manuscritas, você precisa configurar a API do Google Gemini:

## 1. Obter a chave da API Google

1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

## 2. Configurar no projeto

1. Edite o arquivo `/home/job/redacao_IA/api/.env`
2. Substitua `your_google_api_key_here` pela sua chave real:

```
GOOGLE_API_KEY=sua_chave_aqui
```

## 3. Funcionalidades suportadas

### PDFs (usando OpenRouter/Claude)
- Textos digitados
- Análise de texto extraído

### Imagens (usando Google Gemini)
- Fotos de redações manuscritas
- PNG, JPG, JPEG
- OCR automático + análise
- Transcrição do texto manuscrito

## 4. Teste

Após configurar, reinicie o servidor Flask:

```bash
cd /home/job/redacao_IA
source venv/bin/activate
python api/index.py
```

O sistema automaticamente detectará o tipo de arquivo e usará a API apropriada.
