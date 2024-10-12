const express = require('express')
const cors = require("cors");
const ordenRoutes = require('./routes/orden.js');
const detalleOrdenRoutes= require('./routes/detalle_orden.js')
const mesaRoutes= require('./routes/mesa.js')
const platillosRoutes= require('./routes/platillos.js')
const categoriaPlatillosRoutes= require('./routes/categoria_platillos.js')
const usuarioRoutes= require('./routes/usuario.js')
const rolRoutes= require('./routes/rol.js')
const estadoRoutes= require('./routes/estado.js')
const personaRoutes= require('./routes/persona.js')
const loginRoutes= require('./routes/login.js')
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
    }) 
);

  //app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('', loginRoutes);//refactorizar
app.use('', personaRoutes);//refactorizar
app.use('', estadoRoutes);//refactorizar
app.use('', rolRoutes);//refactorizar
app.use('', usuarioRoutes);//refactorizar
app.use('/categoria', categoriaPlatillosRoutes);
app.use('/platillos', platillosRoutes);
app.use('/mesas', mesaRoutes);
app.use('/orden', ordenRoutes);
app.use('/detalle_orden', detalleOrdenRoutes);



app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});