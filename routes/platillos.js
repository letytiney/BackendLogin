const express = require('express')
const db = require('../config/db'); //importamos la bd
const router = express.Router()

router.post("/guardar",(req, res)=>{
    console.log(req.body);
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const categoria_id = req.body.categoria_id;
    const precio = req.body.precio;
    const imagen = req.body.imagen;
    db.query('INSERT INTO platillos(nombre, descripcion, categoria_id, precio, imagen) VALUES (?, ?, ?, ?, ?)',
    [nombre, descripcion, categoria_id, precio, imagen],
    (err, result)=>{
        if(err){
            console.log(`Error al guardar platillo${err}`);
        }else{
            res.send(`Platillo guardada exitosamente ${result}`);
        }
        }
    );
});

router.get("/listar",(req,res)=>{
    db.query("SELECT * FROM platillos", 
    (err, result)=>{
        if(err){
            console.log(`Error al mostrar platillos${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});


router.put("/actualizar",(req, res)=>{
    console.log(req.body);
    const id = req.body.id;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const categoria_id = req.body.categoria_id;
    const precio = req.body.precio;
    const imagen = req.body.imagen;
    db.query('UPDATE platillos SET nombre=?, descripcion=?, categoria_id=?, precio=? imagen=?, WHERE id=?',
    [nombre, descripcion, categoria_id, precio, imagen, id],
    (err, result)=>{
        if(err){
            console.log(`Error al actualizar ${err}`);
        }else{
            res.send(`Platillo actualizado! ${result}`);
        }
        }
    );
});

//eliminar
router.delete("/eliminar/:id", (req, res) => {
    const id = req.params.id;
        db.query('DELETE FROM platillos WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.log(`Platillo no eliminada: ${err}`);
                return res.status(500).send("Error al eliminar la persona");
            } else {
                res.send({ message: "Platillo eliminada con éxito", result });
            }
        });
});


module.exports = router;