import { Router } from 'express';
import {createSale, getSalesReport} from "../controller/salesController";

const router = Router();

router.post('/create', createSale);

router.get('/report', getSalesReport)

export default router