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

        pedidosDAO.getPendientes(function (err, peds) {
            if (err) return console.log('Error al obtener los pedidos');
            console.log('Obteniendo pendientes');
            
            socket.emit('get-pedidos', peds);
        });

    });

    socket.on('get-pedidos-all', function () {

        pedidosDAO.getAll(function (err, peds) {
            if (err) return console.log('Error al obtener los pedidos');
            console.log('Obteniendo todos');
            
            socket.emit('get-pedidos-all', peds);
        });

    });

    socket.on('get-pedidos-listos', function () {

        pedidosDAO.getEntregados(function (err, peds) {
            if (err) return console.log('Error al obtener los pedidos');;
            socket.emit('get-pedidos-listos', peds);
        });

    });

    socket.on('update-pedido', function(pedido){
        pedidosDAO.put(pedido, function(err,peds){
            io.emit('update-pedido',peds);
        })
    })

});