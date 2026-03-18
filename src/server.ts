import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import categoryRoutes from "./routes/categoryRoutes";
import salesRoutes from "./routes/salesRoutes";
import reportRoutes from './routes/reportRoutes';
import InventoryRoutes from "./routes/inventoryRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import logsRoutes from "./routes/logsRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sales', salesRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/inventory', InventoryRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/logs', logsRoutes);


app.get('/health', (req, res) => {
    res.json({ status: 'server online', timestamp: new Date() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(` Servidor e-commerce listo en puerto ${PORT}`);
});