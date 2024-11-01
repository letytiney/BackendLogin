const express = require('express')
const mysql = require('mysql2')
const app = express();
const cors = require("cors");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 3001;
const { saveOrden } = require ('./routes/ordenes/orden.js')

//
app.use(
    cors({
    origin: FRONTEND_URL,
    credentials: true,
    }) 
);

  //app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database: 'restauranteml'
});
/*----------------------------------------------------------------------Login ------------------------- */

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM usuarios WHERE username = ? AND password = ?";
    db.query(sql, [req.body.username, req.body.password], (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        if (data.length > 0) {
            // Usuario encontrado, login exitoso
            return res.status(200).json({ success: true, message: "Inicio de sesión correcto" });
        } else {
            // Usuario no encontrado o contraseña incorrecta
            return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
        }
    });
});

//Tabla Persona - Empleado actualmente
app.post("/create",(req, res)=>{
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
app.get("/obtenerlistapersonas",(req,res)=>{
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
app.get("/obtenerpersona",(req,res)=>{
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
app.put("/update",(req, res)=>{
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

app.delete("/delete/:id", (req, res) => {
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

/*-----------------------------------------------------------------------------------Usuario */
/*Rol, No se creo el formulario porque solo es tres roles , solo se jala desde la base de datos la info creada ahi mismo*/

app.get("/obtenerrol",(req,res)=>{
    db.query("SELECT  id_rol, nombre FROM rol", 
    (err, result)=>{
        if(err){
            console.log(`Test de error rol${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});
/*Estado, No se creo el formulario porque solo es dos estados , solo se jala desde la base de datos la info creada ahi mismo*/

app.get("/obtenerestado",(req,res)=>{
    db.query("SELECT id_estado, estado, descripcion FROM estado_usuario", 
    (err, result)=>{
        if(err){
            console.log(`Test de error estado ${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});


const bcrypt = require('bcrypt');

// Ruta para crear un nuevo usuario
app.post("/create-usuario", (req, res) => {
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

app.get("/obteneruser",(req,res)=>{
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


//Tabla categorias_platillos
//Guardar
app.post("/categoria/guardar",(req, res)=>{
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
app.get("/categoria/listar",(req,res)=>{
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
app.put("/categoria/actualizar",(req, res)=>{
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
app.delete("/categoria/eliminar/:id", (req, res) => {
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


//Tabla platillos
//Guardar
app.post("/platillos/guardar",(req, res)=>{
    console.log(req.body);
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const categoria_id = req.body.categoria_id;
    const precio = req.body.precio;
    db.query('INSERT INTO platillos(nombre, descripcion, categoria_id, precio) VALUES (?, ?, ?, ?)',
    [nombre, descripcion, categoria_id, precio],
    (err, result)=>{
        if(err){
            console.log(`Error al guardar platillo${err}`);
        }else{
            res.send(`Platillo guardada exitosamente ${result}`);
        }
        }
    );
});
//listar
app.get("/platillos/listar",(req,res)=>{
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

//Editar 
app.put("/platillos/actualizar",(req, res)=>{
    console.log(req.body);
    const id = req.body.id;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const categoria_id = req.body.categoria_id;
    const precio = req.body.precio;
    db.query('UPDATE platillos SET nombre=?, descripcion=?, categoria_id=?, precio=? WHERE id=?',
    [nombre, descripcion, categoria_id, precio, id],
    (err, result)=>{
        if(err){
            console.log(`Error al actualizar${err}`);
        }else{
            res.send(`Platillo actualizado! ${result}`);
        }
        }
    );
});

//eliminar
app.delete("/platillos/eliminar/:id", (req, res) => {
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

//Tabla Mesa
//Guardar
app.post("/mesas/guardar",(req, res)=>{
    console.log(req.body);
    const numero = req.body.numero;
    const capacidad_max = req.body.capacidad_max;
    db.query('INSERT INTO mesas(numero, capacidad_max) VALUES (?, ?)',
    [numero, capacidad_max],
    (err, result)=>{
        if(err){
            console.log(`Error al guardar mesa${err}`);
        }else{
            res.send(`Mesa registrada exitosamente ${result}`);
        }
        }
    );
});

//listar
app.get("/mesas/listar",(req,res)=>{
    db.query("SELECT * FROM mesas", 
    (err, result)=>{
        if(err){
            console.log(`Error al mostrar mesas${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});

//Editar 
app.put("/mesas/actualizar",(req, res)=>{
    console.log(req.body);
    const id = req.body.id;
    const numero = req.body.numero;
    const capacidad_max = req.body.capacidad_max;
    db.query('UPDATE mesas SET numero=?, capacidad_max=? WHERE id=?',
    [numero, capacidad_max, id],
    (err, result)=>{
        if(err){
            console.log(`Error al actualizar mesa${err}`);
        }else{
            res.send(`Mesa actualizado! ${result}`);
        }
        }
    );
});

//eliminar
app.delete("/mesa/eliminar/:id", (req, res) => {
    const id = req.params.id;
        db.query('DELETE FROM mesas WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.log(`Mesa no eliminada: ${err}`);
                return res.status(500).send("Error al eliminar la mesa");
            } else {
                res.send({ message: "Mesa eliminada con éxito", result });
            }
        });
});



app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});