import { Router } from "express";
import { getInventorySummary, getDailySales } from "../controller/reportController";

const router = Router();

router.get('/summary', getInventorySummary);
router.get('/daily-profits', getDailySales);

export default router;