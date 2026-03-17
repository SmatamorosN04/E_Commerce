import { Request, Response} from "express";
import pool from "../config/db";

export const getInventorySummary = async (_req: Request, res: Response) => {
    try{
        const sql = `
        SELECT 
        SUM(stock_actual * (SELECT cost_at_moment
                            FROM inventory_logs
                            WHERE variant_id = pv.id
                              AND type = 'Entrada'
                            ORDER BY created_at DESC LIMIT 1 ))
                            as inversion_total,
            SUM(stock_actual) as productos_totales
            FROM product_variants pv;
        `;
        const result = await pool.query(sql);
        res.json(result.rows[0]);
    }catch (error){
        res.status(500).json({ error: 'error al calcular resumen'});
    }
};

export const getDailySales = async (_req: Request, res: Response) => {
    try {
        const sql = `
        SELECT 
        COUNT(o.id) as total_ventas,
        SUM(o.total_amount) as ingresos_brutos,
        SUM(oi.quantity * (oi.unit_price - (SELECT cost_at_moment
                                            FROM inventory_logs
                                            WHERE variant_id = oi.variant_id
                                              AND type = 'Entrada'
                                            ORDER BY created_at ASC LIMIT 1
            ))) as ganancia_neta
        FROM orders o 
        JOIN order_items oi ON o.id = oi.order_id
        WHERE o.created_at::date = CURRENT_DATE;
        `;
        const result = await pool.query(sql);
        res.json(result.rows[0]);
    }catch (error){
        console.error(error);
        res.status(500).json({ error: 'Error al calcular ganancias diarias'});
    }
};

export const getSalesReport = async ( req: Request, res: Response) => {
    const { start_date, end_date } = req.query;

    try{
        const reportQuery = `
        SELECT
            o.id,
            o.order_number as factura,
            o.costumer_name as cliente,
            o.total_amount as total,
            o.payment_method as pago, 
            o.created_at as fecha,
            SUM(oi.profit)margin * oi.quantity) as utilidad_total
            FROM orders o 
        JOIN order_items oi ON o.id = oi.order_id 
        WHERE o.created_at BETWEEN $1 AND $2 
        GROUP BY o.id 
        ORDER BY o.created_at DESC 
        `;

        const result = await pool.query(reportQuery, [start_date, end_date]);
        res.json(result.rows);
    }catch (error: any){
        res.status(500).json({ message: "Error al generar reporte", error: error.message});
    }
}

export const getTopProducts = async (req: Request, res: Response) => {
    try {
        const topQuery = `
     SELECT 
     p.name,
     v.variant_name,
     SUM(oi.quantity) as cantidad_vendida,
     SUM(oi.sold_price * oi.quantity) as ingresos_totales,
     SUM(oi.profit_margin * oi.quantity) as margen_total
 FROM order_items oi 
 JOIN product_variants v ON oi.variant_id = v.id
 JOIN products p ON v.produt_id = p.id
 GROUP BY p.name, v.variant_name
 ORDER BY margen_total DESC 
 LIMIT 10
     `;
        const result = await pool.query(topQuery)
        res.json(result.rows)
    }catch ( error: any){
        res.status(500).json({ message: "error al obtener top produtos", error: error.message});
    }
}