const { io } = require('../../server');
const { pedidosDAO } = require('../../server');
const { prodsDAO } = require('../../server');
const { mesasDAO } = require('../../server');
const { usuariosDAO } = require('../../server');

io.on('connection', function (socket) {

    console.log('New user connected');

    socket.on('post-pedidos', function (pedido) {
        
        pedidosDAO.post(pedido, function (err, peds) {
            io.emit('post-pedidos', peds);
        });
        
    });

    socket.on('get-pedidos', function () {

        pedidosDAO.getAll(function (err, peds) {
            if (err) return console.log('Error al obtener los pedidos');;
            socket.emit('get-pedidos', peds);
        });

    });

});