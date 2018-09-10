const fs = require('fs');
const path = require('path');

function home (req, res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const stream = fs.createReadStream(path.resolve('WorkZone/index.html'));

    stream.pipe(res);
}

module.exports = home;