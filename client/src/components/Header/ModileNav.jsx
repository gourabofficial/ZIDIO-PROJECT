import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiSearch, FiHeart, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import { categoryItems, collectionItems } from './Navdata';

const MobileNav = ({ isOpen, onClose }) => {
  const [isShopCategoryOpen, setIsShopCategoryOpen] = useState(false);
  const [isShopCollectionOpen, setIsShopCollectionOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0e16] animate-fadeIn">
      {/* Background effects */}
      <div className="stars-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e16] via-transparent to-[#0c0e16] pointer-events-none"></div>
      
      <div className="relative z-10 h-full overflow-y-auto">
        {/* Mobile menu header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <Link to="/" className="flex items-center" onClick={onClose}>
            <div className="logo-container">
              <span className="text-xl font-bold tracking-wider cosmic-gradient">COSMIC</span>
              <span className="text-xl font-bold tracking-wider ml-1 heroes-gradient">HEROS</span>
            </div>
          </Link>
          <button 
            onClick={onClose} 
            className="text-white p-2 hover:text-[#c8a95a] transition-colors rounded-full hover:bg-white/5"
            aria-label="Close menu"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* Main mobile navigation */}
        <div className="px-6 py-8 flex flex-col items-center animate-slideUp">
          {/* Main menu items */}
          <div className="w-full space-y-4 mb-8">
            <Link 
              to="/" 
              className="mobile-nav-link text-lg block text-center py-2 hover:text-[#c8a95a] transition-colors" 
              onClick={onClose}
            >
              SHOP
            </Link>

            {/* Categories dropdown */}
            <MobileDropdown 
              title="SHOP BY CATEGORY"
              isOpen={isShopCategoryOpen}
              onToggle={() => setIsShopCategoryOpen(!isShopCategoryOpen)}
              items={categoryItems}
              onItemClick={onClose}
            />

            {/* Collections dropdown */}
            <MobileDropdown 
              title="SHOP BY COLLECTION"
              isOpen={isShopCollectionOpen}
              onToggle={() => setIsShopCollectionOpen(!isShopCollectionOpen)}
              items={collectionItems}
              onItemClick={onClose}
            />

            <Link 
              to="/track-order" 
              className="mobile-nav-link text-lg block text-center py-2 hover:text-[#c8a95a] transition-colors" 
              onClick={onClose}
            >
              TRACK ORDER
            </Link>
          </div>
        </div>
        
        {/* Mobile menu footer with icons */}
        <MobileNavFooter onItemClick={onClose} />
      </div>
    </div>
  );
};

const MobileDropdown = ({ title, isOpen, onToggle, items, onItemClick }) => {
  return (
    <div className="mobile-dropdown w-full">
      <button
        onClick={onToggle}
        className="mobile-nav-link text-lg w-full text-center flex items-center justify-center py-2"
      >
        <span>{title}</span>
        <FiChevronDown className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div 
        className={`transition-all duration-300 overflow-hidden bg-white/5 rounded-lg mt-1 ${
          isOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        {items.map((item, index) => (
          <Link 
            key={index}
            to={item.path} 
            className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" 
            onClick={onItemClick}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

const MobileNavFooter = ({ onItemClick }) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-[#0c0e16]/80 backdrop-blur-sm">
      <div className="flex items-center justify-evenly">
        <Link to="/search" className="mobile-icon-btn" onClick={onItemClick}>
          <FiSearch size={22} />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link to="/wishlist" className="mobile-icon-btn" onClick={onItemClick}>
          <div className="relative">
            <FiHeart size={22} />
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">0</span>
          </div>
          <span className="text-xs mt-1">Wishlist</span>
        </Link>
        <Link to="/cart" className="mobile-icon-btn" onClick={onItemClick}>
          <div className="relative">
            <FiShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">0</span>
          </div>
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link to="/account" className="mobile-icon-btn" onClick={onItemClick}>
          <FiUser size={22} />
          <span className="text-xs mt-1">Account</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;