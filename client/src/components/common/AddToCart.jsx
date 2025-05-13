import React, { useState } from 'react';
import { FiShoppingCart, FiCheck, FiLoader } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const AddToCartButton = ({ 
  product, 
  className = '', 
  size = 'normal', 
  children, 
  disabled = false, 
  selectedSize,
  compact = false,
  onAddedToCart
}) => {
  const { addToCart, cartItems } = useCart();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (added || loading || disabled) {
      console.log("Early return due to:", { added, loading, disabled });
      return;
    }

    if (!product) {
      console.error("Cannot add undefined product to cart");
      return;
    }

    // Create normalized product with consistent structure
    const productToAdd = {
      ...product,
      // Ensure we use _id if available
      id: product._id || product.id,
      // Normalize image property structure
      image: product.image || (product.images && product.images[0]?.imageUrl) || '',
      // Add selected size if applicable
      ...(selectedSize ? { selectedVariant: { size: selectedSize } } : {})
    };
    
    const variantId = selectedSize 
      ? `${productToAdd.id}-size-${selectedSize}`
      : productToAdd.id;
    
    productToAdd.variantId = variantId;
    
    const existingProductIndex = cartItems?.findIndex(item => 
      item.variantId === variantId
    );

    setLoading(true);
    let result;
    
    result = await addToCart(productToAdd, 1);
    

    setLoading(false);

    if (result && result.success) {
      setAdded(true);
      if (typeof onAddedToCart === 'function') {
        onAddedToCart();
      }
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || disabled || !product}
      className={`flex items-center justify-center ${className}`}
    >
      {loading ? (
        <FiLoader className="animate-spin" />
      ) : added ? (
        compact ? (
          <FiCheck className="text-green-400 animate-pulse" size={18} />
        ) : (
          children ? (
            <>
              <FiCheck className="mr-2" />
              ADDED TO CART
            </>
          ) : (
            <FiCheck />
          )
        )
      ) : (
        children || <FiShoppingCart />
      )}
    </button>
  );
};

export default AddToCartButton;