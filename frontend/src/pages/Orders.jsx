import React, { useState, useEffect } from 'react';
import API from "../api/axios";

import { FaSpinner, FaMapMarkerAlt, FaShoppingBag, FaCalendarAlt, FaCheckCircle, FaRupeeSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/api/checkout/';

const OrderItemDetail = ({ item }) => {
    const imageUrl = item.imageUrl || "https://placehold.co/60x60/f3f4f6/333333?text=N/A";

    return (
        <div className="flex items-center space-x-3 py-2 border-t border-gray-100 last:border-b-0">
            <img 
                src={imageUrl} 
                alt={item.name} 
                className="w-12 h-12 object-cover rounded-md"
                onError={(e) => e.target.src = "https://placehold.co/60x60/CCCCCC/333333?text=N/A"}
            />
            <div className=" min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
            </div>
            <p className="font-semibold text-sm text-purple-600 flex items-center">
                 <FaRupeeSign size={10} className="inline mr-0.5" />{(item.price * item.qty).toFixed(2)}
            </p>
        </div>
    );
};

const OrderCard = ({ order }) => {
    const { _id, createdAt, orderStatus, priceSummary, shippingAddress, items } = order;
    
    const date = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-700';
            case 'shipped':
                return 'bg-blue-100 text-blue-700';
            case 'processing':
                return 'bg-yellow-100 text-yellow-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 p-6 mb-8">
            {/* Header Row */}
            <div className="flex justify-between items-start border-b pb-4 mb-4 flex-wrap gap-4">
                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <FaShoppingBag className="text-purple-500 mr-2" />
                        Order ID: <span className="font-mono text-sm text-gray-500 ml-2">...{_id.slice(-6)}</span>
                    </h3>
                    <div className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusStyle(orderStatus)}`}>
                        {orderStatus}
                    </div>
                </div>
                
                <div className="text-right">
                    <p className="text-2xl font-extrabold text-purple-700 flex items-center justify-end">
                       <FaRupeeSign size={16} className="mr-1" />{priceSummary.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center justify-end mt-1">
                        <FaCalendarAlt className="mr-1" /> Placed on: {date}
                    </p>
                </div>
            </div>

            {/* Items List */}
            <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Items Ordered ({items.length})</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
                    {items.map((item) => (
                        <OrderItemDetail key={item._id} item={item} />
                    ))}
                </div>
            </div>

            {/* Address Summary */}
            <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-purple-500" />
                    Shipping To
                </h4>
                <p className="text-sm text-gray-600">{shippingAddress.fullName} ({shippingAddress.phone})</p>
                <p className="text-sm text-gray-500">{shippingAddress.addressLine1}, {shippingAddress.addressLine2}</p>
                <p className="text-sm text-gray-500">{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}</p>
            </div>
        </div>
    );
};


const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await API.get(API_BASE_URL);

                
                if (response.data.success) {
                    setOrders(response.data.orders);
                } else {
                    setError("Failed to fetch orders. Please try again.");
                }

            } catch (err) {
                console.error("Error fetching orders:", err);
                if (err.response && err.response.status === 401) {
                     console.log(err)
                     setError("Session expired or unauthorized. Please log in.");
                } else {
                    setError("Network error or server unreachable. Is the backend running?");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <FaSpinner className="animate-spin text-purple-600 text-4xl" />
                <p className="ml-4 text-gray-600 text-lg">Loading your order history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6 mt-10 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-bold mb-2">Error Loading Orders</p>
                <p>{error}</p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-10 border-b-4 border-purple-500 pb-3">
                Your Order History
            </h2>
            
            {orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">No Orders Found</h2>
                    <p className="text-gray-600 mb-6">It looks like you haven't placed any orders yet. Start shopping!</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200 shadow-md"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <OrderCard key={order._id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
