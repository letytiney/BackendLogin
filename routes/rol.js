const express = require('express')
const pool = require('../config/db'); //importamos la bd
const router = express.Router();

router.get("/obtenerrol", async (req, res) => {
    try {
        // Ejecutamos la consulta usando async/await
        const [result] = await pool.query("SELECT id_rol, nombre FROM rol");
        
        // Enviar respuesta con los resultados
        res.status(200).json({
            success: true,
            data: result,
            count: result.length
        });
    } catch (error) {
        console.error(`Error al obtener roles: ${error}`);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la lista de roles',
            error: error.message
        });
    }
});

module.exports = router;