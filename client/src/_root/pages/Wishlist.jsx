import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';

const Wishlist = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  
  // Mock wishlist data - replace with actual data fetching
  const [wishlistItems, setWishlistItems] = useState([]);

  // Mock function to remove item from wishlist
  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
  };

  // Mock function to add item to cart
  

  if (!isLoaded) {
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
      <div className="max-w-6xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map(item => (
              <div key={item.id} className="bg-[#1e293b] rounded-xl overflow-hidden shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                  {!item.inStock && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1">
                      Out of Stock
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-white text-lg mb-1">{item.name}</h3>
                  <p className="text-purple-400 font-medium mb-4">{item.price.toFixed(2)}</p>
                  
                  <div className="flex justify-between items-center">
                    <button
                      
                      disabled={!item.inStock}
                      className={`flex items-center px-3 py-2 rounded text-sm ${
                        item.inStock 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white' 
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart className="mr-1" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
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