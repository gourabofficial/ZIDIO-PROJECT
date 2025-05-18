import { useState, useEffect, useRef } from 'react';
import MobileNav from './ModileNav';
import { Link } from 'react-router-dom';
import { FiHeart, FiSearch, FiShoppingCart, FiUser, FiChevronDown, FiSettings, FiPackage, FiLogOut } from 'react-icons/fi';
import { categoryItems, collectionItems } from '../../constant/constant';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useClerk } from "@clerk/clerk-react";
import { useAuthdata } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [dropdownTimer, setDropdownTimer] = useState(null);

  const categoryRef = useRef(null);
  const collectionRef = useRef(null);
  const profileRef = useRef(null);

  const { signOut } = useClerk();
  const {
    currentUser,
    isAuth,
    isLoaded,
    error
  } = useAuthdata();
  
  // console.log('Current User:', currentUser?.cartData);

  const { wishlistItems } = useWishlist();
  // const { itemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    const handleClickOutside = (event) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target) &&
        collectionRef.current &&
        !collectionRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimer) clearTimeout(dropdownTimer);
    };
  }, [dropdownTimer]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
  };

  const handleMouseEnter = (dropdown) => {
    if (dropdownTimer) clearTimeout(dropdownTimer);
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setOpenDropdown(null);
    }, 50); // Reduced from 200ms to 50ms
    setDropdownTimer(timer);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0c0e16] shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4 px-4 md:px-6">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white transition-colors hover:text-[#c8a95a] p-2 -ml-2"
              aria-label="Open menu"
            >
              <span className="sr-only">Menu</span>
              {isMenuOpen ? <span>✕</span> : <span>☰</span>}
            </button>
          </div>

          {/* Left side: Logo + Category + Collection */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 mr-6 flex items-center">
              <div className="logo-container relative">
                <span className="text-xl md:text-2xl font-bold tracking-wider cosmic-gradient">COSMIC</span>
                <span className="text-xl md:text-2xl font-bold tracking-wider ml-2 heroes-gradient">HEROS</span>
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a95a] to-transparent"></div>
              </div>
            </Link>

            {/* Category and Collection dropdowns - visible only on desktop */}
            <div className="hidden md:flex items-center space-x-5">
              {/* Category Dropdown */}
              <div 
                ref={categoryRef} 
                className="relative"
                onMouseEnter={() => handleMouseEnter('category')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => toggleDropdown('category')}
                  className="text-white hover:text-[#c8a95a] transition-colors p-2 flex items-center"
                  aria-expanded={openDropdown === 'category'}
                  aria-controls="category-dropdown"
                >
                  SHOP BY CATEGORY
                  <span className="ml-1">
                    {openDropdown === 'category' ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </button>

                {openDropdown === 'category' && (
                  <div className="absolute left-0 mt-2 w-64 bg-[#0c0e16] shadow-lg rounded-md py-2 z-50 border border-gray-700 
                    transition-all duration-200 animate-fadeIn">
                    {categoryItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-[#c8a95a] transition-all duration-150 
                        hover:pl-6 relative overflow-hidden group"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span className="relative z-10">{item.label}</span>
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c8a95a] transition-all duration-200 group-hover:w-full"></span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Collection Dropdown */}
              <div 
                ref={collectionRef} 
                className="relative"
                onMouseEnter={() => handleMouseEnter('collection')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => toggleDropdown('collection')}
                  className="text-white hover:text-[#c8a95a] transition-colors p-2 flex items-center"
                  aria-expanded={openDropdown === 'collection'}
                >
                  SHOP BY COLLECTION
                  <span className="ml-1">
                    {openDropdown === 'collection' ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </button>

                {openDropdown === 'collection' && (
                  <div className="absolute left-0 mt-2 w-80 bg-[#0c0e16] shadow-lg rounded-md py-2 z-50 border border-gray-700
                    transition-all duration-200 animate-fadeIn">
                    {collectionItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-[#c8a95a] transition-all duration-150
                        hover:pl-6 relative overflow-hidden group"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span className="relative z-10">{item.label}</span>
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c8a95a] transition-all duration-200 group-hover:w-full"></span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* right side links */}
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
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
            </Link>
            <Link
              to="/cart"
              className="text-white hover:text-[#c8a95a] transition-colors p-2"
              aria-label="Cart"
            >
              <div className="relative">
                <FiShoppingCart size={20} />
                {currentUser?.cartData?.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">
                    {currentUser.cartData.length}
                  </span>
                )}
              </div>
            </Link>
            {!isLoaded ? (
              <div className="w-5 h-5 rounded-full bg-gray-600 animate-pulse"></div>
            ) : isAuth && currentUser ? (
              <div className="hidden md:block relative" ref={profileRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-1 text-white hover:text-[#c8a95a] transition-colors p-2"
                  aria-label="Profile"
                >
                  {currentUser.imageUrl || currentUser.avatar ? (
                    <img
                      src={currentUser.imageUrl || currentUser.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-[#c8a95a]/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#c8a95a] flex items-center justify-center text-[#0c0e16] text-xs font-bold">
                      {currentUser.firstName?.[0] || currentUser.fullName?.[0] || 'U'}
                    </div>
                  )}
                  <FiChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0c0e16] shadow-lg rounded-md py-2 z-50 border border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-700 flex items-center">
                      {currentUser.imageUrl || currentUser.avatar ? (
                        <img
                          src={currentUser.imageUrl || currentUser.avatar}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border border-[#c8a95a]/30 mr-3"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#c8a95a] flex items-center justify-center text-[#0c0e16] text-sm font-bold mr-3">
                          {currentUser.firstName?.[0] || currentUser.fullName?.[0] || 'U'}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium truncate">{currentUser.fullName || 'User'}</p>
                        <p className="text-gray-400 text-xs truncate max-w-[120px]">{currentUser.email}</p>
                      </div>
                    </div>
                    
                    {/* Profile menu items */}
                    <Link
                      to="/account"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-[#c8a95a]"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUser className="mr-2" size={16} />
                      My Account
                    </Link>

                    {/* Show admin link if user has admin role */}
                    {currentUser.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-[#c8a95a]"
                        onClick={() => setIsProfileOpen(false)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FiSettings className="mr-2" size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    {/* Rest of the menu items */}
                    <Link
                      to="/orders"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-[#c8a95a]"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiPackage className="mr-2" size={16} />
                      My Orders
                    </Link>

                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-[#c8a95a]"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiSettings className="mr-2" size={16} />
                      Settings
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-[#c8a95a]"
                    >
                      <FiLogOut className="mr-2" size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="text-white hover:text-[#c8a95a] transition-colors p-2 hidden md:block"
                aria-label="Sign In"
              >
                <FiUser size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav 
  isOpen={isMenuOpen} 
  onClose={toggleMenu} 
  currentUser={currentUser}
  isAuth={isAuth}
/>
    </header>
  );
};

export default Header;