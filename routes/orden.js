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
    const {id_usuario, mesa_id} = req.body;
    const total = 0;
    const estado = 'pendiente';

    db.query('INSERT INTO ordenes(id_usuario, mesa_id, fecha_orden, total, estado) VALUES (?, ?,  NOW(), ?, ?)',
    [id_usuario, mesa_id, total, estado],
    (err, result)=>{
        if(err){
            console.log(`Error al crear orden${err}`);
            return res.status(500).send('Error al crear orden');
        }
        res.status(201).json({ message: `Orden creada exitosamente`, orderId: result.insertId });
        }
    );
});
//Post para cambio de estado
/*
router.post("/enviar-orden/:id", (req, res) => {
    const ordenId = req.params.id;
    db.query(
        'UPDATE ordenes SET estado = "preparando" WHERE id = ?',
        [ordenId],
        (err, result) => {
            if (err) {
                console.log(`Error al enviar orden: ${err}`);
                return res.status(500).send('Error al enviar orden');
            }

            res.status(200).json({
                message: 'Orden enviada exitosamente',
                ordenId: ordenId,
                estado: 'preparando'
            });
        }
    );
});*/

//Ejemplo usando Socket aun no probado
router.post("/enviar-orden/:id", (req, res) => {
    const ordenId = req.params.id;
    db.query(
        'UPDATE ordenes SET estado = "preparando" WHERE id = ?',
        [ordenId],
        (err, result) => {
            if (err) {
                console.log(`Error al enviar orden: ${err}`);
                return res.status(500).send('Error al enviar orden');
            }

            // Emitir evento a los clientes conectados
            io.emit('ordenActualizada', {
                ordenId: ordenId,
                estado: 'preparando'
            });

            res.status(200).json({
                message: 'Orden enviada exitosamente',
                ordenId: ordenId,
                estado: 'preparando'
            });
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