const fs = require('fs');
const path = require('path');

function works (req, res) {
    
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    const stream = fs.createReadStream(path.resolve('WorkZone', 'works.html'));

    stream.pipe(res);
}

module.exports = works;