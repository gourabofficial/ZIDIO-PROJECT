import React, { useState, useEffect } from "react";
import { FiHeart, FiLoader } from "react-icons/fi";
import toast from 'react-hot-toast';
import { addToWishlist, removeFromWishlist } from "../../Api/user.js";
import { useAuthdata } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const WishlistButton = ({ product, className = "", size = "medium" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, refetchUserData, currentUser } = useAuthdata();
  const navigate = useNavigate();

  // Check if product is already in wishlist
  const isInWishlist = () => {
    if (!isLoaded || !currentUser || !currentUser.wishlist) {
      return false;
    }
    
    return currentUser.wishlist.some(item => 
      item._id === product.id || item === product.id
    );
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoaded || !currentUser) {
      toast.info("Please sign in to use wishlist");
      navigate('/sign-in');
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      if (isInWishlist()) {
        // Remove from wishlist
        const res = await removeFromWishlist(product.id);
        if (res.success) {
          toast.success("Removed from wishlist");
        } else {
          toast.error(res.message || "Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const res = await addToWishlist(product.id);
        if (res.success) {
          toast.success("Added to wishlist");
        } else {
          toast.error(res.message || "Failed to add to wishlist");
        }
      }
      
      // Refresh user data to update wishlist status
      refetchUserData();
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    } finally {
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
      } ${className}`}
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