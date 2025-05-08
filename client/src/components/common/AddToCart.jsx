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
  compact = false
}) => {
  const { addToCart, cartItems } = useCart();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (added || loading || disabled) return;

    if (!product) {
      console.error("Cannot add undefined product to cart");
      return;
    }

    console.log("Adding product to cart:", product);
    console.log("Product price:", product.price);
    console.log("Selected size:", selectedSize);

    const productToAdd = selectedSize 
      ? {...product, selectedVariant: { size: selectedSize }}
      : product;
    
    const variantId = selectedSize 
      ? `${productToAdd.id}-size-${selectedSize}`
      : productToAdd.id;
    
    console.log("Generated variantId:", variantId);
    console.log("Current cart items:", cartItems);

    productToAdd.variantId = variantId;
    
    if (!productToAdd.id) {
      productToAdd.id = `product-${Date.now()}`;
    }
    
    const existingProductIndex = cartItems?.findIndex(item => 
      item.variantId === variantId
    );

    setLoading(true);
    let result;
    
    result = await addToCart(productToAdd, 1);
    
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