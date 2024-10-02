// ==UserScript==
// @name         Enviar Questões para Flask e Mostrar Resposta - CEUB
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Captura questões, envia ao Flask e mostra a resposta na página
// @author       Você
// @match        https://salaonline.ceub.br/mod/quiz/attempt.php?attempt=*
// @grant        none
// ==/UserScript==

(function responder() {
    'use strict';

    // Função para capturar as questões e opções
    function captureQuestions() {
        let questions = [];
        document.querySelectorAll('div.que.multichoice').forEach(function(questionElem) {
            // Captura o ID da questão
            let questionId = questionElem.id;

            // Captura todo o texto da questão, concatenando parágrafos, se houver mais de um
            let questionTextElem = questionElem.querySelectorAll('div.qtext p');
            let questionText = Array.from(questionTextElem).map(p => p.textContent.trim()).join(' ').trim();

            if (questionText) {
                let options = [];
                // Captura todas as opções de resposta
                questionElem.querySelectorAll('div.answer div.d-flex').forEach(function(optionElem) {
                    let optionText = optionElem.querySelector('p').textContent.trim();
                    options.push(optionText);
                });

                questions.push({
                    id: questionId,
                    question: questionText,
                    options: options
                });
            }
        });

        return questions;
    }

    // Função para enviar as questões para o servidor Flask
    function sendQuestions(questions) {
        let data = { questions: questions };

        fetch('http://localhost:5000/submit_questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // Exibir a resposta na página
            showResponseInPage(data);
        })
        .catch(error => {
            console.error('Erro ao enviar as questões:', error);
        });
    }

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
        responseDiv.innerHTML = `<h3>Resposta da Questão:</h3><p>${response}</p>`;

        // Adiciona o elemento à página
        document.body.appendChild(responseDiv);
    }

    // Adicionar botão "Enviar Questões"
    const btn = document.createElement("button");
    btn.innerHTML = "ZoserQuestions: Enviar Questões";
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = 1000;
    btn.style.backgroundColor = 'blue';
    btn.style.color = 'white';
    btn.style.fontSize = '25px';
    btn.style.border = '1px solid black';
    document.body.appendChild(btn);

    // Executar as funções ao clicar no botão
    btn.addEventListener('click', function() {
        let questions = captureQuestions();
        if (questions.length > 0) {
            sendQuestions(questions);
        } else {
            alert('Nenhuma questão encontrada!');
        }
    });
})();
