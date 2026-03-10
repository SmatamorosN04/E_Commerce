import { Router } from 'express';
import { createCategory, getCategories } from '../controller/categoryController';

const router = Router();

router.get('/', getCategories);

router.post('/', createCategory);

export default router;