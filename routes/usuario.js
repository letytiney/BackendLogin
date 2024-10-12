const express = require('express')
const db = require('../config/db'); //importamos la bd
const router = express.Router();
const bcrypt = require('bcrypt');

router.post("/create-usuario", (req, res) => {
    const { id_persona, rol_id, estado_id, username, password } = req.body;
    // Verificar si el username ya existe
    db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.log(`Error al verificar el username: ${err}`);
            return res.status(500).send("Error en el servidor");
        }
        // Si el username ya existe, enviar un mensaje de error
        if (result.length > 0) {
            return res.status(400).send({ message: "El nombre de usuario ya existe." });
        }
        // Si no existe, encriptar la contraseña antes de insertar el usuario
        const saltRounds = 10; // Número de rondas para el salt

        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                console.log(`Error al encriptar la contraseña: ${err}`);
                return res.status(500).send("Error en el servidor al encriptar la contraseña");
            }

            // Insertar el nuevo usuario con la contraseña encriptada
            db.query('INSERT INTO usuarios(id_persona, rol_id, estado_id, username, password) VALUES(?, ?, ?, ?, ?)',
                [id_persona, rol_id, estado_id, username, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.log(`Error al registrar el usuario: ${err}`);
                        return res.status(500).send("Error al registrar el usuario");
                    } else {
                        res.send("Usuario registrado con éxito");
                    }
                }
            );
        });
    });
});

router.get("/obteneruser",(req,res)=>{
    db.query("SELECT * FROM usuarios", 
    (err, result)=>{
        if(err){
            console.log(`Test de error Usuarios${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});

router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    // Primero, verificar si la persona tiene usuarios asociados
    db.query('SELECT * FROM usuarios WHERE id_persona = ?', [id], (err, result) => {
        if (err) {
            console.log(`Error al verificar usuarios: ${err}`);
            return res.status(500).send("Error en el servidor");
        }

        // Si hay usuarios asociados, no permitir la eliminación
        if (result.length > 0) {
            return res.status(400).send({ message: "No se puede eliminar el porque tiene un usuario asociados." });
        }

        // Si no hay usuarios asociados, proceder a eliminar la persona
        db.query('DELETE FROM persona WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.log(`Persona no eliminada: ${err}`);
                return res.status(500).send("Error al eliminar la persona");
            } else {
                res.send({ message: "Persona eliminada con éxito", result });
            }
        });
    });
});


module.exports = router;