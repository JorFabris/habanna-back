const express = require('express');
const app = express();
const { prodsDAO } = require('../../server');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/productos', function (req, res) {
    let prod = req.body;

    prodsDAO.post(prod, function (err, prods) {
        if (err) {
            res.send({
                'error': true,
                'err': err
            });
        } else {
            res.json(prods);
        }
    });
});

app.get('/productos', function (req, res) {
    prodsDAO.getAll(function (err, prods) {
        if (err) {
            return res.status(400).json(err)
        }
        res.json(prods);
    });
});

app.get('/producto/:id', function (req, res) {
    let id = req.params.id;

    prodsDAO.getById(id, function (err, prod) {
        if (err) {
            return res.status(400).json(err)
        }
        res.json(prod);
    });
});

app.delete('/producto', function (req, res) {
    let prod = req.body;

    prodsDAO.delete(prod, function (err, producto) {
        if (err) { 
            return res.status(400).json(err) 
        }
        console.log(`Producto: "${prod.descripcion}" eliminado!`);
        res.json(prod);
    });
});


module.exports = app;