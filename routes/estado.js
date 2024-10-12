const express = require('express')
const db = require('../config/db'); //importamos la bd
const router = express.Router();

router.get("/obtenerestado",(req,res)=>{
    db.query("SELECT id_estado, estado, descripcion FROM estado_usuario", 
    (err, result)=>{
        if(err){
            console.log(`Test de error estado ${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});

module.exports = router;