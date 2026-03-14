
import pool from '../config/db';

export const registerStockMovement = async (req: any, res: any) => {
    const { variant_id, product_id, quantity, type, reason, unit_cost, is_price_update } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        if (is_price_update) {
            // 1. Actualización directa del precio
            const updatePriceQuery = `
                UPDATE products
                SET base_price = $1
                WHERE id = $2::uuid
        RETURNING id;
            `;

            const updateResult = await client.query(updatePriceQuery, [unit_cost, product_id]);

            // 2. Si rowCount es 0, la relación variant_id -> product_id no existe
            if (updateResult.rowCount === 0) {
                console.log("No se encontro producto para variante:", variant_id);
                throw new Error("No se encontro el producto asociado a esta variante");
            }

            console.log("Precio actualizado correctamente:", updateResult.rows[0]);

            // 3. Log de ajuste
            const logPriceQuery = `
                INSERT INTO inventory_logs (variant_id, type, quantity, cost_at_moment, reason)
                VALUES ($1, 'Ajuste', 0, $2, $3)
            `;
            await client.query(logPriceQuery, [variant_id, unit_cost, `Cambio precio: ${reason}`]);

        } else {
            // Lógica de stock (Entrada/Venta)
            const logQuery = `
                INSERT INTO inventory_logs (variant_id, type, quantity, cost_at_moment, reason)
                VALUES ($1, $2, $3, $4, $5)
            `;
            await client.query(logQuery, [variant_id, type, quantity, unit_cost || 0, reason]);

            const adjustment = (type === 'Entrada') ? quantity : -quantity;
            const updateStockQuery = `
                UPDATE product_variants
                SET stock_actual = stock_actual + $1
                WHERE id = $2
            `;
            await client.query(updateStockQuery, [adjustment, variant_id]);
        }

        await client.query('COMMIT');
        res.status(200).json({ message: "Exito" });

    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error("ERROR BACKEND:", error.message);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

export const getLowStockAlerts = async (req: any, res: { json: (arg0: any[]) => void; }) => {
    const  result = await pool.query(
        `SELECT
             p.name as product_name,
             pv.id as variant_id,
             pv.sku,
             pv.stock,
             pv.min_threshold,
             (pv.min_threshold - pv.stock) as deficit
         FROM product_variants pv
                  JOIN products p ON pv.product_id = p.id
         WHERE pv.stock <= pv.min_threshold
         ORDER BY (pv.min_threshold - pv.stock) DESC;`
    );
    res.json(result.rows)
}

export const getAllInventory = async (req: any, res: any) => {
    try {
        const queryText = `
            SELECT
                pv.id AS variant_id,
                p.id as product_id,
                p.name AS product_name,
                p.sku,
                pv.variant_name,
                pv.stock_actual AS stock,
                p.base_price AS base_price,
                (p.base_price + COALESCE(pv.additional_price, 0)) AS unit_cost,
                COALESCE(c.name, 'Sin Categoría') AS category_name
            FROM product_variants pv
                     JOIN products p ON pv.product_id = p.id
                     LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.name ASC;
        `;

        const result = await pool.query(queryText);
        res.status(200).json(result.rows);
    } catch (error: any) {
        console.error("Error al obtener el inventario completo:", error);
        res.status(500).json({
            error: "Error en la consulta SQL",
            detail: error.message
        });
    }
};