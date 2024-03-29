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
            return res.status(400).json(err)
        }
        res.json(prods);
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

app.get('/productos/id/:id', function (req, res) {
    let id = req.params.id;
    
    prodsDAO.getById(id, function (err, prod) {
        if (err) {
            return res.status(400).json(err)
        }
        res.json(prod);
    });
});

app.get('/productos/nombre/:nombre', function (req, res) {
    let nombre = req.params.nombre;

    prodsDAO.getByNombre(nombre, function (err, prod) {
        if (err) {
            return res.status(400).json(err)
        }
        res.json(prod);
    });
});

app.put('/productos', function (req, res) {
    let prod = req.body;

    prodsDAO.put(prod, function (err, prods) {
        if (err) {
            return res.status(400).json(err)
        };
        res.json(prods);
    });
});

app.delete('/productos/:id', function (req, res) {
    let id = req.params.id;
    
    prodsDAO.delete(id, function (err, producto) {
        if (err) {
            return res.status(400).json(err)
        }
        console.log(`Producto: "${producto.descripcion}" eliminado!`);
        res.json(producto);
    });
});


module.exports = app;