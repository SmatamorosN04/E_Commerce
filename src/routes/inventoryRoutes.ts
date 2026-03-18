import { Router } from 'express';
import {
    registerStockMovement,
    getLowStockAlerts,
    getAllInventory,
    deleteProduct
} from "../controller/inventoryController";
import pool from '../config/db'
const router = Router();

router.post('/movement', registerStockMovement);
router.get('/variants', getAllInventory);

router.delete('/products/:id', deleteProduct);

router.get('/alerts', getLowStockAlerts)

export default router;