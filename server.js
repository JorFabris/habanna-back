/* Librerias necesarias para la aplicación */
var bodyParser  = require('body-parser');
var express     = require('express');
var app         = express();
var http        = require('http').Server(app);
var io          = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
// IMPORTACION DE LOS DAO´S
var userDAO     = require('./DAO/UsersDAO').UserDAO;
var mesaDAO     = require('./DAO/MesasDAO').MesasDAO;
var prodDAO     = require('./DAO/ProductosDAO').ProductosDAO;
var pedidoDAO   = require('./DAO/PedidosDAO').PedidosDAO;
//OTRAS IMPORTACIONES
var morgan      = require('morgan');
var cors = require('cors')

// Para acceder a los parametros de las peticiones POST
app.use(bodyParser());

app.use(cors())

app.use(morgan('combined'));


app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ 'extended': false }));

/* Mongodb config */
var mdbconf = {
    host: 'localhost',
    port: '27017',
    db: 'app_habb'
  };




/* Get a mongodb connection and start application */
MongoClient.connect('mongodb://'+mdbconf.host+':'+mdbconf.port+'/'+mdbconf.db,{ useUnifiedTopology: true }, function (err, db) {
  
  if (err) return new Error('Connection to mongodb unsuccessful');

  
  
  var usersDAO = new userDAO(db); // Initialize userDAO
  var mesasDAO = new mesaDAO(db);
  var prodsDAO = new prodDAO(db);
  var pedidosDAO = new pedidoDAO(db);
  var onlineUsers = [];
  
  
/** *** *** ***
 *  Configuramos el sistema de ruteo para las peticiones web:
 */
  
  app.get('/signup', function (req, res) {
    res.sendFile( __dirname + '/views/signup.html');
  });
  
  app.post('/usuario/create', function (req, res) {
    var username   = req.body.username;
    var password   = req.body.password;
    var email      = req.body.email;
    var nombre     = req.body.nombre;
    var apellido   = req.body.apellido;
    //var fecha_alta = req.body.fecha_alta;
    var role       = req.body.role;
    var activo     = req.body.activo
     
    usersDAO.addUser(username, password, email, nombre, apellido, /*fecha_alta*/ role, activo, function (err, user) {
      if (err) {
        res.send({ 'error': true, 'err': err});
      }
      else {
        
        res.send({ 'error': false, 'user': user });
      }
    });
  });

  app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    
    usersDAO.validateLogin(username, password, function (err, user) {
      if (err) {
        res.send({'error': true, 'err': err});
      }
      else {
        user.password = null;
        res.send({ 'error': false, 'user': user});
      }
    });
  });


  app.post('/create/mesa',function(req,res){
    var mesa = req.body;
    mesasDAO.addMesa(mesa, function(err,mesas){
     if(err){
      res.send({'error': true, 'err': err});
     }
     else {
      res.send({ 'error': false, 'mesas': mesas});
    }
   })
  })

  
  app.get('/mesas',function(req,res){
    mesasDAO.getMesa(function(err,mesas){
      console.log(mesas);
      if(err){
      return res.send({'error': true, 'err': err});
      }
      else {
      res.json({ 'error': false, 'mesas': mesas});
     }
    })
   })

   app.post('/create/producto',function(req,res){
    var prod = req.body;
   
    prodsDAO.addProducto(prod, function(err,prods){
     if(err){
      res.send({'error': true, 'err': err});
     }
     else {
      res.send({ 'error': false, 'prods': prods});
    }
   })
  })


   app.get('/productos',function(req,res){
    prodsDAO.getProductos(function(err,prods){
      
      if(err){
      return res.send({'error': true, 'err': err});
      }
      else {
      res.json({ 'error': false, 'prods': prods});
     }
    })
   })

   app.post('/create/pedido',function(req,res){
    var pedido = req.body;
   
    pedidosDAO.addPedido(pedido, function(err,peds){
     if(err){
      res.send({'error': true, 'err': err});
     }
     else {
      res.send({ 'error': false, 'prods': peds});
    }
   })
  })


   app.get('/pedidos',function(req,res){
    pedidosDAO.getPedidos(function(err,peds){
      
      if(err){
      return res.send({'error': true, 'err': err});
      }
      else {
      res.json({ 'error': false, 'peds': peds});
     }
    })
   })
  
  /** css and js request */
  app.get('/css/foundation.min.css', function (req, res) {
    res.sendFile(__dirname + '/views/css/foundation.min.css');
  });

  // app.get('/css/normalize.css', function (req, res) {
  //   res.sendFile(__dirname + '/views/css/normalize.css');
  // });
  
  app.get('/js/foundation.min.js', function (req, res) {
    res.sendFile(__dirname + '/views/js/foundation.min.js');
  });
  /** *** *** */
  
  app.get('*', function(req, res) {
    res.sendFile( __dirname + '/views/chat.html');
  });


  /** *** *** ***
   *  Configuramos Socket.IO para estar a la escucha de
   *  nuevas conexiones. 
   */
  io.on('connection', function(socket) {
    
    console.log('New user connected');
    
    /**
     * Cada nuevo cliente solicita con este evento la lista
     * de usuarios conectados en el momento.
     */
    socket.on('all online users', function () {
      socket.emit('all online users', onlineUsers);
    });
    
    /**
     * Cada nuevo socket debera estar a la escucha
     * del evento 'chat message', el cual se activa
     * cada vez que un usuario envia un mensaje.
     * 
     * @param  msg : Los datos enviados desde el cliente a 
     *               través del socket.
     */
    // socket.on('chat message', function(msg) {
    //   io.emit('chat message', msg);
    // });

    socket.on('post-pedidos', function(pedido){
      
      
      pedidosDAO.addPedido(pedido,function(err,peds){
       
        
        io.emit('post-pedidos',peds);
      });
      // 
    });


    socket.on('get-pedidos', function(){
      console.log("Pidiendo pedidos");
      
      pedidosDAO.getPedidos(function(err,peds){
        if(err) return console.log('Error al obtener los pedidos');;
        socket.emit('get-pedidos',peds);
        
      })
    })
    
    /**
     * Mostramos en consola cada vez que un usuario
     * se desconecte del sistema.
     */
    socket.on('disconnect', function() {
      onlineUsers.splice(onlineUsers.indexOf(socket.user), 1);
      io.emit('remove user', socket.user);
      console.log('User disconnected');
    });
    
    /**
     * Cuando un cliente se conecta, emite este evento
     * para informar al resto de usuarios que se ha conectado.
     * @param  {[type]} nuser El nuevo usuarios
     */
    socket.on('new user', function (nuser) {
      socket.user = nuser;
      onlineUsers.push(nuser);
      io.emit('new user', nuser);
    });
    
  });


  /**
   * Iniciamos la aplicación en el puerto 3000
   */
  http.listen(3000, function() {
    console.log('listening on *:3000');
  });
});