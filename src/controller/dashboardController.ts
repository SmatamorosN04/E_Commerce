import { Request, Response } from 'express';
import pool from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // 1. Valor de Inventario (Suma de Stock Actual * Costo en el último Log)
        const inventoryRes = await pool.query(`
            SELECT COALESCE(SUM(v.stock_actual * (
                SELECT cost_at_moment 
                FROM inventory_logs 
                WHERE variant_id = v.id 
                ORDER BY created_at DESC LIMIT 1
            )), 0) as total_value 
            FROM product_variants v
        `);

        // 2. Ventas y Ganancias del Mes Actual (Usando la nueva columna profit_margin)
        const monthlyStatsRes = await pool.query(`
            SELECT
                COALESCE(SUM(o.total_amount), 0) as total_sales,
                COALESCE(SUM(oi.profit_margin * oi.quantity), 0) as total_profit
            FROM orders o
                     JOIN order_items oi ON o.id = oi.order_id
            WHERE date_trunc('month', o.created_at) = date_trunc('month', CURRENT_DATE)
              AND o.status = 'Completada'
        `);

        // 3. Historial de Ventas vs Ganancias (Para el gráfico de líneas del diseño)
        const historyRes = await pool.query(`
            SELECT
                to_char(d.day, 'Dy') as day,
                COALESCE(SUM(o.total_amount), 0) as sales,
                COALESCE(SUM(oi.profit_margin * oi.quantity), 0) as profit
            FROM generate_series(
                CURRENT_DATE - INTERVAL '6 days',
                CURRENT_DATE,
                '1 day'::interval
                ) d(day)
                LEFT JOIN orders o ON date_trunc('day', o.created_at) = d.day AND o.status = 'Completada'
                LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY d.day
            ORDER BY d.day ASC
        `);

        // 4. Stock Crítico (Lo que falta por reponer)
        const lowStockRes = await pool.query(`
            SELECT p.name as product_name, v.variant_name, v.stock_actual as stock, p.sku
            FROM product_variants v
                     JOIN products p ON v.product_id = p.id
            WHERE v.stock_actual <= 5
            ORDER BY v.stock_actual ASC
                LIMIT 5
        `);

        // 5. Métodos de Pago (Para el gráfico circular "Traffic Source")
        const paymentMethodsRes = await pool.query(`
            SELECT payment_method as name, COUNT(*) as value
            FROM orders
            WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
            GROUP BY payment_method
        `);

        res.json({
            totalInventoryValue: parseFloat(inventoryRes.rows[0].total_value),
            monthlySales: parseFloat(monthlyStatsRes.rows[0].total_sales),
            monthlyProfit: parseFloat(monthlyStatsRes.rows[0].total_profit),
            lowStockItems: lowStockRes.rows,
            salesHistory: historyRes.rows.map((row: any) => ({
                day: row.day,
                sales: parseFloat(row.sales),
                profit: parseFloat(row.profit)
            })),
            paymentStats: paymentMethodsRes.rows
        });

    } catch (error: any) {
        console.error("Dashboard Error:", error.message);
        res.status(500).json({ message: "Error al cargar dashboard", error: error.message });
    }
};