const fs = require('fs');
const path = require('path');

function auth (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const stream = fs.createReadStream(path.resolve('public', 'auth.html'));

    stream.pipe(res);
}

module.exports = auth;