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
        let error = "";
        
        if (login.length === 0) {
            error = "Введите логин!";
        } else if (login.length < 5) {
            error = "Минимальная длина логина - 5 символов!";
        } else if (password.length === 0) {
            error = "Введите пароль!";
        } else if (password.length < 3) {
            error = "Минимальная длина пароля - 3 символа!";
        } else if (password !== rePassword) {
            error = "Пароли не совпадают!";
        }
        
        if (error === "") {
        db.get("SELECT * FROM users WHERE login=$login", {$login: login}, function(err, row) {
            if (typeof(row) === 'undefined') {
                db.run("INSERT INTO users Values ($login, $password)", {$login: login, $password: password});
                res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                res.end('Вы успешно зарегистрированы!');    
            } else {
                error = "Пользователь с таким логином уже зарегистрирован!";
                res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                fs.readFile(path.resolve('public', 'regauthindex.html'), 'utf-8', function (err, data) {
                    var loadParam = "<body onload=\"showreg('block')\">";
                    data = data.replace("{param}", loadParam).replace("{errorReg}", error).replace("{errorAuth}", "")
                            .replace("{valueReg}", "value=\""+login.toString()+"\"").replace("{valueAuth}", "\"\"")
                            .replace("{loginBorder}", 'style=\"border: 1px solid lightcoral;\"');
                     
                    res.end(data);
                });
            }
        });  
    }
        
    else if (error !== "") {
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            fs.readFile(path.resolve('public', 'regauthindex.html'), 'utf-8', function (err, data) {
                var loadParam = "<body onload=\"showreg('block')\">";
                data = data.replace("{param}", loadParam).replace("{errorReg}", error).replace("{errorAuth}", "");
                if (error === "Введите логин!" || error === "Минимальная длина логина - 5 символов!") {
                    data = data.replace("{valueReg}", "value=\""+login.toString()+"\"").replace("{valueAuth}",  "value=\"\"")
                    .replace("{loginBorder}", 'style=\"border: 1px solid lightcoral;\"');    
                } 
                else if (error === "Введите пароль!" || error === "Минимальная длина пароля - 3 символа!" || error === "Пароли не совпадают!") {
                    data = data.replace("{valueReg}", "value=\""+login.toString()+"\"").replace("{valueAuth}",  "value=\"\"")
                        .replace("{passwordBorder}", 'style=\"border: 1px solid lightcoral;\"')
                        .replace("{rePasswordBorder}", 'style=\"border: 1px solid lightcoral;\"');
                }
                res.end(data);
            });
        }
        console.log(error);
        db.close();
    });       
}

module.exports = checkReg;