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
            error = "Enter username!";
        } else if (login.length < 5) {
            error = "Username is 5 symbols minimum!";
        } else if (password.length === 0) {
            error = "Enter password!";
        } else if (password.length < 3) {
            error = "Password is 3 symbols minimum!";
        } else if (password !== rePassword) {
            error = "Passwords are not same!";
        }

        if (error === "Enter username!" || error === "Username is 5 symbols minimum!") {
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            fs.readFile('index.html', 'utf-8', function (err, data) {
                var loadParam = "reReg();";
                data =  data.replace("{param}", loadParam).replace("{errorReg}", error).replace("{errorAuth}", "")
                    .replace("{valueReg}", "value=\""+login.toString()+"\"").replace("{valueAuth}",  "value=\"\"")
                    .replace("{loginBorder}", 'style=\"border: 1px solid lightcoral;\"');
                res.end(data);
            });
        } else {
            db.get("SELECT * FROM users WHERE login=$login", {$login: login}, function(err, row) {
                if (typeof(row) === 'undefined') {
                    if (error === '') {
                        db.run("INSERT INTO users Values ($login, $password)", {$login: login, $password: password});
                        fs.mkdirSync("./usersProjects/"+login);
                        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                        res.end('Signed up successfully!');
                    } else {
                        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                        fs.readFile('index.html', 'utf-8', function (err, data) {
                            var loadParam = "reReg();";
                            data =  data.replace("{param}", loadParam).replace("{errorReg}", error).replace("{errorAuth}", "")
                                .replace("{valueReg}", "value=\""+login.toString()+"\"").replace("{valueAuth}",  "value=\"\"")
                                .replace("{passwordBorder}", 'style=\"border: 1px solid lightcoral;\"')
                                .replace("{rePasswordBorder}", 'style=\"border: 1px solid lightcoral;\"');
                            res.end(data);
                        });
                    }
                } else {
                    error = "This username already exists!";
                    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                    fs.readFile('index.html', 'utf-8', function (err, data) {
                        var loadParam = "reReg();";
                        data =  data.replace("{param}", loadParam).replace("{errorReg}", error).replace("{errorAuth}", "")
                            .replace("{valueReg}", "value=\""+login.toString()+"\"").replace("{valueAuth}", "\"\"")
                            .replace("{loginBorder}", 'style=\"border: 1px solid lightcoral;\"');

                        res.end(data);
                    });
                }
            });
        }
        db.close();
    });
}

module.exports = checkReg;