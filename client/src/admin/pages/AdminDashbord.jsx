import React, { useState, useEffect } from 'react';

import { 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  AlertCircle,
  RefreshCw
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
    overflow-y:auto;
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
  
  // Removed mobileMenuOpen state as it was for the navbar

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
      {/* Navbar removed */}
      
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