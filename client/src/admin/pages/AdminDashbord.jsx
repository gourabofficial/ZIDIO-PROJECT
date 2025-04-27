import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Settings,
  LayoutDashboard,
  Search,
  Shield,
  CheckCircle,
  Clock,
  User,
  Bell,
  TrendingUp
} from 'lucide-react';

// Updated global styles to properly handle scrolling
const globalStyles = `
  body, html {
    background-color: #111827;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: #1f2937;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoVisible, setLogoVisible] = useState(true);

  // Current date/time and user info
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());
  const currentUser = "gourabofficial";
  
  // Apply global styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const toggleLogo = () => {
    setLogoVisible(prev => !prev);
  };

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Temporary mock data for testing
      setTimeout(() => {
        setStats({
          totalUsers: 1234,
          totalOrders: 567,
          totalProducts: 89,
          totalRevenue: 123456
        });
        
        setRecentOrders([
          { id: '1', customer: 'John Doe', product: 'Smartphone', amount: 799, status: 'Delivered', date: '2025-04-23' },
          { id: '2', customer: 'Jane Smith', product: 'Laptop', amount: 1299, status: 'Processing', date: '2025-04-24' },
          { id: '3', customer: 'Bob Johnson', product: 'Headphones', amount: 199, status: 'Shipped', date: '2025-04-24' },
        ]);
        
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to load dashboard data');
      setIsLoading(false);
      console.error('Dashboard data fetch error:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, bgColor }) => (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center p-6">
        <div className={`flex items-center justify-center p-3 rounded-full mr-4 ${bgColor}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-gray-400 text-sm">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
      <div className={`${bgColor} bg-opacity-20 px-6 py-2 border-t border-gray-700 flex justify-between items-center`}>
        <span className="text-xs text-gray-300 flex items-center">
          <TrendingUp size={14} className="mr-1 text-green-400" /> 12% Increase
        </span>
        <span className="text-xs text-gray-300">Last 30 days</span>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'text-green-400';
      case 'Processing': return 'text-blue-400';
      case 'Shipped': return 'text-purple-400';
      case 'Pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Delivered': return <CheckCircle size={14} className="mr-1" />;
      case 'Processing': return <RefreshCw size={14} className="mr-1" />;
      case 'Shipped': return <ShoppingCart size={14} className="mr-1" />;
      case 'Pending': return <Clock size={14} className="mr-1" />;
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gray-900 text-white fixed top-0 left-0 right-0 bottom-0 z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gray-900 fixed top-0 left-0 right-0 bottom-0 z-50">
        <div className="bg-gray-800 border border-red-500 text-red-400 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
          <button 
            className="mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={fetchDashboardData}
          >
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const ordersToDisplay = Array.isArray(recentOrders) ? recentOrders : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col overflow-x-hidden">
      {/* Mobile header - simplified without menu button */}
      <div className="md:hidden bg-gray-800 shadow-md flex items-center justify-between p-4 sticky top-0 z-30">
        <div className="flex items-center">
          <Shield className="text-blue-400 mr-2" size={20} />
          <h1 className="text-lg font-medium text-white">Admin Dashboard</h1>
        </div>
        
        {/* Notification icon */}
        <div className="relative">
          <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 flex-grow bg-gray-900 overflow-y-auto">
        <h1 className="hidden md:block text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers.toLocaleString()} 
            icon={<Users className="text-white" size={20} />} 
            bgColor="bg-blue-600"
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders.toLocaleString()} 
            icon={<ShoppingCart className="text-white" size={20} />} 
            bgColor="bg-green-600"
          />
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts.toLocaleString()} 
            icon={<Package className="text-white" size={20} />} 
            bgColor="bg-purple-600"
          />
          <StatCard 
            title="Total Revenue" 
            value={`$${stats.totalRevenue?.toLocaleString() || 0}`} 
            icon={<DollarSign className="text-white" size={20} />} 
            bgColor="bg-yellow-600"
          />
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-700">
            <div className="flex flex-wrap items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                <ShoppingCart className="mr-2" size={20} />
                Recent Orders
              </h2>
              
              <div className="hidden md:flex items-center mt-2 sm:mt-0 bg-gray-700 rounded-md p-2">
                <Search size={18} className="text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="bg-transparent border-none text-sm text-white focus:outline-none placeholder-gray-400"
                />
              </div>
            </div>
          </div>
          
          {ordersToDisplay.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-750">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {ordersToDisplay.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-750 transition-colors duration-150">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">#{order.id}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customer}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.product}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">${order.amount}</td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`${getStatusColor(order.status)} font-medium flex items-center`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">No recent orders found</div>
          )}
          
          <div className="mt-3 md:hidden p-4 space-y-3">
            {ordersToDisplay.map((order) => (
              <div key={order.id} className="bg-gray-750 rounded-lg p-3 border border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-200">#{order.id}</span>
                  <span className={`${getStatusColor(order.status)} font-medium text-sm flex items-center`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between py-1 border-b border-gray-700">
                    <span className="text-xs text-gray-400">Customer</span>
                    <span className="text-xs text-white">{order.customer}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-700">
                    <span className="text-xs text-gray-400">Product</span>
                    <span className="text-xs text-white">{order.product}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-700">
                    <span className="text-xs text-gray-400">Amount</span>
                    <span className="text-xs text-white">${order.amount}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-xs text-gray-400">Date</span>
                    <span className="text-xs text-white">{order.date}</span>
                  </div>
                </div>
                <button className="mt-2 w-full bg-gray-700 hover:bg-gray-650 text-gray-300 text-xs font-medium py-1.5 rounded flex items-center justify-center">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 md:hidden">
          <h2 className="text-lg font-semibold mb-3 text-white flex items-center">
            <Settings className="mr-2" size={18} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm flex flex-col items-center">
              <Users size={20} className="mb-2" />
              <span>Manage Users</span>
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-sm flex flex-col items-center">
              <Package size={20} className="mb-2" />
              <span>Add Products</span>
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg text-sm flex flex-col items-center">
              <ShoppingCart size={20} className="mb-2" />
              <span>Orders</span>
            </button>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 rounded-lg text-sm flex flex-col items-center">
              <Settings size={20} className="mb-2" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* <footer className="bg-gray-800 border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        <p>© 2025 Admin Dashboard. Current user: {currentUser}</p>
      </footer> */}
    </div>
  );
};

export default AdminDashboard;