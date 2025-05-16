import React, { useState } from "react";
import { FiShoppingCart, FiCheck, FiLoader, FiShoppingBag } from "react-icons/fi";
import toast from 'react-hot-toast';
import { addToCart } from "../../Api/user.js";
import { useAuthdata } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";


const AddToCartButton = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isLoaded, refetchUserData, currentUser } = useAuthdata();
  const navigate = useNavigate();

  // Check if product is already in cart
  const isInCart = () => {
    if (!isLoaded || !currentUser || !currentUser.cartData || !currentUser.cartData.items) {
      return false;
    }
    
    return currentUser.cartData.items.some(item => 
      item.productId._id === product.id || item.productId === product.id
    );
  };
  
  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!isLoaded) {
      toast.info("Please log in to add items to your cart");
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const cartToBeSubmitted = {
        productId: product.id,
        quantity: 1,
      };
      
      const res = await addToCart(cartToBeSubmitted);
      refetchUserData();
      
      setIsSuccess(true);
      toast.success("Item added to cart successfully!");
      console.log("res:: ", res);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add item to cart. Please try again.");
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
      <Link to={'/cart'}>
        <button 
          onClick={handleViewCart}
          className="flex items-center justify-center p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors w-10 h-10"
          title="View in Cart"
        >
          <FiShoppingBag className="text-lg" />
        </button>
      </Link>
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
