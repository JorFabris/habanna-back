const express = require('express');
const app = express();
const prodsDAO = require('../server');

const bodyParser = require('body-parser');

// parse applicaction/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.post('/create/producto', function (req, res) {
    var prod = req.body;

    prodsDAO.addProducto(prod, function (err, prods) {
        if (err) {
            res.send({ 'error': true, 'err': err });
        }
        else {
            res.send({ 'error': false, 'prods': prods });
        }
    });
});

app.get('/productos', function (req, res) {
    prodsDAO.getProductos(function (err, prods) {

        if (err) {
            return res.send({ 'error': true, 'err': err });
        }
        else {
            res.json({ 'error': false, 'prods': prods });
        }
    });
});

module.exports = app;