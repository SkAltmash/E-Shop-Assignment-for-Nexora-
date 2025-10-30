import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from '../context/AuthContext'

const API_BASE_URL = "http://localhost:8000/api";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth(); 
   const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
       const response = await API.get(`/products/${id}`);
        const productData = response.data.product;
        setProduct(productData);
        setMainImage(productData.imageUrl);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
   <div className="bg-white py-10 animate-pulse">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
        
     <div className="flex flex-col items-center">
          <div className="w-full h-[480px] bg-gray-200 rounded-2xl mb-4"></div>
          <div className="flex gap-3 flex-wrap justify-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-start">
          <div className="h-6 w-2/3 bg-gray-200 rounded mb-3"></div>
          <div className="h-6 w-1/3 bg-gray-300 rounded mb-6"></div>

          <div className="space-y-3 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 w-1/2 bg-gray-200 rounded"></div>
            ))}
          </div>

          <div className="mb-4">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
            <div className="h-10 w-20 bg-gray-300 rounded"></div>
          </div>

          <div className="flex gap-3 mb-6">
            <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
            <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
          </div>

          <div className="h-5 w-1/4 bg-gray-200 rounded mb-3"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 w-full bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 text-lg py-10">{error}</div>
    );

  if (!product)
    return (
      <div className="text-center text-gray-500 text-lg py-10">
        Product not found.
      </div>
    );

  const { name, price, stock, category, gender, moreImages, description } =
    product;

const handleAddToCart = async () => {
  console.log(token);
  if (!token) {
    toast.error("You need to be logged in to add items to the cart.");
    return;
  }

  
  const payload = { productId: product.productId, qty: quantity };
  console.log(payload);

const cartPromise = API.post("/cart", payload);
  toast.promise(cartPromise, {
    loading: "Adding item to cart...",
    success: (res) => res.data.message || `${name} added successfully!`,
    error: (err) => {
      if (err.response?.status === 401) {

        console.log(err);
        return "Your session has expired. Please log in.";
      }
      const msg =
        err.response?.data?.message ||
        "Failed to add item to cart. Please check console.";
      return msg;
    },
  });
};


  return (
    <div className="bg-white py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
        {/* ... Image gallery section ... */}
        <div className="flex flex-col items-center">
          <div className=" border rounded-2xl shadow-sm overflow-hidden bg-r=gray-50">
            <img
              src={mainImage}
              alt={name}
              className="w-full h-[480px] object-contain transition-all duration-300"
            />
          </div>
          <div className="flex gap-3 mt-4 flex-wrap justify-center">
            {moreImages?.length ? (
              moreImages.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${name} thumbnail ${index + 1}`}
                  onClick={() => setMainImage(imgUrl)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 ${
                    imgUrl === mainImage
                      ? "border-purple-600"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                />
              ))
            ) : (
              <p className="text-gray-400 text-sm">No additional images</p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-start">
          <h1 className="text-2xl font-semibold text-gray-800 mb-3">
            {name}
          </h1>

          <p className="text-xl font-bold text-green-600 mb-4">₹{price}</p>

          <div className="space-y-1 mb-6 text-gray-700">
            <p>
              <span className="font-semibold">Category:</span> {category}
            </p>
            <p>
              <span className="font-semibold">Gender:</span> {gender}
            </p>
            <p>
              <span className="font-semibold">Available Quantity:</span>{" "}
              <span
                className={
                  stock > 0
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {stock > 0 ? stock : "Out of Stock"}
              </span>
            </p>
          </div>
          
          {/* Quantity selector */}
          <div className="mb-4">
              <label htmlFor="qty" className="font-semibold text-gray-700 block mb-2">Quantity</label>
              <input
                  id="qty"
                  type="number"
                  min="1"
                  max={stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
                  className="border border-gray-300 p-2 rounded-lg w-20 text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={stock <= 0}
              />
          </div>


          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart} 
              disabled={stock <= 0}
              className={`flex-1 py-3 rounded-lg font-semibold text-white ${
                stock > 0
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="flex-1 py-3 rounded-lg font-semibold text-white bg-yellow-500 hover:bg-yellow-600"
            >
              Go to Cart 
            </button>
          </div>

        
        </div>
      </div>
    </div>
  );
}

export default Product;
