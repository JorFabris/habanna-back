/* Util para encriptar el password del usuario */
var bcrypt = require('bcrypt-nodejs');

function UserDAO(db) {
  if (false == (this instanceof UserDAO)) {
    console.log('WARNING: UserDAO constructor called without "new" operator');
    return new UserDAO(db);
  }
  /* Colección 'users' en la base de datos */
  var db = db.db('app_habb');
  var users = db.collection('users')


  this.post = function (user, callback) {
    users.findOne({ 'username': user.username }, function (err, userDB) {

      if (err) throw err;

      if (userDB) {

        let existe = new Error('Este nombre de usuario ya existe');
        return callback(existe, null);

      } else {

        users.insertOne(user, function (err, result) {

          if (err) { return res.status(400).json(err) }

          console.log('Nuevo usuario creado');
          return callback(null, result);

        });
      }
    });
  }

  this.getAll = function (callback) {
    users.find({}).toArray(function (err, usuarios) {
      if (err) {
        let msgError = "Error al obtener Usuarios."
        return callback(msgError, null)
      }
      return callback(null, usuarios);
    });
  }

  this.getById = function (id, callback) {
    users.findOne({ '_id': id }, function (err, usuario) {
      if (err) {
        let msgError = "No se encontró ningún Usuario"
        return callback(msgError, null)
      }
      return callback(null, usuario);
    });
  }

  this.update = function (user, callback) {
    users.findOne({ 'id': user.id }, function (err, user) {
      if (err) throw err;

      if (user) {
        var user_yet_exist_error = new Error('Este nombre de usuario ya existe');
        user_yet_exist_error.msg = "Este nombre de usuario ya existe"
        return callback(user_yet_exist_error, null);
      } else {
        // Insertar el nuevo usuario en la base de datos
        users.findOneAndUpdate(user, function (err, result) {

          if (err) { return res.status(400).json(err) }

          console.log('Usuario Actualizado');
          callback(null, user);
        });
      }
    });
  }


  this.delete = function (prod, callback) {
    productos.deleteOne(prod, function (err, prod) {
      if (err) throw err;
      callback(null, prod)
    });
  }

  this.validateLogin = function (username, password, callback) {
    users.findOne({
      'username': username,
      'password': password
    }, function (err, user) {
      if (err) return callback(err, null);

      if (user) {
        callback(null, user);
      } else {
        var no_such_user_error = new Error('User not found');
        no_such_user_error.msg = 'User not found';
        callback(no_such_user_error, null);
      }
    });
  }

}

module.exports.UserDAO = UserDAO;