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

/*router.post ("/guardar",(req, res)=>{
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
});*/
// detallesOrdenRoutes.js
router.post("/guardar", (req, res) => {
    console.log(req.body);
    const { orden_id, platillo_id, cantidad } = req.body;

    // Insertamos el detalle de la orden
    db.query(
        'INSERT INTO detalles_orden(orden_id, platillo_id, cantidad) VALUES (?, ?, ?)',
        [orden_id, platillo_id, cantidad],
        (err, result) => {
            if (err) {
                console.log(`Error al crear detalle orden: ${err}`);
                return res.status(500).send('Error al crear detalle orden');
            }

            // Calculamos el total sumando todos los subtotales
            db.query(
                'SELECT SUM(subtotal) as total FROM detalles_orden WHERE orden_id = ?',
                [orden_id],
                (err, totalResult) => {
                    if (err) {
                        console.log(`Error al calcular total: ${err}`);
                        return res.status(500).send('Error al calcular total');
                    }

                    const nuevoTotal = totalResult[0].total || 0;

                    // Actualizamos el total y estado de la orden
                    db.query(
                        'UPDATE ordenes SET total = ? WHERE id = ?',
                        [nuevoTotal, orden_id],
                        (err, updateResult) => {
                            if (err) {
                                console.log(`Error al actualizar orden: ${err}`);
                                return res.status(500).send('Error al actualizar orden');
                            }

                            res.status(201).json({
                                message: 'Detalle orden creada exitosamente',
                                detalleId: result.insertId,
                                ordenId: orden_id,
                                nuevoTotal: nuevoTotal,
                            });
                        }
                    );
                }
            );
        }
    );
});

router.post("/enviar-orden/:id", (req, res) => {
    const ordenId = req.params.id;
    
    // Actualizamos solo el estado
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