import React, { useState, useEffect } from 'react';

import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  AlertCircle,
  RefreshCw,
  Bell,
  LogOut,
  Menu,
  X,
  User,
  Search
} from 'lucide-react';

// Updated global styles to properly handle scrolling
const globalStyles = `
  body, html {
    background-color: #111827; /* bg-gray-900 */
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
`;

const AdminDashbord = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply global styles
  useEffect(() => {
    // Insert global styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);
    
    // Cleanup
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Temporary mock data for testing
      // Remove this and uncomment the API calls when your backend is ready
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
      
      // Comment out or remove these API calls until your backend is ready
      /*
      // Fetch stats data
      const statsResponse = await axios.get('/api/admin/stats');
      setStats(statsResponse.data);
      
      // Fetch recent orders - ensure it's an array
      const ordersResponse = await axios.get('/api/admin/orders/recent');
      setRecentOrders(Array.isArray(ordersResponse.data) ? ordersResponse.data : []);
      
      setIsLoading(false);
      */
    } catch (err) {
      setError('Failed to load dashboard data');
      setIsLoading(false);
      console.error('Dashboard data fetch error:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color, bgColor }) => (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
      <div className={`p-3 rounded-full mr-4 ${bgColor}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
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

  // Admin Navbar Component
  const AdminNavbar = () => (
    <div className="bg-black shadow-md sticky top-0 z-10">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Toggle */}
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="ml-4 md:ml-0">
              <span className="text-white font-bold text-xl">Admin Panel</span>
            </div>
          </div>
          
          {/* Search */}
          <div className="hidden md:flex md:flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full">
              <div className="relative flex items-center">
                <input
                  className="bg-gray-800 block w-full text-sm text-white rounded-md py-2 pl-10 pr-3 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search..."
                  type="search"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side icons */}
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none">
              <Bell size={20} />
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="rounded-full bg-gray-700 p-1">
                  <User size={20} className="text-gray-300" />
                </div>
                <span className="ml-2 text-gray-300 text-sm hidden md:inline-block">Admin User</span>
              </div>
            </div>
            <button className="ml-4 p-1 rounded-full text-gray-300 hover:text-white focus:outline-none">
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 pt-2 bg-black">
            <div className="px-2 space-y-1">
              <div className="bg-gray-800 p-2 rounded mb-2">
                <input
                  className="bg-gray-700 block w-full text-sm text-white rounded-md py-2 pl-3 pr-3 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search..."
                  type="search"
                />
              </div>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-800">Dashboard</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Users</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Products</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Orders</a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Settings</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );

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

  // Safety check - ensure recentOrders is always an array
  const ordersToDisplay = Array.isArray(recentOrders) ? recentOrders : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col overflow-x-hidden">
      {/* Top Navbar */}
      <AdminNavbar />
      
      <div className="p-6 flex-grow bg-gray-900 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6 text-white">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<Users className="text-white" size={20} />} 
            bgColor="bg-blue-600"
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders} 
            icon={<ShoppingCart className="text-white" size={20} />} 
            bgColor="bg-green-600"
          />
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts} 
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
        
        {/* Recent Orders */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Orders</h2>
          {ordersToDisplay.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {ordersToDisplay.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${order.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`${getStatusColor(order.status)} font-medium`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400">No recent orders found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashbord;