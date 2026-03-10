import { Router } from 'express';
import { createProduct, getAllProducts } from '../controller/productController';

const router = Router();

router.get('/', getAllProducts);

router.post('/', createProduct);

export default router;