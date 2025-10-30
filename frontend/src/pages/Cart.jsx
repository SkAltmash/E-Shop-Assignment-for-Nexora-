import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CartPage() {
  const { token, loading: authLoading } = useAuth();
  const { cart, total, loading: cartLoading, updateCartItem, removeItem } = useCart();
  const navigate = useNavigate();

  const isLoading = authLoading || cartLoading;

  // 🩶 Skeleton UI Components
  const SkeletonCartItem = () => (
    <div className="animate-pulse flex items-center gap-4 p-4 border-b border-gray-200">
      <div className="w-24 h-24 bg-gray-200 rounded-lg" />
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="flex gap-2">
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="w-20 h-6 bg-gray-200 rounded" />
    </div>
  );

  const SkeletonSummary = () => (
    <div className="animate-pulse bg-white p-6 shadow-lg rounded-xl space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-12 bg-gray-200 rounded mt-4" />
    </div>
  );

  if (isLoading) {
    // 🩶 Skeleton loading state
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-6" />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4 bg-white shadow-lg rounded-xl overflow-hidden divide-y divide-gray-200">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCartItem key={i} />
            ))}
          </div>
          <div className="lg:w-1/4">
            <SkeletonSummary />
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">You Must Log In</h2>
        <p className="text-gray-600 mb-6">
          Please log in to view and manage your shopping cart.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty 🙁</h2>
        <p className="text-gray-600 mb-6">Start shopping to add items to your cart!</p>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4">
        Your Shopping Cart ({cart.length} {cart.length === 1 ? "Item" : "Items"})
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 🛒 Cart Items */}
        <div className="lg:w-3/4 bg-white shadow-lg rounded-xl overflow-hidden divide-y divide-gray-200">
          {cart.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              updateQty={updateCartItem}
              removeItem={removeItem}
            />
          ))}
        </div>

        {/* 💳 Summary */}
        <div className="lg:w-1/4">
          <div className="bg-white p-6 shadow-lg rounded-xl sticky top-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>

            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{total}</span>
            </div>

            <div className="flex justify-between text-gray-700 border-t pt-4 mt-4">
              <span className="text-xl font-extrabold">Total:</span>
              <span className="text-xl font-extrabold text-purple-700">₹{total}</span>
            </div>

            <button
              onClick={() => navigate('/cheekout')}
              className="mt-6 w-full bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition duration-200"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
