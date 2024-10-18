// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); 
const router = express.Router();
//AUTORIZACION CON TOKENS

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    
    const query = `
        SELECT u.*, r.nombre AS rol_nombre, e.descripcion AS estado_descripcion, GROUP_CONCAT(p.nombre) AS permisos
        FROM usuarios u 
        JOIN rol r ON u.rol_id = r.id_rol 
        JOIN estado_usuario e ON u.estado_id = e.id_estado 
        LEFT JOIN rol_permisos rp ON r.id_rol = rp.rol_id
        LEFT JOIN permisos p ON rp.permiso_id = p.id_permiso
        WHERE u.username = ?
        GROUP BY u.id_usuario;
    `;

    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Error del servidor", error: err.message });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        const user = results[0];
        console.log('User found:', { ...user, password: '[REDACTED]' });

    
        if (user.estado_descripcion.toLowerCase() !== 'activo') {
            return res.status(403).json({ message: "Usuario inactivo" });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Bcrypt error:', err);
                return res.status(500).json({ message: "Error del servidor", error: err.message });
            }

            if (!isMatch) {
                return res.status(400).json({ message: "Credenciales inválidas" });
            }

            // La creacion del token
            const payload = {
                user: {
                    id_usuario: user.id_usuario,
                    id_persona: user.id_persona,
                    username: user.username,
                    rol_id: user.rol_id,
                    rol_nombre: user.rol_nombre,
                    estado_id: user.estado_id,
                    estado_descripcion: user.estado_descripcion, 
                    roles: [user.rol_nombre], 
                    permissions: user.permisos ? user.permisos.split(',') : [] 
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) {
                        console.error('JWT error:', err);
                        return res.status(500).json({ message: "Error del servidor", error: err.message });
                    }
                    res.json({ token, user: payload.user });
                }
            );
        });
    });
});





/*
// Register route
router.post('/register', (req, res) => {
    const { id_persona, rol_id, estado_id, username, password } = req.body;

    // Check if the username already exists
    db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.log(`Error checking username: ${err}`);
            return res.status(500).send("Server error");
        }

        if (result.length > 0) {
            return res.status(400).send({ message: "Username already exists." });
        }

        // Hash the password
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                console.log(`Error hashing password: ${err}`);
                return res.status(500).send("Server error while hashing password");
            }

            // Insert new user into the database
            db.query('INSERT INTO usuarios(id_persona, rol_id, estado_id, username, password) VALUES(?, ?, ?, ?, ?)',
                [id_persona, rol_id, estado_id, username, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.log(`Error registering user: ${err}`);
                        return res.status(500).send("Error registering user");
                    } else {
                        res.status(201).send("User registered successfully");
                    }
                }
            );
        });
    });
});*/

module.exports = router;