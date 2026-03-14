import { Request, Response } from 'express';
import pool from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // 1. Valor Total del Inventario (Suma de Stock Actual * Costo en el último Log)
        // Como no tienes 'cost' en variants, lo sacamos del promedio de los logs o lo asumimos de los registros de entrada
        const inventoryValueRes = await pool.query(`
            SELECT COALESCE(SUM(v.stock_actual * (
                SELECT COALESCE(cost_at_moment, 0)
                FROM inventory_logs
                WHERE variant_id = v.id
                ORDER BY created_at DESC LIMIT 1
                                )), 0) as total_value
            FROM product_variants v
        `);

        // 2. Stock Crítico (Menos de 5 unidades)
        const lowStockRes = await pool.query(`
            SELECT p.sku, p.name as product_name, v.variant_name, v.stock_actual as stock
            FROM product_variants v
                     JOIN products p ON v.product_id = p.id
            WHERE v.stock_actual <= 5
            ORDER BY v.stock_actual ASC
                LIMIT 5
        `);

        // 3. Ventas de los últimos 7 días (Usando tu tabla 'orders')
        const salesHistoryRes = await pool.query(`
            SELECT
                to_char(d.day, 'Dy') as day,
                COALESCE(SUM(o.total_amount), 0) as amount
            FROM generate_series(
                CURRENT_DATE - INTERVAL '6 days',
                CURRENT_DATE,
                '1 day'::interval
                ) d(day)
                LEFT JOIN orders o ON date_trunc('day', o.created_at) = d.day
            GROUP BY d.day
            ORDER BY d.day ASC
        `);

        // 4. Ventas totales del mes actual (Tabla 'orders')
        const monthlySalesRes = await pool.query(`
            SELECT COALESCE(SUM(total_amount), 0) as monthly_total
            FROM orders
            WHERE date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)
              AND status = 'Completada'
        `);

        res.json({
            totalInventoryValue: parseFloat(inventoryValueRes.rows[0]?.total_value) || 0,
            monthlySales: parseFloat(monthlySalesRes.rows[0]?.monthly_total) || 0,
            lowStockItems: lowStockRes.rows || [],
            salesHistory: (salesHistoryRes.rows || []).map((row: any) => ({
                day: row.day,
                amount: parseFloat(row.amount) || 0
            }))
        });

    } catch (error: any) {
        console.error("Dashboard Error:", error.message);
        res.status(500).json({
            message: "Error al obtener estadísticas",
            error: error.message
        });
    }
};