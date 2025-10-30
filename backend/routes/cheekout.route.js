import express from 'express';
import { createCheckout,getAllOrders } from '../controler/cheekout.controlers.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
const router = express.Router();

router.post('/', isAuthenticated, createCheckout);
router.get('/', isAuthenticated, getAllOrders);

export default router;