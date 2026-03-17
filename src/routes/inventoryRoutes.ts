import { Router } from 'express';
import { registerStockMovement, getLowStockAlerts, getAllInventory} from "../controller/inventoryController";

const router = Router();

router.post('/movement', registerStockMovement);
router.get('/variants', getAllInventory);

router.get('/alerts', getLowStockAlerts)

export default router;