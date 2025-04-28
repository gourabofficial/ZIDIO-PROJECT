import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package as PackageIcon, 
  ShoppingCart, 
  BarChart2, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Bell,
  User,
  ChevronRight,
  ChevronDown,
  Shield
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [mobileView, setMobileView] = useState(window.innerWidth < 768);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const mainContentRef = useRef(null);
  const userMenuRef = useRef(null);
  
  // Current date/time and login info
  const currentDateTime = "2025-04-25 21:23:25";
  const currentUser = "gourabofficial";
  
  // Handle click outside user menu to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setMobileView(isMobile);
      
      // On desktop, always show sidebar
      if (!isMobile) {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
    { name: 'Products', href: '/admin/products', icon: <PackageIcon size={20} /> },
    { name: 'Orders', href: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
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
      
      const navItem = navigation.find(item => item.href === currentPath);
      const name = navItem ? navItem.name : path.charAt(0).toUpperCase() + path.slice(1);
      
      breadcrumbs.push({ name, href: currentPath });
    });
    
    return breadcrumbs;
  };

  const getCurrentPageTitle = () => {
    const path = location.pathname;
    const navItem = navigation.find(item => item.href === path || (item.href !== '/admin' && path.startsWith(item.href)));
    return navItem ? navItem.name : 'Dashboard';
  };

  const handleWheelScroll = (e) => {
    if (mainContentRef.current) {
      const scrollAmount = e.deltaY;
      const currentScroll = mainContentRef.current.scrollTop;
      
      mainContentRef.current.scrollTo({
        top: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`flex h-screen bg-gray-900 overflow-hidden`}>
      {/* Sidebar - Only shown on desktop (md and up) */}
      {!mobileView && (
        <div 
          className={`bg-gray-800 text-white h-full z-30 transition-all duration-300 shadow-lg ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className={`flex justify-between items-center p-4 h-16 border-b border-gray-700`}>
            <div className={`font-bold text-xl flex items-center ${!sidebarOpen && 'hidden'}`}>
              <Shield className="text-blue-400 mr-2" size={24} />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">ADMIN PANEL</span>
            </div>
            <button 
              onClick={toggleSidebar} 
              className={`p-2 rounded-full hover:bg-gray-700 focus:outline-none`}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="mt-6 px-2">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center py-3 px-4 rounded-lg ${
                      isCurrentPath(item.href)
                        ? 'bg-blue-600 text-white font-medium' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} text-lg`}>{item.icon}</span>
                    <span className={!sidebarOpen ? 'hidden' : ''}>
                      {item.name}
                    </span>
                    {isCurrentPath(item.href) && sidebarOpen && (
                      <ChevronRight className="ml-auto" size={18} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
            <button className={`flex items-center justify-center md:justify-start w-full py-2 px-4 rounded-lg text-red-400 hover:bg-gray-700`}>
              <LogOut className={sidebarOpen ? 'mr-3' : 'mx-auto'} size={20} />
              <span className={!sidebarOpen ? 'hidden' : ''}>Logout</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navbar - Always visible */}
        <header className={`bg-gray-800 shadow-md h-16 flex items-center justify-between px-4 text-white`}>
          <div className="flex items-center">
            {/* On mobile, show page title only */}
            {mobileView ? (
              <h1 className="text-lg font-medium">{getCurrentPageTitle()}</h1>
            ) : (
              <>
                {/* On desktop, show breadcrumbs */}
                <div className="flex items-center text-sm">
                  {getBreadcrumbs().map((crumb, index, array) => (
                    <div key={crumb.href} className="flex items-center">
                      {index > 0 && <span className="mx-2 text-gray-500">/</span>}
                      {index === array.length - 1 ? (
                        <span className={`font-medium text-blue-400`}>{crumb.name}</span>
                      ) : (
                        <Link to={crumb.href} className={`hover:text-blue-400`}>{crumb.name}</Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Current Date - Desktop Only */}
            <span className="hidden md:block text-sm text-gray-400">{currentDateTime}</span>
            
            {/* Notification Bell */}
            <button className={`p-2 rounded-full hover:bg-gray-700 focus:outline-none relative`}
                   aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={toggleUserMenu}
                className={`flex items-center focus:outline-none hover:bg-gray-700 p-2 rounded-full`}
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                <User className="h-6 w-6 text-blue-400" />
                <span className="ml-2 font-medium hidden md:block">{currentUser}</span>
                <ChevronDown className="ml-1 text-xs hidden md:block" size={16} />
              </button>
              
              {userMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50`}
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className={`px-4 py-2 text-sm border-b border-gray-700 text-gray-300`}>
                      <p className="font-medium">{currentUser}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <Link to="/admin/settings" className={`block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700`}>
                      Your Profile
                    </Link>
                    <Link to="/admin/settings" className={`block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700`}>
                      Settings
                    </Link>
                    <div className={`border-t border-gray-700`}>
                      <button className={`block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700`}>
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main 
          ref={mainContentRef}
          onWheel={handleWheelScroll}
          className={`flex-1 overflow-y-auto p-4 md:p-6 bg-gray-900 text-white scroll-smooth`}
        >
          <div className="p-1">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-900 rounded-lg p-4 mb-4 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{getCurrentPageTitle()}</h1>
                  <p className="text-blue-200 text-sm">
                    Current Date: {currentDateTime} | Last login: {currentUser}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="bg-white text-blue-800 px-4 py-2 rounded-lg shadow-md hover:bg-blue-50 text-sm font-medium">
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
            
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
          <footer className={`py-3 px-6 text-center bg-gray-800 text-gray-400 border-t border-gray-700 text-sm`}>
            <p>© 2025 Admin Dashboard. All rights reserved. Current user: {currentUser}</p>
          </footer>
      </div>
    </div>
  );
};

export default AdminLayout;