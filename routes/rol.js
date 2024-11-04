const express = require('express')
const pool = require('../config/db'); //importamos la bd
const router = express.Router();

router.get("/obtenerrol", async (req, res) => {
    try {
        // Ejecutamos la consulta usando async/await
        const [result] = await pool.query("SELECT id_rol, nombre FROM rol");
        
        // Enviar respuesta con los resultados
        res.status(200).send(result);
    } catch (error) {
        console.error(`Error al obtener roles: ${err}`);
        res.status(500).send("Error del servidor");
    }
});

module.exports = router;