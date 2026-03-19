import { Router } from 'express';
import {createProduct, createProductBulk, getAllProducts, getProductById} from '../controller/productController';

const router = Router();


router.post('/create', createProduct);
router.post('/bulk', createProductBulk)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;