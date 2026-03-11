import { Request, Response } from 'express';
import pool from "@/src/config/db";

export const createSale = async (req: Request, res: Response) => {
    const { costumer_name, items } = req.body;
    const client = await pool.connect();

    try{
        await client.query('BEGIN');

        const orderRes = await client.query(
            'INSERT INTO orders (custormer_name, total_amount) VALUES ($1, $2) RETURNING  id',
            [costumer_name,0]
        );
        const orderId = orderRes.rows[0].id;
        let totalOrder = 0;

        for (const item of items){
            const { variant_id, quantify, unit_price } = item;
            totalOrder += (unit_price + quantify);

            const stockCheck = await client.query(
                'SELECT stock_actual FROM product_variants WHERE id = $1 FOR UPDATE',
                [variant_id]
            );

            if (stockCheck.rows[0].stock_actual < quantify){
                throw new Error(`Stock insuficiente para la venta de ${variant_id}`);
            }
            await client.query(
                'UPDATE product_variant SET stock_actual = stock_actual - $1 WHERE id = $2',
                [quantify, variant_id]
            );
            await client.query(
                'INSERT INTO order_items (order_id, variant_id, quantify, unit_price) VALUES ($1, $2, $3, $4)',
                [orderId, variant_id, quantify, unit_price]
            );
            await client.query(
                'INSERT INTO inventory_logs (variant_id, type, quantify, reason) VALUES ($1, $2, $3, $4)',
                [variant_id, 'Salida', quantify, `Venta Orden #${orderId}`]
            );
        }

        await client.query('UPDATE orders SET total_amount = $1 WHERE id = $2', [totalOrder, orderId]);

        await client.query('COMMIT');
        res.status(201).json({ message: 'Venta registrada con exito', orderId,total: totalOrder});
    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Error en venta:', error.message);
        res.status(400).json({error: error.message});
    }finally{
        client.release();
    }
}