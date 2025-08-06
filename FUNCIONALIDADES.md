# RedaçãoIA - Funcionalidades Avançadas

## 🚀 Novas Funcionalidades Implementadas

### 1. 📱 Suporte a Redações Manuscritas
- **Formato aceito**: PNG, JPG, JPEG
- **Tecnologia**: Google Gemini 1.5 Flash
- **Funcionalidade**: OCR automático + análise completa
- **Transcrição**: O texto manuscrito é transcrito e incluído na análise

### 2. 🔍 Detecção de Plágio
- **Para PDFs**: Pesquisa automática na internet usando Google Search
- **Para Imagens**: Verificação integrada no Gemini
- **Relatório**: Lista trechos suspeitos com fontes encontradas
- **Alertas**: Indicação clara quando plágio é detectado

### 3. 📝 Análise Personalizada
Adaptada para seu estilo específico de redação:

#### Critérios Específicos:
- **Períodos curtos**: Avalia clareza e concisão
- **Introduções concisas**: Foco na eficácia da abertura
- **Duas problemáticas**: Verifica estrutura específica
- **Conectivos**: Análise detalhada da fluência textual

#### Proposta de Intervenção - 5W2H:
- **QUEM** resolve a problemática
- **ONDE** resolver (local/âmbito)
- **QUANDO** resolver (prazo/momento)  
- **COMO** resolver (meio/estratégia)
- **O QUE SE ESPERA** (resultado esperado)
- **NOME DA SOLUÇÃO** (dica pessoal - nome criativo)

#### Análise de Conectivos:
- Lista conectivos utilizados
- Avalia variedade e adequação
- Sugere melhorias específicas
- Dicas por categoria (introdução, contraste, conclusão)

## 🛠️ Configuração Necessária

### APIs Utilizadas:
1. **OpenRouter** (Claude 3.5 Sonnet) - Para PDFs
2. **Google Gemini** - Para imagens manuscritas
3. **Google Search** - Para detecção de plágio

### Variáveis de Ambiente (.env):
```
OPENROUTER_API_KEY=sua_chave_openrouter
GOOGLE_API_KEY=sua_chave_google_gemini
```

### Dependências Python:
- `google-generativeai` - Google Gemini
- `googlesearch-python` - Busca no Google
- `beautifulsoup4` - Parse de páginas web
- `requests` - Requisições HTTP
- `Pillow` - Processamento de imagens

## 📊 Fluxo de Análise

### Para PDFs:
1. Extração de texto (PyPDF2)
2. Verificação de plágio (Google Search)
3. Análise personalizada (Claude 3.5 Sonnet)
4. Resultado com detecção de plágio

### Para Imagens:
1. Carregamento da imagem (Pillow)
2. Análise completa (Google Gemini)
3. OCR + Transcrição + Análise + Verificação integrada
4. Resultado com texto transcrito

## 🎯 Benefícios da Personalização

### Estilo Específico:
- Respeita períodos curtos
- Valoriza introduções concisas
- Foca nas duas problemáticas
- Análise detalhada de conectivos

### Proposta de Intervenção:
- Verificação completa 5W2H
- Valoriza criatividade (nome da solução)
- Análise detalhada de cada componente
- Feedback específico para melhorias

### Detecção de Plágio:
- Previne problemas acadêmicos
- Ensina sobre originalidade
- Mostra fontes encontradas
- Orienta sobre citações adequadas

## 💡 Dicas de Uso

1. **Tema opcional**: Melhora precisão, mas não obrigatório
2. **Qualidade da imagem**: Fotos claras funcionam melhor
3. **Conectivos**: Use variedade para melhor pontuação
4. **Proposta 5W2H**: Complete todos os elementos
5. **Nome da solução**: Seja criativo e específico

## 🔧 Solução de Problemas

### Erros Comuns:
- **Plágio não detectado**: Rate limits do Google Search
- **Imagem não reconhecida**: Qualidade baixa ou texto ilegível
- **API Key inválida**: Verificar configuração no .env
- **Timeout**: Análises podem demorar até 2 minutos

### Performance:
- PDFs: ~30-60 segundos (inclui verificação de plágio)
- Imagens: ~45-90 segundos (OCR + análise completa)
- Plágio: Máximo 3 pesquisas para otimizar tempo
