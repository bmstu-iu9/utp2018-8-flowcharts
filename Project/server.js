const http = require('http');
const sqlite3 = require('sqlite3').verbose();

const public = require('./routes/public');
const home = require('./routes/home');
const notFound =  require('./routes/notFound');
const help = require('./routes/help');
const reg = require('./routes/reg');
const auth = require('./routes/auth');
const checkReg = require('./public/scripts/regger');
const checkAuth = require('./public/scripts/auther');

http.createServer((req,res) => {
    switch (req.method) {
        case 'GET':
            if (req.url.match(/\.(html|css|js|png|jpg|php)$/)) {
                public(req, res);
            } else if (req.url === '/') {
                home(req, res); 
            } else if (req.url === '/reg') {
                reg(req, res); 
            } else if (req.url === '/auth') {
                auth(req, res); 
            } else if (req.url === '/help') {
                help(req, res); 
            } else {
                notFound(req, res);
            }
            break;

        case 'POST':
        if (req.url === '/reg') {
            checkReg(req, res); 
        } else if (req.url === '/auth') {
            checkAuth(req, res);
        }
    }
}).listen(3000, () => console.log('Сервер работает'));