function PedidosDAO(db) {

    if (false == (this instanceof PedidosDAO)) {
        console.log('WARNING: PedidosDAO constructor called without "new" operator');
        return new PedidosDAO(db);
    }

    var database = db.db('app_habb');

    var pedidos = database.collection('pedidos')


    this.addPedido = function (pedido, callback) {

        pedidos.insertOne(pedido, function (err, result) {
            if (err) return callback(err, null);

            console.log('Nueva pedido creado');
            return callback(null, result.ops[0]);
        });
    }

    this.getPedidos = function (callback) {

        pedidos.find({}).toArray(function (err, peds) {
            if (err) {
                var errPeds = new Error('No hay PEDIDOS aún');
                errPeds.msg = "No hay PEDIDOS aún";
                return callback(errPeds, null);
            } else {
                return callback(null, peds);
            }
        })
    }

}

module.exports.PedidosDAO = PedidosDAO;