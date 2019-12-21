function PedidosDAO(db) {

    let ObjectId = require('mongodb').ObjectID;

    if (false == (this instanceof PedidosDAO)) {
        console.log('WARNING: PedidosDAO constructor called without "new" operator');
        return new PedidosDAO(db);
    }

    let database = db.db('app_habb');
    let pedidos = database.collection('pedidos')


    this.post = function (pedido, callback) {

        pedidos.insertOne(pedido, function (err, result) {
            if (err) return callback(err, null);

            console.log('Nueva pedido creado');
            return callback(null, result[0]);
        });
    }

    this.getAll = function (callback) {
        pedidos.find({}).toArray(function (err, pedidos) {
            if (err) {
                let msgError = new Error('No hay pedidos aún');
                return callback(msgError, null);
            }
            return callback(null, pedidos);
        });
    }

    this.getById = function (id, callback) {
        pedidos.findOne({ "_id": ObjectId(id) }, function (err, pedido) {
            if (err) {
                let msgError = "No se encontró ningún Producto"
                return callback(msgError, null)
            }
            return callback(null, pedido);
        })
    }


    this.put = function (ped, callback) {
        pedidos.updateOne(
            { "_id": ObjectId(ped._id) },
            {
                $set: {
                    "fecha": ped.fecha,
                    "hora": ped.hora,
                    "apellido_cliente": ped.apellido_cliente,
                    "descripcion": ped.descripcion,
                    "usuario": ped.usuario,
                    "mesa": ped.mesa,
                    "productos": ped.productos,
                }
            },
            { upsert: true },
            function (err, ped) {
                if (err) throw err;
                callback(null, ped)
            });
    }

    this.delete = function (ped, callback) {
        pedidos.deleteOne({ "_id": ObjectId(ped._id) }, function (err, ped) {
            if (err) throw err;
            callback(null, ped)
        }
        );
    }

}

module.exports.PedidosDAO = PedidosDAO;