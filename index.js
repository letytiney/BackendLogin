const express = require('express');
const cors = require("cors");
const { expressjwt: expressJwt } = require("express-jwt");
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
require('dotenv').config();
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const PORT = process.env.PORT || 3001;
const authRoutes = require('./routes/auth'); 
const roleMiddleware = require('./middleware/roleMiddleware');
//Socket para envio de ordenes en tiempo real
const socketIo = require('socket.io');
const io = socketIo(server); // Inicializa Socket.IO

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', authRoutes);


app.use('/admin', 
    expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }), 
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

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});