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

app.get('/usuarios/:id', function (req, res) {
  let id = req.params.id;

  usersDAO.getById(id, function (err, user) {
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
      if (err) { 
        return res.status(400).json(err) 
      };
      res.json(userAct);
  });
});

app.delete('/usuarios/:id', function (req, res) {
  let id = req.params.id;

  usersDAO.delete(id, function (err, usuario) {
      if (err) {
          return res.status(400).json(err)
      }
      console.log(`Usuario: "${usuario.nombre}" eliminado!`);
      res.json(usuario);
  });
});

module.exports = app;