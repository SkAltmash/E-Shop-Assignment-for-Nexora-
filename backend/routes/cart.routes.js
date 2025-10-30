// src/routes/cartRoutes.js
import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js'; 
import { addItemToCart, removeItemFromCart, increaseItemQty, decreaseItemQty, getCart } from '../controler/cart.controlers.js';

const router = express.Router();

router.use(isAuthenticated); 

// Cart Endpoints
router.post('/', addItemToCart);
router.get('/', getCart);
router.delete('/', removeItemFromCart); 
router.put('/increase', increaseItemQty);
router.put('/decrease', decreaseItemQty);

export default router;