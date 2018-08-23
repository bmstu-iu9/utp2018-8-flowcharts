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

function checkReg (req, res) {
    var db = new sqlite3.Database('./data.db');
    let body = '';

    req.setEncoding('utf-8');
    req.on('data', data => body += data);
    req.on('end', () => {
        
        const data = parseBody(body);
        const login = data.login;
        const password = data.password;
        const rePassword = data.rePassword;
        var errors = [];
        if (login.length < 5) {
            errors.push("Логин от 5 символов");
        }
        if (password.length < 3) {
            errors.push("Пароль от 3 символов");
        }
        if (password != rePassword) {
            errors.push('Пароли не совпадают!');
        }
        
        if (errors.length == 0) {
        db.get("SELECT * FROM users WHERE login=$login", {$login: login}, function(err, row) {
            if (typeof(row) === 'undefined') {
                db.run("INSERT INTO users Values ($login, $password)", {$login: login, $password: password});
            } else errors.push('Пользователь с таким логином уже зарегистрирован!');
        });  
    }
        
        //res.end(errors[0]);
        if (errors.length > 0) {
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            const stream = fs.createReadStream(path.resolve('public', 'reg.html'));
            stream.pipe(res);
        } else {
            res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
            res.end('Вы успешно зарегистрированы!')
        }
        console.log(errors);
        db.close();
    });       
}



module.exports = checkReg;