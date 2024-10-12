const express = require('express')
const db = require('../config/db'); //importamos la bd
const router = express.Router()


router.post("/guardar",(req, res)=>{
    console.log(req.body);
    const numero = req.body.numero;
    const capacidad_max = req.body.capacidad_max;
    db.query('INSERT INTO mesas(numero, capacidad_max) VALUES (?, ?)',
    [numero, capacidad_max],
    (err, result)=>{
        if(err){
            console.log(`Error al guardar mesa${err}`);
            return res.status(500).send('Error al crear mesa');
        }else{
            res.status(201).json({ message: `Mesa creada exitosamente`, orderId: result.insertId });
        }
        }
    );
});

//listar
router.get("/listar",(req,res)=>{
    db.query("SELECT * FROM mesas", 
    (err, result)=>{
        if(err){
            console.log(`Error al mostrar mesas${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});

//Editar 
router.put("/actualizar",(req, res)=>{
    console.log(req.body);
    const id = req.body.id;
    const numero = req.body.numero;
    const capacidad_max = req.body.capacidad_max;
    db.query('UPDATE mesas SET numero=?, capacidad_max=? WHERE id=?',
    [numero, capacidad_max, id],
    (err, result)=>{
        if(err){
            console.log(`Error al actualizar mesa${err}`);
        }else{
            res.send(`Mesa actualizado! ${result}`);
        }
        }
    );
});

//eliminar
router.delete("/eliminar/:id", (req, res) => {
    const id = req.params.id;
        db.query('DELETE FROM mesas WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.log(`Mesa no eliminada: ${err}`);
                return res.status(500).send("Error al eliminar la mesa");
            } else {
                res.send({ message: "Mesa eliminada con éxito", result });
            }
        });
});



module.exports = router;