/* Librerias necesarias para la aplicación */
require('./src/config/config');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoClient = require('mongodb').MongoClient;
const morgan = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser');

// IMPORTACION DE LOS DAO´S
const userDAO = require('./src/DAO/UsersDAO').UserDAO;
const mesaDAO = require('./src/DAO/MesasDAO').MesasDAO;
const prodDAO = require('./src/DAO/ProductosDAO').ProductosDAO;
const pedidoDAO = require('./src/DAO/PedidosDAO').PedidosDAO;

// Para acceder a los parametros de las peticiones POST
// app.use(bodyParser());
app.use(cors())
app.use(morgan('combined'));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ 'extended': true }));

/* Mongodb config */
var mdbconf = {
  host: 'localhost',
  port: '27017',
  db: 'app_habb'
};

/* Get a mongodb connection and start application */
MongoClient.connect('mongodb://' + mdbconf.host + ':' + mdbconf.port + '/' + mdbconf.db, { useUnifiedTopology: true }, function (err, db) {

  if (err) return new Error('Se ha producido un error al conectar la Base de Datos', err);

  console.log('Conectado a la Base de Datos');

  var usersDAO = new userDAO(db); // Initialize userDAO
  var mesasDAO = new mesaDAO(db);
  var prodsDAO = new prodDAO(db);
  var pedidosDAO = new pedidoDAO(db);

  module.exports = {
    usersDAO,
    mesasDAO,
    prodsDAO,
    pedidosDAO
  }

  app.use(require('./src/routes/index'));

  module.exports.io = io;

  require('./src/sockets/socket');


  http.listen(process.env.PORT, () => {
    console.log('listening on *:', process.env.PORT);
  });

});
