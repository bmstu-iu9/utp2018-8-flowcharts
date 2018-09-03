const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function parseCookies (req) {
    var list = {},
        rc = req.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function works (req, res) {
    var db = new sqlite3.Database('./data.db');
    var cookies = parseCookies(req);
    var login;

    db.serialize(function() {
        db.get("SELECT * FROM sessions WHERE id=$id", {$id: cookies.session_id}, function(err, row) {
            if (typeof(row) === 'undefined') {
                console.log('NO SESSION');
                console.log(cookies.session_id);
            } else {
                login = row.login;
                let code = '';
                db.each("SELECT * FROM projects WHERE login=$login", {$login: login}, function(err, row) {
                    code += "<div class=\"project\">"+row.title+"</div>\n";
                });
                setTimeout(() => {
                    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                        fs.readFile(path.resolve('WorkZone', 'works.html'), 'utf-8', function (err, data) {
                        data = data.replace("{code}", code);
                        res.end(data);
                    });
                }, 10)
            }
        });
    });
}

module.exports = works;