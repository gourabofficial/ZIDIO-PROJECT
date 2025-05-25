import { useState, useEffect, useRef } from "react";
import MobileNav from "./ModileNav";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiChevronDown,
  FiSettings,
  FiPackage,
  FiLogOut,
} from "react-icons/fi";
import { categoryItems, collectionItems } from "../../constant/constant";
import { useClerk } from "@clerk/clerk-react";
import { useAuthdata } from "../../context/AuthContext";

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
  const { currentUser, isAuth, isLoaded, error } = useAuthdata();

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

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0c0e16]/90 backdrop-blur-md shadow-lg shadow-purple-900/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4 px-4 md:px-6">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white transition-all hover:text-indigo-400 hover:scale-110 p-2 -ml-2 duration-300"
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
                <span className="text-xl md:text-2xl font-bold tracking-wider cosmic-gradient">
                  COSMIC
                </span>
                <span className="text-xl md:text-2xl font-bold tracking-wider ml-2 heroes-gradient">
                  HEROS
                </span>
                <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a95a] to-transparent"></div>
              </div>
            </Link>

            {/* Category and Collection dropdowns - visible only on desktop */}
            <div className="hidden md:flex items-center space-x-5">
              {/* Category Dropdown */}
              <div
                ref={categoryRef}
                className="relative"
                onMouseEnter={() => handleMouseEnter("category")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => toggleDropdown("category")}
                  className="text-white hover:text-indigo-400 transition-colors duration-300 p-2 flex items-center space-x-1 relative group"
                  aria-expanded={openDropdown === "category"}
                  aria-controls="category-dropdown"
                >
                  <span>SHOP BY CATEGORY</span>
                  <FiChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openDropdown === "category" ? "rotate-180" : ""
                    }`}
                  />
                  <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500 transition-all duration-300"></span>
                </button>

                {openDropdown === "category" && (
                  <div
                    className="absolute left-0 mt-2 w-64 bg-[#0c0e16]/90 backdrop-blur-md shadow-lg shadow-purple-900/20 rounded-md py-2 z-50 border border-purple-900/30
                    transition-all duration-200 animate-fadeIn"
                  >
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 pointer-events-none"></div>

                    {categoryItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-white hover:bg-indigo-900/30 hover:text-indigo-300 transition-all duration-200 
                        hover:pl-6 relative overflow-hidden group"
                        onClick={() => {
                          setOpenDropdown(null);
                          if (window.location.pathname.includes("/category/")) {
                            const currentPath = window.location.pathname;
                            if (currentPath !== item.path) {
                              window.location.href = item.path;
                            }
                          }
                        }}
                      >
                        <span className="relative z-10">{item.label}</span>
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200 group-hover:w-full"></span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Collection Dropdown */}
              <div
                ref={collectionRef}
                className="relative"
                onMouseEnter={() => handleMouseEnter("collection")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => toggleDropdown("collection")}
                  className="text-white hover:text-indigo-400 transition-colors duration-300 p-2 flex items-center space-x-1 relative group"
                  aria-expanded={openDropdown === "collection"}
                >
                  <span>SHOP BY COLLECTION</span>
                  <FiChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      openDropdown === "collection" ? "rotate-180" : ""
                    }`}
                  />
                  <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500 transition-all duration-300"></span>
                </button>

                {openDropdown === "collection" && (
                  <div
                    className="absolute left-0 mt-2 w-80 bg-[#0c0e16]/90 backdrop-blur-md shadow-lg shadow-purple-900/20 rounded-md py-2 z-50 border border-purple-900/30
                    transition-all duration-200 animate-fadeIn"
                  >
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 pointer-events-none"></div>

                    {collectionItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-white hover:bg-indigo-900/30 hover:text-indigo-300 transition-all duration-200
                        hover:pl-6 relative overflow-hidden group"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span className="relative z-10">{item.label}</span>
                        <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200 group-hover:w-full"></span>
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
              className="text-white hover:text-indigo-400 transition-all duration-300 p-2 group"
              aria-label="Search"
            >
              <div className="w-5 h-5 flex items-center justify-center relative">
                <FiSearch
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-colors duration-300"></span>
              </div>
            </Link>

            {/* For the wishlist badge */}
            <Link
              to="/wishlist"
              className="text-white hover:text-indigo-400 transition-all duration-300 p-2 hidden md:block group"
              aria-label="Wishlist"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <FiHeart
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-colors duration-300"></span>
                {isLoaded && currentUser?.wishlist?.length > 0 && (
                  <div className="absolute -top-2 -right-2 min-w-[16px] h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center px-1 shadow-sm shadow-purple-500/30">
                    <span className="text-[10px] font-bold text-white">
                      {currentUser.wishlist.length > 99
                        ? "99+"
                        : currentUser.wishlist.length}
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* For the cart badge */}
            <Link
              to="/cart"
              className="text-white hover:text-indigo-400 transition-all duration-300 p-2 group"
              aria-label="Cart"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <FiShoppingCart
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                <span className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-colors duration-300"></span>
                {isLoaded && currentUser?.cartData?.items?.length > 0 && (
                  <div className="absolute -top-2 -right-2 min-w-[16px] h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center px-1 shadow-sm shadow-purple-500/30">
                    <span className="text-[10px] font-bold text-white">
                      {currentUser.cartData.items.length > 99
                        ? "99+"
                        : currentUser.cartData.items.length}
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {!isLoaded ? (
              <div className="w-5 h-5 rounded-full bg-indigo-700/50 animate-pulse"></div>
            ) : isAuth && currentUser ? (
              <div className="hidden md:block relative" ref={profileRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 text-white hover:text-indigo-400 transition-all duration-200 p-2 group rounded-lg hover:bg-white/5"
                  aria-label="Profile"
                >
                  <div className="relative">
                    {currentUser.imageUrl || currentUser.avatar ? (
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 p-[1px] group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-200 shadow-lg shadow-purple-500/20">
                        <div className="w-full h-full rounded-full overflow-hidden bg-[#0c0e16]">
                          <img
                            src={currentUser.imageUrl || currentUser.avatar}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 p-[1px] group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-200 shadow-lg shadow-purple-500/20">
                        <div className="w-full h-full rounded-full overflow-hidden bg-[#0c0e16]">
                          <img
                            src="https://img.freepik.com/premium-vector/influencer-icon-vector-image-can-be-used-digital-nomad_120816-263441.jpg?ga=GA1.1.987127041.1747852951&semt=ais_hybrid&w=740"
                            alt="Default Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 blur transition-all duration-200 opacity-0 group-hover:opacity-100"></div>
                  </div>

                  {/* <div className="hidden lg:block">
                    <span className="text-sm font-medium">
                      {currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'User'}
                    </span>
                  </div> */}

                  <FiChevronDown
                    size={14}
                    className={`transition-all duration-200 ${
                      isProfileOpen ? "rotate-180 text-indigo-400" : ""
                    }`}
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-1 w-64 bg-black/90 backdrop-blur-xl shadow-2xl shadow-purple-900/30 rounded-xl py-3 z-50 border border-purple-500/20 animate-slideDown">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-600/5 via-purple-600/3 to-pink-600/5 pointer-events-none"></div>

                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-purple-500/20 relative">
                      <div className="flex items-center space-x-3">
                        {currentUser.imageUrl || currentUser.avatar ? (
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 p-[1px] shadow-lg shadow-purple-500/30">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black">
                              <img
                                src={currentUser.imageUrl || currentUser.avatar}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 p-[1px] shadow-lg shadow-purple-500/30">
                            <div className="w-full h-full rounded-full overflow-hidden bg-black">
                              <img
                                src="https://img.freepik.com/premium-vector/influencer-icon-vector-image-can-be-used-digital-nomad_120816-263441.jpg?ga=GA1.1.987127041.1747852951&semt=ais_hybrid&w=740"
                                alt="Default Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-semibold text-sm truncate">
                            {currentUser.fullName || "User"}
                          </p>
                          <p className="text-gray-400 text-xs truncate max-w-[150px]">
                            {currentUser.email}
                          </p>
                          {currentUser.role === "admin" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30 mt-1">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2 space-y-1">
                      <Link
                        to="/account"
                        className="flex items-center px-4 py-3 text-sm text-white hover:bg-white/5 hover:text-indigo-300 transition-all duration-150 group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiUser className="mr-3 text-indigo-400" size={16} />
                        <span className="font-medium">My Account</span>
                      </Link>

                      {/* Show admin link if user has admin role */}
                      {currentUser.role === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-3 text-sm text-white hover:bg-white/5 hover:text-orange-300 transition-all duration-150 group"
                          onClick={() => setIsProfileOpen(false)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiSettings className="mr-3 text-orange-400" size={16} />
                          <span className="font-medium">Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-3 text-sm text-white hover:bg-white/5 hover:text-purple-300 transition-all duration-150 group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiPackage className="mr-3 text-purple-400" size={16} />
                        <span className="font-medium">My Orders</span>
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-3 text-sm text-white hover:bg-white/5 hover:text-indigo-300 transition-all duration-150 group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiSettings className="mr-3 text-indigo-400" size={16} />
                        <span className="font-medium">Settings</span>
                      </Link>

                      <div className="my-2 mx-4 border-t border-purple-500/20"></div>

                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5 hover:text-red-300 transition-all duration-150 group"
                      >
                        <FiLogOut className="mr-3 text-red-400" size={16} />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="text-white hover:text-indigo-400 transition-all duration-300 p-2 hidden md:block group"
                aria-label="Sign In"
              >
                <div className="w-5 h-5 flex items-center justify-center relative">
                  <FiUser
                    size={20}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="absolute inset-0 rounded-full bg-indigo-500/0 group-hover:bg-indigo-500/20 transition-colors duration-300"></span>
                </div>
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

      {/* Animation styles */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.1s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default Header;
