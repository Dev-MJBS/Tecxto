from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import os
from dotenv import load_dotenv
import PyPDF2
import openai
from openai import OpenAI
import google.generativeai as genai
import tempfile
from werkzeug.utils import secure_filename
from PIL import Image
import base64
import io
import requests
from bs4 import BeautifulSoup
from googlesearch import search
import re
import time
from database import Database
from auth import AuthManager, require_subscription, require_auth, require_admin

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configurações JWT
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')  # Mude em produção
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Inicializar banco de dados
db = Database()
db.init_database()

# Configurar APIs
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# Configurar Google Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    return text

def check_plagiarism(text, max_searches=3):
    """Verifica possível plágio pesquisando frases na internet"""
    try:
        # Dividir o texto em sentenças
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if len(s.strip()) > 20]
        
        plagiarism_results = []
        search_count = 0
        
        for sentence in sentences[:5]:  # Verificar apenas as primeiras 5 sentenças
            if search_count >= max_searches:
                break
                
            try:
                # Pesquisar a sentença no Google
                search_query = f'"{sentence[:50]}"'  # Primeiras 50 palavras
                search_results = list(search(search_query, num_results=3, sleep_interval=1))
                
                if search_results:
                    for url in search_results:
                        try:
                            response = requests.get(url, timeout=5)
                            if response.status_code == 200:
                                soup = BeautifulSoup(response.content, 'html.parser')
                                page_text = soup.get_text().lower()
                                
                                if sentence.lower() in page_text:
                                    plagiarism_results.append({
                                        'sentence': sentence[:100] + "...",
                                        'url': url,
                                        'similarity': 'Alta'
                                    })
                                    break
                        except:
                            continue
                
                search_count += 1
                time.sleep(1)  # Respeitar rate limits
                
            except Exception as e:
                continue
        
        return plagiarism_results
        
    except Exception as e:
        return [{"error": f"Erro na verificação de plágio: {str(e)}"}]

def analyze_image_with_gemini(image_path, theme=None):
    """Analisa uma imagem de redação manuscrita usando Google Gemini"""
    try:
        # Carregar a imagem
        image = Image.open(image_path)
        
        # Configurar o modelo Gemini
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        if theme and theme.strip():
            prompt = f"""
Você é um professor especialista em correção de redações do ENEM. Analise a redação manuscrita na imagem seguindo os critérios do ENEM e o estilo específico do aluno:

TEMA PROPOSTO: {theme}

CRITÉRIOS ESPECÍFICOS PARA ANÁLISE:
- ESTILO: Períodos curtos, introduções concisas, estrutura sucinta
- ESTRUTURA: Duas problemáticas bem definidas 
- CONECTIVOS: Uso adequado de conectivos para fluência textual
- PROPOSTA DE INTERVENÇÃO: Deve responder 5W2H (Quem, Onde, Quando, Como, O que se espera) + Nome da solução

INSTRUÇÕES:
- Leia e transcreva todo o texto manuscrito
- Avalie adequação ao tema e estilo dissertativo-argumentativo
- Analise conectivos e coesão entre parágrafos
- Verifique se há duas problemáticas claras
- Avalie proposta de intervenção completa (5W2H + nome)

FORNEÇA SUA ANÁLISE NO SEGUINTE FORMATO:

**TEMA PROPOSTO:** {theme}

**TEXTO TRANSCRITO:**
[Transcreva fielmente o texto manuscrito]

**VERIFICAÇÃO DE PLÁGIO:** 
[Será verificado automaticamente após a análise]

**NOTA GERAL: [0-1000]**

**ANÁLISE DO ESTILO ESPECÍFICO:**
- Períodos: [Avalie se os períodos estão adequadamente curtos e claros]
- Introdução: [Analise se a introdução é concisa e eficaz]
- Estrutura: [Verifique se há duas problemáticas bem desenvolvidas]
- Conectivos: [Analise uso e variedade dos conectivos]

**COMPETÊNCIA 1 - DOMÍNIO DA NORMA PADRÃO (0-200):**
Nota: [0-200]
Análise: [análise detalhada considerando períodos curtos e clareza]

**COMPETÊNCIA 2 - COMPREENSÃO DA PROPOSTA (0-200):**
Nota: [0-200]
Análise: [análise do tema, foco nas duas problemáticas]

**COMPETÊNCIA 3 - SELEÇÃO E ORGANIZAÇÃO DAS INFORMAÇÕES (0-200):**
Nota: [0-200]
Análise: [argumentação, repertório, organização das duas problemáticas]

**COMPETÊNCIA 4 - CONHECIMENTO DOS MECANISMOS LINGUÍSTICOS (0-200):**
Nota: [0-200]
Análise: [coesão, coerência, conectivos entre parágrafos]

**COMPETÊNCIA 5 - PROPOSTA DE INTERVENÇÃO (0-200):**
Nota: [0-200]
Análise detalhada 5W2H:
- QUEM resolve: [Identificar agente]
- ONDE resolver: [Identificar local/âmbito]
- QUANDO resolver: [Identificar prazo/momento]
- COMO resolver: [Identificar meio/estratégia]
- O QUE SE ESPERA: [Identificar resultado esperado]
- NOME DA SOLUÇÃO: [Verificar se foi dado nome criativo à proposta]

**CONECTIVOS UTILIZADOS:**
- [Liste os principais conectivos encontrados e avalie variedade]

**PONTOS FORTES:**
- [Considerando o estilo específico]

**PONTOS A MELHORAR:**
- [Sugestões específicas para o estilo]

**DICAS DE CONECTIVOS:**
- [Sugestões de conectivos para melhorar a fluência]

**VERSÃO CORRIGIDA (TRECHOS PRINCIPAIS):**
[Reescreva mantendo períodos curtos e estilo conciso]
"""
        else:
            prompt = f"""
Você é um professor especialista em correção de redações do ENEM. Analise a redação manuscrita seguindo critérios específicos do ENEM e estilo do aluno:

CRITÉRIOS ESPECÍFICOS:
- ESTILO: Períodos curtos, introduções concisas, estrutura sucinta
- ESTRUTURA: Duas problemáticas bem definidas
- CONECTIVOS: Uso adequado para fluência textual
- PROPOSTA: 5W2H completo + Nome da solução

FORNEÇA SUA ANÁLISE NO SEGUINTE FORMATO:

**TEXTO TRANSCRITO:**
[Transcreva fielmente o texto manuscrito]

**TEMA IDENTIFICADO:**
[Identifique o tema abordado]

**VERIFICAÇÃO DE PLÁGIO:** 
[Será verificado automaticamente]

**NOTA GERAL: [0-1000]**

**ANÁLISE DO ESTILO ESPECÍFICO:**
- Períodos: [Avalie clareza dos períodos curtos]
- Introdução: [Analise concisão da introdução]
- Estrutura: [Verifique duas problemáticas]
- Conectivos: [Analise uso dos conectivos]

**COMPETÊNCIA 1 - DOMÍNIO DA NORMA PADRÃO (0-200):**
Nota: [0-200]
Análise: [considerando estilo de períodos curtos]

**COMPETÊNCIA 2 - COMPREENSÃO DA PROPOSTA (0-200):**
Nota: [0-200]
Análise: [foco nas duas problemáticas]

**COMPETÊNCIA 3 - SELEÇÃO E ORGANIZAÇÃO DAS INFORMAÇÕES (0-200):**
Nota: [0-200]
Análise: [organização das problemáticas e argumentação]

**COMPETÊNCIA 4 - CONHECIMENTO DOS MECANISMOS LINGUÍSTICOS (0-200):**
Nota: [0-200]
Análise: [conectivos e coesão textual]

**COMPETÊNCIA 5 - PROPOSTA DE INTERVENÇÃO (0-200):**
Nota: [0-200]
Análise 5W2H:
- QUEM resolve: [Agente identificado]
- ONDE resolver: [Local/âmbito]
- QUANDO resolver: [Prazo/momento]
- COMO resolver: [Meio/estratégia]
- O QUE SE ESPERA: [Resultado esperado]
- NOME DA SOLUÇÃO: [Nome criativo dado à proposta]

**CONECTIVOS UTILIZADOS:**
[Liste e avalie os conectivos]

**PONTOS FORTES:**
[Considerando estilo específico]

**PONTOS A MELHORAR:**
[Sugestões para o estilo]

**DICAS DE CONECTIVOS:**
[Sugestões específicas]

**VERSÃO CORRIGIDA:**
[Mantenha períodos curtos e estilo conciso]
"""
        
        # Fazer a análise
        response = model.generate_content([prompt, image])
        return response.text
        
    except Exception as e:
        return f"Erro ao analisar a imagem: {str(e)}"

def analyze_essay(text, theme=None, plagiarism_results=None):
    # Preparar informação sobre plágio
    plagiarism_info = ""
    if plagiarism_results:
        if any("error" in result for result in plagiarism_results):
            plagiarism_info = "⚠️ Não foi possível verificar plágio completamente."
        elif plagiarism_results:
            plagiarism_info = f"🚨 ATENÇÃO: Possível plágio detectado em {len(plagiarism_results)} trechos."
        else:
            plagiarism_info = "✅ Nenhum plágio detectado."
    
    if theme and theme.strip():
        prompt = f"""
Você é um professor especialista em correção de redações do ENEM. Analise a redação seguindo os critérios do ENEM e o estilo específico do aluno:

TEMA PROPOSTO: {theme}

REDAÇÃO:
{text}

CRITÉRIOS ESPECÍFICOS PARA ANÁLISE:
- ESTILO: Períodos curtos, introduções concisas, estrutura sucinta
- ESTRUTURA: Duas problemáticas bem definidas
- CONECTIVOS: Uso adequado de conectivos para fluência textual  
- PROPOSTA DE INTERVENÇÃO: Deve responder 5W2H (Quem, Onde, Quando, Como, O que se espera) + Nome da solução

VERIFICAÇÃO DE PLÁGIO: {plagiarism_info}

INSTRUÇÕES:
- Avalie adequação ao tema e estilo dissertativo-argumentativo
- Analise conectivos e coesão entre parágrafos
- Verifique se há duas problemáticas claras
- Avalie proposta de intervenção completa (5W2H + nome)

FORNEÇA SUA ANÁLISE NO SEGUINTE FORMATO:

**TEMA PROPOSTO:** {theme}

**VERIFICAÇÃO DE PLÁGIO:** {plagiarism_info}

**NOTA GERAL: [0-1000]**

**ANÁLISE DO ESTILO ESPECÍFICO:**
- Períodos: [Avalie se os períodos estão adequadamente curtos e claros]
- Introdução: [Analise se a introdução é concisa e eficaz]
- Estrutura: [Verifique se há duas problemáticas bem desenvolvidas]
- Conectivos: [Analise uso e variedade dos conectivos]

**COMPETÊNCIA 1 - DOMÍNIO DA NORMA PADRÃO (0-200):**
Nota: [0-200]
Análise: [considerando períodos curtos e clareza textual]

**COMPETÊNCIA 2 - COMPREENSÃO DA PROPOSTA (0-200):**
Nota: [0-200]
Análise: [análise do tema com foco nas duas problemáticas]

**COMPETÊNCIA 3 - SELEÇÃO E ORGANIZAÇÃO DAS INFORMAÇÕES (0-200):**
Nota: [0-200]
Análise: [argumentação, repertório, organização das duas problemáticas]

**COMPETÊNCIA 4 - CONHECIMENTO DOS MECANISMOS LINGUÍSTICOS (0-200):**
Nota: [0-200]
Análise: [coesão, coerência, conectivos entre parágrafos e ideias]

**COMPETÊNCIA 5 - PROPOSTA DE INTERVENÇÃO (0-200):**
Nota: [0-200]
Análise detalhada 5W2H:
- QUEM resolve: [Identificar e avaliar o agente responsável]
- ONDE resolver: [Identificar local/âmbito de aplicação]
- QUANDO resolver: [Identificar prazo ou momento de implementação]
- COMO resolver: [Identificar meio, estratégia ou método]
- O QUE SE ESPERA: [Identificar resultado ou impacto esperado]
- NOME DA SOLUÇÃO: [Verificar se foi dado um nome criativo/específico à proposta]

**CONECTIVOS UTILIZADOS:**
- [Liste os principais conectivos encontrados e avalie sua variedade e adequação]

**PROBLEMÁTICAS IDENTIFICADAS:**
1. [Primeira problemática apresentada]
2. [Segunda problemática apresentada]

**PONTOS FORTES:**
- [Considerando o estilo específico do aluno]

**PONTOS A MELHORAR:**
- [Sugestões específicas para o estilo de períodos curtos]

**DICAS DE CONECTIVOS:**
- Para introduzir ideias: [sugestões]
- Para contrastar: [sugestões]  
- Para concluir: [sugestões]

**VERSÃO CORRIGIDA (TRECHOS PRINCIPAIS):**
[Reescreva mantendo períodos curtos e estilo conciso]
"""
    else:
        prompt = f"""
Você é um professor especialista em correção de redações do ENEM. Analise a redação seguindo critérios específicos do ENEM e estilo do aluno:

REDAÇÃO:
{text}

CRITÉRIOS ESPECÍFICOS:
- ESTILO: Períodos curtos, introduções concisas, estrutura sucinta
- ESTRUTURA: Duas problemáticas bem definidas
- CONECTIVOS: Uso adequado para fluência textual
- PROPOSTA: 5W2H completo + Nome da solução

VERIFICAÇÃO DE PLÁGIO: {plagiarism_info}

FORNEÇA SUA ANÁLISE NO SEGUINTE FORMATO:

**TEMA IDENTIFICADO:**
[Identifique o tema abordado na redação]

**VERIFICAÇÃO DE PLÁGIO:** {plagiarism_info}

**NOTA GERAL: [0-1000]**

**ANÁLISE DO ESTILO ESPECÍFICO:**
- Períodos: [Avalie clareza dos períodos curtos]
- Introdução: [Analise concisão da introdução]
- Estrutura: [Verifique duas problemáticas]
- Conectivos: [Analise uso dos conectivos]

**COMPETÊNCIA 1 - DOMÍNIO DA NORMA PADRÃO (0-200):**
Nota: [0-200]
Análise: [considerando estilo de períodos curtos]

**COMPETÊNCIA 2 - COMPREENSÃO DA PROPOSTA (0-200):**
Nota: [0-200]
Análise: [tema e foco nas duas problemáticas]

**COMPETÊNCIA 3 - SELEÇÃO E ORGANIZAÇÃO DAS INFORMAÇÕES (0-200):**
Nota: [0-200]
Análise: [organização das problemáticas e argumentação]

**COMPETÊNCIA 4 - CONHECIMENTO DOS MECANISMOS LINGUÍSTICOS (0-200):**
Nota: [0-200]
Análise: [conectivos e coesão textual]

**COMPETÊNCIA 5 - PROPOSTA DE INTERVENÇÃO (0-200):**
Nota: [0-200]
Análise 5W2H:
- QUEM resolve: [Agente identificado]
- ONDE resolver: [Local/âmbito]
- QUANDO resolver: [Prazo/momento]
- COMO resolver: [Meio/estratégia]
- O QUE SE ESPERA: [Resultado esperado]
- NOME DA SOLUÇÃO: [Nome criativo dado à proposta]

**CONECTIVOS UTILIZADOS:**
[Liste e avalie os conectivos]

**PROBLEMÁTICAS IDENTIFICADAS:**
1. [Primeira problemática]
2. [Segunda problemática]

**PONTOS FORTES:**
[Considerando estilo específico]

**PONTOS A MELHORAR:**
[Sugestões para o estilo]

**DICAS DE CONECTIVOS:**
[Sugestões específicas de conectivos]

**VERSÃO CORRIGIDA:**
[Mantenha períodos curtos e estilo conciso]
"""

    try:
        response = client.chat.completions.create(
            model="anthropic/claude-3.5-sonnet",
            messages=[
                {"role": "system", "content": "Você é um professor especialista em correção de redações do ENEM com mais de 20 anos de experiência, especializado em análise de textos com períodos curtos, estruturas sucintas e propostas de intervenção detalhadas."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=2500,
            temperature=0.3
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        return f"Erro ao processar a redação: {str(e)}"

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Tecxto IA - API de Correção de Redações - Ativa"})

# Endpoints de autenticação
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password') or not data.get('email'):
        return jsonify({"error": "Username, email e password são obrigatórios"}), 400
    
    success, user_id, message = AuthManager.register_user(
        data['username'], 
        data['email'], 
        data['password']
    )
    
    if success:
        return jsonify({
            "message": message,
            "user_id": user_id
        }), 201
    
    return jsonify({"error": message}), 400

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"error": "Username e password são obrigatórios"}), 400
    
    success, user_data, message = AuthManager.login_user(
        data['username'],
        data['password']
    )
    
    if success:
        return jsonify({
            "message": message,
            "data": user_data
        }), 200
    
    return jsonify({"error": message}), 401

@app.route('/auth/verify-token', methods=['GET'])
@require_auth
def verify_token():
    """Verifica se o token é válido e retorna dados do usuário"""
    from flask_jwt_extended import get_jwt_identity
    user_id = get_jwt_identity()
    
    # Buscar dados do usuário
    conn = db.get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT username, email, is_admin FROM users WHERE id = ? AND is_active = 1
    ''', (user_id,))
    
    result = cursor.fetchone()
    conn.close()
    
    if not result:
        return jsonify({"error": "Usuário não encontrado"}), 404
    
    username, email, is_admin = result
    
    # Verificar assinatura
    has_subscription, end_date, usage_count = db.check_user_subscription(user_id)
    
    return jsonify({
        "message": "Token válido",
        "data": {
            "user_id": user_id,
            "username": username,
            "email": email,
            "is_admin": bool(is_admin),
            "has_subscription": has_subscription,
            "subscription_end": end_date.isoformat() if end_date else None,
            "usage_count": usage_count
        }
    }), 200

@app.route('/auth/redeem-code', methods=['POST'])
@require_auth
def redeem_payment_code():
    from flask_jwt_extended import get_jwt_identity
    user_id = get_jwt_identity()
    
    data = request.get_json()
    if not data or not data.get('payment_code'):
        return jsonify({"error": "Código de pagamento é obrigatório"}), 400
    
    success, message = db.use_payment_code(data['payment_code'], user_id)
    
    if success:
        # Buscar nova informação da assinatura
        has_subscription, end_date, usage_count = db.check_user_subscription(user_id)
        
        return jsonify({
            "message": message,
            "subscription": {
                "active": has_subscription,
                "end_date": end_date.isoformat() if end_date else None,
                "usage_count": usage_count
            }
        }), 200
    
    return jsonify({"error": message}), 400

@app.route('/auth/subscription-status', methods=['GET'])
@require_auth
def subscription_status():
    from flask_jwt_extended import get_jwt_identity
    user_id = get_jwt_identity()
    
    has_subscription, end_date, usage_count = db.check_user_subscription(user_id)
    
    return jsonify({
        "subscription": {
            "active": has_subscription,
            "end_date": end_date.isoformat() if end_date else None,
            "usage_count": usage_count
        }
    }), 200

# Endpoints administrativos
@app.route('/admin/users', methods=['GET'])
@require_admin
def admin_list_users():
    users = db.get_all_users()
    
    users_list = []
    for user in users:
        users_list.append({
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'created_at': user[3],
            'is_active': user[4],
            'subscription_end': user[5],
            'usage_count': user[6],
            'has_subscription': user[7]
        })
    
    return jsonify({'users': users_list}), 200

@app.route('/admin/activate-user', methods=['POST'])
@require_admin
def admin_activate_user():
    from flask_jwt_extended import get_jwt_identity
    admin_id = get_jwt_identity()
    
    data = request.get_json()
    if not data or not data.get('user_id') or not data.get('days'):
        return jsonify({"error": "user_id e days são obrigatórios"}), 400
    
    success, message = db.activate_user_subscription(
        data['user_id'],
        data['days'],
        admin_id
    )
    
    if success:
        return jsonify({"message": message}), 200
    
    return jsonify({"error": message}), 400

@app.route('/analyze', methods=['POST'])
@require_subscription
def analyze_essay_endpoint():
    if 'file' not in request.files:
        return jsonify({"error": "Nenhum arquivo foi enviado"}), 400
    
    file = request.files['file']
    theme = request.form.get('theme', None)
    
    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Formato de arquivo não permitido. Aceitos: PDF, PNG, JPG, JPEG."}), 400
    
    try:
        filename = secure_filename(file.filename)
        file_extension = filename.rsplit('.', 1)[1].lower()
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}') as temp_file:
            file.save(temp_file.name)
            
            if file_extension == 'pdf':
                # Análise de PDF com texto digital
                text = extract_text_from_pdf(temp_file.name)
                
                if not text.strip():
                    return jsonify({"error": "Não foi possível extrair texto do PDF"}), 400
                
                # Verificar plágio para PDFs
                print("Verificando plágio...")
                plagiarism_results = check_plagiarism(text)
                
                analysis = analyze_essay(text, theme, plagiarism_results)
                extracted_text = text[:500] + "..." if len(text) > 500 else text
                
                # Adicionar detalhes do plágio na resposta
                plagiarism_details = []
                if plagiarism_results and not any("error" in result for result in plagiarism_results):
                    plagiarism_details = plagiarism_results
                
            else:
                # Análise de imagem com Google Gemini (plágio será verificado pelo Gemini)
                analysis = analyze_image_with_gemini(temp_file.name, theme)
                extracted_text = "Texto extraído da imagem manuscrita (veja na análise)"
                plagiarism_details = []  # Gemini faz sua própria verificação
            
            os.unlink(temp_file.name)
            
            return jsonify({
                "success": True,
                "file_type": "PDF" if file_extension == 'pdf' else "Imagem",
                "extracted_text": extracted_text,
                "analysis": analysis,
                "theme": theme,
                "plagiarism_check": len(plagiarism_details) > 0 if file_extension == 'pdf' else "Verificado pelo Gemini",
                "plagiarism_details": plagiarism_details
            })
    
    except Exception as e:
        return jsonify({"error": f"Erro interno do servidor: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

# Para o Vercel
app = app