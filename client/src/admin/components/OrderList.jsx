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
  Clock
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
  
  // Order statuses
  const orderStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  // Fetch orders
  const fetchOrders = async (page = 1, searchTerm = '') => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getAllOrders(page, searchTerm, filterStatus, limit);
      console.log("resposne: ", response);
      
      
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
  
  // Filter handler
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
    fetchOrders(1, searchQuery);
  };
  
  // Reset handler
  const handleReset = () => {
    setSearchQuery('');
    setFilterStatus('');
    setCurrentPage(1);
    fetchOrders(1, '', '');
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
        // Update the order in the local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message || 'An error occurred while updating order');
    }
  };
  
  // Apply filters when status changes
  useEffect(() => {
    fetchOrders(currentPage, searchQuery);
  }, [filterStatus, limit]);
  
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
        return 'bg-yellow-900 text-yellow-300';
      case 'processing':
        return 'bg-blue-900 text-blue-300';
      case 'shipped':
        return 'bg-purple-900 text-purple-300';
      case 'delivered':
        return 'bg-green-900 text-green-300';
      case 'cancelled':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-gray-900 text-gray-300';
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-6">Order Management</h1>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <span>{error}</span>
          </div>
        )}
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-400"
              >
                <Search size={18} />
              </button>
            </form>
          </div>
          
          {/* Status Filter */}
          <div className="w-full md:w-64">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 pl-10 pr-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {orderStatuses.map((status) => (
                  <option key={status} value={status.toLowerCase()}>
                    {status}
                  </option>
                ))}
              </select>
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleReset}
            disabled={!searchQuery && !filterStatus}
            className={`py-2 px-4 rounded-lg flex items-center justify-center transition-colors ${
              searchQuery || filterStatus 
                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw size={18} className="mr-2" />
            Reset
          </button>
        </div>
        
        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Payment
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10">
                    <div className="flex justify-center">
                      <RefreshCw size={30} className="animate-spin text-blue-500" />
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10">
                    <div className="text-center text-gray-400">
                      <p className="text-lg">No orders found</p>
                      <p className="text-sm mt-1">Try a different search or filter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-650">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        #{order.trackingId || order._id.substring(0, 8)}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {order.owner.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.owner.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-white">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-white">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.paymentStatus === 'paid' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}
                      >
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        {/* View Order Details */}
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {/* Status Update Dropdown */}
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white text-xs rounded py-1 pl-2 pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {orderStatuses.map((status) => (
                              <option 
                                key={status} 
                                value={status.toLowerCase()}
                              >
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalOrders)} of {totalOrders} orders
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;