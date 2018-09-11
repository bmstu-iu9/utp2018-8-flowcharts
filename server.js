const http = require('http');
//const sqlite3 = require('sqlite3').verbose();

const public = require('./routes/public');
const home = require('./routes/home');
const notFound =  require('./routes/notFound');
const reg = require('./routes/reg');
const auth = require('./routes/auth');
const checkReg = require('./Workzone/scripts/regger');
const checkAuth = require('./Workzone/scripts/auther');
const save = require('./Workzone/scripts/saver');
const works = require('./routes/works');
const deleteSession = require('./Workzone/scripts/saver');
const getUsername = require('./Workzone/scripts/saver');

http.createServer((req,res) => {
    switch (req.method) {
        case 'GET':
            if (req.url.match(/\.(html|css|js|png|jpg)$/)) {
                public(req, res);
            } else if (req.url === '/') {
                home(req, res); 
            // } else if (req.url === '/reg') {
            //     reg(req, res);
            // } else if (req.url === '/auth') {
            //     auth(req, res);
            } else if (req.url === '/works') {
                works(req, res); 
            } else {
                notFound(req, res);
            }
            break;

        case 'POST':
        if (req.url === '/reg') {
            checkReg(req, res); 
        } else if (req.url === '/auth') {
            checkAuth(req, res);
        } else if (req.url === '/save') {
            save(req,res);
        } else if (req.url === '/deleteSession') {
            deleteSession(req,res);
        }
    }
}).listen(3000, () => console.log('Сервер работает на localhost:3000'));