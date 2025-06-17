import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package as PackageIcon,
  PlusSquare, 
  List,
  UserCheck,
  ShoppingCart, 
  ClipboardList,
  Settings, 
  Menu, 
  X, 
  Home,
  ChevronRight,
  Shield,
  Warehouse
} from 'lucide-react';

const AdminSidebar = ({ sidebarOpen, toggleSidebar, location }) => {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'AddProduct', href: '/admin/add-products', icon: <PlusSquare size={20} /> },
    { name: 'AllProductList', href: '/admin/products-list', icon: <PackageIcon size={20} /> },
    { name: 'AllUser', href: '/admin/all-users', icon: <UserCheck size={20} /> },
    { name: 'AllOrder', href: '/admin/all-orders', icon: <ClipboardList size={20} /> },
    { name: 'Stock', href: '/admin/stock', icon: <Warehouse size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const isCurrentPath = (path) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <div 
      className={`bg-gray-800 text-white h-full z-30 transition-all duration-300 shadow-lg ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex justify-between items-center p-4 h-16 border-b border-gray-700">
        <div className={`font-bold text-xl flex items-center ${!sidebarOpen && 'hidden'}`}>
          <Shield className="text-blue-400 mr-2" size={24} />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">ADMIN</span>
        </div>
        <button 
          onClick={toggleSidebar} 
          className="p-2 rounded-full hover:bg-gray-700 focus:outline-none"
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
        <Link 
          to="/" 
          className={`flex items-center py-4 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 group ${
            sidebarOpen ? 'justify-start' : 'justify-center'
          }`}
          title="Home"
        >
          <Home 
            className={`text-white group-hover:scale-110 transition-transform duration-200 ${
              sidebarOpen ? 'mr-3' : 'mx-auto'
            }`}
            size={20} 
            strokeWidth={2.5}
          />
          <span className={`text-white font-medium ${!sidebarOpen ? 'hidden' : ''}`}>
            Home
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;