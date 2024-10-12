const express = require('express')
const db = require('../config/db'); //importamos la bd
const router = express.Router();


router.get("/listar",(req,res)=>{
    db.query("SELECT * FROM ordenes", 
    (err, result)=>{
        if(err){
            console.log(`Error al mostrar ordenes${err}`);
            return res.status(500).send('Error al mostrar mesas');
            }else{
                res.status(200).json(result);
            }	
    }
    );
});

router.post ("/guardar",(req, res)=>{
    console.log(req.body);
    const { id_usuario, mesa_id, fecha_orden, total } = req.body;

    db.query('INSERT INTO ordenes(id_usuario, mesa_id, fecha_orden, total) VALUES (?, ?, ?, ?)',
    [id_usuario, mesa_id, fecha_orden, total],
    (err, result)=>{
        if(err){
            console.log(`Error al crear orden${err}`);
            return res.status(500).send('Error al crear orden');
        }
        res.status(201).json({ message: `Orden creada exitosamente`, orderId: result.insertId });
        }
    );
});

//Editar 
router.put("/actualizar",(req, res)=>{
    console.log(req.body);
    const id = req.body.id;
    const id_usuario = req.body.id_usuario;
    const mesa_id = req.body.mesa_id;
    const fecha_orden = req.body.fecha_orden;
    const total = req.body.total;
    db.query('UPDATE ordenes SET id_usuario=?, mesa_id=?, fecha_orden=?,total=?  WHERE id=?',
    [id_usuario, mesa_id, fecha_orden, total, id],
    (err, result)=>{
        if(err){
            console.log(`Error al actualizar orden${err}`);
        }else{
            res.send(`Orden actualizado! ${result}`);
        }
        }
    );
});

//eliminar
router.delete("/eliminar/:id", (req, res) => {
    const id = req.params.id;
        db.query('DELETE FROM ordenes WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.log(`Orden no eliminada: ${err}`);
                return res.status(500).send("Error al eliminar la orden");
            } else {
                res.send({ message: "Orden eliminada con éxito", result });
            }
        });
});



module.exports = router;