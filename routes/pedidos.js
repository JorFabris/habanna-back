const express = require('express');
const app = express();
const { pedidosDAO } = require('../server');
const bodyParser = require('body-parser');

// parse applicaction/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());


app.post('/create/pedido', function (req, res) {
    var pedido = req.body;

    pedidosDAO.addPedido(pedido, function (err, peds) {
        if (err) {
            res.send({ 'error': true, 'err': err });
        }
        else {
            res.send({ 'error': false, 'prods': peds });
        }
    })
});

app.get('/pedidos', function (req, res) {
    pedidosDAO.getPedidos(function (err, peds) {

        if (err) {
            return res.send({ 'error': true, 'err': err });
        }
        else {
            res.json({ 'error': false, 'peds': peds });
        }
    })
});

module.exports = app;