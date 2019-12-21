function ProductosDAO(db) {

    if (false == (this instanceof ProductosDAO)) {
        console.log('WARNING: UserDAO constructor called without "new" operator');
        return new ProductosDAO(db);
    }

    var database = db.db('app_habb');
    var productos = database.collection('productos')

    this.post = function (producto, callback) {
        productos.findOne({ 'descripcion': producto.descripcion }, function (err, prod) {
            if (err) return new Error(err);

            if (prod) {
                let msgError = 'Esta descripción de Producto ya existe';
                return callback(msgError, null);

            } else {
                productos.insertOne(producto, function (err, result) {
                    if (err) return callback(err, null);

                    console.log('Nueva producto creado');
                    return callback(null, result[0]);
                });
            }
        });
    }

    this.getAll = function (callback) {
        productos.find({}).toArray(function (err, productos) {

            if (err) {
                let msgError = new Error('No hay productos aún');
                return callback(msgError, null);
            }
            return callback(null, productos);

        })
    }

    this.getById = function (id, callback) {
        productos.findOne({ '_id': id }, function (err, producto) {
            if (err) {
                let msgError = "No se encontró ningún Producto"
                return callback(msgError, null)
            }
            return callback(null, producto);
        })
    }

    this.delete = function (prod, callback) {
        productos.deleteOne(prod, function (err, prod) {
            if (err) throw err;
            callback(null, prod)
        });
    }


}

module.exports.ProductosDAO = ProductosDAO;