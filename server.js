const http = require('http');

const public = require('./routes/public');
const home = require('./routes/home');
const notFound =  require('./routes/notFound');


http.createServer((req, res) => {
    if (req.url.match(/\.(html|css|js|png|jpg)$/)) {
        public(req, res);
    } else if (req.url === '/') {
        home(req, res); 
    } else {
        notFound(req, res);
    }
}).listen(3000, () => console.log('Сервер работает!'));