const express = require('express');
const cors = require("cors");
const { expressjwt: expressJwt } = require("express-jwt");
const http = require('http'); 
require('dotenv').config();
const app = express();
const server = http.createServer(app); 
const roleMiddleware = require('./middleware/roleMiddleware');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authRoutes = require('./routes/auth'); 

app.use('/admin', expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), 
    roleMiddleware(['admin']), 
    (req, res) => {
        res.send('Welcome Admin!');
    }
);
app.use('/user', 
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), 
    (req, res) => {
        res.send(`Welcome User with ID: ${req.user.id}`);
    }
);

const ordenRoutes = require('./routes/orden.js');
const detalleOrdenRoutes = require('./routes/detalle_orden.js');
const mesaRoutes = require('./routes/mesa.js');
const platillosRoutes = require('./routes/platillos.js');
const categoriaPlatillosRoutes = require('./routes/categoria_platillos.js');
const usuarioRoutes = require('./routes/usuario.js');
const rolRoutes = require('./routes/rol.js');
const estadoRoutes = require('./routes/estado.js');
const personaRoutes = require('./routes/persona.js');
const autorizacion = require('./routes/auth.js');
const facturaRoutes = require('./routes/factura.js');
const clientesRoutes = require('./routes/clientes.js');
const reporteRoutes = require('./routes/reporte.js');
const arqueoCajaRoutes = require('./routes/arqueo_caja.js')


const LOCAL = process.env.LOCAL;

app.use('/auth', authRoutes);

// Other routes
app.use('', autorizacion)
app.use('', usuarioRoutes)
app.use('', personaRoutes);
app.use('', estadoRoutes);
app.use('', rolRoutes);
/*app.use('/user', usuarioRoutes);*/
app.use('/categoria', categoriaPlatillosRoutes);
app.use('/platillos', platillosRoutes);
app.use('/mesas', mesaRoutes);
app.use('/orden', ordenRoutes);
app.use('/detalle_orden', detalleOrdenRoutes);
app.use('/factura', facturaRoutes)
app.use('/cliente', clientesRoutes)
app.use('/reporte', reporteRoutes)
app.use('/caja', arqueoCajaRoutes)


// Iniciar el servidor
server.listen(process.env.PORT || 3001, () => {
    console.log(`Servidor escuchando en ${process.env.LOCAL}:${process.env.PORT || 3001}`);
});

