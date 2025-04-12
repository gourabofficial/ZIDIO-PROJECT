import { useState, useEffect } from 'react';
import HeaderLogo from './HeaderLogo';
import DesktopNav from './DesktopNav';
import MobileNav from './ModileNav';
import HeaderActions from './HeaderAction';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

          {/* Logo */}
          <HeaderLogo />
          
          {/* Desktop navigation */}
          <DesktopNav />

          {/* Header Actions (cart, search, etc.) */}
          <HeaderActions />
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileNav isOpen={isMenuOpen} onClose={toggleMenu} />
    </header>
  );
};

export default Header;