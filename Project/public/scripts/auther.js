const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function parseBody(body) {
    const result = {};
    const keyValuePairs = body.split('&');
    
    keyValuePairs.forEach(keyValue => {
        const [key, value] = keyValue.split('=');
        result[key] = value;
    });

    return result;
}

function checkAuth (req, res) {
    var db = new sqlite3.Database('./data.db');
    let body = '';

    req.setEncoding('utf-8');
    req.on('data', data => body += data);
    req.on('end', () => {
        
        const data = parseBody(body);
        const login = data.login;
        const password = data.password;
        
        var errors = [];
        
        db.get("SELECT * FROM users WHERE login=$login", {$login: login}, function(err, row) {
            if (typeof(row) === 'undefined') {
                errors.push('Неверный логин');
                res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                const stream = fs.createReadStream(path.resolve('public', 'auth.html'));
                stream.pipe(res);
                console.log(errors);
            } else if (row.password !== password) {
                errors.push('Неверный пароль!')
                res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                const stream = fs.createReadStream(path.resolve('public', 'auth.html'));
                stream.pipe(res);
                console.log(errors);
            } else {
                console.log('HERE');
                res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                str = 'Вы успешно авторизованы под ником ' + login + '!';
                res.end(str);
                console.log(errors);
            }
        });  
        db.close();
    });       
}

module.exports = checkAuth;