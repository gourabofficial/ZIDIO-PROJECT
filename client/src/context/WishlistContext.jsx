import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage when component mounts or user changes
  useEffect(() => {
    if (isSignedIn && user) {
      const userId = user.id;
      const savedWishlist = localStorage.getItem(`wishlist_${userId}`);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    }
  }, [isSignedIn, user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isSignedIn && user) {
      const userId = user.id;
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isSignedIn, user]);

  // Add item to wishlist
  const addToWishlist = (product) => {
    if (!isSignedIn) return false;
    
    console.log("Adding to wishlist:", product);
    console.log("Current wishlist:", wishlistItems);
    
    // Check if product is already in wishlist
    if (!wishlistItems.some(item => String(item.id) === String(product.id))) {
      const updatedWishlist = [...wishlistItems, product];
      setWishlistItems(updatedWishlist);
      console.log("Updated wishlist:", updatedWishlist);
      return true;
    }
    return false;
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    if (!isSignedIn) return false;
    
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    return true;
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    // Convert IDs to strings for comparison to avoid type mismatches
    return wishlistItems.some(item => String(item.id) === String(productId));
  };

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};