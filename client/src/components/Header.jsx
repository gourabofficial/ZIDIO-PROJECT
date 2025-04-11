import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX, FiChevronDown, FiUser } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopCategoryOpen, setIsShopCategoryOpen] = useState(false);
  const [isShopCollectionOpen, setIsShopCollectionOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Refs for dropdown containers
  const categoryContainerRef = useRef(null);
  const collectionContainerRef = useRef(null);

  // Timeout refs for delayed closing
  const categoryTimeoutRef = useRef(null);
  const collectionTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Cleanup timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
      if (collectionTimeoutRef.current) clearTimeout(collectionTimeoutRef.current);
    };
  }, []);

  const handleCategoryMouseEnter = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
      categoryTimeoutRef.current = null;
    }
    setIsShopCategoryOpen(true);
    setIsShopCollectionOpen(false); // Close the other dropdown
  };

  const handleCategoryMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setIsShopCategoryOpen(false);
    }, 200); // Small delay before closing
  };

  const handleCollectionMouseEnter = () => {
    if (collectionTimeoutRef.current) {
      clearTimeout(collectionTimeoutRef.current);
      collectionTimeoutRef.current = null;
    }
    setIsShopCollectionOpen(true);
    setIsShopCategoryOpen(false); // Close the other dropdown
  };

  const handleCollectionMouseLeave = () => {
    collectionTimeoutRef.current = setTimeout(() => {
      setIsShopCollectionOpen(false);
    }, 200); // Small delay before closing
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCategoryDropdown = (e) => {
    e.preventDefault();
    setIsShopCategoryOpen(!isShopCategoryOpen);
    setIsShopCollectionOpen(false); // Close the other dropdown
  };
  
  const toggleCollectionDropdown = (e) => {
    e.preventDefault();
    setIsShopCollectionOpen(!isShopCollectionOpen);
    setIsShopCategoryOpen(false); // Close the other dropdown
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#0c0e16] shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4 px-4 md:px-6">
          {/* Mobile menu button - increased padding for better touch target */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="text-white transition-colors hover:text-[#c8a95a] p-2 -ml-2"
              aria-label="Open menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Logo - centered on mobile, left aligned on desktop */}
          <div className="flex justify-center flex-grow md:flex-grow-0 md:justify-start">
            <Link to="/" className="flex-shrink-0 md:mr-8 flex items-center">
              <div className="logo-container relative">
                <span className="text-xl md:text-2xl font-bold tracking-wider cosmic-gradient">COSMIC</span>
                <span className="text-xl md:text-2xl font-bold tracking-wider ml-2 heroes-gradient">HEROS</span>
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a95a] to-transparent"></div>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6 flex-grow">
            <Link to="/" className="nav-link relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c8a95a] hover:after:w-full after:transition-all after:duration-300">SHOP</Link>

            <div 
              ref={categoryContainerRef}
              className="relative dropdown-container" 
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <button
                onClick={toggleCategoryDropdown}
                className="nav-link flex items-center space-x-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c8a95a] hover:after:w-full after:transition-all after:duration-300"
              >
                <span>SHOP BY CATEGORY</span>
                <FiChevronDown 
                  className={`ml-1 opacity-70 transform transition-transform duration-300 ${isShopCategoryOpen ? 'rotate-180' : ''}`} 
                  size={14} 
                />
              </button>
              <div 
                className={`absolute left-0 mt-2 w-48 bg-[#0c0e16] text-white border border-[rgba(255,255,255,0.1)] shadow-lg z-50 transition-all duration-300 origin-top ${
                  isShopCategoryOpen 
                    ? 'opacity-100 transform scale-100 translate-y-0' 
                    : 'opacity-0 pointer-events-none transform scale-95 -translate-y-2'
                }`}
              >
                <Link to="/collections/tshirt" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">T-SHIRTS</Link>
                <Link to="/collections/sweatshirt" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">SWEATSHIRTS</Link>
                <Link to="/collections/hoodies" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">HOODIES</Link>
                <Link to="/collections/bottoms" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">BOTTOMS</Link>
                <Link to="/collections/co-ord-set" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">CO-ORD SETS</Link>
                <Link to="/collections/sleeveless-vest" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">SLEEVELESS VESTS</Link>
              </div>
            </div>

            <div 
              ref={collectionContainerRef}
              className="relative dropdown-container" 
              onMouseEnter={handleCollectionMouseEnter}
              onMouseLeave={handleCollectionMouseLeave}
            >
              <button
                onClick={toggleCollectionDropdown}
                className="nav-link flex items-center space-x-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c8a95a] hover:after:w-full after:transition-all after:duration-300"
              >
                <span>SHOP BY COLLECTION</span>
                <FiChevronDown 
                  className={`ml-1 opacity-70 transform transition-transform duration-300 ${isShopCollectionOpen ? 'rotate-180' : ''}`} 
                  size={14} 
                />
              </button>
              <div 
                className={`absolute left-0 mt-2 w-64 bg-[#0c0e16] text-white border border-[rgba(255,255,255,0.1)] shadow-lg z-50 transition-all duration-300 origin-top ${
                  isShopCollectionOpen 
                    ? 'opacity-100 transform scale-100 translate-y-0' 
                    : 'opacity-0 pointer-events-none transform scale-95 -translate-y-2'
                }`}
              >
                <Link to="/collections/nox-collection-ss1-0" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">NOX SS1.0 COLLECTION</Link>
                <Link to="/collections/yuki-collection" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">YUKI COLLECTION</Link>
                <Link to="/collections/takeover-collection-summer-phase-ii" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">TAKEOVER SUMMER PHASE II</Link>
                <Link to="/collections/winter-2023-collection" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">WINTER 2023 COLLECTION</Link>
                <Link to="/collections/summer-collection-phase-i-1" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">SUMMER COLLECTION PHASE I</Link>
              </div>
            </div>

            <Link to="/track-order" className="nav-link relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#c8a95a] hover:after:w-full after:transition-all after:duration-300">TRACK ORDER</Link>
          </nav>

          {/* Cart and search icons - Better spacing on mobile */}
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
        </div>
      </div>

      {/* Mobile menu - Enhanced version */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c0e16] animate-fadeIn">
          {/* Background effects */}
          <div className="stars-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e16] via-transparent to-[#0c0e16] pointer-events-none"></div>
          
          <div className="relative z-10 h-full overflow-y-auto">
            {/* Mobile menu header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <div className="logo-container">
                  <span className="text-xl font-bold tracking-wider cosmic-gradient">COSMIC</span>
                  <span className="text-xl font-bold tracking-wider ml-1 heroes-gradient">HEROS</span>
                </div>
              </Link>
              <button 
                onClick={toggleMenu} 
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
                  onClick={toggleMenu}
                >
                  SHOP
                </Link>

                {/* Categories dropdown */}
                <div className="mobile-dropdown w-full">
                  <button
                    onClick={() => setIsShopCategoryOpen(!isShopCategoryOpen)}
                    className="mobile-nav-link text-lg w-full text-center flex items-center justify-center py-2"
                  >
                    <span>SHOP BY CATEGORY</span>
                    <FiChevronDown className={`ml-2 transition-transform duration-300 ${isShopCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`transition-all duration-300 overflow-hidden bg-white/5 rounded-lg mt-1 ${
                      isShopCategoryOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'
                    }`}
                  >
                    <Link to="/collections/tshirt" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>T-SHIRTS</Link>
                    <Link to="/collections/sweatshirt" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>SWEATSHIRTS</Link>
                    <Link to="/collections/hoodies" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>HOODIES</Link>
                    <Link to="/collections/bottoms" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>BOTTOMS</Link>
                    <Link to="/collections/co-ord-set" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>CO-ORD SETS</Link>
                    <Link to="/collections/sleeveless-vest" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>SLEEVELESS VESTS</Link>
                  </div>
                </div>

                {/* Collections dropdown */}
                <div className="mobile-dropdown w-full">
                  <button
                    onClick={() => setIsShopCollectionOpen(!isShopCollectionOpen)}
                    className="mobile-nav-link text-lg w-full text-center flex items-center justify-center py-2"
                  >
                    <span>SHOP BY COLLECTION</span>
                    <FiChevronDown className={`ml-2 transition-transform duration-300 ${isShopCollectionOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`transition-all duration-300 overflow-hidden bg-white/5 rounded-lg mt-1 ${
                      isShopCollectionOpen ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'
                    }`}
                  >
                    <Link to="/collections/nox-collection-ss1-0" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>NOX SS1.0 COLLECTION</Link>
                    <Link to="/collections/yuki-collection" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>YUKI COLLECTION</Link>
                    <Link to="/collections/takeover-collection-summer-phase-ii" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>TAKEOVER SUMMER PHASE II</Link>
                    <Link to="/collections/winter-2023-collection" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>WINTER 2023 COLLECTION</Link>
                    <Link to="/collections/summer-collection-phase-i-1" className="block py-3 px-4 text-center text-[#b8b8d0] hover:text-[#c8a95a]" onClick={toggleMenu}>SUMMER COLLECTION PHASE I</Link>
                  </div>
                </div>

                <Link 
                  to="/track-order" 
                  className="mobile-nav-link text-lg block text-center py-2 hover:text-[#c8a95a] transition-colors" 
                  onClick={toggleMenu}
                >
                  TRACK ORDER
                </Link>
              </div>
            </div>
            
            {/* Mobile menu footer with icons */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-[#0c0e16]/80 backdrop-blur-sm">
              <div className="flex items-center justify-evenly">
                <Link to="/search" className="mobile-icon-btn" onClick={toggleMenu}>
                  <FiSearch size={22} />
                  <span className="text-xs mt-1">Search</span>
                </Link>
                <Link to="/wishlist" className="mobile-icon-btn" onClick={toggleMenu}>
                  <div className="relative">
                    <FiHeart size={22} />
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">0</span>
                  </div>
                  <span className="text-xs mt-1">Wishlist</span>
                </Link>
                <Link to="/cart" className="mobile-icon-btn" onClick={toggleMenu}>
                  <div className="relative">
                    <FiShoppingCart size={22} />
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">0</span>
                  </div>
                  <span className="text-xs mt-1">Cart</span>
                </Link>
                <Link to="/account" className="mobile-icon-btn" onClick={toggleMenu}>
                  <FiUser size={22} />
                  <span className="text-xs mt-1">Account</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;