const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/login', function (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    usersDAO.validateLogin(username, password, function (err, user) {
        if (err) {
            res.send({ 'error': true, 'err': err });
        }
        else {
            user.password = null;
            res.send({ 'error': false, 'user': user });
        }
    });
});

module.exports = app;