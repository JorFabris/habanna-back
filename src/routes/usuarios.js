const express = require('express');
const app = express();
const { usersDAO } = require('../../server');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/usuarios', function (req, res) {
  let usuario = req.body;
  let fc_alta = new Date();
  usuario.fecha_alta = fc_alta;

  usersDAO.post(usuario, function (err, user) {
    if (err) {
      res.send({
        'error': true,
        'err': err
      });
    } else {
      res.json(user);
    }
  });
});

app.get('/usuarios', function (req, res) {
  usersDAO.getAll(function (err, user) {
    if (err) {
      return res.send({
        'error': true,
        'err': err
      });
    } else {
      res.json(user);
    }
  });
});

app.get('/usuarios/getById', function (req, res) {
  usersDAO.getById(function (err, user) {
    if (err) {
      return res.send({
        'error': true,
        'err': err
      });
    } else {
      res.json(user);
    }
  });
});

app.put('/usuarios', function (req, res) {
  let user = req.body;

  usersDAO.put(user, function (err, userAct) {

      if (err) { return res.status(400).json(err) };

      res.json(userAct);
  });
});

app.delete('/usuarios', function (req, res) {
  let usuario = req.body;

  usersDAO.delete(usuario, function (err, usuario) {
      if (err) {
          return res.status(400).json(err)
      }
      console.log(`Usuario: "${usuario.nombre}" eliminado!`);
      res.json(usuario);
  });
});

module.exports = app;