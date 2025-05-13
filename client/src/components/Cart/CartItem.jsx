import React from 'react';
import { FiMinus, FiPlus, FiTrash } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const itemId = item.variantId || item.handle || item.id;
  
  // Get the primary image or a placeholder
  const productImage = item.images && item.images.length > 0 
    ? item.images[0] 
    : '/assets/placeholder-product.jpg';
  
  const handleIncrease = () => {
    updateQuantity(itemId, item.quantity + 1);
  };
  
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    } else {
      removeFromCart(itemId);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(itemId);
  };

  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-700">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-900 rounded overflow-hidden">
        <img 
          src={productImage} 
          alt={item.name} 
          className="w-full h-full object-cover"
          onError={(e) => {e.target.src = '/assets/placeholder-product.jpg'}}
        />
      </div>
      
      {/* Product Info */}
      <div className="flex-grow">
        <h3 className="text-white font-medium">{item.name}</h3>
        
        {/* Show size if available */}
        {item.selectedVariant?.size && (
          <p className="text-gray-400 text-sm mt-1">
            Size: {item.selectedVariant.size}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-2">
          <p className="text-white font-medium">${item.price}</p>
          
          {/* Quantity Controls */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDecrease}
              className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full"
            >
              <FiMinus size={14} className="text-white" />
            </button>
            
            <span className="text-white">{item.quantity}</span>
            
            <button 
              onClick={handleIncrease}
              className="w-7 h-7 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-full"
            >
              <FiPlus size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Remove Button */}
      <button 
        onClick={handleRemove}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <FiTrash size={18} />
      </button>
    </div>
  );
};

export default CartItem;