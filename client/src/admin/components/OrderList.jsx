import React, { useState, useEffect } from 'react';
import { 
  Search, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  RefreshCw,
  Eye,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  Clock,
  Edit3,
  Trash2,
  ShoppingCart,
  Calendar,
  ChevronDown,
  X,
  MoreVertical
} from 'lucide-react';
import { getAllOrders, updateOrderStatus as updateOrderStatusAPI } from '../../Api/admin';

const OrderList = () => {
  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeOrderMenu, setActiveOrderMenu] = useState(null);
  
  // Order statuses
  const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  // Date filter options
  const dateFilterOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'thismonth', label: 'This Month' },
    { value: 'lastmonth', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Calculate active filters count
  const activeFiltersCount = (() => {
    let count = 0;
    if (filterStatus && filterStatus !== '') count++;
    if (dateFilter && dateFilter !== '') count++;
    if (searchQuery && searchQuery.trim() !== '') count++;
    return count;
  })();

  // Fetch orders
  const fetchOrders = async (page = 1, searchTerm = '') => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getAllOrders(page, searchTerm, filterStatus, limit, dateFilter, customDateRange);
      console.log("response: ", response);
      
      if (response.success) {
        setOrders(response.orders || []);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          setTotalOrders(response.pagination.totalOrders || 0);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'An error occurred while fetching orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders(1, searchQuery);
  };
  
  // Filter handlers
  const handleStatusFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
    fetchOrders(1, searchQuery);
  };

  const handleDateFilterChange = (dateRange) => {
    setDateFilter(dateRange);
    setCurrentPage(1);
    fetchOrders(1, searchQuery);
  };

  const handleCustomDateChange = (field, value) => {
    setCustomDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyCustomDateRange = () => {
    setCurrentPage(1);
    fetchOrders(1, searchQuery);
  };
  
  // Reset handler
  const handleReset = () => {
    setSearchQuery('');
    setFilterStatus('');
    setDateFilter('');
    setCustomDateRange({ startDate: '', endDate: '' });
    setCurrentPage(1);
    fetchOrders(1, '');
  };
  
  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    fetchOrders(page, searchQuery);
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };
  
  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatusAPI(orderId, newStatus);
      
      if (response.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        setActiveOrderMenu(null);
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message || 'An error occurred while updating order');
    }
  };

  // Toggle order menu
  const toggleOrderMenu = (orderId) => {
    setActiveOrderMenu(activeOrderMenu === orderId ? null : orderId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveOrderMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  // Apply filters when status or date changes
  useEffect(() => {
    fetchOrders(currentPage, searchQuery);
  }, [filterStatus, dateFilter, limit]);
  
  // Initial load
  useEffect(() => {
    fetchOrders(currentPage);
  }, []);
  
  // Get status icon based on order status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending':
        return <Clock size={16} className="mr-1 text-yellow-400" />;
      case 'processing':
        return <Package size={16} className="mr-1 text-blue-400" />;
      case 'shipped':
        return <Truck size={16} className="mr-1 text-purple-400" />;
      case 'delivered':
        return <CheckCircle size={16} className="mr-1 text-green-400" />;
      case 'cancelled':
        return <XCircle size={16} className="mr-1 text-red-400" />;
      default:
        return <Clock size={16} className="mr-1 text-gray-400" />;
    }
  };
  
  // Get status badge class based on order status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50';
      case 'processing':
        return 'bg-blue-900/40 text-blue-400 border-blue-700/50';
      case 'shipped':
        return 'bg-purple-900/40 text-purple-400 border-purple-700/50';
      case 'delivered':
        return 'bg-green-900/40 text-green-400 border-green-700/50';
      case 'cancelled':
        return 'bg-red-900/40 text-red-400 border-red-700/50';
      default:
        return 'bg-gray-900/40 text-gray-400 border-gray-700/50';
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  
  // Format date with time at bottom
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dateOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const formattedDate = date.toLocaleDateString(undefined, dateOptions);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
    return { date: formattedDate, time: formattedTime };
  };

  // Compact Mobile Order Card Component
  const MobileOrderCard = ({ order }) => {
    const { date, time } = formatDate(order.createdAt);
    
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-4 hover:bg-gray-700/30 transition-all duration-200">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-mono text-blue-400">
            #{order.trackingId || order._id.substring(0, 6)}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-green-400">
              {formatCurrency(order.totalAmount)}
            </div>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleOrderMenu(order._id)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded transition-all duration-200"
              >
                <MoreVertical size={14} />
              </button>
              
              {activeOrderMenu === order._id && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-gray-800 border border-gray-700 rounded-md shadow-2xl z-20 overflow-hidden">
                  <div className="py-1">
                    <button className="w-full text-left px-3 py-2 text-sm text-blue-400 hover:bg-gray-700 flex items-center gap-2">
                      <Eye size={12} />
                      View
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2">
                      <Edit3 size={12} />
                      Edit
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Customer Info - Compact */}
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0 h-7 w-7">
            <div className="h-7 w-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-semibold">
              {order.owner?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {order.owner?.name || 'Unknown'}
            </div>
            <div className="text-sm text-gray-400 truncate">
              {order.owner?.email || 'No email'}
            </div>
          </div>
        </div>
        
        {/* Date & Time */}
        <div className="mb-3">
          <div className="text-sm text-white">{date}</div>
          <div className="text-sm text-gray-400">{time}</div>
        </div>
        
        {/* Status Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium border ${getStatusBadgeClass(order.status)}`}>
            {getStatusIcon(order.status)}
            <span className="truncate ml-1">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium border ${
            order.paymentStatus === 'paid' 
              ? 'bg-green-900/40 text-green-400 border-green-700/50' 
              : 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50'
          }`}>
            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
          </span>
        </div>
        
        {/* Compact Status Update */}
        <select
          value={order.status}
          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
          className="w-full bg-gray-700/60 border border-gray-600 text-white text-sm rounded py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/70"
        >
          {orderStatuses.map((status) => (
            <option key={status} value={status.toLowerCase()} className="bg-gray-800">
              {status}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  // Refresh handler
  const handleRefresh = () => {
    fetchOrders(currentPage, searchQuery);
  };

  return (
    <div className="w-full min-h-screen">
      <div className="max-w-full mx-auto px-3 sm:px-5 lg:px-7">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-4 sm:p-5 lg:p-7 mb-7 border border-gray-700">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5 sm:mb-7">
            <div className="flex items-center gap-3">
              <ShoppingCart className="text-blue-400 flex-shrink-0" size={22} />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Order Management</h1>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto">
              <div className="text-sm text-gray-400 font-medium">
                {totalOrders > 0 && `${totalOrders} total orders`}
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-gray-700/60 hover:bg-gray-700/80 disabled:bg-gray-700/40 text-white rounded-lg border border-gray-600 transition-all duration-300 font-medium text-sm disabled:cursor-not-allowed"
                title="Refresh orders"
              >
                <RefreshCw className={`${loading ? 'animate-spin' : ''}`} size={16} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-900/40 backdrop-blur-sm border border-red-700/50 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-center animate-fadeIn">
              <AlertCircle className="mr-3 text-red-400 flex-shrink-0" size={18} />
              <span className="font-medium text-sm flex-1">{error}</span>
              <button 
                onClick={() => setError("")} 
                className="ml-3 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          {/* Controls */}
          <div className="flex flex-col gap-4 mb-5">
            {/* Search and Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1">
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    placeholder="Search orders by ID, customer name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700/60 backdrop-blur-sm border border-gray-600 text-white rounded-lg py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition-all duration-300 placeholder-gray-400 text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" size={16} />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded transition-colors duration-300"
                    title="Search orders"
                  >
                    <Search size={14} />
                  </button>
                </form>
              </div>
            </div>
            
            {/* Filter Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-300 font-medium text-sm ${
                  showFilters 
                    ? 'bg-blue-600/20 border-blue-500/30 text-blue-400' 
                    : 'bg-gray-700/40 border-gray-600 text-gray-300 hover:bg-gray-700/60'
                }`}
              >
                <Filter size={14} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} size={14} />
              </button>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleReset}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 font-medium border border-blue-500 shadow-md hover:shadow-lg text-sm"
                >
                  <X size={14} />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-lg p-4 border border-gray-600 space-y-4">
                <h3 className="text-base font-semibold text-white">Advanced Filters</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Order Status</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleStatusFilterChange('')}
                        className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 ${
                          filterStatus === '' 
                            ? 'bg-blue-600 text-white border border-blue-500' 
                            : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60 border border-gray-600'
                        }`}
                      >
                        All
                      </button>
                      {orderStatuses.slice(0, 5).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusFilterChange(status.toLowerCase())}
                          className={`px-2 py-2 rounded text-sm font-medium transition-all duration-200 border truncate ${
                            filterStatus === status.toLowerCase() 
                              ? getStatusBadgeClass(status.toLowerCase()) 
                              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60 border-gray-600'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Date Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      {dateFilterOptions.slice(0, 4).map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleDateFilterChange(option.value)}
                          className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 border truncate ${
                            dateFilter === option.value 
                              ? 'bg-purple-600 text-white border-purple-500' 
                              : 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60 border-gray-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="animate-spin text-blue-400 mb-3" size={28} />
              <p className="text-gray-300 font-medium text-base">Loading orders...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && orders.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-10 w-10 text-gray-500 mb-3" />
              <p className="text-base font-medium text-gray-300 mb-2">No orders found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Mobile View - Cards */}
          <div className="block xl:hidden">
            {!loading && orders.length > 0 && orders.map((order) => (
              <MobileOrderCard key={order._id} order={order} />
            ))}
          </div>
          
          {/* Desktop View - Table */}
          <div className="hidden xl:block">
            {!loading && orders.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-800/80 border-b border-gray-700">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Total Amount
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Payment
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {orders.map((order) => {
                        const { date, time } = formatDate(order.createdAt);
                        return (
                          <tr key={order._id} className="hover:bg-gray-700/30 transition-colors duration-200">
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="text-sm font-mono text-blue-400">
                                #{order.trackingId || order._id.substring(0, 6)}
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-sm">
                                    {order.owner?.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-white">
                                    {order.owner?.name || 'Unknown'}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {order.owner?.email?.substring(0, 25) || 'No email'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="text-sm text-white">{date}</div>
                              <div className="text-sm text-gray-400">{time}</div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-green-400">
                                {formatCurrency(order.totalAmount)}
                              </div>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium border ${getStatusBadgeClass(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium border ${
                                order.paymentStatus === 'paid' 
                                  ? 'bg-green-900/40 text-green-400 border-green-700/50' 
                                  : 'bg-yellow-900/40 text-yellow-400 border-yellow-700/50'
                              }`}>
                                {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                              </span>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                className="bg-gray-700/60 border border-gray-600 text-white text-sm rounded py-2 pl-2 pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500/70 hover:bg-gray-700/80 transition-all duration-200 cursor-pointer"
                              >
                                {orderStatuses.map((status) => (
                                  <option key={status} value={status.toLowerCase()} className="bg-gray-800">
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {!loading && orders.length > 0 && (
            <div className="mt-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 px-4 py-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-400 order-2 sm:order-1">
                  Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalOrders)} of {totalOrders} orders
                </div>
                <div className="flex items-center space-x-2 order-1 sm:order-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded transition-all duration-200 ${
                      currentPage === 1
                        ? 'bg-gray-700/40 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700/60 text-white hover:bg-gray-700/80 border border-gray-600'
                    }`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <span className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded text-sm font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded transition-all duration-200 ${
                      currentPage === totalPages
                        ? 'bg-gray-700/40 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700/60 text-white hover:bg-gray-700/80 border border-gray-600'
                    }`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;