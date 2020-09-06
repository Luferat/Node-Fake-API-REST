/*
    Description: Testing REST API using Node.js
    Author: André Luferat - www.luferat.net
    License: MIT License
    Support: read manual pages in "index.html"
*/

// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const favicon = require('serve-favicon');

// Set HTTP port
const httpPort = process.env.PORT || 8888;

// Databse file
const database = 'users.json';

// Starts Express
const app = express();

// Favicon
app.use(favicon(path.join(__dirname, './favicon.png')));

// Index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

// Starts Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Format HTTP header
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

// Starts the HTTP server on the specified port
app.listen(httpPort, () => { console.log(`Servidor Web rodando na porta ${httpPort}`) });

// post() method --> See "index.html" for help
app.post('/api', (req, res) => {

    // Load database formatted as JSON
    fs.readFile(database, 'utf8', (err, data) => {

        // If database does not exist
        if (err) {
            var response = { status: 'fail', result: err };
            res.json(response);

            // If database exists
        } else {

            // Get all records  
            var obj = JSON.parse(data);

            // Creates the new id based on the number of records
            req.body.id = obj.users.length + 1;

            // Current date
            req.body.date = new Date();

            // Includes new record
            obj.users.push(req.body);

            // Records updated database 
            fs.writeFile(database, JSON.stringify(obj), (err) => {

                // Recording error?
                if (err) {
                    var response = { status: 'fail', result: err };
                    res.json(response);

                    // Recording success?
                } else {

                    // Format response
                    var response = { status: 'success', result: 'Record successfully added' };

                    // Send response
                    res.json(response);
                }
            });
        }
    });
});

// get() method --> See "index.html" for help
app.get('/api', (req, res) => {

    // Load database formatted as JSON
    fs.readFile(database, 'utf8', (err, data) => {

        // If database does not exist
        if (err) {
            var response = { status: 'fail', result: err };
            res.json(response);

            // If database exists
        } else {

            // Formats data in JSON
            var obj = JSON.parse(data);

            // Standard result
            var result = 'No record found';

            // Get request id
            var data_id = req.query.id;

            // If you did not enter an id or id = 0
            if (data_id == undefined || data_id == 0) {

                // Returns all records
                result = obj.users;

                // If you entered an id
            } else {

                // Search the records for the id
                obj.users.forEach((user) => {

                    if (user != null) {

                        // If found the id, returns the record
                        if (user.id == data_id) {
                            result = user;
                        }
                    }
                });
            }

            // Formats response
            var response = { status: 'success', result: result };

            // Send response
            res.json(response);
        }
    });
});

// put() method --> See "index.html" for help
app.put('/api', (req, res) => {
    fs.readFile(database, 'utf8', (err, data) => {
        if (err) {
            var response = { status: 'fail', result: err };
            res.json(response);
        } else {
            var obj = JSON.parse(data);

            // Current date
            var today = new Date();

            // Note that the fields correspond to the database
            obj.users[(req.body.id - 1)].name = req.body.name;
            obj.users[(req.body.id - 1)].email = req.body.email;
            obj.users[(req.body.id - 1)].avatar = req.body.avatar;
            obj.users[(req.body.id - 1)].status = req.body.status;
            obj.users[(req.body.id - 1)].passwd = req.body.passwd;
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

// delete() method --> See "index.html" for help
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
