import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ChevronRight,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import axiosInstance from '../../Api/config';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
    userGrowth: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch dashboard stats
        const statsResponse = await axiosInstance.get('/admin/dashboard/stats');
        
        if (statsResponse.data.success) {
          setStats(statsResponse.data.stats);
        } else {
          throw new Error(statsResponse.data.message || 'Failed to fetch dashboard stats');
        }
        
        // Fetch recent orders
        const ordersResponse = await axiosInstance.get('/orders', { 
          params: { limit: 5, page: 1, sort: '-createdAt' } 
        });
        
        if (ordersResponse.data.success) {
          setRecentOrders(ordersResponse.data.orders || []);
        }
        
        // Fetch top selling products
        const productsResponse = await axiosInstance.get('/product/bestsellers', { 
          params: { limit: 5 } 
        });
        
        if (productsResponse.data.success) {
          setTopProducts(productsResponse.data.products || []);
        }
        
        // Fetch recent activities
        const activitiesResponse = await axiosInstance.get('/admin/activities', {
          params: { limit: 5 }
        });
        
        if (activitiesResponse.data.success) {
          setRecentActivities(activitiesResponse.data.activities || []);
        }
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format currency in INR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const secondsAgo = Math.floor((now - date) / 1000);
    
    if (secondsAgo < 60) return 'Just now';
    
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
    
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
    
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${monthsAgo} ${monthsAgo === 1 ? 'month' : 'months'} ago`;
  };
  
  // Get appropriate status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-900 text-yellow-300';
      case 'processing': return 'bg-blue-900 text-blue-300';
      case 'shipped': return 'bg-purple-900 text-purple-300';
      case 'delivered': return 'bg-green-900 text-green-300';
      case 'cancelled': return 'bg-red-900 text-red-300';
      default: return 'bg-gray-900 text-gray-300';
    }
  };
  
  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch(type) {
      case 'product':
        return <Package size={16} className="text-blue-400" />;
      case 'user':
        return <Users size={16} className="text-green-400" />;
      case 'order':
        return <ShoppingCart size={16} className="text-purple-400" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };
  
  // Get activity background color based on type
  const getActivityBgColor = (type) => {
    switch(type) {
      case 'product':
        return 'bg-blue-900';
      case 'user':
        return 'bg-green-900';
      case 'order':
        return 'bg-purple-900';
      default:
        return 'bg-gray-900';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome to your admin dashboard</p>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-6 flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      )}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Orders */}
        <div className="bg-gray-800 rounded-lg p-5 shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <RefreshCw className="animate-spin text-blue-500" size={24} />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.totalOrders}</h3>
                </div>
                <div className="bg-blue-900 p-3 rounded-lg text-blue-400">
                  <ShoppingCart size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stats.orderGrowth > 0 ? (
                  <div className="flex items-center text-green-400 text-sm">
                    <ArrowUp size={16} className="mr-1" />
                    <span>{stats.orderGrowth}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-400 text-sm">
                    <ArrowDown size={16} className="mr-1" />
                    <span>{Math.abs(stats.orderGrowth)}%</span>
                  </div>
                )}
                <span className="text-gray-500 text-sm ml-2">vs last month</span>
              </div>
            </>
          )}
        </div>
        
        {/* Revenue */}
        <div className="bg-gray-800 rounded-lg p-5 shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <RefreshCw className="animate-spin text-blue-500" size={24} />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {formatCurrency(stats.totalRevenue)}
                  </h3>
                </div>
                <div className="bg-green-900 p-3 rounded-lg text-green-400">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stats.revenueGrowth > 0 ? (
                  <div className="flex items-center text-green-400 text-sm">
                    <ArrowUp size={16} className="mr-1" />
                    <span>{stats.revenueGrowth}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-400 text-sm">
                    <ArrowDown size={16} className="mr-1" />
                    <span>{Math.abs(stats.revenueGrowth)}%</span>
                  </div>
                )}
                <span className="text-gray-500 text-sm ml-2">vs last month</span>
              </div>
            </>
          )}
        </div>
        
        {/* Users */}
        <div className="bg-gray-800 rounded-lg p-5 shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <RefreshCw className="animate-spin text-blue-500" size={24} />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</h3>
                </div>
                <div className="bg-purple-900 p-3 rounded-lg text-purple-400">
                  <Users size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stats.userGrowth > 0 ? (
                  <div className="flex items-center text-green-400 text-sm">
                    <ArrowUp size={16} className="mr-1" />
                    <span>{stats.userGrowth}%</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-400 text-sm">
                    <ArrowDown size={16} className="mr-1" />
                    <span>{Math.abs(stats.userGrowth)}%</span>
                  </div>
                )}
                <span className="text-gray-500 text-sm ml-2">vs last month</span>
              </div>
            </>
          )}
        </div>
        
        {/* Products */}
        <div className="bg-gray-800 rounded-lg p-5 shadow-lg">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <RefreshCw className="animate-spin text-blue-500" size={24} />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm">Total Products</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stats.totalProducts}</h3>
                </div>
                <div className="bg-yellow-900 p-3 rounded-lg text-yellow-400">
                  <Package size={20} />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/products-list" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                  View all products
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Orders */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="p-5 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
              <Link to="/admin/all-orders" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                View All
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="animate-spin text-blue-500" size={30} />
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-gray-500">
                No recent orders found
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-700">
                      <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-white">
                        #{order.orderNumber || order._id.substring(0, 6)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">
                        {order.user.name}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        {/* Top Selling Products */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="p-5 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Top Selling Products</h3>
              <Link to="/admin/products-list" className="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                View All
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="animate-spin text-blue-500" size={30} />
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No product data available
            </div>
          ) : (
            <div className="overflow-hidden">
              {topProducts.map((product, index) => (
                <div 
                  key={product._id}
                  className="flex items-center p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700"
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-white">{product.name}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-400 capitalize">{product.category}</span>
                      <span className="mx-2 text-gray-600">•</span>
                      <span className="text-sm text-green-400">{formatCurrency(product.price)}</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-medium text-white">{product.totalSold} sold</div>
                    <div className="text-xs text-gray-400 mt-1">
                      <TrendingUp size={14} className="inline mr-1 text-green-400" />
                      Top performer
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <RefreshCw className="animate-spin text-blue-500" size={30} />
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-500">
            No recent activities found
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity._id} className="flex items-start">
                <div className={`flex-shrink-0 ${getActivityBgColor(activity.type)} rounded-full p-2`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-3">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-gray-400 mt-1 flex items-center">
                    <Clock size={14} className="mr-1" />
                    {formatTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;