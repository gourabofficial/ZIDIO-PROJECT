import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiX, FiCheckCircle, FiAlertCircle, FiShoppingBag } from 'react-icons/fi';
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
          className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center backdrop-blur-md ${
            type === "success"
              ? "bg-purple-900/80 text-purple-200 border border-purple-600/50"
              : "bg-red-900/80 text-red-200 border border-red-600/50"
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
              type === "success" 
                ? "bg-gradient-to-r from-indigo-500 to-purple-500" 
                : "bg-gradient-to-r from-red-500 to-pink-500"
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
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-opacity-20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-r-indigo-500 border-t-purple-500 rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-300 text-lg font-medium">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 pb-16 px-4 flex flex-col items-center justify-center">
        <div className="backdrop-blur-md bg-black/30 border border-purple-900/30 rounded-xl p-10 max-w-md mx-auto text-center animate-fadeIn">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-md"></div>
            <div className="relative w-full h-full">
              <FiHeart className="w-full h-full text-purple-400" />
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-3">
            Sign In to View Your Wishlist
          </h3>
          <p className="text-gray-300 mb-6">
            Track your favorite cosmic heroes and get notified about special offers
          </p>
          <Link 
            to="/sign-in" 
            className="relative group overflow-hidden px-6 py-2.5 rounded-lg inline-block"
          >
            <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600"></span>
            <span className="relative flex items-center justify-center text-white font-medium">
              Sign In
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 pb-16 px-4 md:px-8">
      {/* Toast Notification */}
      <Toast notification={notification} onClose={clearNotification} />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-fadeIn opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4 md:mb-0">
            Cosmic Wishlist
          </h1>
          <div className="flex items-center py-1.5 px-4 rounded-full bg-indigo-900/30 border border-indigo-500/30">
            <FiHeart className="mr-2 text-purple-400" />
            <span className="text-white font-medium">{wishlistItems.length} Heroes</span>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="backdrop-blur-md bg-black/30 border border-purple-900/30 rounded-xl p-10 max-w-2xl mx-auto text-center animate-fadeIn opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-md"></div>
              <div className="relative w-full h-full">
                <FiHeart className="w-full h-full text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-3">
              Your Cosmic Wishlist is Empty
            </h3>
            <p className="text-gray-300 mb-6">
              Save your favorite heroes to your wishlist for quick access
            </p>
            <Link 
              to="/" 
              className="relative group overflow-hidden px-6 py-2.5 rounded-lg inline-block"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600"></span>
              <span className="relative flex items-center justify-center text-white font-medium">
                <FiShoppingBag className="mr-2" />
                Explore Heroes
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
                className={`group transform transition-all duration-300 hover:scale-105 hover:-rotate-1 animate-fadeIn opacity-0`}
                style={{ animationDelay: `${0.1 * index + 0.3}s`, animationFillMode: "forwards" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-900/30 shadow-lg shadow-purple-900/5 relative z-10">
                  <div className="relative h-48 overflow-hidden bg-gradient-to-b from-black/20 to-black/5">
                    <Link to={`/product/${item.handle}`}>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-contain transition-transform hover:scale-105 duration-500"
                        onError={(e) => {
                          e.target.src = "https://ext.same-assets.com/1329671863/375037467.gif";
                        }}
                      />
                    </Link>
                    {item.inStock === false && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Out of Stock
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={pendingRemovals[item.id]}
                      className={`absolute top-2 left-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-red-500 transition-colors ${
                        pendingRemovals[item.id] ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label="Remove from wishlist"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <Link to={`/product/${item.handle}`} className="mb-1 block">
                      <h3 className="font-medium text-white hover:text-purple-300 transition-colors duration-200 line-clamp-2 min-h-[2.5rem]">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text font-semibold mb-3">
                      ₹{(item.price || 0).toFixed(2)}
                    </p>
                    
                    <div className="w-full">
                      <AddToCartButton
                        product={{...item, id: item.productId}}
                        disabled={item.inStock === false || pendingRemovals[item.id]}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {wishlistItems.length > 0 && (
          <div className="mt-12 text-center animate-fadeIn opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            <Link 
              to="/" 
              className="relative inline-flex items-center overflow-hidden px-6 py-2.5 rounded-full group"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 group-hover:from-indigo-600/30 group-hover:to-purple-600/30"></span>
              <span className="relative flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 font-medium transition-colors duration-200">
                <FiShoppingBag className="mr-2" />
                Continue Exploring
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;