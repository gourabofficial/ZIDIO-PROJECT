import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';

const Wishlist = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { wishlistItems, removeFromWishlist } = useWishlist();

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
              <div key={item.id} className="bg-[#1e293b] rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
                <div className="relative h-40 overflow-hidden bg-black/30">
                  <Link to={`/product/${item.slug || item.id}`}>
                    <img 
                      src={item.images?.[0] || item.image || 'https://ext.same-assets.com/1329671863/375037467.gif'} 
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
                  <Link to={`/product/${item.slug || item.id}`} className="mb-1">
                    <h3 className="font-medium text-white text-sm hover:text-purple-400 line-clamp-2">{item.title}</h3>
                  </Link>
                  <p className="text-purple-400 font-medium mb-2 text-sm">₹{item.price?.toFixed(2) || "0.00"}</p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <AddToCartButton
                      product={item}
                      disabled={item.inStock === false}
                      className={`flex items-center justify-center px-2 py-1 rounded text-xs ${
                        item.inStock === false 
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                      }`}
                      compact={true}
                    >
                      {item.inStock === false ? 'Out of Stock' : 'Add to Cart'}
                    </AddToCartButton>
                    
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="flex items-center text-gray-400 hover:text-red-400 transition-colors ml-2"
                      aria-label="Remove from wishlist"
                    >
                      <FiTrash2 size={14} />
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