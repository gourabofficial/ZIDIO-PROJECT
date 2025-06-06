import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  IndianRupee, 
  TrendingUp, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  Plus,
  Eye,
  Settings,
  BarChart3,
  Clock,
  User,
  Calendar,
  MapPin,
  Activity
} from 'lucide-react';
import { getDashboardStats, getRecentUsers, getRecentOrders } from '../../Api/admin';

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
  const [recentActivities, setRecentActivities] = useState({
    recentUsers: [],
    recentOrders: []
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Import API functions
      const { getDashboardStats, getRecentUsers, getRecentOrders } = await import('../../Api/admin');
      
      // Fetch dashboard stats from the real API
      const statsResponse = await getDashboardStats();
      
      if (statsResponse.success) {
        setStats(statsResponse.stats);
      } else {
        // Fallback to mock stats if API fails
        setStats({
          totalOrders: 0,
          totalRevenue: 0,
          totalUsers: 0,
          totalProducts: 0,
          orderGrowth: 0,
          revenueGrowth: 0,
          userGrowth: 0
        });
      }

      // Fetch recent activities
      try {
        const [usersResponse, ordersResponse] = await Promise.all([
          getRecentUsers(),
          getRecentOrders()
        ]);

        setRecentActivities({
          recentUsers: usersResponse.success ? usersResponse.users : [],
          recentOrders: ordersResponse.success ? ordersResponse.orders : []
        });
      } catch (activityError) {
        console.error('Error fetching recent activities:', activityError);
        // Set empty arrays if activities fail to load
        setRecentActivities({
          recentUsers: [],
          recentOrders: []
        });
      }
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  useEffect(() => {
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

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-7xl mx-auto p-6">
        {/* Enhanced Dashboard Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Monitor your e-commerce platform performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-800 disabled:to-blue-900 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl flex items-center transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-1"
              >
                <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={18} />
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Error message with better styling */}
        {error && (
          <div className="bg-gradient-to-r from-red-900/80 to-red-800/80 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-8 flex items-center backdrop-blur-sm">
            <AlertCircle className="mr-3 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold">Error Loading Data</h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
          </div>
        )}
        
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Orders Card */}
          <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-blue-500/10 transform hover:-translate-y-2">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <RefreshCw className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform duration-300">
                    <ShoppingCart size={28} />
                  </div>
                  {stats.orderGrowth !== 0 && (
                    <div className={`flex items-center ${stats.orderGrowth > 0 ? 'text-green-400' : 'text-red-400'} text-sm font-medium`}>
                      {stats.orderGrowth > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                      <span className="ml-1">{Math.abs(stats.orderGrowth)}%</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stats.totalOrders.toLocaleString()}</h3>
                  <p className="text-gray-400 text-sm font-medium">Total Orders</p>
                  <p className="text-gray-500 text-xs mt-1">All time orders</p>
                </div>
              </>
            )}
          </div>

          {/* Revenue Card */}
          <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-500 hover:shadow-green-500/10 transform hover:-translate-y-2">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <RefreshCw className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-2xl text-green-400 group-hover:scale-110 transition-transform duration-300">
                    <IndianRupee size={28} />
                  </div>
                  {stats.revenueGrowth !== 0 && (
                    <div className={`flex items-center ${stats.revenueGrowth > 0 ? 'text-green-400' : 'text-red-400'} text-sm font-medium`}>
                      {stats.revenueGrowth > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                      <span className="ml-1">{Math.abs(stats.revenueGrowth)}%</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{formatCurrency(stats.totalRevenue)}</h3>
                  <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                  <p className="text-gray-500 text-xs mt-1">All time earnings</p>
                </div>
              </>
            )}
          </div>

          {/* Users Card */}
          <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-purple-500/10 transform hover:-translate-y-2">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <RefreshCw className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform duration-300">
                    <Users size={28} />
                  </div>
                  {stats.userGrowth !== 0 && (
                    <div className={`flex items-center ${stats.userGrowth > 0 ? 'text-green-400' : 'text-red-400'} text-sm font-medium`}>
                      {stats.userGrowth > 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                      <span className="ml-1">{Math.abs(stats.userGrowth)}%</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stats.totalUsers.toLocaleString()}</h3>
                  <p className="text-gray-400 text-sm font-medium">Total Users</p>
                  <p className="text-gray-500 text-xs mt-1">Registered customers</p>
                </div>
              </>
            )}
          </div>

          {/* Products Card */}
          <div className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-500 hover:shadow-orange-500/10 transform hover:-translate-y-2">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <RefreshCw className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-4 rounded-2xl text-orange-400 group-hover:scale-110 transition-transform duration-300">
                    <Package size={28} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stats.totalProducts.toLocaleString()}</h3>
                  <p className="text-gray-400 text-sm font-medium">Total Products</p>
                  <p className="text-gray-500 text-xs mt-1">In inventory</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Users */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-3 rounded-xl text-blue-400 mr-4">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Recent Users</h3>
                  <p className="text-gray-400 text-sm">Recently registered users</p>
                </div>
              </div>
              <Link 
                to="/admin/all-users"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
              >
                View All <ArrowUp className="ml-1 rotate-45" size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="animate-spin text-blue-500" size={24} />
                </div>
              ) : recentActivities.recentUsers.length > 0 ? (
                recentActivities.recentUsers.slice(0, 4).map((user, index) => (
                  <div key={user._id || index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/30 hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-3 rounded-full text-blue-400">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{user.name || 'Anonymous User'}</h4>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-gray-400 text-xs mb-1">
                        <Clock size={12} className="mr-1" />
                        {getTimeAgo(user.createdAt || user.registeredAt)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {formatDate(user.createdAt || user.registeredAt)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <User size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No recent users found</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-3 rounded-xl text-green-400 mr-4">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Recent Orders</h3>
                  <p className="text-gray-400 text-sm">Latest customer orders</p>
                </div>
              </div>
              <Link 
                to="/admin/all-orders"
                className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center"
              >
                View All <ArrowUp className="ml-1 rotate-45" size={14} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw className="animate-spin text-blue-500" size={24} />
                </div>
              ) : recentActivities.recentOrders.length > 0 ? (
                recentActivities.recentOrders.slice(0, 3).map((order, index) => (
                  <div key={order._id || index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-xl border border-gray-600/30 hover:border-green-500/30 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-3 rounded-full text-green-400">
                        <Package size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">#{order.orderNumber || order._id?.slice(-6) || 'N/A'}</h4>
                        <p className="text-gray-400 text-sm">{order.customerName || order.user?.name || 'Customer'}</p>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'completed' || order.status === 'delivered' 
                              ? 'bg-green-500/20 text-green-400' 
                              : order.status === 'pending' 
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {order.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold mb-1">
                        {formatCurrency(order.totalAmount || order.total || 0)}
                      </div>
                      <div className="flex items-center text-gray-400 text-xs mb-1">
                        <Clock size={12} className="mr-1" />
                        {getTimeAgo(order.createdAt || order.orderDate)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {formatDate(order.createdAt || order.orderDate)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No recent orders found</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced Quick Actions */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Quick Actions</h2>
            <p className="text-gray-400">Manage your store efficiently with these shortcuts</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to="/admin/add-products" 
              className="group bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white p-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-xl hover:shadow-green-500/25 transform hover:-translate-y-2"
            >
              <div className="bg-white/20 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Plus size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-1">Add Product</h3>
              <p className="text-green-100 text-sm text-center">Create new product listings</p>
            </Link>
            
            <Link 
              to="/admin/all-orders" 
              className="group bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white p-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-2"
            >
              <div className="bg-white/20 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Eye size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-1">View Orders</h3>
              <p className="text-blue-100 text-sm text-center">Monitor customer orders</p>
            </Link>
            
            <Link 
              to="/admin/products-list" 
              className="group bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white p-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-xl hover:shadow-purple-500/25 transform hover:-translate-y-2"
            >
              <div className="bg-white/20 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Settings size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-1">Manage Products</h3>
              <p className="text-purple-100 text-sm text-center">Edit and organize inventory</p>
            </Link>
            
            <Link 
              to="/admin/all-users" 
              className="group bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white p-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-xl hover:shadow-orange-500/25 transform hover:-translate-y-2"
            >
              <div className="bg-white/20 p-4 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users size={28} />
              </div>
              <h3 className="text-lg font-semibold mb-1">View Users</h3>
              <p className="text-orange-100 text-sm text-center">Manage customer accounts</p>
            </Link>
          </div>
        </div>

        {/* Analytics Overview Card */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 p-3 rounded-xl text-indigo-400 mr-4">
                <BarChart3 size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Performance Overview</h3>
                <p className="text-gray-400">Your business metrics at a glance</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-xl border border-gray-600/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 font-medium">Order Status</span>
                <TrendingUp className="text-blue-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.totalOrders > 0 ? '✓' : '—'}</p>
              <p className="text-sm text-gray-400">
                {stats.totalOrders > 0 ? 'Orders are flowing' : 'No orders yet'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-xl border border-gray-600/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 font-medium">Revenue Status</span>
                <IndianRupee className="text-green-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.totalRevenue > 0 ? '✓' : '—'}</p>
              <p className="text-sm text-gray-400">
                {stats.totalRevenue > 0 ? 'Revenue generating' : 'No revenue yet'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-xl border border-gray-600/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-300 font-medium">Growth Trend</span>
                <ArrowUp className="text-purple-400" size={20} />
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                {(stats.orderGrowth + stats.revenueGrowth + stats.userGrowth) > 0 ? '↗' : '→'}
              </p>
              <p className="text-sm text-gray-400">
                {(stats.orderGrowth + stats.revenueGrowth + stats.userGrowth) > 0 ? 'Positive growth' : 'Stable metrics'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;