import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../hooks/useCart";
import API from "../api/axios";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const { token } = useAuth();
  const { cart, total, loading: cartLoading } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "COD",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      toast.error("Please log in to continue checkout.");
      navigate("/login");
    }
  }, [token, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit checkout
  const handleCheckout = async () => {
    if (!form.fullName || !form.phone || !form.addressLine1 || !form.city || !form.state || !form.postalCode) {
      return toast.error("Please fill all required fields.");
    }

    setLoading(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          qty: item.qty,
          imageUrl: item.imageUrl,
        })),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        payment: {
          method: form.paymentMethod,
        },
        priceSummary: {
          itemsTotal: total,
          shippingCharge: 0,
          discount: 0,
          totalAmount: total,
        },
      };

      const response = await API.post("/checkout", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Order placed successfully!");
      navigate("/orders"); // redirect to order history page
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.response?.data?.message || "Checkout failed!");
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-xl">Loading checkout...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-3">Your Cart is Empty</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4 text-center">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-2 bg-white p-6 shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Shipping Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="addressLine1"
              placeholder="Address Line 1"
              value={form.addressLine1}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500 col-span-2"
            />
            <input
              type="text"
              name="addressLine2"
              placeholder="Address Line 2"
              value={form.addressLine2}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500 col-span-2"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">Payment Method</h3>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="border p-2 rounded-lg focus:ring-2 focus:ring-purple-500 w-full"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Stripe">Stripe</option>
            </select>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>

          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between mb-3">
              <p>{item.name}</p>
              <p className="font-semibold">₹{item.price * item.qty}</p>
            </div>
          ))}

          <hr className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="text-purple-600">₹{total}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-lg text-white font-bold text-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } transition duration-200`}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
