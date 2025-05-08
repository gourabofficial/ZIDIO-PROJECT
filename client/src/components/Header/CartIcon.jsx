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
        className="relative p-2 text-white hover:text-[#c8a95a] transition-colors"
        onClick={toggleCart}
        aria-label="Cart"
      >
        <FiShoppingBag size={20} />
        {itemsCount > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">
            {itemsCount}
          </span>
        )}
      </button>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default CartIcon;