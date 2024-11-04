const express = require('express')
const pool = require('../config/db'); //importamos la bd
const router = express.Router();

router.get("/listar", async (req, res) => {
    try {
        // Ejecutamos la consulta usando async/await
        const [result] = await pool.query("SELECT * FROM ordenes");
        
        // Enviar respuesta con los resultados
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error al mostrar órdenes: ${error}`);
        res.status(500).send("Error del servidor");
    }
});

router.post("/guardar", async (req, res) => {
    console.log(req.body);
    const { id_usuario, mesa_id } = req.body;
    const total = 0;
    const estado = 'pendiente';

    const query = 'INSERT INTO ordenes(id_usuario, mesa_id, fecha_orden, total, estado) VALUES (?, ?, NOW(), ?, ?)';

    try {
        // Ejecutar la consulta usando async/await
        const [result] = await pool.query(query, [id_usuario, mesa_id, total, estado]);
        
        // Enviar respuesta con el resultado de la inserción
        res.status(201).json({ ordenId: result.insertId }); // Enviar el ID de la orden en formato JSON
    } catch (err) {
        console.error(`Error al crear orden: ${err}`);
        res.status(500).send("Error del servidor");
    }
});

router.post("/enviar-orden/:id", async (req, res) => {
    const ordenId = req.params.id;

    const query = 'UPDATE ordenes SET estado = "preparando" WHERE id = ?';

    try {
        // Ejecutar la consulta usando async/await
        const [result] = await pool.query(query, [ordenId]);

        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).send('Orden no encontrada');
        }

        // Enviar respuesta con el resultado de la actualización
        res.status(200).json({
            success: true,
            message: 'Orden enviada exitosamente',
            ordenId: ordenId,
            estado: 'preparando'
        });
    } catch (err) {
        console.error(`Error al enviar orden: ${err}`);
        res.status(500).send("Error al enviar orden");
    }
});

//Ejemplo usando Socket aun no probado
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
*/

module.exports = router;