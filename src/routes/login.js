const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse applicaction/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());


app.get('/signup', function (req, res) {
    res.sendFile(__dirname + '/views/signup.html');
});


app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

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