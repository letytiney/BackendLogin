const express = require('express')
const db = require('../config/db'); //importamos la bd
const router = express.Router();


router.post("/guardar",(req, res)=>{
    console.log(req.body);
    const nombre = req.body.nombre;
    db.query('INSERT INTO categorias_platillos(nombre) VALUES (?)',
    [nombre],
    (err, result)=>{
        if(err){
            console.log(`Error al guardar categoria${err}`);
        }else{
            res.send(`Categoria guardada exitosamente ${result}`);
        }
        }
    );
});
//listar
router.get("/listar",(req,res)=>{
    db.query("SELECT * FROM categorias_platillos", 
    (err, result)=>{
        if(err){
            console.log(`Error al mostrar categorias de platillos${err}`);
            }else{
                res.send(result);
            }	
    }
    );
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