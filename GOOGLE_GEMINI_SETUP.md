# 🔑 Como obter a chave do Google Gemini

## Passo a passo:

1. **Acesse**: https://makersuite.google.com/app/apikey

2. **Faça login** com sua conta Google

3. **Clique em "Create API Key"**

4. **Copie a chave** gerada (ela começa com `AIza...`)

5. **Substitua no arquivo `.env`**:
   ```
   GOOGLE_API_KEY=AIzaSyA... (sua chave aqui)
   ```

## ⚠️ Importante:

- A chave do Google Gemini é **diferente** do OpenRouter
- Ela começa com `AIza...` não com `sk-or...`
- É gratuita com limites generosos
- Necessária para analisar imagens manuscritas

## 🧪 Testando:

Após configurar a chave correta:
1. Reinicie o servidor Flask
2. Teste com uma imagem de redação manuscrita
3. A análise deve funcionar normalmente

## 💡 Se não conseguir a chave do Google:
- Por enquanto, use apenas PDFs (funciona perfeitamente)
- PDFs são analisados com Claude 3.5 Sonnet
- Imagens serão analisadas quando configurar o Gemini
