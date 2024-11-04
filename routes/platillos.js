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
        res.status(201).json({
            success: true,
            message: `Platillo guardada exitosamente`,
            platilloId: result.insertId
        });
    } catch (err) {
        console.error(`Error al guardar platillo: ${err}`);
        res.status(500).json({
            success: false,
            message: 'Error al guardar el platillo',
            error: err.message
        });
    }
});

router.get("/listar", async (req, res) => {
    try {
        // Ejecutamos la consulta usando async/await
        const [result] = await pool.query("SELECT * FROM platillos");
        
        // Enviar respuesta con los resultados
        res.status(200).json({
            success: true,
            data: result,
            count: result.length
        });
    } catch (error) {
        console.error(`Error al mostrar platillos: ${error}`);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la lista de platillos',
            error: error.message
        });
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
            return res.status(404).json({
                success: false,
                message: 'Platillo no encontrado'
            });
        }

        // Enviar respuesta con el resultado de la actualización
        res.status(200).json({
            success: true,
            message: 'Platillo actualizado exitosamente',
            platilloId: id
        });
    } catch (err) {
        console.error(`Error al actualizar platillo: ${err}`);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el platillo',
            error: err.message
        });
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
        res.status(200).json({
            success: true,
            message: "Platillo eliminada con éxito",
            result
        });
    } catch (err) {
        console.error(`Error al eliminar platillo: ${err}`);
        res.status(500).json({
            success: false,
            message: "Error al eliminar el platillo",
            error: err.message
        });
    }
});


module.exports = router;