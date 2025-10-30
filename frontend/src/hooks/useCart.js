// src/hooks/useCart.js

import { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export const useCart = () => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState("0.00");
  const [loading, setLoading] = useState(true);

  // Function to fetch the cart data from the backend
  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart([]);
      setTotal("0.00");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await API.get("/cart");
      setCart(res.data.cartItems);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart data.");
      setCart([]);
      setTotal("0.00");
    } finally {
      setLoading(false);
    }
  }, [token]); 
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateCartItem = async (productId, endpoint) => {
    if (!token) {
      toast.error("Please log in to modify your cart.");
      return;
    }
    try {
 
      
      const res = await API.put(`/cart/${endpoint}`, { productId });
      
      setCart(res.data.cart.items);
      setTotal(res.data.total);
      
      toast.success(res.data.message || 'Cart updated.');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
      // If error, refetch to restore original state
      fetchCart(); 
    }
  };

  const removeItem = async (productId) => {
    if (!token) return;
    try {
        const res = await API.delete("/cart", { data: { productId } })
        setCart(res.data.cart.items);
        setTotal(res.data.total);
        toast.success(res.data.message || 'Item removed.');
    } catch (err) {
        toast.error(err.response?.data?.message || 'Removal failed.');
    }
  }

  return { cart, total, loading, fetchCart, updateCartItem, removeItem };
};