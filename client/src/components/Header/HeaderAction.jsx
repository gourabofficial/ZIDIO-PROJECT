import { Link } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';

const HeaderActions = () => {
  return (
    <div className="flex items-center space-x-4 md:space-x-5">
      <Link 
        to="/search" 
        className="text-white hover:text-[#c8a95a] transition-colors p-2"
        aria-label="Search"
      >
        <FiSearch size={20} />
      </Link>
      <Link 
        to="/wishlist" 
        className="text-white hover:text-[#c8a95a] transition-colors p-2 hidden md:block"
        aria-label="Wishlist"
      >
        <div className="relative">
          <FiHeart size={20} />
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">0</span>
        </div>
      </Link>
      <Link 
        to="/cart" 
        className="text-white hover:text-[#c8a95a] transition-colors p-2"
        aria-label="Cart"
      >
        <div className="relative">
          <FiShoppingCart size={20} />
          <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">0</span>
        </div>
      </Link>
      <Link 
        to="/account" 
        className="text-white hover:text-[#c8a95a] transition-colors p-2 hidden md:block"
        aria-label="Account"
      >
        <FiUser size={20} />
      </Link>
    </div>
  );
};

export default HeaderActions;