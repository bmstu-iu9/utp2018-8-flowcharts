const fs = require('fs');
const path = require('path');

function help (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const stream = fs.createReadStream(path.resolve('public', 'help.html'));

    stream.pipe(res);
}

module.exports = help;