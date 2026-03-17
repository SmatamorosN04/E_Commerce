import pool from '../config/db'

const updateSalesTables = async () => {
    const client = await pool.connect();

    try {
        console.log(' Iniciando actualización de tablas de ventas...');
        await client.query('BEGIN');

         await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                order_number SERIAL,
                customer_name VARCHAR(255) DEFAULT 'Consumidor Final',
                total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
                payment_method VARCHAR(50) DEFAULT 'Efectivo',
                status VARCHAR(20) DEFAULT 'Completada',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
                variant_id UUID REFERENCES product_variants(id),
                quantity INTEGER NOT NULL,
                sold_price DECIMAL(12, 2) NOT NULL,
                cost_price_at_sale DECIMAL(12, 2) NOT NULL,
                profit_margin DECIMAL(12, 2) GENERATED ALWAYS AS (sold_price - cost_price_at_sale) STORED
            );
        `);

      await client.query(`
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'Efectivo';
            ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255) DEFAULT 'Consumidor Final';
        `);

        await client.query('COMMIT');
        console.log("✅ Tablas de ventas actualizadas y listas para el Dashboard.");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Error al actualizar las tablas:", err);
    } finally {
        client.release();
        process.exit();
    }
};

updateSalesTables();