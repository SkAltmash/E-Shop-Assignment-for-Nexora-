import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";
const MAX_LENGTH = 20;

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/products/all`);
        setProducts(response.data.products || []);
        setFiltered(response.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (category !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, category, products]);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white shadow rounded-2xl overflow-hidden">
      <div className="w-full h-66 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <h2 className="text-3xl font-bold text-center mb-10">All Products</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="All">All</option>
          <option value="T-shirt">T-Shirts</option>
          <option value="Joggers">Joggers</option>
        </select>
      </div>

      {/* 🛒 Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No products found for your selection.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="cursor-pointer bg-white shadow hover:shadow-lg transition-all rounded-2xl overflow-hidden"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
              <div className="p-4 flex flex-col gap-2">
                <h5 className="font-medium text-lg">
                  {product.name.length > MAX_LENGTH
                    ? product.name.substring(0, MAX_LENGTH) + "..."
                    : product.name}
                </h5>
                <p className="text-green-600 font-semibold text-lg">
                  ₹{product.price}
                </p>
                <span className="text-sm text-gray-500">
                  {product.category || "Uncategorized"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
