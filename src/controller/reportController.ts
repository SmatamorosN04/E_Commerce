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