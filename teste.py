from flask import Flask, request, jsonify, render_template
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import google.generativeai as genai
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

# Configurar a chave API do Google Generative AI
API_KEY = os.environ['API_KEY']
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-pro')

@app.route('/')
def index():
    return render_template('index.html')


# Rota para capturar o texto de qualquer página via Selenium
@app.route('/capture_text', methods=['POST'])
def capture_text():
    data = request.json
    url = data.get('url')

    print(data)
    if not url:
        return jsonify({'error': 'Nenhuma URL fornecida.'}), 400

    # Inicializar o Selenium
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.get(url)

    # Capturar o texto da página (modifique este seletor conforme necessário)
    selected_text = driver.execute_script("return window.getSelection().toString();")

    if not selected_text:
        # Caso não tenha sido possível capturar a seleção, capturar o corpo da página
        selected_text = driver.find_element(By.TAG_NAME, "body").text

    driver.quit()

    # Criar o prompt para a API de IA com base no texto capturado
    prompt = f"Responda a seguinte questão baseada no texto:\n\n{selected_text}\n"

    # Chamar a API do Gemini para gerar uma resposta
    response = model.generate_content(prompt)
    response_text = response.text.strip()

    print(response_text)

    # Retornar a resposta gerada
    return jsonify({'response': response_text}), 200


if __name__ == '__main__':
    app.run(debug=True)
