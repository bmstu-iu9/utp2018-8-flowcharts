const fs = require('fs');
const path = require('path');

function reg (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    fs.readFile(path.resolve('public', 'regauthindex.html'), 'utf-8', function (err, data) {
        var loadParam = "<body onload=\"showreg('block')\">";
        data = data.replace("{param}", loadParam).replace("{errorReg}", "").replace("{errorAuth}", "")
                    .replace("{valueReg}", "\"\"").replace("{valueAuth}", "\"\"");
        res.end(data);
    })
}

module.exports = reg;