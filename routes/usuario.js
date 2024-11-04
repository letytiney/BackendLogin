const express = require('express')
const pool = require('../config/db'); //importamos la bd
const router = express.Router();
const bcrypt = require('bcrypt');

router.post("/create-usuario", async (req, res) => {
    const { id_persona, rol_id, estado_id, username, password } = req.body;

    try {
        // Verificar si el username ya existe
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);

        // Si el username ya existe, enviar un mensaje de error
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El nombre de usuario ya existe." });
        }

        // Si no existe, encriptar la contraseña antes de insertar el usuario
        const saltRounds = 10; // Número de rondas para el salt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertar el nuevo usuario con la contraseña encriptada
        const [result] = await pool.query('INSERT INTO usuarios(id_persona, rol_id, estado_id, username, password) VALUES(?, ?, ?, ?, ?)',
            [id_persona, rol_id, estado_id, username, hashedPassword]);

        res.status(201).send(`Usuarios guardada exitosamente con ID: ${result.insertId}`);
    } catch (err) {
        console.error(`Error al crear usuario: ${err}`);
        res.status(500).send("Error del servidor");
    }
});

router.get("/obteneruser", async (req, res) => {
    try {
        // Ejecutamos la consulta usando async/await
        const [result] = await pool.query("SELECT * FROM usuarios");
        
        // Enviar respuesta con los resultados
        res.status(200).send(result);
    } 
    catch (error) {
        console.error(`Error al obtener usuarios: ${err}`);
        res.status(500).send("Error del servidor");
    }
});


module.exports = router;