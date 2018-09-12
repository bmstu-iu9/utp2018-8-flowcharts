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

function deleteSession(req, res) {
    var db = new sqlite3.Database('./data.db');
    let body = '';

    req.setEncoding('utf-8');
    req.on('data', data => body += data);
    req.on('end', () => {
        var cookies = parseCookies(req);
        db.run("DELETE FROM sessions WHERE id = $id", {$id: cookies.session_id});
        db.close();
    });
}

module.exports = deleteSession;