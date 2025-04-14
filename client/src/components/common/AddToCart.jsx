import React, { useState } from 'react';
import { FiShoppingCart, FiCheck, FiLoader } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const AddToCartButton = ({ product, className = '', size = 'normal' }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (added || loading) return;

    setLoading(true);
    const result = await addToCart(product);
    setLoading(false);

    if (result.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`flex items-center justify-center ${className}`}
    >
      {loading ? (
        <FiLoader className="animate-spin" />
      ) : added ? (
        <FiCheck />
      ) : (
        <FiShoppingCart />
      )}
    </button>
  );
};

export default AddToCartButton;