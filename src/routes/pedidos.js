const express = require('express');
const app = express();
const { pedidosDAO } = require('../../server');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post('/pedidos', function (req, res) {
    let pedido = req.body;

    pedidosDAO.post(pedido, function (err, pedidos) {
        if (err) {
            res.send({
                'error': true,
                'err': err
            });
        } else {
            res.json(pedidos);
        }
    });
});

app.get('/pedidos', function (req, res) {
    pedidosDAO.getAll(function (err, pedidos) {
        if (err) {
            return res.status(400).json(err)
        }
        res.json(pedidos);
    });
});

app.get('/pedidos/:id', function (req, res) {
    let id = req.params.id;
    
    pedidosDAO.getById(id, function (err, pedido) {
        if (err) {
            return res.status(400).json(err)
        }
        res.json(pedido);
    });
});

app.put('/pedidos', function (req, res) {
    let pedido = req.body;

    pedidosDAO.put(pedido, function (err, pedidos) {

        if (err) { return res.status(400).json(err) };

        res.json(pedidos);
    });
});

app.delete('/pedidos/:id', function (req, res) {
    let id = req.params.id;
    
    pedidosDAO.delete(id, function (err, pedido) {
        if (err) {
            return res.status(400).json(err)
        }
        console.log(`Pedido: "${pedido.descripcion}" eliminado!`);
        res.json(pedido);
    });
});

module.exports = app;