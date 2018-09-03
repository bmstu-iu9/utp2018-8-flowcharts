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

function getRandom() {
    return Math.floor(Math.random() * 9732712) + 101;
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
        
        let error = "";
        
        db.get("SELECT * FROM users WHERE login=$login", {$login: login}, function(err, row) {
            if (typeof(row) === 'undefined') {
                error = "Неверный логин!";
                res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                fs.readFile(path.resolve('WorkZone', 'regauthindex.html'), 'utf-8', function (err, data) {
                    var loadParam = "<body onload=\"showauth('block')\">";
                    data = data.replace("{param}", loadParam).replace("{errorAuth}", error).replace("{errorReg}", "")
                        .replace("{valueAuth}", "value=\""+login.toString()+"\"").replace("{valueReg}", "value=\"\"")
                        .replace("{loginCheckBorder}", 'style=\"border: 1px solid lightcoral;\"');
                    res.end(data);
                });
                console.log(error);
            } else if (row.password !== password) {
                error = "Неверный пароль!";
                res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                fs.readFile(path.resolve('WorkZone', 'regauthindex.html'), 'utf-8', function (err, data) {
                    var loadParam = "<body onload=\"showauth('block')\">";
                    data = data.replace("{param}", loadParam).replace("{errorAuth}", error).replace("{errorReg}", "")
                        .replace("{valueAuth}", "value=\""+login.toString()+"\"").replace("{valueReg}", "value=\"\"")
                        .replace("{passwordCheckBorder}", 'style=\"border: 1px solid lightcoral;\"');
                    res.end(data);
                });
                console.log(error);
            } else {
                var id = getRandom();
                db.run("INSERT INTO sessions Values ($id, $login)", {$id: id, $login: login});
                cookie = 'session_id='+id;
                res.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8",
                    "Set-Cookie": cookie
                });
                fs.readFile(path.resolve('Workzone', 'index.html'), 'utf-8', function (err, data) {
                    res.end(data);
                })
            }
        });  
        db.close();
    });       
}

module.exports = checkAuth;