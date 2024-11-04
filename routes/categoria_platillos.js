const express = require('express')
const pool = require('../config/db'); //importamos la bd
const router = express.Router();

router.post("/guardar", async (req, res) => {
    console.log(req.body);
    const nombre = req.body.nombre;

    const query = 'INSERT INTO categorias_platillos(nombre) VALUES (?)';

    try {
        // Ejecutar la consulta directamente con el pool
        const [result] = await pool.query(query, [nombre]);

        res.status(201).send(`Categoría guardada exitosamente con ID: ${result.insertId}`);
    } catch (err) {
        console.error(`Error al guardar categoría: ${err}`);
        res.status(500).send("Error del servidor");
    }
});

//listar
router.get("/listar", async (req, res) => {
    try {
        // Ejecutar la consulta para listar categorías
        const [result] = await pool.query("SELECT * FROM categorias_platillos");
        
        res.status(200).send(result);
    } catch (err) {
        console.error(`Error al mostrar categorías de platillos: ${err}`);
        res.status(500).send("Error del servidor");
    }
});

//Editar 
router.put("/actualizar",(req, res)=>{
    console.log(req.body);
    const id = req.body.id;
    const nombre = req.body.nombre;
    db.query('UPDATE categorias_platillos SET nombre=? WHERE id=?',
    [nombre, id],
    (err, result)=>{
        if(err){
            console.log(`Error al actualizar${err}`);
        }else{
            res.send(`Categoria actualizada! ${result}`);
        }
        }
    );
});
//eliminar
router.delete("/eliminar/:id", (req, res) => {
    const id = req.params.id;

    // Primero, verificar si la categorias_platillos tiene platillos asociados
    db.query('SELECT * FROM platillos WHERE categoria_id = ?', [id], (err, result) => {
        if (err) {
            console.log(`Error al eliminar categoria: ${err}`);
            return res.status(500).send("Error en el servidor");
        }
        // Si hay platillos asociados, no permitir la eliminación
        if (result.length > 0) {
            return res.status(400).send({ message: "No se puede eliminar el porque tiene un platillo asociados." });
        }
        // Si no hay platillos asociados, proceder a eliminar la categoria
        db.query('DELETE FROM categorias_platillos WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.log(`Categoria no eliminada: ${err}`);
                return res.status(500).send("Error al eliminar la persona");
            } else {
                res.send({ message: "Categoria eliminada con éxito", result });
            }
        });
    });
});
module.exports = router;