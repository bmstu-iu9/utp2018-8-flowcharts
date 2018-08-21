const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

function parseBody(body) {
    const result = {};
    const keyValuePairs = body.split('&');
    
    keyValuePairs.forEach(keyValue => {
        const [key, value] = keyValue.split('=');
        result[key] = value;
    });

    return result;
}

function regger (req, res) {
    let body = '';

    req.setEncoding('utf-8');
    req.on('data', data => body += data);
    req.on('end', () => {
        const data = parseBody(body);
        const login = body.login;
        const password = body.password;

        db.serialize(function() {
            
            db.each("SELECT * FROM users WHERE login LIKE '%login%'", function(err, row) {
                console.log(row.id);
            });
          });
          
          


        //res.writeHead(200, { 'Content-Type': 'application/json'});
        //res.end(JSON.stringify(data));
    });       
}

db.close();

module.exports = regger;