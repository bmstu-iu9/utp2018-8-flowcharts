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
        
        //const data = parseBody(body);
        
        var cookies = parseCookies(req);
        title = 'new';
        const path = './usersProjects/' + cookies.login + '/' + title + '.txt';
        fs.writeFile(path, body, (err) => {
            if (err) throw err;
            
            db.run("INSERT INTO projects Values ($login, $title)", {$login: cookies.login, $title: title});
            
            db.close();
        });

        
        
    });       
}

module.exports = save;