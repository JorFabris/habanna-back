const express = require('express');
const app = express();
const { mesasDAO } = require('../../server');
const bodyParser = require('body-parser');

// parse applicaction/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());


app.post('/create/mesa', function (req, res) {
    var mesa = req.body;
    mesasDAO.addMesa(mesa, function (err, mesas) {
        if (err) {
            res.send({ 'error': true, 'err': err });
        }
        else {
            res.send({ 'error': false, 'mesas': mesas });
        }
    });
});

app.get('/mesas', function (req, res) {
    mesasDAO.getMesa(function (err, mesas) {
        console.log(mesas);
        if (err) {
            return res.send({ 'error': true, 'err': err });
        }
        else {
            res.json({ 'error': false, 'mesas': mesas });
        }
    });
});


module.exports = app;