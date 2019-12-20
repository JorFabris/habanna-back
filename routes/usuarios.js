const express = require('express');
const app = express();
const usersDAO = require('../server');

const bodyParser = require('body-parser');

// parse applicaction/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.post('/usuario/create', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  //var fecha_alta = req.body.fecha_alta;
  var role = req.body.role;
  var activo = req.body.activo

  usersDAO.addUser(username, password, email, nombre, apellido, /*fecha_alta*/ role, activo, function (err, user) {
    if (err) {
      res.send({ 'error': true, 'err': err });
    }
    else {

      res.send({ 'error': false, 'user': user });
    }
  });
});

module.exports = app;