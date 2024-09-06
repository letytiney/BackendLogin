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
    //user:'leticia',
    //password:'admin',
    //database: 'gestionrestaurante'
    user:'root',
    password:'',
    database: 'restauranteml'
});
//Tabla Persona
app.post("/create",(req, res)=>{
    console.log(req.body);
    const primer_nombre = req.body.primer_nombre;
    const segundo_nombre = req.body.segundo_nombre;
    const primer_apellido = req.body.primer_apellido;
    const segundo_apellido = req.body.segundo_apellido;
    const telefono = req.body.telefono;
   //const direccion = req.body.direccion;
const email = req.body.email;
    db.query('INSERT INTO persona(primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, email) VALUES (?,?,?,?,?,?)',
    [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, email],
    (err, result)=>{
        if(err){
            console.log(`Test de error${err}`);
        }else{
            res.send("Persona registrada con exito");
        }
        }
    );
});

//instalar cors 


/*app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
}); */

//Ver tabla persona

app.get("/persona",(req,res)=>{
    db.query("SELECT * FROM personas", 
    (err, result)=>{
        if(err){
            console.log(`Test de error${err}`);
            }else{
                res.send(result);
            }	
    }
    );
});

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
    db.query('UPDATE personas SET primer_nombre=? segundo_nombre=?, primer_apellido=?, segundo_apellido=?, telefono=?, email=? WHERE id =?',
    [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, telefono, email, id],
    (err, result)=>{
        if(err){
            console.log(`Test de error${err}`);
        }else{
            res.send("Persona actualizada con exito");
        }
        }
    );
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  //console.log(`Servidor escuchando en http://localhost:3001`);
});
