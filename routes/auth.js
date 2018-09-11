const fs = require('fs');
const path = require('path');

function auth (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    fs.readFile('index.html', 'utf-8', function (err, data) {
        var loadParam = "reLogin();";
        data = data.replace("{param}", loadParam).replace("{errorAuth}", "").replace("{errorReg}", "")
        .replace("{valueAuth}", "value=\"\"").replace("{valueReg}", "value=\"\"")
        .replace("{loginCheckBorder}", "").replace("{passwordCheckBorder}", "")
        .replace("{loginCheckBorder}", "").replace("{passwordBorder}", "").replace("{rePasswordBorder}", "");
        res.end(data);
    })
}

module.exports = auth;