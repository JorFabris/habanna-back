const express = require('express');
const app = express();
const { mesasDAO } = require('../../server');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/mesas', function (req, res) {
    let mesa = req.body;

    mesasDAO.post(mesa, function (err, mesa) {
        if (err) {
            res.send({
                'error': true,
                'err': err
            });
        } else {
            res.json(mesa);
        }
    });
});

app.get('/mesas', function (req, res) {
    mesasDAO.getAll(function (err, mesa) {
        if (err) {
            return res.status(400).json(err)
        }
        res.json(mesa);
    });
});

app.get('/mesa/:id', function (req, res) {
    let id = req.params.id;
    
    mesasDAO.getById(id, function (err, mesa) {
        if (err) {
            return res.status(400).json(err)
        }
        res.json(mesa);
    });
});

app.put('/mesas', function (req, res) {
    let mesa = req.body;

    mesasDAO.put(mesa, function (err, mesa) {
        if (err) { 
            return res.status(400).json(err) 
        };
        res.json(mesa);
    });
});

app.delete('/mesas/:id', function (req, res) {    
    let id = req.params.id;
    
    mesasDAO.delete(id, function (err, mesa) {
        if (err) {
            return res.status(400).json(err)
        }
        console.log(`Mesa: "${mesa.numero}" eliminada!`);
        res.json(mesa);
    });
});

module.exports = app;