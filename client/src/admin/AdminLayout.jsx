import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBoxes, 
  FaShoppingCart, 
  FaChartLine, 
  FaCog, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaBell,
  FaUserCircle,
  FaAngleRight,
  FaChevronDown,
  FaMoon,
  FaSun
} from 'react-icons/fa';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const location = useLocation();
  const mainContentRef = useRef(null);
  
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobileView(isMobile);
      
      // Auto close sidebar on mobile view
      if (isMobile && sidebarOpen) {
        setSidebarOpen(false);
      } else if (!isMobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: <FaTachometerAlt /> },
    { name: 'Users', href: '/admin/users', icon: <FaUsers /> },
    { name: 'Products', href: '/admin/products', icon: <FaBoxes /> },
    { name: 'Orders', href: '/admin/orders', icon: <FaShoppingCart /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <FaChartLine /> },
    { name: 'Settings', href: '/admin/settings', icon: <FaCog /> },
  ];

  const isCurrentPath = (path) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    let breadcrumbs = [
      { name: 'Admin', href: '/admin' }
    ];
    
    let currentPath = '';
    paths.forEach((path, index) => {
      if (index === 0 && path.toLowerCase() === 'admin') return;
      
      currentPath += `/${path}`;
      
      // Find matching navigation item or create a default one
      const navItem = navigation.find(item => item.href === currentPath);
      const name = navItem ? navItem.name : path.charAt(0).toUpperCase() + path.slice(1);
      
      breadcrumbs.push({ name, href: currentPath });
    });
    
    return breadcrumbs;
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    const navItem = navigation.find(item => item.href === path || (item.href !== '/admin' && path.startsWith(item.href)));
    return navItem ? navItem.name : 'Dashboard';
  };

  // Add smooth scroll function
  const handleWheelScroll = (e) => {
    if (mainContentRef.current) {
      // Prevent default only if needed for custom behavior
      // e.preventDefault();
      
      const scrollAmount = e.deltaY;
      const currentScroll = mainContentRef.current.scrollTop;
      
      // For smooth scrolling, use behavior: 'smooth'
      mainContentRef.current.scrollTo({
        top: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-200 overflow-hidden`}>
      {/* Mobile overlay */}
      {mobileView && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <div 
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} text-${darkMode ? 'white' : 'gray-800'} fixed h-full z-30 md:relative transition-all duration-300 shadow-lg ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-20'
        } ${mobileView && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        <div className={`flex justify-between items-center p-4 h-16 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`font-bold text-xl ${!sidebarOpen && 'md:hidden'}`}>
            {sidebarOpen ? (
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">ADMIN PANEL</span>
            ) : ''}
          </div>
          <button 
            onClick={toggleSidebar} 
            className={`p-2 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} focus:outline-none transition-colors duration-200`}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className="mt-6">
          <ul className="space-y-1 px-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
                    isCurrentPath(item.href)
                      ? darkMode 
                        ? 'bg-blue-600 text-white font-medium' 
                        : 'bg-blue-100 text-blue-700 font-medium'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} text-lg`}>{item.icon}</span>
                  <span className={!sidebarOpen ? 'hidden' : 'transition-opacity duration-200'}>
                    {item.name}
                  </span>
                  {isCurrentPath(item.href) && sidebarOpen && (
                    <FaAngleRight className="ml-auto" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button 
            onClick={toggleDarkMode}
            className={`flex items-center justify-center md:justify-start mb-4 w-full py-2 px-4 rounded-lg ${
              darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'
            } transition-colors duration-200`}
          >
            {darkMode ? <FaSun className={sidebarOpen ? 'mr-3' : 'mx-auto'} /> : <FaMoon className={sidebarOpen ? 'mr-3' : 'mx-auto'} />}
            <span className={!sidebarOpen ? 'hidden' : ''}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>
          
          <button className={`flex items-center justify-center md:justify-start w-full py-2 px-4 rounded-lg text-red-400 hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} transition-colors duration-200`}>
            <FaSignOutAlt className={sidebarOpen ? 'mr-3' : 'mx-auto'} />
            <span className={!sidebarOpen ? 'hidden' : ''}>Logout</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar */}
        <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md h-16 flex items-center justify-between px-4 ${darkMode ? 'text-white' : 'text-gray-800'} transition-colors duration-200`}>
          <div className="flex items-center">
            <button 
              className="md:hidden focus:outline-none mr-3"
              onClick={toggleSidebar}
            >
              <FaBars />
            </button>
            
            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center text-sm">
              {getBreadcrumbs().map((crumb, index, array) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-gray-500">/</span>}
                  {index === array.length - 1 ? (
                    <span className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{crumb.name}</span>
                  ) : (
                    <Link to={crumb.href} className={`hover:${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{crumb.name}</Link>
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile Page Title */}
            <h1 className="md:hidden text-lg font-medium">{getCurrentPageTitle()}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Bar - REMOVED */}
            
            {/* Notification Bell */}
            <button className={`p-2 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} focus:outline-none transition-colors duration-200 relative`}>
              <FaBell />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className={`flex items-center focus:outline-none hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} p-2 rounded-full transition-colors duration-200`}
              >
                <FaUserCircle className="h-6 w-6 text-blue-400" />
                <span className="ml-2 font-medium hidden md:block">gourabofficial</span>
                <FaChevronDown className="ml-1 text-xs hidden md:block" />
              </button>
              
              {/* Dropdown menu */}
              {userMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  } ring-1 ring-black ring-opacity-5 z-50`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className={`px-4 py-2 text-sm border-b ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}>
                      <p className="font-medium">gourabofficial</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <Link to="/admin/profile" className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      Your Profile
                    </Link>
                    <Link to="/admin/settings" className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      Settings
                    </Link>
                    <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <button className={`block w-full text-left px-4 py-2 text-sm text-red-400 hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area - Modified with ref and wheel event handler */}
        <main 
          ref={mainContentRef}
          onWheel={handleWheelScroll}
          className={`flex-1 overflow-y-auto p-4 md:p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} transition-colors duration-200 scroll-smooth`}
        >
          <div className="p-1">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-lg p-4 mb-4 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{getCurrentPageTitle()}</h1>
                  <p className="text-blue-200 text-sm">
                    Current Date: {new Date().toISOString().slice(0, 10)} | Last login: 2025-04-25 08:42:33
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="bg-white text-blue-800 px-4 py-2 rounded-lg shadow-md hover:bg-blue-50 transition-colors duration-200 text-sm font-medium">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
            
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className={`py-3 px-6 text-center ${darkMode ? 'bg-gray-800 text-gray-400 border-t border-gray-700' : 'bg-white text-gray-600 border-t border-gray-200'} text-sm`}>
          <p>© 2025 Admin Dashboard. All rights reserved. Current user: gourabofficial</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;