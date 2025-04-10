import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopCategoryOpen, setIsShopCategoryOpen] = useState(false);
  const [isShopCollectionOpen, setIsShopCollectionOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0c0e16] shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4 px-4 md:px-6">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white transition-colors">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Logo - centered on mobile, left aligned on desktop */}
          <Link to="/" className="flex-shrink-0 md:mr-8">
            <span className="text-xl font-bold tracking-wider gradient-text">COSMIC</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6 flex-grow">
            <Link to="/" className="nav-link">SHOP</Link>

            <div className="relative group">
              <button
                onClick={() => setIsShopCategoryOpen(!isShopCategoryOpen)}
                className="nav-link flex items-center space-x-1"
              >
                <span>SHOP BY CATEGORY</span>
                <FiChevronDown className="opacity-70" size={14} />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-[#0c0e16] text-white border border-[rgba(255,255,255,0.1)] shadow-lg z-50 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Link to="/collections/tshirt" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">T-SHIRTS</Link>
                <Link to="/collections/sweatshirt" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">SWEATSHIRTS</Link>
                <Link to="/collections/hoodies" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">HOODIES</Link>
                <Link to="/collections/bottoms" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">BOTTOMS</Link>
                <Link to="/collections/co-ord-set" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">CO-ORD SETS</Link>
                <Link to="/collections/sleeveless-vest" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">SLEEVELESS VESTS</Link>
              </div>
            </div>

            <div className="relative group">
              <button
                onClick={() => setIsShopCollectionOpen(!isShopCollectionOpen)}
                className="nav-link flex items-center space-x-1"
              >
                <span>SHOP BY COLLECTION</span>
                <FiChevronDown className="opacity-70" size={14} />
              </button>
              <div className="absolute left-0 mt-2 w-64 bg-[#0c0e16] text-white border border-[rgba(255,255,255,0.1)] shadow-lg z-50 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Link to="/collections/nox-collection-ss1-0" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">NOX SS1.0 COLLECTION</Link>
                <Link to="/collections/yuki-collection" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">YUKI COLLECTION</Link>
                <Link to="/collections/takeover-collection-summer-phase-ii" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">TAKEOVER SUMMER PHASE II</Link>
                <Link to="/collections/winter-2023-collection" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">WINTER 2023 COLLECTION</Link>
                <Link to="/collections/summer-collection-phase-i-1" className="block px-4 py-3 hover:bg-[#151a28] hover:text-[#c8a95a] transition-colors">SUMMER COLLECTION PHASE I</Link>
              </div>
            </div>

            <Link to="/track-order" className="nav-link">TRACK ORDER</Link>
            <Link to="/account" className="nav-link">ACCOUNT</Link>
          </nav>

          {/* Cart and search icons */}
          <div className="flex items-center space-x-5">
            <Link to="/search" className="text-white hover:text-[#c8a95a] transition-colors">
              <FiSearch size={20} />
            </Link>
            <Link to="/wishlist" className="text-white hover:text-[#c8a95a] transition-colors">
              <div className="relative">
                <FiHeart size={20} />
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">0</span>
              </div>
            </Link>
            <Link to="/cart" className="text-white hover:text-[#c8a95a] transition-colors">
              <div className="relative">
                <FiShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">0</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c0e16]">
          <div className="stars-overlay"></div>
          
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold tracking-wider gradient-text">COSMIC</span>
              <button onClick={toggleMenu} className="text-white">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="flex flex-col items-center mt-8 space-y-6">
              <Link to="/" className="nav-link text-lg" onClick={toggleMenu}>SHOP</Link>

              <div className="w-full">
                <button
                  onClick={() => setIsShopCategoryOpen(!isShopCategoryOpen)}
                  className="nav-link text-lg w-full text-center flex items-center justify-center space-x-2"
                >
                  <span>SHOP BY CATEGORY</span>
                  <FiChevronDown className={`transition-transform duration-200 ${isShopCategoryOpen ? 'rotate-180' : ''}`} />
                </button>
                {isShopCategoryOpen && (
                  <div className="mt-4 flex flex-col space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-4 mb-4">
                    <Link to="/collections/tshirt" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>T-SHIRTS</Link>
                    <Link to="/collections/sweatshirt" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>SWEATSHIRTS</Link>
                    <Link to="/collections/hoodies" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>HOODIES</Link>
                    <Link to="/collections/bottoms" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>BOTTOMS</Link>
                    <Link to="/collections/co-ord-set" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>CO-ORD SETS</Link>
                    <Link to="/collections/sleeveless-vest" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>SLEEVELESS VESTS</Link>
                  </div>
                )}
              </div>

              <div className="w-full">
                <button
                  onClick={() => setIsShopCollectionOpen(!isShopCollectionOpen)}
                  className="nav-link text-lg w-full text-center flex items-center justify-center space-x-2"
                >
                  <span>SHOP BY COLLECTION</span>
                  <FiChevronDown className={`transition-transform duration-200 ${isShopCollectionOpen ? 'rotate-180' : ''}`} />
                </button>
                {isShopCollectionOpen && (
                  <div className="mt-4 flex flex-col space-y-4 border-t border-[rgba(255,255,255,0.1)] pt-4 mb-4">
                    <Link to="/collections/nox-collection-ss1-0" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>NOX SS1.0 COLLECTION</Link>
                    <Link to="/collections/yuki-collection" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>YUKI COLLECTION</Link>
                    <Link to="/collections/takeover-collection-summer-phase-ii" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>TAKEOVER SUMMER PHASE II</Link>
                    <Link to="/collections/winter-2023-collection" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>WINTER 2023 COLLECTION</Link>
                    <Link to="/collections/summer-collection-phase-i-1" className="nav-link text-[#b8b8d0] text-center" onClick={toggleMenu}>SUMMER COLLECTION PHASE I</Link>
                  </div>
                )}
              </div>

              <Link to="/track-order" className="nav-link text-lg" onClick={toggleMenu}>TRACK ORDER</Link>
              <Link to="/account" className="nav-link text-lg" onClick={toggleMenu}>ACCOUNT</Link>
              
              <div className="flex items-center space-x-6 mt-8 pt-6 border-t border-[rgba(255,255,255,0.1)] w-full justify-center">
                <Link to="/search" className="text-white hover:text-[#c8a95a]" onClick={toggleMenu}>
                  <FiSearch size={20} />
                </Link>
                <Link to="/wishlist" className="text-white hover:text-[#c8a95a]" onClick={toggleMenu}>
                  <div className="relative">
                    <FiHeart size={20} />
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">0</span>
                  </div>
                </Link>
                <Link to="/cart" className="text-white hover:text-[#c8a95a]" onClick={toggleMenu}>
                  <div className="relative">
                    <FiShoppingCart size={20} />
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 bg-[#c8a95a] text-[#0c0e16] text-xs rounded-full font-semibold">0</span>
                  </div>
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