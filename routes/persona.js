const express = require('express')
const db = require('../config/db'); //importamos la bd
const router = express.Router();

//Tabla Persona - Empleado actualmente
router.post("/create",(req, res)=>{
    console.log(req.body);
    const primer_nombre = req.body.primer_nombre;
    const segundo_nombre = req.body.segundo_nombre;
    const primer_apellido = req.body.primer_apellido;
    const segundo_apellido = req.body.segundo_apellido;
    const telefono = req.body.telefono;
    const email = req.body.email;
    db.query('INSERT INTO persona(primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, email) VALUES (?,?,?,?,?,?)',
    [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, email],
    (err, result)=>{
        if(err){
            console.log(`Test de error${err}`);
        }else{
            res.send(result);
        }
        }
    );
});

/*Consulta que se muestra en la tabla de empleados.  */
router.get("/obtenerlistapersonas",(req,res)=>{
    db.query( "SELECT * FROM PERSONA", 
    (err, result)=>{
        if(err){
            console.log(`Test de error${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});
/*Filtro que se muestra al crear un usuario */
router.get("/obtenerpersona",(req,res)=>{
    db.query( `
        SELECT p.*
        FROM persona p
        LEFT JOIN usuarios u ON p.id = u.id_persona
        WHERE u.id_usuario IS NULL
        `, 
    (err, result)=>{
        if(err){
            console.log(`Test de error${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});

//Update
router.put("/update",(req, res)=>{
    console.log(req.body);
    const id = req.body.id;
    const primer_nombre = req.body.primer_nombre;
    const segundo_nombre = req.body.segundo_nombre;
    const primer_apellido = req.body.primer_apellido;
    const segundo_apellido = req.body.segundo_apellido;
    const telefono = req.body.telefono;
   //const direccion = req.body.direccion;
    const email = req.body.email;
    db.query('UPDATE persona SET primer_nombre=?, segundo_nombre=?, primer_apellido=?, segundo_apellido=?, telefono=?, email=? WHERE id=?',
    [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, email, id],
    (err, result)=>{
        if(err){
            console.log(`Persona no actualizada${err}`);
        }else{
            res.send(result);
        }
        }
    );
});

module.exports = router;