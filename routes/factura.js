const express = require('express')
const pool = require('../config/db'); //importamos la bd
const router = express.Router();

router.get("/listar", async (req, res) => {
    try {
        // Ejecutamos la consulta usando async/await
        const [result] = await pool.query("SELECT * FROM facturas");
        
        // Enviar respuesta con los resultados
        res.status(200).json(result);
    } catch (error) {
        console.error(`Error al mostrar Facturas: ${error}`);
        res.status(500).send("Error del servidor");
    }
});

router.post("/guardar", async (req, res) => {
    try {
        console.log(req.body);
        const nit_cliente = req.body.nit_cliente;
        const nombre_cliente = req.body.nombre_cliente;
        const direccion = req.body.direccion;
        const orden_id = req.body.orden_id;
        
        const result = await pool.query(
            'INSERT INTO facturas(nit_cliente, nombre_cliente, direccion, orden_id, fecha_factura ) VALUES (?, ?, ?, ?, NOW())',
            [nit_cliente, nombre_cliente, direccion,  orden_id]
        );
        
        res.status(201).send(`Factura generada exitosamente con ID: ${result.insertId}`);
    } 
    catch (error) {
        console.log(`Error al generar la factura: ${error}`);
        res.status(500).send("Error del servidor");
    }
});

/*
router.post("/guardar", async (req, res) => {
    try {
        console.log(req.body);
        const nit_cliente = req.body.nit_cliente;
        const nombre_cliente = req.body.nombre_cliente;
        const direccion = req.body.direccion;
        const orden_id = req.body.orden_id;

        // Obtener detalles de la orden
        const detallesQuery = `
            SELECT 
                do.cantidad,
                p.precio,
                (do.cantidad * p.precio) AS subtotal,
                p.nombre AS platillo_nombre  // Asegúrate de incluir el nombre del platillo
            FROM 
                detalles_orden do
            JOIN 
                platillos p ON do.platillo_id = p.id
            WHERE 
                do.orden_id = ?`;
        
        const [detalles] = await pool.query(detallesQuery, [orden_id]);

        // Calcular el total y construir el detalle
        let totalFactura = 0;
        let detallesFactura = [];

        detalles.forEach(detalle => {
            totalFactura += detalle.subtotal; // Sumar subtotales
            detallesFactura.push(`${detalle.cantidad} x ${detalle.platillo_nombre} ($${detalle.precio})`);
        });

        // Convertir el detalle a una cadena o JSON
        const detallesString = detallesFactura.join(", ");

        // Insertar en la tabla facturas
        const result = await pool.query(
            'INSERT INTO facturas(nit_cliente, nombre_cliente, direccion, orden_id, fecha_factura, totalFactura) VALUES (?, ?, ?, ?, NOW(), ?)',
            [nit_cliente, nombre_cliente, direccion, orden_id, totalFactura]
        );

        // Obtener el ID de la factura creada
        const facturaId = result.insertId;

        // Actualizar la factura con los detalles (opcional)
        await pool.query(
            'UPDATE facturas SET detalles = ? WHERE id = ?',
            [detallesString, facturaId]
        );

        res.status(201).send(`Factura generada exitosamente con ID: ${facturaId}`);
    } 
    catch (error) {
        console.log(`Error al generar la factura: ${error}`);
        res.status(500).send("Error del servidor");
    }
});
*/
module.exports = router;