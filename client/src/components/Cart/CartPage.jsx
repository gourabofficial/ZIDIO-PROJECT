import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiX, FiTag } from 'react-icons/fi';

const CartPage = () => {
  const { cartItems, loading, error, updateQuantity, removeFromCart, clearCart, subtotal, itemsCount } = useCart();
  const { currentUser } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity > 0) {
      await updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleApplyPromo = () => {
    if (!promoCode) {
      setPromoError('Please enter a promo code');
      return;
    }

    // Mock promo code validation - will be replaced with backend validation
    if (promoCode.toUpperCase() === 'COSMIC20') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(false);
    }
  };

  const handleContinueToCheckout = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/cart' } });
    } else {
      navigate('/checkout');
    }
  };

  // Shipping is free over 2000
  const shipping = subtotal > 2000 ? 0 : 499;
  
  // Discount is 20% if promo code is applied
  const discount = promoApplied ? subtotal * 0.2 : 0;
  
  // Calculate total
  const total = subtotal + shipping - discount;

  return (
    <div className="min-h-screen bg-[#0c0e16] relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 starry-bg opacity-20 pointer-events-none"></div>
      
      {/* Nebula effects */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-900/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-indigo-900/10 blur-3xl rounded-full"></div>
      
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors">
            <FiArrowLeft className="mr-2" />
            <span>Continue Shopping</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-white ml-auto">Your Cart</h1>
          
          <div className="ml-auto flex items-center">
            <FiShoppingCart className="text-purple-400 mr-2" />
            <span className="text-white font-semibold">{itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}</span>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-900/20 text-red-400 p-4 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-[#1e293b] flex items-center justify-center mx-auto mb-6">
              <FiShoppingCart className="text-4xl text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              to="/"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items - 2/3 width on large screens */}
            <div className="lg:col-span-2">
              <div className="bg-[#151828] rounded-lg shadow-lg overflow-hidden">
                <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Cart Items</h2>
                  <button 
                    onClick={handleClearCart}
                    className="text-gray-400 hover:text-red-400 flex items-center text-sm transition-colors"
                  >
                    <FiTrash2 className="mr-1" />
                    Clear Cart
                  </button>
                </div>
                
                <ul className="divide-y divide-gray-800">
                  {cartItems.map(item => (
                    <li key={item.id} className="px-6 py-6 flex flex-col sm:flex-row">
                      {/* Product image */}
                      <div className="sm:flex-shrink-0 mb-4 sm:mb-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full sm:w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Product details */}
                      <div className="sm:ml-6 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-white">{item.title}</h3>
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <FiX />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Item #{item.id}</p>
                        
                        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-gray-700 rounded-md">
                            <button 
                              onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="px-3 py-1 text-white">{item.quantity}</span>
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          
                          {/* Price */}
                          <div className="mt-4 sm:mt-0">
                            <span className="text-lg font-semibold text-purple-400">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Order summary - 1/3 width on large screens */}
            <div className="lg:col-span-1">
              <div className="bg-[#151828] rounded-lg shadow-lg sticky top-6">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h2 className="text-xl font-semibold text-white">Order Summary</h2>
                </div>
                
                <div className="px-6 py-4 space-y-4">
                  {/* Promo code */}
                  <div>
                    <div className="flex items-center mb-2">
                      <FiTag className="text-purple-400 mr-2" />
                      <h3 className="text-white font-medium">Promo Code</h3>
                    </div>
                    <div className="flex">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-grow px-3 py-2 bg-[#1e293b] border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-r-md transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="mt-1 text-sm text-red-400">{promoError}</p>
                    )}
                    {promoApplied && (
                      <p className="mt-1 text-sm text-green-400">Promo code applied successfully!</p>
                    )}
                  </div>
                  
                  {/* Price calculations */}
                  <div className="space-y-2 pt-4 border-t border-gray-800">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">
                        {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-green-400">
                        <span>Discount (20%)</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-4 border-t border-gray-800">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-xl font-bold text-purple-400">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <button
                    onClick={handleContinueToCheckout}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-md transition-all"
                  >
                    {currentUser ? 'Continue to Checkout' : 'Sign in to Checkout'}
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Free shipping on orders over ₹2,000
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;