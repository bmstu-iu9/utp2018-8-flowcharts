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

function parseCookies (req) {
    var list = {},
        rc = req.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function save (req, res) {
    var db = new sqlite3.Database('./data.db');
    let body = '';

    req.setEncoding('utf-8');
    req.on('data', data => body += data);
    req.on('end', () => {
        var cookies = parseCookies(req); 
        db.get("SELECT * FROM sessions WHERE id=$id", {$id: cookies.session_id}, function(err, row) {
            if (typeof(row) === 'undefined') {
                console.log('NO SESSION');
            } else {
                login = row.login;
                title = 'new';
                var curdt = new Date();
                lastupdate = "last updated in: " + curdt.toDateString();
                const path = './usersProjects/' + login + '/' + title + '.txt';
                console.log(body);
                fs.writeFile(path, body, (err) => {
                    if (err) throw err;
                    db.run("INSERT INTO projects Values ($login, $title, $lastupdate)", {$login: login, $title: title, $lastupdate: lastupdate});
                });
            }
        });
        setTimeout(() => {db.close();}, 100);  
    });       
}
module.exports = save;