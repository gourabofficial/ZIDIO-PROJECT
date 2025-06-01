import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiShoppingBag, FiTrash2 } from 'react-icons/fi';

const CartDrawer = ({ isOpen, onClose }) => {
  

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'}`}
        onClick={onClose}
      ></div>
      
      {/* Cart drawer */}
      <div 
        className={`absolute top-0 right-0 w-full sm:w-96 h-full bg-[#0c0e16] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        
        {/* Cart items */}
        <div className="h-[calc(100%-10rem)] overflow-y-auto py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <FiShoppingBag className="text-4xl text-gray-500 mb-4" />
              <p className="text-gray-400 mb-4">Your cart is empty</p>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {cartItems.map(item => (
                <li key={item.variantId || item.id} className="flex px-4 py-4">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-white">{item.title}</h3>
                    {/* Add size display */}
                    {item.selectedVariant && item.selectedVariant.size && (
                      <p className="text-xs text-gray-400 mt-1">Size: {item.selectedVariant.size}</p>
                    )}
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm text-gray-400">
                        <span>{item.quantity} × </span>
                        <span className="text-purple-400">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                      <button 
                        onClick={() => {
                          console.log("Removing item:", item);
                          removeFromCart(item.variantId || item.id);
                        }}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Drawer footer */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-gray-800 bg-[#0c0e16]">
          <div className="flex justify-between mb-4">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-white font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              to="/cart" 
              onClick={onClose}
              className="px-4 py-2 border border-purple-600 text-purple-400 rounded-md text-center hover:bg-purple-600 hover:text-white transition-all"
            >
              View Cart
            </Link>
            <Link 
              to="/checkout" 
              onClick={onClose}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md text-center hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;