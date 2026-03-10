import pool from '../config/db'

const initDatabase = async () => {
    const client = await  pool.connect();

    try {
        console.log('Starting the creation of database')
        await client.query('BEGIN');

        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 3. Tabla Productos
        await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        sku VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        base_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 4. Tabla Variantes (Con Stock Actual para velocidad de lectura)
        await client.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        variant_name VARCHAR(100) NOT NULL,
        additional_price DECIMAL(12, 2) DEFAULT 0.00,
        stock_actual INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 5. Tabla Inventory Logs (Tu historial contable)
        await client.query(`
      CREATE TABLE IF NOT EXISTS inventory_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
        type VARCHAR(20) CHECK (type IN ('Entrada', 'Salida', 'Ajuste', 'Venta')),
        quantity INTEGER NOT NULL,
        cost_at_moment DECIMAL(12, 2) NOT NULL,
        reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 6. Tabla Orders (Cabecera)
        await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        total_amount DECIMAL(12, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'Completada',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 7. Tabla Order Items (Detalle con Costo Histórico para Ganancias)
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

        await client.query('COMMIT');
        console.log("✅ Base de datos normalizada con éxito.");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Error normalizando la base de datos:", err);
    } finally {
        client.release();
        process.exit();
    }
};

initDatabase();