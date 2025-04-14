import React, { useState } from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../Cart/CartDrawer';

const CartIcon = () => {
  const { itemsCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <button 
        className="relative p-2 text-white hover:text-purple-400 transition-colors"
        onClick={toggleCart}
        aria-label="Cart"
      >
        <FiShoppingBag className="w-6 h-6" />
        {itemsCount > 0 && (
          <span className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform translate-x-1 -translate-y-1">
            {itemsCount}
          </span>
        )}
      </button>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default CartIcon;