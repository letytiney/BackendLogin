const express = require('express')
const db = require('../config/db'); //importamos la bd
const router = express.Router();


router.get("/listar",(req,res)=>{
    db.query("SELECT * FROM detalles_orden", 
    (err, result)=>{
        if(err){
            console.log(`Error al mostrar detalle de ordenes${err}`);
            return res.status(500).send('Error al mostrar detalle de ordenes');
            }else{
                res.status(200).json(result);
            }	
    }
    );
});

router.post ("/guardar",(req, res)=>{
    console.log(req.body);
    const { orden_id, platillo_id, cantidad} = req.body;

    db.query('INSERT INTO detalles_orden(orden_id, platillo_id, cantidad) VALUES (?, ?, ?)',
    [orden_id, platillo_id, cantidad],
    (err, result)=>{
        if(err){
            console.log(`Error al crear detalle orden${err}`);
            return res.status(500).send('Error al crear detalle orden');
        }
        res.status(201).json({ message: `Detalle orden creada exitosamente`, orderId: result.insertId });
        }
    );
});

//Editar //pendiente logica si usar patch
router.put("/actualizar",(req, res)=>{
    console.log(req.body);
    const { id, orden_id, platillo_id, cantidad} = req.body;
    db.query('UPDATE detalles_orden SET orden_id=?, platillo_id=?, cantidad=? WHERE id=?',
    [orden_id, platillo_id, cantidad, id],
    (err, result)=>{
        if(err){
            console.log(`Error al actualizar detalle orden${err}`);
        }else{
            res.send(`Detalle orden actualizado! ${result}`);
        }
        }
    );
});

//eliminar
router.delete("/eliminar/:id", (req, res) => {
    const id = req.params.id;
        db.query('DELETE FROM detalles_orden WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.log(`Detalle orden no eliminada: ${err}`);
                return res.status(500).send("Error al eliminar detalle orden");
            } else {
                res.send({ message: "Detalle orden eliminada con éxito", result });
            }
        });
});



module.exports = router;