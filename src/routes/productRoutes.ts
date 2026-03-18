import { Router } from 'express';
import {createProduct, createProductBulk, getAllProducts} from '../controller/productController';

const router = Router();


router.post('/create', createProduct);
router.post('/bulk', createProductBulk)
router.get('/', getAllProducts)

export default router;