import { Request, Response } from 'express';
import pool from '../config/db';

export const createProduct = async (req: Request, res: Response) => {
    const {
        sku,
        name,
        description,
        base_price,
        category_id,
        variant_name,
        initial_stock,
        initial_cost
    } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const productQuery = `
            INSERT INTO products (sku, name, description, base_price, category_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const productRes = await client.query(productQuery, [sku, name, description, base_price, category_id]);
        const productId = productRes.rows[0].id;

        const variantQuery = `
            INSERT INTO product_variants (product_id, variant_name, stock_actual)
            VALUES ($1, $2, $3)
            RETURNING id;
        `;
        const variantRes = await client.query(variantQuery, [productId, variant_name, initial_stock]);
        const variantId = variantRes.rows[0].id;


        const logQuery = `
            INSERT INTO inventory_logs (variant_id, type, quantity, cost_at_moment, reason)
            VALUES ($1, 'Entrada', $2, $3, $4);
        `;
        await client.query(logQuery, [variantId, initial_stock, initial_cost, 'Carga inicial de inventario']);

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Producto, variante e inventario inicial creados correctamente',
            data: { productId, variantId, sku, name }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error en createProduct:', error);
        res.status(500).json({ error: 'Error interno al procesar el registro' });
    } finally {
        client.release();
    }
};

export const getAllProducts = async (_req: Request, res: Response) => {
    try {
        const sql = `
            SELECT 
                p.id, p.sku, p.name, p.base_price, c.name as category,
                json_agg(json_build_object(
                    'variant_id', pv.id,
                    'name', pv.variant_name,
                    'stock', pv.stock_actual
                )) as variants
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_variants pv ON p.id = pv.product_id
            GROUP BY p.id, c.name;
        `;
        const result = await pool.query(sql);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};