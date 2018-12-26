import path from 'path';
import express from 'express';
import compression from 'compression';
import routes from './src/routes';
import { renderHTMLString } from '@sketchpixy/rubix/lib/node/router';
import RubixAssetMiddleware from '@sketchpixy/rubix/lib/node/RubixAssetMiddleware';
import session from 'express-session'
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require ('body-parser')
const http = require('http')
const socketio = require('socket.io')
const port = process.env.PORT || 3000;

let app = express();

app.use(bodyParser.json ())
app.use(bodyParser.urlencoded ({extended: true}))

var options = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '$IsiBolivia2018',
  database: 'gps'
};

var sessionStore = new MySQLStore(options);

app.use(session({
  secret: 'POmsjqA!@278456!@AqUJyr',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}));

app.use(compression());
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

const server = http.createServer(app)
const io = socketio.listen(server)

function renderHTML(req, res) {
  renderHTMLString(routes, req, (error, redirectLocation, html) => {
    if (error) {
      if (error.message === 'Not found') {
        res.status(404).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else {
      res.render('index', {
        content: html
      });
    }
  });
}

import {serverSocket} from './sockets'
serverSocket(io)
//require('./sockets')(io)
import {serverTCP} from './tcpServer'
serverTCP()
app.use(require('./routes/ruta_usuarios'))

app.get('*', RubixAssetMiddleware('ltr'), (req, res, next) => {
  renderHTML(req, res);
});

server.listen(port, () => {
  console.log(`Aplicacion ejecutando en http://localhost:${port}/`);
  console.log(`****************************************************`);
});
