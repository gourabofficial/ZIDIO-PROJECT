import { useState, useEffect, useRef } from 'react';
import MobileNav from './ModileNav';
import { Link } from 'react-router-dom';
import { FiHeart, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import { categoryItems, collectionItems } from '../../constant/constant';
import { ChevronDown, ChevronUp,  } from 'lucide-react';
import { useAuth, UserButton } from "@clerk/clerk-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const categoryRef = useRef(null);
  const collectionRef = useRef(null);

  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    const handleClickOutside = (event) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target) &&
        collectionRef.current &&
        !collectionRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
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
              <div ref={categoryRef} className="relative">
                <button
                  onClick={() => toggleDropdown('category')}
                  className="text-white hover:text-[#c8a95a] transition-colors p-2 flex items-center"
                  aria-expanded={openDropdown === 'category'}
                >
                  SHOP BY CATEGORY
                  <span className="ml-1">
                    {openDropdown === 'category' ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </span>
                </button>

                {openDropdown === 'category' && (
                  <div className="absolute left-0 mt-2 w-64 bg-[#0c0e16] shadow-lg rounded-md py-2 z-50 border border-gray-700">
                    {categoryItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-[#c8a95a]"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Collection Dropdown */}
              <div ref={collectionRef} className="relative">
                <button
                  onClick={() => toggleDropdown('collection')}
                  className="text-white hover:text-[#c8a95a] transition-colors p-2 flex items-center"
                  aria-expanded={openDropdown === 'collection'}
                >
                  SHOP BY COLLECTION
                  <span className="ml-1">{openDropdown === 'collection' ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}</span>
                </button>

                {openDropdown === 'collection' && (
                  <div className="absolute left-0 mt-2 w-80 bg-[#0c0e16] shadow-lg rounded-md py-2 z-50 border border-gray-700">
                    {collectionItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-800 hover:text-[#c8a95a]"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.label}
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
            {isSignedIn ? (
              <div className="hidden md:block">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonBox: "p-2",
                      userButtonAvatarBox: "w-5 h-5",
                      userButtonAvatarImage: "w-5 h-5"
                    }
                  }}
                />
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
      <MobileNav isOpen={isMenuOpen} onClose={toggleMenu} />
    </header>
  );
};

export default Header;