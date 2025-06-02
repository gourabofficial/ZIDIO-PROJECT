import React, { useState, useCallback } from "react";
import { FiHeart, FiLoader } from "react-icons/fi";
import toast from 'react-hot-toast';
import { addToWishlist, removeFromWishlist } from "../../Api/user.js";
import { useAuthdata } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const WishlistButton = ({ product, className = "", size = "medium" }) => {
  const [optimisticState, setOptimisticState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, refetchUserData, currentUser, addToWishlistOptimistic, removeFromWishlistOptimistic } = useAuthdata();
  const navigate = useNavigate();

  // More efficient wishlist check
  const isInWishlist = useCallback(() => {
    if (optimisticState !== null) return optimisticState;
    
    if (!isLoaded || !currentUser?.wishlist) return false;
    
    // Use a direct lookup instead of array iteration when possible
    const productId = product.id || product._id;
    return currentUser.wishlist.some(item => (item._id || item) === productId);
  }, [optimisticState, isLoaded, currentUser, product]);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoaded || !currentUser) {
      toast.info("Please sign in to use wishlist");
      navigate('/sign-in');
      return;
    }
    
    if (isLoading) return;
    
    const currentlyInWishlist = isInWishlist();
    const productId = product.id || product._id;
    
    // Immediately update UI state
    setOptimisticState(!currentlyInWishlist);
    setIsLoading(true);

    // Optimistically update the context immediately
    if (currentlyInWishlist) {
      removeFromWishlistOptimistic(productId);
      toast.success("Removed from wishlist");
    } else {
      addToWishlistOptimistic(product);
      toast.success("Added to wishlist");
    }

    try {
      // Execute operation in background
      const apiCall = currentlyInWishlist 
        ? removeFromWishlist(productId)
        : addToWishlist(productId);
      
      // Fire and forget pattern with cleanup
      apiCall.then(res => {
        if (!res.success) {
          // Revert on failure and show error
          setOptimisticState(currentlyInWishlist);
          toast.error(res.message || "Failed to update wishlist");
          // Silently refetch to restore correct state
          refetchUserData();
        } else {
          // Reset optimistic state since the operation succeeded
          setOptimisticState(null);
        }
      }).catch(error => {
        console.error("Error updating wishlist:", error);
        setOptimisticState(currentlyInWishlist);
        toast.error("Failed to update wishlist");
        // Silently refetch to restore correct state
        refetchUserData();
      }).finally(() => {
        setIsLoading(false);
      });
      
      // Don't wait for API to complete - update UI immediately
      setIsLoading(false);
      
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setOptimisticState(currentlyInWishlist);
      toast.error("Failed to update wishlist");
      setIsLoading(false);
    }
  };

  // Size classes for the button
  const sizeClasses = {
    small: "w-8 h-8 text-sm",
    medium: "w-10 h-10 text-lg",
    large: "w-12 h-12 text-xl"
  };

  const inWishlist = isInWishlist();

  return (
    <button 
      onClick={handleToggleWishlist}
      className={`flex items-center justify-center p-2 rounded-full transition-colors ${sizeClasses[size]} ${
        inWishlist 
          ? 'bg-red-100 text-red-500 hover:bg-red-200' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
      } ${className} ${isLoading ? 'opacity-70' : ''}`}
      disabled={isLoading}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isLoading ? (
        <FiLoader className="animate-spin" />
      ) : (
        <FiHeart className={inWishlist ? "fill-red-500" : ""} />
      )}
    </button>
  );
};

export default WishlistButton;