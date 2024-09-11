const express = require('express')
//instalar mysql2
const mysql = require('mysql2')
const app = express();
const cors = require("cors");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 3001;

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
/*Este es para que cuando se crear un nuevo usuario este se pueda actualizar sin necesidad que el usuario recargue el nav */
/*app.post("/agregarusuario", (req, res) => {
    const { id_persona, id_usuario, rol_id, estado_id, username } = req.body; // Asegúrate de que el cuerpo de la solicitud contenga estos datos

    db.query(`
        INSERT INTO usuarios (id_persona, id_usuario) VALUES (?, ?)`,
        [id_persona, id_usuario],
        (err, result) => {
            if (err) {
                console.log(`Error al agregar usuario: ${err}`);
                return res.status(500).send('Error al agregar usuario');
            }
            res.status(201).send('Usuario agregado correctamente');
        }
    );
});*/ /*Borrar esto hoy 10-09-2024 ya no sirve */

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

app.delete("/delete/:id",(req, res)=>{
    const id = req.params.id;

    db.query('DELETE FROM persona WHERE id=?',
    id,
    (err, result)=>{
        if(err){
            console.log(`Persona no eliminada${err}`);
        }else{
            res.send(result);
        }
        }
    );
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


/*Usuario*///Tabla Usuarios
/*
app.post("/create-usuario",(req,res)=>{
    const id_persona= req.body.id_persona;
    const rol_id= req.body.rol_id;
    const estado_id= req.body.estado_id;
    const username = req.body.username;
    const password = req.body.password;
    db.query('INSERT INTO usuarios(id_persona, rol_id, estado_id, username, password) VALUES(?, ?, ?, ?, ?)',
        [id_persona, rol_id, estado_id, username, password],
        (err, result)=>{
            if(err){
                console.log(`Test de error tabla usuario${err}`);
            }else{
                res.send("Usuario registrada con exito");
            }
            }
    );
});*/

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

        // Si no existe, proceder a insertar el nuevo usuario
        db.query('INSERT INTO usuarios(id_persona, rol_id, estado_id, username, password) VALUES(?, ?, ?, ?, ?)',
            [id_persona, rol_id, estado_id, username, password],
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

//Update
app.put("/updateuser",(req, res)=>{
    console.log(req.body);
    const id_usuario = req.body.id_usuario;
    const id_persona = req.body.id_persona;
    const rol_id = req.body.rol_id;
    const estado_id = req.body.estado_id;
    const username = req.body.username;
    const password = req.body.password;
    db.query('UPDATE usuarios SET id_persona=?, rol_id=?, estado_id=?, username=?, password=? WHERE id_usuario=?',
    [id_persona, rol_id, estado_id, username, password, id_usuario],
    (err, result)=>{
        if (err) {
            console.log(`Usuario no actualizada: ${err}`);
            res.status(500).send({ message: "Error al actualizar el usuario" });
        } else {
            res.send(result);
        }
        }
    );
});



app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  //console.log(Servidor escuchando en http://localhost:3001);
});