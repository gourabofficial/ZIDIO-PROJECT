import React, { useState } from 'react';
import { FiShoppingCart, FiCheck, FiLoader } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const AddToCartButton = ({ product, className = '', size = 'normal', children, disabled = false, selectedSize }) => {
  const { addToCart, cartItems } = useCart();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (added || loading || disabled) return;

    // Check if product is defined
    if (!product) {
      console.error("Cannot add undefined product to cart");
      return;
    }

    // Debug logs
    console.log("Adding product to cart:", product);
    console.log("Product price:", product.price);
    console.log("Selected size:", selectedSize);

    // Create a product copy with the selected size if applicable
    const productToAdd = selectedSize 
      ? {...product, selectedVariant: { size: selectedSize }}
      : product;
    
    // Create a composite ID that includes both product ID and size
    const variantId = selectedSize 
      ? `${productToAdd.id}-size-${selectedSize}`
      : productToAdd.id;
    
    // Add these logs after creating variantId
    console.log("Generated variantId:", variantId);
    console.log("Current cart items:", cartItems);

    // Assign the variant-specific ID
    productToAdd.variantId = variantId;
    
    // Ensure we have a consistent ID format
    if (!productToAdd.id) {
      productToAdd.id = `product-${Date.now()}`;
    }
    
    // If same product with same size already exists, just update quantity
    const existingProductIndex = cartItems?.findIndex(item => 
      item.variantId === variantId
    );

    setLoading(true);
    let result;
    
    // Always add with quantity 1
    result = await addToCart(productToAdd, 1);
    
    // And after the addToCart call:
    console.log("Result from addToCart:", result);

    setLoading(false);

    if (result && result.success) {
      setAdded(true);
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
        children ? (
          <>
            <FiCheck className="mr-2" />
            ADDED TO CART
          </>
        ) : (
          <FiCheck />
        )
      ) : (
        children || <FiShoppingCart />
      )}
    </button>
  );
};

export default AddToCartButton;