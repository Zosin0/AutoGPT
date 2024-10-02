// ==UserScript==
// @name         Enviar Texto Selecionado para Flask e Mostrar Resposta
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Captura o texto selecionado na página, envia ao Flask e mostra a resposta
// @author       Você
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function responder() {
    'use strict';

    // Função para capturar o texto selecionado na página
    function getSelectedText() {
        let selectedText = window.getSelection().toString().trim();
        return selectedText;
    }

    // Função para enviar o texto para o servidor Flask
    function sendSelectedText(text) {
        let questionData = {
            questions: [{
                question: text,
                options: [] // Aqui você pode ajustar se precisar enviar opções de resposta
            }]
        };

        fetch('http://localhost:5000/submit_question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(questionData)
        })
            .then(response => response.json())
            .then(data => {
            // Exibir a resposta na página
            showResponseInPage(data);
        })
            .catch(error => {
            console.error('Erro ao enviar o texto selecionado:', error);
        });
    }


    // Função para mostrar a resposta do Flask na página
    // Função para mostrar a resposta do Flask na página
    function showResponseInPage(response) {
        // Remove qualquer resposta anterior
        let oldResponseDiv = document.getElementById('responseDiv');
        if (oldResponseDiv) {
            oldResponseDiv.remove();
        }

        // Cria um novo elemento para mostrar a resposta
        let responseDiv = document.createElement('div');
        responseDiv.id = 'responseDiv';
        responseDiv.style.position = 'fixed';
        responseDiv.style.top = '50px';
        responseDiv.style.right = '10px';
        responseDiv.style.backgroundColor = '#f9f9f9';
        responseDiv.style.border = '2px solid #000';
        responseDiv.style.padding = '10px';
        responseDiv.style.zIndex = 1000;

        // Construir o conteúdo da resposta baseado no JSON recebido
        let htmlContent = `<h3>Resposta da Questão:</h3>`;
        if (response && response.response) {
            htmlContent += `<p><strong>Resposta:</strong> ${response.response}</p>`;
        } else {
            htmlContent += `<p><strong>Erro:</strong> Não foi possível obter a resposta.</p>`;
        }

        responseDiv.innerHTML = htmlContent;

        // Adiciona o elemento à página
        document.body.appendChild(responseDiv);
    }


    // Adicionar botão "Enviar Texto Selecionado"
    const btn = document.createElement("button");
    btn.innerHTML = "Zquests: Enviar Texto Selecionado";
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = 1000;
    btn.style.backgroundColor = 'blue';
    btn.style.color = 'white';
    btn.style.fontSize = '12px';
    btn.style.border = '1px solid black';
    document.body.appendChild(btn);

    // Executar as funções ao clicar no botão
    btn.addEventListener('click', function() {
        let selectedText = getSelectedText();
        if (selectedText.length > 0) {
            sendSelectedText(selectedText);
        } else {
            alert('Nenhum texto foi selecionado!');
        }
    });
})();
