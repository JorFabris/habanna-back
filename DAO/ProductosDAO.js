

function ProductosDAO(db){

    if (false == (this instanceof ProductosDAO)) {
        console.log('WARNING: UserDAO constructor called without "new" operator');
        return new ProductosDAO(db);
      }


      var database = db.db('app_habb');
      
      var productos = database.collection('productos')


      this.addProducto = function(producto,callback){

        productos.findOne({'nombre':producto.nombre},function(err,prod){
            if(err) throw err;

            if(prod){
                var prod_existe = new Error('Este numero de mesa ya existe');
                prod_existe.msg = "Este producto ya existe"
                return callback(prod_existe, null);
            }else{

                productos.insertOne(producto, function (err, result) {
                    if (err) return callback(err, null);
                    
                    console.log('Nueva producto creado');
                    return callback(null, result[0]);
                  });
        

            }
        })

      }


      this.getProductos = function(callback){

        // var qryOpts={
        //     'sort':[['numero', 'desc']]
        // }

        productos.find({}).toArray(function(err,productos){
            
            console.log('PRODUCTOS: ',productos);
            if(err){
                var errProds = new Error('No hay productos aún');
                errProds.msg = "No hay productos aún";
                return callback(errProds,null);
            }else{
                return callback(null,productos);
            }
           
        })

      }

    

}

module.exports.ProductosDAO = ProductosDAO;