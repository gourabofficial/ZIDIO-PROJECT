import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiX, FiTag, FiChevronsRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthdata } from '../../context/AuthContext';

const Cart = () => {
  const { cartItems, loading, error, updateQuantity, removeFromCart, clearCart, subtotal, itemsCount } = useCart();
  const { currentUser } = useAuthdata();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // Show notification function
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity > 0) {
      await updateQuantity(productId, newQuantity);
      showNotification(`Quantity updated successfully`, 'success');
    }
  };

  const handleRemoveItem = async (productId) => {
    await removeFromCart(productId);
    showNotification('Item removed from cart', 'info');
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
      showNotification('Cart cleared successfully', 'info');
    }
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
      showNotification('Promo code applied successfully!', 'success');
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

  // Recommended products (you can replace with actual recommendations)
  const recommendedProducts = [
    {
      id: 'rec1',
      title: 'Cosmic Hoodie',
      price: 2499,
      image: 'https://example.com/cosmic-hoodie.jpg'
    },
    {
      id: 'rec2',
      title: 'Nebula T-Shirt',
      price: 1299,
      image: 'https://example.com/nebula-tshirt.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0c0e16] relative overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 starry-bg opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-900/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-indigo-900/10 blur-3xl rounded-full"></div>

      {/* Notification system */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-900/90 text-green-200' :
                notification.type === 'error' ? 'bg-red-900/90 text-red-200' :
                  'bg-blue-900/90 text-blue-200'
              }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center mb-8">
          <Link to="/" className="flex items-center text-purple-400 hover:text-purple-300 transition-colors group">
            <FiArrowLeft className="mr-2 group-hover:translate-x-[-3px] transition-transform" />
            <span>Continue Shopping</span>
          </Link>

          <h1 className="text-3xl font-bold text-white ml-auto">Your Cart</h1>

          <div className="ml-auto flex items-center">
            <FiShoppingCart className="text-purple-400 mr-2" />
            <span className="text-white font-semibold">
              {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 bg-red-900/20 text-red-400 p-4 rounded-lg text-center"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-[#1e293b] flex items-center justify-center mx-auto mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              >
                <FiShoppingCart className="text-4xl text-purple-400" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Your cosmic cart is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Your journey through our universe of products awaits. Start adding items to your cart to begin.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all hover:shadow-lg hover:shadow-purple-500/20"
            >
              Explore Products
            </Link>

            {/* Recently viewed or recommended products */}
            <div className="mt-16">
              <h3 className="text-xl text-white font-medium mb-6">You might be interested in</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {recommendedProducts.map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="bg-[#151828] rounded-lg overflow-hidden hover:translate-y-[-5px] hover:shadow-lg hover:shadow-purple-500/10 transition-all"
                  >
                    <div className="h-40 bg-gray-800">
                      <img
                        src={product.image || 'https://via.placeholder.com/150'}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-white font-medium">{product.title}</h4>
                      <p className="text-purple-400 mt-1">₹{product.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items - 2/3 width on large screens */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#151828] rounded-lg shadow-lg overflow-hidden"
              >
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

                <AnimatePresence>
                  <ul className="divide-y divide-gray-800">
                    {cartItems.map(item => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 py-6 flex flex-col sm:flex-row"
                      >
                        {/* Product image */}
                        <div className="sm:flex-shrink-0 mb-4 sm:mb-0 relative group">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full sm:w-28 h-28 object-cover rounded-lg group-hover:scale-105 transition-transform"
                          />
                          <Link
                            to={`/product/${item.id}`}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                          >
                            <span className="text-white text-sm font-medium">View Product</span>
                          </Link>
                        </div>

                        {/* Product details */}
                        <div className="sm:ml-6 flex-1">
                          <div className="flex justify-between">
                            <Link to={`/product/${item.id}`} className="hover:text-purple-400 transition-colors">
                              <h3 className="text-lg font-medium text-white">{item.title}</h3>
                            </Link>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors hover:rotate-90 transition-transform"
                            >
                              <FiX />
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Item #{item.id}</p>

                          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            {/* Quantity selector */}
                            <div className="flex items-center border border-gray-700 rounded-md bg-gray-800/50">
                              <button
                                onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus size={14} />
                              </button>
                              <span className="px-3 py-1.5 text-white font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors"
                              >
                                <FiPlus size={14} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="mt-4 sm:mt-0">
                              <span className="text-sm text-gray-400 line-through mr-2">
                                ₹{((item.price * 1.2) * item.quantity).toLocaleString()}
                              </span>
                              <span className="text-lg font-semibold text-purple-400">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </AnimatePresence>

                {/* Related products section */}
                <div className="border-t border-gray-800 px-6 py-4">
                  <h3 className="text-lg font-medium text-white mb-4">You might also like</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recommendedProducts.map(product => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="bg-[#1e293b] rounded-lg overflow-hidden hover:bg-[#2a3952] transition-colors"
                      >
                        <div className="h-24 bg-gray-800">
                          <img
                            src={product.image || 'https://via.placeholder.com/150'}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <h4 className="text-white text-xs font-medium truncate">{product.title}</h4>
                          <p className="text-purple-400 text-xs mt-1">₹{product.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Order summary - 1/3 width on large screens */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#151828] rounded-lg shadow-lg sticky top-24"
              >
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
                  <div className="space-y-3 pt-4 border-t border-gray-800">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">
                        {shipping === 0 ? (
                          <span className="text-green-400">Free</span>
                        ) : (
                          `₹${shipping.toLocaleString()}`
                        )}
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
                    className="w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-md transition-all hover:shadow-lg hover:shadow-purple-500/20 group"
                  >
                    {currentUser ? 'Continue to Checkout' : 'Sign in to Checkout'}
                    <FiChevronsRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    {shipping === 0 ? (
                      <span className="text-green-400">✓ Free shipping applied</span>
                    ) : (
                      <span>Free shipping on orders over ₹2,000</span>
                    )}
                  </p>
                </div>

                {/* Payment icons */}
                <div className="px-6 py-4 border-t border-gray-800">
                  <p className="text-center text-xs text-gray-500 mb-2">We accept</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-10 h-6 bg-gray-700 rounded"></div>
                    <div className="w-10 h-6 bg-gray-700 rounded"></div>
                    <div className="w-10 h-6 bg-gray-700 rounded"></div>
                    <div className="w-10 h-6 bg-gray-700 rounded"></div>
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-2">Secured by Razorpay</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;