const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function parseCookies(req) {
    var list = {},
        rc = req.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function works(req, res) {
    var db = new sqlite3.Database('./data.db');
    var cookies = parseCookies(req);
    var login;

    db.serialize(function () {
        db.get("SELECT * FROM sessions WHERE id=$id", {$id: cookies.session_id}, function (err, row) {
            if (typeof(row) === 'undefined') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');

                fs.readFile('index.html', 'utf-8', function (err, data) {
                    var loadParam = "reLogin();";
                    data = data.replace("{param}", loadParam).replace("{errorAuth}", "Log In before Projects").replace("{errorReg}", "")
                    .replace("{valueAuth}", "value=\"\"").replace("{valueReg}", "value=\"\"")
                    .replace("{loginCheckBorder}", "").replace("{passwordCheckBorder}", "")
                    .replace("{loginCheckBorder}", "").replace("{passwordBorder}", "").replace("{rePasswordBorder}", "");
                    res.end(data);
                })
            } else {
                login = row.login;
                //lastupdate = row.$lastupdate;
                let projects = '';
                db.each("SELECT * FROM projects WHERE login=$login", {$login: login}, function (err, row) {
                    projects += "<div class=\"project\">" + row.title + "<p class=\"defaulttext\">" + row.lastupdate + "</p></div>";
                });
                setTimeout(() => {
                    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                    fs.readFile(path.resolve('WorkZone', 'works.html'), 'utf-8', function (err, data) {
                        data = data.replace("{projects}", projects);
                        res.end(data);
                    });
                }, 100)
            }
        });
    });
}

module.exports = works;