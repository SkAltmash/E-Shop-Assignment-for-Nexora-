// src/components/CartItem.jsx

import React from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartItem = ({ item, updateQty, removeItem, isActionDisabled }) => {
  const { productId, name, price, qty, imageUrl } = item;
  
  const displayImageUrl = imageUrl;
  
  

  return (
    <div className="flex items-center justify-between border-b py-4 px-2 hover:bg-gray-50 transition-colors">
      
      {/* Product Info */}
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <img 
          src={displayImageUrl} 
          alt={name} 
          className="w-16 h-16 object-cover rounded-md" 
          onError={(e) => e.target.src = "https://placehold.co/64x64/CCCCCC/333333?text=N/A"}
        />
        <div className="truncate">
          <p className="font-semibold text-gray-800 truncate">{name}</p>
          <p className="text-sm text-gray-500">ID: {productId}</p>
          <p className="text-sm font-medium text-purple-600">₹{price.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Quantity Control */}
      <div className="flex items-center space-x-3 mx-4">
        <button 
          onClick={() => updateQty(productId, 'decrease')} 
          disabled={qty === 1 || isActionDisabled}
          className="p-2 border rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          <FaMinus size={12} />
        </button>
        <span className="w-8 text-center font-bold text-lg">{qty}</span>
        <button 
          onClick={() => updateQty(productId, 'increase')} 
          disabled={isActionDisabled} 
          className="p-2 border rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          aria-label="Increase quantity"
        >
          <FaPlus size={12} />
        </button>
      </div>

      <div className="flex items-center space-x-4 w-32 justify-end">
        <p className="font-bold text-lg text-gray-800 w-20 text-right">₹{(price * qty).toFixed(2)}</p>
        <button 
          onClick={() => removeItem(productId)} 
          // 🔑 Disable if any cart action is currently running
          disabled={isActionDisabled} 
          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50"
          aria-label="Remove item"
        >
          <FaTrash size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;