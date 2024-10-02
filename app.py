from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

# Configure sua chave API do Google Generative AI
API_KEY = os.environ['API_KEY']
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-pro')


@app.route('/submit_question', methods=['POST'])
def submit_question():
    data = request.json
    
    print(data)

    # Verificar se "selectedText" está presente no corpo da requisição
    if not data or 'questions' not in data:
        print('error:' ' Nenhum dado ou texto selecionado enviado')
        return jsonify({'error': 'Nenhum dado ou texto selecionado enviado'}), 400

    # Obter o texto selecionado
    selected_text = data.get('questions', '')
    print(selected_text)    
    
    
    # Criar o prompt com base no texto selecionado
    prompt = f"Responda a seguinte pergunta:\n\n{selected_text}\n"

    # Chamar a API do Gemini (ou outro modelo)
    response = model.generate_content(prompt)
    response_text = response.text.strip()

    print(response_text)

    # Retornar a resposta como um dicionário serializável em JSON
    return jsonify({'response': response_text}), 200


@app.route('/submit_questions', methods=['POST'])
def submit_questions():
    data = request.json

    if not data or 'questions' not in data:
        return jsonify({'error': 'Nenhum dado ou questões não enviadas'}), 400

    questions = data.get('questions', [])

    # Responder questão por questão
    for i, q in enumerate(questions):
        prompt = f"Responda a seguinte pergunta de múltipla escolha com a opção correta:\n\n{q['question']}\n"
        for j, option in enumerate(q['options']):
            prompt += f"   {chr(65+j)}. {option}\n"

        # Chamar a API do Gemini
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        print(response_text)
        
    return jsonify(response_text)




if __name__ == '__main__':
    app.run(debug=True)
