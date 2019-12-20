/* Util para encriptar el password del usuario */
var bcrypt = require('bcrypt-nodejs');

// const { db } = require('../server');

function UserDAO(db){  
  /**
   * Si el constructor es llamado sin el operador 'new',
   * muestra una advertencia y lo llama correctamente.
   */
  if (false == (this instanceof UserDAO)) {
    console.log('WARNING: UserDAO constructor called without "new" operator');
    return new UserDAO(db);
  }
  
  /* Colección 'users' en la base de datos */
  var db = db.db('app_habb');
  var users = db.collection('users')
  
  
  this.addUser = function (username, password, email,nombre,apellido,/*fecha_alta,*/role,activo, callback) {

    // console.log('username'+username);
    // console.log('password'+password);
    // console.log('email'+email);
    // console.log('nombre'+nombre);
    // console.log('apellido'+apellido);
    // console.log('fecha_alta'+fecha_alta);
    // console.log('role'+role);
    // console.log('activo'+activo);
    
    
    // Verificamos que el usuario no exista aun
    users.findOne({'username': username}, function (err, user) {
      if (err) throw err;
      
      if (user) {
        var user_yet_exist_error = new Error('Este nombre de usuario ya existe');
        user_yet_exist_error.msg = "Este nombre de usuario ya existe"
        return callback(user_yet_exist_error, null);
      }
      else {
        
        //Generar fecha
        var day = new Date();
   
        


        var user = {
          'username':username,
          'password': password, 
          'email': email,
          'nombre': nombre, 
          'apellido':apellido,
          'fecha_alta':day,
          'role':role,
          'activo':activo
        };
        
        // Insertar el nuevo usuario en la base de datos
        users.insertOne(user, function (err, result) {
          if (err) return callback(err, null);
          
          console.log('Nuevo usuario creado');
          return callback(null, result[0]);
        });
      }
    });
  }
  
  this.validateLogin = function (username, password, callback) {
    
    users.findOne({'username': username,'password':password}, function (err, user) {
      if (err) return callback(err, null);
      
      if (user) {
       
          callback(null, user);
        
        
      }
      else {
        var no_such_user_error = new Error('User not found');
        no_such_user_error.msg = 'User not found';
        callback(no_such_user_error, null);
      }
    });
  }
  
}

module.exports.UserDAO = UserDAO;