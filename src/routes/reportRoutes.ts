import { Router } from "express";
import {getInventorySummary, getDailySales, getSalesReport, getTopProducts} from "../controller/reportController";

const router = Router();

router.get('/summary', getInventorySummary);
router.get('/daily-profits', getDailySales);
router.get('/sales', getSalesReport);
router.get('/top_products', getTopProducts);

export default router;