const express = require('express')
const pool = require('../config/db'); //importamos la bd
const router = express.Router()

router.post("/guardar", async (req, res) => {
    console.log(req.body);
    const { nombre, descripcion, categoria_id, precio, imagen } = req.body;

    const query = 'INSERT INTO platillos(nombre, descripcion, categoria_id, precio, imagen) VALUES (?, ?, ?, ?, ?)';

    try {
        // Ejecutar la consulta usando async/await
        const [result] = await pool.query(query, [nombre, descripcion, categoria_id, precio, imagen]);

        // Enviar respuesta con el resultado de la inserción
        res.status(201).send(`Platillos guardada exitosamente con ID: ${result.insertId}`);
    } catch (err) {
        console.error(`Error al guardar Platillo: ${err}`);
        res.status(500).send("Error del servidor");
    }
});

router.get("/listar", async (req, res) => {
    try {
        // Ejecutamos la consulta usando async/await
        const [result] = await pool.query("SELECT * FROM platillos");
        
        // Enviar respuesta con los resultados
        res.status(200).send(result);
    } 
    catch (error) {
        console.error(`Error al mostrar Listado de platillos: ${err}`);
        res.status(500).send("Error del servidor");
    }
});

router.put("/actualizar", async (req, res) => {
    console.log(req.body);
    const { id, nombre, descripcion, categoria_id, precio, imagen } = req.body;

    const query = 'UPDATE platillos SET nombre=?, descripcion=?, categoria_id=?, precio=?, imagen=? WHERE id=?';

    try {
        // Ejecutar la consulta usando async/await
        const [result] = await pool.query(query, [nombre, descripcion, categoria_id, precio, imagen, id]);

        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).send('Detalle no encontrado');
        }

        // Enviar respuesta con el resultado de la actualización
        res.status(200).send(`Platillo actualizada exitosamente con ID: ${result.insertId}`);
    } catch (err) {
        console.error(`Error al actualizar platillo: ${err}`);
        res.status(500).send('Error al actualizar detalle');
    }
});

//eliminar
router.delete("/eliminar/:id", async (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM platillos WHERE id = ?';

    try {
        // Ejecutar la consulta usando async/await
        const [result] = await pool.query(query, [id]);

        // Verificar si se eliminó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Platillo no encontrado'
            });
        }

        // Enviar respuesta de éxito
        res.status(200).send("Categoría eliminada con éxito.");
    } catch (err) {
        console.error(`Error al eliminar platillo: ${err}`);
        res.status(500).send("Error en el servidor");
    }
});


module.exports = router;