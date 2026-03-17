import { Router } from 'express';
import { getDashboardStats } from '../controller/dashboardController';

const router = Router();

router.get('/stats', getDashboardStats);

export default router;