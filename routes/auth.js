const fs = require('fs');
const path = require('path');

function auth (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    fs.readFile(path.resolve('WorkZone', 'regauthindex.html'), 'utf-8', function (err, data) {
        var loadParam = "<body onload=\"showauth('block')\">";
        data = data.replace("{param}", loadParam).replace("{errorAuth}", "").replace("{errorReg}", "")
                   .replace("{valueReg}", "\"\"").replace("{valueAuth}", "\"\"");
        res.end(data);
    })
}

module.exports = auth;