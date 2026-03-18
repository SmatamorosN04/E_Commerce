import { Request, Response } from 'express';
import pool from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
       const inventoryRes = await pool.query(`
            SELECT COALESCE(SUM(v.stock_actual * p.cost_price), 0) as total_value
            FROM product_variants v
                     JOIN products p ON v.product_id = p.id
            WHERE p.is_active = true
        `);

        // 2. Estadísticas Mensuales: Ganancia = (Precio Vendido - Precio de Costo)
        const monthlyStatsRes = await pool.query(`
            SELECT
                COALESCE(SUM(oi.sold_price * oi.quantity), 0) as total_sales,
                COALESCE(SUM((oi.sold_price - p.cost_price) * oi.quantity), 0) as total_profit
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN product_variants v ON oi.variant_id = v.id
            JOIN products p ON v.product_id = p.id
            WHERE date_trunc('month', o.created_at) = date_trunc('month', CURRENT_DATE)
              AND o.status = 'Completada'
        `);

        // 3. Historial de 7 días: Corregimos los JOINs para calcular la utilidad diaria
        const historyRes = await pool.query(`
            SELECT
                to_char(d.day, 'Dy') as day,
                COALESCE(SUM(oi.sold_price * oi.quantity), 0) as sales,
                COALESCE(SUM((oi.sold_price - p.cost_price) * oi.quantity), 0) as profit
            FROM generate_series(
                CURRENT_DATE - INTERVAL '6 days',
                CURRENT_DATE,
                '1 day'::interval
                ) d(day)
                LEFT JOIN orders o ON date_trunc('day', o.created_at) = d.day AND o.status = 'Completada'
                LEFT JOIN order_items oi ON o.id = oi.order_id
                LEFT JOIN product_variants v ON oi.variant_id = v.id
                LEFT JOIN products p ON v.product_id = p.id
            GROUP BY d.day
            ORDER BY d.day ASC
        `);

        const lowStockRes = await pool.query(`
            SELECT p.name as product_name, v.variant_name, v.stock_actual as stock, p.sku
            FROM product_variants v
                     JOIN products p ON v.product_id = p.id
            WHERE v.stock_actual <= 5
              AND p.is_active = true
            ORDER BY v.stock_actual ASC
                LIMIT 5
        `);

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