/*
    Description: Testing REST API using Node.js
    Author: André Luferat - www.luferat.net
    License: MIT License
*/

// Dependências
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');

// Porta HTTP local
const httpPort = 8888;

// Base de dados
const database = 'users.json';

// Inicializa Express
const app = express();

// Favicon
app.use(favicon(path.join(__dirname, './favicon.png')));

// Index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

// Inicializa Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Formata cabeçalho HTTP
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

// Inicia servidor HTTP na porta 8888
app.listen(httpPort, () => { console.log(`Servidor Web rodando na porta ${httpPort}`) });

// Método post()
/*
  Exemplo: adicionar no banco de dados

    URL da Requisição: http://localhost:8888/api
    Body da Requisição (JSON):
	{
		"name" : "Joca da Silva",
		"email" : "joca@silva.com",
		"avatar" : "photo.jpg",
		"status" : "1"
	}

    Adicionará o registro:
        {
            "name" : "Joca da Silva",
            "email" : "joca@silva.com",
            "avatar" : "photo.jpg",
            "status" : 1,
            "id" : #,  <<< Total de registros + 1
            "date" : # <<< Data do sistema no momento da inclusã
        }
*/
app.post('/api', (req, res) => {

    // Carrega database em JSON
    fs.readFile(database, 'utf8', (err, data) => {

        // Se database não existe
        if (err) {
            var response = { status: 'fail', result: err };
            res.json(response);

            // Se database existe
        } else {
			
            // Obtém todos os registros  
            var obj = JSON.parse(data);

            // Cria o novo id com base no número de registros
            req.body.id = obj.users.length + 1;

            // Data atual
            //var today = new Date();
            //req.query.date = formatDate(today);
            req.query.date = new Date();

            // Inclui novo registro
            // obj.users.push(req.query);
			obj.users.push(req.body);

            // Grava database atualizado 
            fs.writeFile(database, JSON.stringify(obj), (err) => {

                // Erro na gravação
                if (err) {
                    var response = { status: 'fail', result: err };
                    res.json(response);

                    // successo na gravação
                } else {

                    // Formata response
                    var response = { status: 'success', result: 'Record successfully added' };

                    // Envia response
                    res.json(response);
                }
            });
        }
    });
});

// Método get()
/*
  Exemplos:
  
    URL da Requisição: http://localhost:8888/api --> Obtém todos os cadastros
    URL da Requisição: http://localhost:8888/api?id=0 --> Obtém todos os cadastros
    URL da Requisição: http://localhost:8888/api?id=2 --> Obtém o cadastro com id = 2
*/
app.get('/api', (req, res) => {

    // Carrega database em JSON
    fs.readFile(database, 'utf8', (err, data) => {

        // Se database não existe
        if (err) {
            var response = { status: 'fail', result: err };
            res.json(response);

            // Se database existe
        } else {

            // Formata em JSON
            var obj = JSON.parse(data);

            // Resultado padrão
            var result = 'No record found';

            // Obtém id da requisição
            var data_id = req.query.id;

            // Se não informou um id ou id = 0
            if (data_id == undefined || data_id == 0) {

				// Retorna todos os registros
                result = obj.users;

                // Se informou um id
            } else {

                // Pesquisa o id nos registros
                obj.users.forEach((user) => {

                    if (user != null) {

                        // Se encontrou o id, retorna o registro
                        if (user.id == data_id) {
                            result = user;
                        }
                    }
                });
            }

            // Formata response
            var response = { status: 'success', result: result };

            // Envia response
            res.json(response);
        }
    });
});

// Método put()
/*
    Exemplo: Atualiza o registro com id = 1
    
        URL da Requsição: http://localhost:8888/api
	Body da Requisição:
	}
            "id" : 1,
            "name" : "Joca da Silva",
            "email" : "joca@silva.com",
            "avatar" : "photo.jpg",
            "status" : 1
	}        
*/
app.put('/api', (req, res) => {
    fs.readFile(database, 'utf8', (err, data) => {
        if (err) {
            var response = { status: 'fail', result: err };
            res.json(response);
        } else {
            var obj = JSON.parse(data);

            // Data atual
            var today = new Date();

            // Observe que os campos correspondem ao database
            obj.users[(req.body.id - 1)].name = req.body.name;
            obj.users[(req.body.id - 1)].email = req.body.email;
            obj.users[(req.body.id - 1)].avatar = req.body.avatar;
            obj.users[(req.body.id - 1)].status = req.body.status;
            obj.users[(req.body.id - 1)].date = new Date();

            fs.writeFile(database, JSON.stringify(obj), (err) => {
                if (err) {
                    var response = { status: 'fail', result: err };
                    res.json(response);
                } else {
                    var response = { status: 'success', result: 'Record successfully edited' };
                    res.json(response);
                }
            });
        }
    });
});

// Método delete()
/*
    Exemplo: Apaga o registro com id = 1

        URL da Requisição: http://localhost:8888/api?id=1
*/
app.delete('/api', (req, res) => {
    fs.readFile(database, 'utf8', (err, data) => {
        if (err) {
            var response = { status: 'fail', result: err };
            res.json(response);
        } else {
            var obj = JSON.parse(data);

            delete obj.users[(req.query.id - 1)];

            fs.writeFile(database, JSON.stringify(obj), (err) => {
                if (err) {
                    var response = { status: 'fail', result: err };
                    res.json(response);
                } else {
                    var response = { status: 'success', result: 'Record deleted successfully' };
                    res.json(response);
                }
            });
        }
    });
});
