const http = require('http');

const public = require('./routes/public');
const home = require('./routes/home');
const notFound =  require('./routes/notFound');
const help = require('./routes/help');
const reg = require('./routes/reg');
const regger = require('./functions/regger');
//const signup = require('./routes/signup');

http.createServer((req,res) => {
    switch (req.method) {
        case 'GET':
            if (req.url.match(/\.(html|css|js|png|jpg|php)$/)) {
                public(req, res);
            } else if (req.url === '/') {
                home(req, res); 
            } else if (req.url === '/reg') {
                reg(req, res); 
            } else if (req.url === '/signup') {
                signup(req, res); 
            } else if (req.url === '/help') {
                help(req, res); 
            } else {
                notFound(req, res);
            }
            break;

        case 'POST':
        if (req.url === '/regger') {
            regger(req, res); 
        }
        
    }
}).listen(3000, () => console.log('Сервер работает'));