import React, { useState } from "react";
import { FiShoppingCart, FiCheck, FiLoader, FiShoppingBag } from "react-icons/fi";
import toast from 'react-hot-toast';
import { addToCart } from "../../Api/user.js";
import { useAuthdata } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";


const AddToCartButton = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isLoaded, refetchUserData, currentUser, addToCartOptimistic } = useAuthdata();
  const navigate = useNavigate();

  // Check if product is already in cart
  const isInCart = () => {
    if (!isLoaded || !currentUser || !currentUser.cartData || !currentUser.cartData.items) {
      return false;
    }
    
    return currentUser.cartData.items.some(item => {
      // First check if item.productId exists
      if (!item || item.productId === null || item.productId === undefined) {
        return false;
      }
      
      // Now safely check the id match based on the type of productId
      if (typeof item.productId === 'object') {
        return item.productId._id === product.id;
      } else {
        return item.productId === product.id;
      }
    });
  };
  
  const handleViewCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigate('/cart');
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!isLoaded || !currentUser) {
      toast.error("Please login first");
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    setIsSuccess(false);

    // Optimistically update the UI immediately
    addToCartOptimistic(product, 1);
    toast.success("Item added to cart successfully!");
    setIsSuccess(true);

    try {
      const cartToBeSubmitted = {
        productId: product.id,
        quantity: 1,
      };
      
      // Call API in background without blocking UI
      const res = await addToCart(cartToBeSubmitted);
      console.log("res:: ", res);
      
      // Only refetch if there was an error to sync with server
      if (!res.success) {
        toast.error(res.message || "Failed to add item to cart");
        // Silently refetch to restore correct state
        refetchUserData();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add item to cart. Please try again.");
      // Silently refetch to restore correct state
      refetchUserData();
    } finally {
      setIsLoading(false);
      
      // Reset success state after 2 seconds
      if (isSuccess) {
        setTimeout(() => {
          setIsSuccess(false);
        }, 2000);
      }
    }
  };

  // If the product is already in the cart, show "View in Cart" button
  if (isInCart()) {
    
    return (
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleViewCart();
        }}
        className="flex items-center justify-center p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors w-10 h-10"
        title="View in Cart"
      >
        <FiShoppingBag className="text-lg" />
      </button>
    );
  }

  return (
    <button 
      onClick={handleAddToCart}
      className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors w-10 h-10"
      disabled={isLoading}
      title={isLoading ? "Adding to cart" : isSuccess ? "Added to cart" : "Add to cart"}
    >
      {isLoading ? (
        <FiLoader className="animate-spin text-lg" />
      ) : isSuccess ? (
        <FiCheck className="text-lg" />
      ) : (
        <FiShoppingCart className="text-lg" />
      )}
    </button>
  );
};

export default AddToCartButton;
