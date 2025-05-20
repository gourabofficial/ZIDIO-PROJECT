import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useAuthdata } from '../../context/AuthContext';
import { removeFromWishlist } from '../../Api/user';
import AddToCartButton from '../../components/common/AddToCartButton';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Toast component with Framer Motion
const Toast = ({ notification, onClose }) => {
  if (!notification) return null;

  const { message, type } = notification;

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center ${
            type === "success"
              ? "bg-purple-900/90 text-purple-200 border border-purple-700"
              : "bg-red-900/90 text-red-200 border border-red-700"
          }`}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="mr-3"
          >
            {type === "success" ? (
              <FiCheckCircle className="text-green-400 text-xl" />
            ) : (
              <FiAlertCircle className="text-red-400 text-xl" />
            )}
          </motion.div>
          <p>{message}</p>
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-white transition-colors"
          >
            <FiX />
          </button>

          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
            className={`absolute bottom-0 left-0 h-1 ${
              type === "success" ? "bg-purple-500" : "bg-red-500"
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Wishlist = () => {
  const { user, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { currentUser, refetchUserData, isLoaded: authLoaded } = useAuthdata();
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [notification, setNotification] = useState(null);
  
  // Optimistic removal tracking
  const [pendingRemovals, setPendingRemovals] = useState({});

  // Clear notification after 3 seconds
  const clearNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(clearNotification, 2000); // Shorter duration for snappier feel
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (authLoaded && currentUser) {
      // Process wishlist items from the database
      const processedItems = (currentUser.wishlist || []).map(item => {
        return {
          id: item._id,
          productId: item._id,
          title: item.name || item.title || "Product",
          price: item.price || 0,
          // Handle different image formats - nested array or direct URL
          image: item.images && item.images.length > 0 
            ? item.images[0].imageUrl || item.images[0] 
            : item.image || 'https://ext.same-assets.com/1329671863/375037467.gif',
          inStock: item.inStock !== false,
          // For navigation - handle different property names
          handle: item.product_id || item.handle || item.slug || item._id,
        };
      });
      
      setWishlistItems(processedItems);
      setIsLoading(false);
    } else if (authLoaded) {
      setIsLoading(false);
    }
  }, [authLoaded, currentUser]);

  const handleRemoveFromWishlist = async (productId) => {
    // Already being removed
    if (pendingRemovals[productId]) return;
    
    // Optimistically update UI immediately
    setPendingRemovals(prev => ({ ...prev, [productId]: true }));
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    
    // Show success toast immediately for perceived speed
    const toastId = toast.loading("Removing...", { duration: 1000 });
    
    try {
      // Execute API call in background
      removeFromWishlist(productId)
        .then(response => {
          if (response.success) {
            toast.success("Item removed", { id: toastId, duration: 1500 });
            // Silently refresh data
            refetchUserData();
          } else {
            // Handle failure - revert UI
            toast.error(response.message || "Failed to remove item", { id: toastId });
            setPendingRemovals(prev => {
              const newState = { ...prev };
              delete newState[productId];
              return newState;
            });
            // Re-fetch data to restore correct state
            refetchUserData().then(() => {
              if (currentUser?.wishlist) {
                const revertedItem = currentUser.wishlist.find(item => (item._id || item) === productId);
                if (revertedItem) {
                  setWishlistItems(prev => [...prev, {
                    id: revertedItem._id,
                    productId: revertedItem._id,
                    title: revertedItem.name || revertedItem.title || "Product",
                    price: revertedItem.price || 0,
                    image: revertedItem.images?.[0]?.imageUrl || revertedItem.images?.[0] || revertedItem.image,
                    inStock: revertedItem.inStock !== false,
                    handle: revertedItem.product_id || revertedItem.handle || revertedItem.slug || revertedItem._id,
                  }]);
                }
              }
            });
          }
        })
        .catch(error => {
          console.error('Error removing from wishlist:', error);
          toast.error("Failed to remove item", { id: toastId });
        })
        .finally(() => {
          setPendingRemovals(prev => {
            const newState = { ...prev };
            delete newState[productId];
            return newState;
          });
        });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error("Failed to remove item", { id: toastId });
      setPendingRemovals(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }
  };

  if (!clerkLoaded || isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0c0e16] p-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">You're not signed in</h2>
          <p className="text-gray-400 mb-6">Please sign in to view your wishlist</p>
          <Link 
            to="/sign-in" 
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0e16] p-6 mt-20">
      {/* Toast Notification */}
      <Toast notification={notification} onClose={clearNotification} />
      
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          <div className="flex items-center text-purple-400">
            <FiHeart className="mr-2" />
            <span>{wishlistItems.length} items</span>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-[#1e293b] rounded-xl p-10 text-center">
            <div className="flex justify-center mb-4">
              <FiHeart className="text-purple-400 w-16 h-16 opacity-50" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">Items you save to your wishlist will appear here</p>
            <Link 
              to="/" 
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {wishlistItems.map(item => (
              <motion.div 
                key={item.id}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                layout
                className={`bg-[#1e293b] rounded-lg overflow-hidden shadow-lg flex flex-col h-full`}
              >
                <div className="relative h-40 overflow-hidden bg-black/30">
                  <Link to={`/product/${item.handle}`}>
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-contain transition-transform hover:scale-105 duration-300"
                      onError={(e) => {
                        e.target.src = "https://ext.same-assets.com/1329671863/375037467.gif";
                      }}
                    />
                  </Link>
                  {item.inStock === false && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1">
                      Out of Stock
                    </div>
                  )}
                </div>
                
                <div className="p-3 flex flex-col flex-grow">
                  <Link to={`/product/${item.handle}`} className="mb-1">
                    <h3 className="font-medium text-white text-sm hover:text-purple-400 line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-purple-400 font-medium mb-2 text-sm">
                    ₹{(item.price || 0).toFixed(2)}
                  </p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <AddToCartButton
                      product={{...item, id: item.productId}}
                      disabled={item.inStock === false || pendingRemovals[item.id]}
                    />
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={pendingRemovals[item.id]}
                      className={`flex items-center text-gray-400 hover:text-red-400 transition-colors ml-2 ${
                        pendingRemovals[item.id] ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label="Remove from wishlist"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {wishlistItems.length > 0 && (
          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;