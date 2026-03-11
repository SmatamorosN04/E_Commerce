import { Router } from 'express';
import { createSale} from "../controller/salesController";

const router = Router();

router.post('/', createSale);

export default router