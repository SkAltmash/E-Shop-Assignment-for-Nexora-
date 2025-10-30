import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";
const MAX_LENGTH = 20;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/products/all`);
        setProducts(response.data.products);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products. Is the backend server running?");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white shadow rounded-2xl overflow-hidden">
      <div className="w-full h-96 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  const tshirts = products.filter((p) => p.category?.toLowerCase() === "t-shirt");
  const joggers = products.filter((p) => p.category?.toLowerCase() === "joggers");

  const renderCategory = (title, items) => (
    <section className="my-10">
      <h3 className="text-2xl font-semibold mb-5 text-center border-b pb-2">
        {title}
      </h3>
      {loading ? (
        // Show skeletons while loading
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">No {title.toLowerCase()} available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
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
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10">
        Featured Products
      </h2>

      {renderCategory("T-Shirts", tshirts)}
      {renderCategory("Joggers", joggers)}
    </div>
  );
};

export default Home;
