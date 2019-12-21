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

app.get('/usuario/:id', function (req, res) {
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

app.put('/usuario/:id', function (req, res) {
  let id = req.params.id
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  user.nombre = req.body.nombre;
  user.apellido = req.body.apellido;
  user.role = req.body.role;
  user.activo = req.body.activo

  usersDAO.update(id, user, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({ ok: false, err });
    }
    res.json(usuarioDB);
  })
});


module.exports = app;