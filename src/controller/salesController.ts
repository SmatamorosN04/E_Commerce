import { Request, Response } from 'express';
import pool from "../config/db";
import {insertLog} from "./logsController";

export const createSale = async (req: Request, res: Response) => {
    const { items } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const orderRes = await client.query(
            'INSERT INTO orders (total_amount) VALUES ($1) RETURNING id',
            [0]
        );
        const orderId = orderRes.rows[0].id;
        let totalOrder = 0;

        for (const item of items) {
            const { variant_id, quantity, price } = item;
            totalOrder += (Number(price) * Number(quantity));

            // 2. Verificar stock (stock_actual)
            const stockCheck = await client.query(
                'SELECT stock_actual FROM product_variants WHERE id = $1 FOR UPDATE',
                [variant_id]
            );

            if (!stockCheck.rows[0] || stockCheck.rows[0].stock_actual < quantity) {
                throw new Error(`Stock insuficiente para el producto`);
            }

            // 3. Actualizar stock_actual (nombre exacto de tu script)
            await client.query(
                'UPDATE product_variants SET stock_actual = stock_actual - $1 WHERE id = $2',
                [quantity, variant_id]
            );

            // 4. Obtener base_price para el costo histórico (obligatorio en tu tabla order_items)
            const priceRes = await client.query(
                'SELECT p.base_price FROM products p JOIN product_variants v ON p.id = v.product_id WHERE v.id = $1',
                [variant_id]
            );
            const costPrice = priceRes.rows[0].base_price;

            // 5. Insertar en order_items (usando los nombres de tu script: quantity, sold_price, cost_price_at_sale)
            await client.query(
                `INSERT INTO order_items (order_id, variant_id, quantity, sold_price, cost_price_at_sale) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [orderId, variant_id, quantity, price, costPrice]
            );

            // 6. Insertar en inventory_logs (usando cost_at_moment y quantity)
            await client.query(
                `INSERT INTO inventory_logs (variant_id, type, quantity, cost_at_moment, reason) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [variant_id, 'Venta', quantity, costPrice, `Venta Orden #${orderId}`]
            );
        }

        // 7. Actualizar el total final
        await client.query('UPDATE orders SET total_amount = $1 WHERE id = $2', [totalOrder, orderId]);

        await client.query('COMMIT');
        res.status(201).json({ message: 'Venta registrada con éxito', orderId, total: totalOrder });

        await insertLog(
            'NUEVA_VENTA',
            'VENTAS',
            `Se generó una venta por C$ ${req.body.total_amount}`
        );

        res.status(201).json ({ message: "Venta procesada"})
        
    } catch (error: any) {
        await client.query('ROLLBACK');
        await insertLog('ERROR_VENTA', 'VENTAS', `Fallo al procesar: ${error.message}`);
        console.error('Error en venta:', error.message);
        res.status(400).json({ error: error.message });
    } finally {
        client.release();
    }
};

