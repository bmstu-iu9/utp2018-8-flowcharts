const fs = require('fs');
const path = require('path');

function reg (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const stream = fs.createReadStream(path.resolve('public', 'reg.html'));

    stream.pipe(res);
}

module.exports = reg;