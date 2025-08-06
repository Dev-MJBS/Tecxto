# Tecxto IA 📝

Sistema completo de correção de redações com Inteligência Artificial, seguindo os critérios do ENEM. Interface moderna inspirada no CatólIA com tema escuro/claro.

## ✨ Funcionalidades Principais

### 📄 Análise Inteligente
- **PDFs digitais**: Extração de texto + verificação de plágio na internet
- **Redações manuscritas**: OCR com Google Gemini Vision
- **Análise personalizada**: Estilo de períodos curtos e estrutura sucinta
- **5 Competências ENEM**: Avaliação detalhada (0-200 por competência)
- **Proposta 5W2H**: Análise completa (Quem, Onde, Quando, Como, O que se espera + Nome)

### 🔐 Sistema de Autenticação
- Login/Registro com JWT
- Controle de assinatura por códigos de pagamento
- Painel administrativo completo
- Gestão de usuários e ativações

### 🎨 Interface Moderna
- Design inspirado no CatólIA/ChatGPT
- Tema escuro por padrão com alternância claro/escuro
- Layout responsivo (sidebar retrátil)
- Preview antes do login para demonstração

### 📊 Painel Admin
- Listagem de todos os usuários
- Ativação manual de assinaturas
- Controle de códigos de pagamento
- Estatísticas de uso

## 🛠️ Tecnologias

### Backend
- **Python 3.9+** com Flask
- **Claude 3.5 Sonnet** (via OpenRouter) - Análise de texto
- **Google Gemini 1.5 Flash** - OCR de manuscritas
- **JWT** para autenticação
- **SQLite** para banco de dados
- **BeautifulSoup** + **googlesearch** para detecção de plágio

### Frontend
- **React 18** com Context API
- **Design System** inspirado no CatólIA
- **CSS Variables** para temas dinâmicos
- **React Dropzone** para uploads
- **Axios** para API calls

## 🚀 Configuração Rápida

### 1. Clonar e configurar
```bash
git clone https://github.com/Dev-MJBS/Tecxto.git
cd Tecxto
```

### 2. Backend (Python)
```bash
# Instalar dependências
pip install -r requirements.txt

# Configurar .env
cp .env.example .env
# Adicione suas chaves:
# OPENROUTER_API_KEY=your_key
# GOOGLE_API_KEY=your_key
# JWT_SECRET_KEY=your_secret

# Iniciar API
cd api
python index.py
```

### 3. Frontend (React)
```bash
# Instalar dependências
npm install

# Iniciar desenvolvimento
npm start
```

## 📋 Como Usar

### Para Usuários
1. **Demonstração**: Explore as funcionalidades sem login
2. **Cadastro**: Crie conta para fazer uploads
3. **Upload**: Envie PDF ou imagem da redação
4. **Tema** (opcional): Informe o tema para análise mais precisa
5. **Análise**: Receba feedback completo em segundos

### Para Administradores
- Acesse `/admin` com conta administrativa
- Gerencie usuários e ativações
- Monitore uso do sistema

## 🔑 Códigos de Pagamento

Sistema de ativação por códigos únicos:
- Códigos gerados pelo admin
- Ativação automática ao resgatar
- Controle de período de validade
- Histórico completo de usos

## 🌐 Deploy

### Vercel (Recomendado)
1. Conecte o repositório no Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Variáveis Necessárias
```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxx
GOOGLE_API_KEY=AIzaSyxxxxxx
JWT_SECRET_KEY=your-super-secret-key
```

## 📁 Estrutura do Projeto

```
Tecxto/
├── api/
│   ├── index.py              # API principal Flask
│   ├── database.py           # Gerenciamento SQLite
│   ├── auth.py              # Autenticação e decorators
│   └── requirements.txt      # Dependências Python
├── src/
│   ├── components/          # Componentes React
│   │   ├── Dropzone.js      # Upload de arquivos
│   │   ├── FeedbackDisplay.js # Exibição de resultados
│   │   └── Navbar.js        # Navegação
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.js          # Página principal
│   │   └── ResultPage.js    # Resultados
│   ├── context/            # Context API
│   │   └── AuthContext.js   # Estado de autenticação
│   └── styles/             # Estilos CSS
│       ├── App.css
│       └── GlobalStyles.css # Variáveis de tema
├── public/                 # Arquivos estáticos
├── package.json           # Dependências Node.js
├── vercel.json           # Configuração Vercel
└── README.md
```

## 📡 API Endpoints

### Públicos
- `GET /` - Status da API
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login

### Autenticados
- `POST /analyze` - Analisar redação (requer assinatura)
- `POST /auth/redeem-code` - Resgatar código
- `GET /auth/subscription-status` - Status da assinatura

### Admin
- `GET /admin/users` - Listar usuários
- `POST /admin/activate-user` - Ativar usuário

## 💡 Recursos Únicos

### Análise Personalizada
- Foco em períodos curtos e introduções concisas
- Identificação de duas problemáticas principais
- Avaliação específica de conectivos
- Nome criativo para proposta de intervenção

### Sistema de Plágio Inteligente
- Busca automática na internet (PDFs)
- Análise contextual com BeautifulSoup
- Rate limiting respeitoso
- Verificação via Gemini (manuscritas)

### Interface CatólIA-Style
- Sidebar elegante com histórico
- Tema escuro moderno
- Transições suaves
- Design responsivo completo

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🎯 Roadmap

- [ ] Histórico de análises por usuário
- [ ] Exportar análises em PDF
- [ ] Suporte a mais formatos de imagem
- [ ] API webhooks para integrações
- [ ] Dashboard com estatísticas
- [ ] Sistema de feedback dos usuários

---

**Desenvolvido por [Dev-MJBS](https://github.com/Dev-MJBS)** - Sistema educacional para melhoria da escrita acadêmica 📚✨
