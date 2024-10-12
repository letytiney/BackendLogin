const express = require('express')
const db = require('../config/db'); //importamos la bd
const router = express.Router();

router.get("/obtenerrol",(req,res)=>{
    db.query("SELECT  id_rol, nombre FROM rol", 
    (err, result)=>{
        if(err){
            console.log(`Test de error rol${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});

module.exports = router;