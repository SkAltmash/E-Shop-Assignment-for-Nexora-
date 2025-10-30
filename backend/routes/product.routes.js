import express from 'express';
import { addProduct, getAllProducts, getProductById,  } from '../controler/product.controlers.js';
const router = express.Router();

router.post('/add', addProduct);
router.get('/all', getAllProducts);
router.get('/:id', getProductById);

export default router;