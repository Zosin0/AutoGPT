# AutoGPT


## TamperMonkey + AI GPT

- Instalar o TamperMonkey(extensão de navegador) e criar um script com o _código fonte_ do arquivo: `all_questions.js`
- Garanta que você tenha as seguintes coisas:
```bash
- Chave API (nesse exemplo foi utilizado o Gemini)
- Essas dependencias instaladas do python:
from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
from dotenv import load_dotenv
import os
```
- Rodar o arquivo app.py

---
### Orientações de Uso

##### Quando tiver o script configurado, selecione um texto, clique no botão `Enviar Questões` e seja feliz!
