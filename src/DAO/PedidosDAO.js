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
            return callback(null, result.ops[0]);
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
                let msgError = "No se encontró ningún Pedido"
                return callback(msgError, null)
            }
            return callback(null, pedido);
        })
    }

    this.getPendientes = function (callback) {
        pedidos.find({ "entregado": { $eq: false } })
            .sort({ "hora": 1 })
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido"
                    return callback(msgError, null)
                }
                return callback(null, pedidos);
            })
    }

    this.getEntregados = function (callback) {
        pedidos.find({ "entregado": { $eq: true } })
            .sort({ "fecha": 1, "hora": -1 })
            .limit(50)
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido"
                    return callback(msgError, null)
                }
                return callback(null, pedidos);
            })
    }
        
    this.getPedidoMozo = function (id, callback) {
        pedidos.find({ "usuario._id": { $eq: id } })
            .sort({ "fecha": 1, "hora": -1 })
            .limit(50)
            .toArray(function (err, pedidos) {
                if (err) {
                    let msgError = "No se encontró ningún Pedido"
                    return callback(msgError, null)
                }
                return callback(null, pedidos);
            })
    }

    this.put = function (ped, callback) {
        pedidos.findOneAndUpdate(
            { "_id": ObjectId(ped._id) },
            {
                $set: {
                    "fecha": ped.fecha,
                    "hora": ped.hora,
                    "apellido_cliente": ped.apellido_cliente,
                    "descripcion": ped.descripcion,
                    "estado": ped.estado,
                    "estado_descrip": ped.estado_descrip,
                    "usuario": ped.usuario,
                    "mesa": ped.mesa,
                    "productos": ped.productos,
                }
            },
            { returnOriginal: false },
            function (err, ped) {
                if (err) throw err;
                
                console.log(ped.value);
                
                callback(null, ped.value);
            });
    }

    this.delete = function (id, callback) {
        pedidos.deleteOne({ "_id": ObjectId(id) }, function (err, ped) {
            if (err) throw err;
            callback(null, ped)
        }
        );
    }

}

module.exports.PedidosDAO = PedidosDAO;