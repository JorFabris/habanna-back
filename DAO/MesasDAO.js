

function MesasDAO(db){

    if (false == (this instanceof MesasDAO)) {
        console.log('WARNING: UserDAO constructor called without "new" operator');
        return new MesasDAO(db);
      }
    

      var database = db.db('app_habb');
      
      var mesas = database.collection('mesas')
  



      this.addMesa = function(mesa,callback){

        mesas.findOne({'numero':mesa.numero},function(err,fmesa){
            if(err) throw err;

            if(fmesa){
                var mesa_existe = new Error('Este numero de mesa ya existe');
                mesa_existe.msg = "Este numero de mesa ya existe"
                return callback(mesa_existe, null);
            }else{

                mesas.insertOne(mesa, function (err, result) {
                    if (err) return callback(err, null);
                    
                    console.log('Nueva mesa creada');
                    return callback(null, result[0]);
                  });
        

            }
        })


        

     

      }

      this.getMesa = function(callback){

        var qryOpts={
            'sort':[['numero', 'desc']]
        }

        mesas.find({},qryOpts).toArray(function(err,mesas){
            
            console.log('MESAS: ',mesas);
            if(err){
                var errMesas = new Error('No hay mesas aún');
                errMesas.msg = "No hay mesas aún";
                return callback(errMesas,null);
            }else{
                return callback(null,mesas);
            }
           
        })
      }

}

module.exports.MesasDAO = MesasDAO;