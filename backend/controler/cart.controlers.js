import express from "express";
import Cart from '../modles/cart.modle.js';    
import Product from '../modles/product.modle.js'; 
import jwt from 'jsonwebtoken';

const calculateTotal = (cart) => {
    return cart.items.reduce((total, item) => 
        total + (item.price * item.qty), 0
    ).toFixed(2);
};

const findOrCreateCart = async (sessionId) => {
    if (!sessionId) {
        throw new Error("Cannot create cart: Authentication ID is missing."); 
    }
    
    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
        cart = new Cart({ sessionId: sessionId, items: [] }); 
        await cart.save();
    }
    return cart;
};

const addItemToCart = async (req, res) => {
const sessionId = req.userId || req.id;
    const { productId, qty = 1 } = req.body;

    try {
       const productData = await Product.findOne({ productId: productId });
        if (!productData) {
            return res.status(404).json({ message: "Product not found", success: false });
        }
        const { name, price, imageUrl } = productData;

        const cart = await findOrCreateCart(sessionId);
        const existingItem = cart.items.find((item) => item.productId === productId);

        if (existingItem) {
            existingItem.qty += qty;
            existingItem.price = price;
        } else {
            cart.items.push({ productId, name, price, qty ,imageUrl});
        }

        await cart.save();
        
        res.status(200).json({ 
            message: "Item added to cart", 
            cart: cart.toObject(), 
            success: true 
        });

    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({ message: "Error adding item", error: error.message, success: false });
    }
};

const getCart = async (req , res) => {
const sessionId = req.userId || req.id;
    try {
        const cart = await Cart.findOne({sessionId});
        
        if (!cart) {
            return res.status(200).json({ cartItems: [], total: "0.00", success: true });
        }
        
        const cartObject = cart.toObject();
        const total = calculateTotal(cartObject);

        res.status(200).json({ 
            cartItems: cartObject.items, 
            total: total,
            success: true 
        });

    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};


const removeItemFromCart = async (req, res) => {
    const sessionId = req.userId || req.id;
    const { productId } = req.body;
    
    try {
        const cart = await Cart.findOne({ sessionId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const initialLength = cart.items.length;
        cart.items = cart.items.filter((item) => item.productId !== productId);
        
        if (cart.items.length === initialLength) {
             return res.status(404).json({ message: "Item not found in cart" });
        }

        await cart.save();
        
        const total = calculateTotal(cart);
        res.status(200).json({ message: "Item removed", cart: cart.toObject(), total, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error removing item", error: error.message, success: false });
    }
};

const increaseItemQty = async (req, res) => {
    const sessionId = req.userId || req.id;
    const { productId } = req.body;
    
    try {
        const cart = await Cart.findOne({ sessionId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find((i) => i.productId === productId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.qty += 1;
        await cart.save();

        const total = calculateTotal(cart);
        res.status(200).json({ message: "Quantity increased", cart: cart.toObject(), total, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error increasing qty", error: error.message, success: false });
    }
};

const decreaseItemQty = async (req, res) => {
    const sessionId = req.userId || req.id;
    const { productId } = req.body;

    try {
        const cart = await Cart.findOne({ sessionId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const item = cart.items.find((i) => i.productId === productId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if (item.qty > 1) {
            item.qty -= 1;
        } else {
            cart.items = cart.items.filter((i) => i.productId !== productId);
        }

        await cart.save();
        
        const total = calculateTotal(cart);
        res.status(200).json({ message: "Quantity updated", cart: cart.toObject(), total, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error decreasing qty", error: error.message, success: false });
    }
};


export {
  addItemToCart,
  removeItemFromCart,
  increaseItemQty,
  decreaseItemQty,
  getCart
};