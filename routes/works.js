const fs = require('fs');
const path = require('path');

function works (req, res) {
    rc = req.headers.cookie;
    console.log (rc);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const stream = fs.createReadStream(path.resolve('public', 'works.html'));

    stream.pipe(res);
}

module.exports = works;