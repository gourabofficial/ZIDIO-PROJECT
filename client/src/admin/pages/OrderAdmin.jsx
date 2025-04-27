import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ChevronDown, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  User,
  Calendar,
  IndianRupee,
  ExternalLink,
  RefreshCw,
  FileText,
  Eye
} from 'lucide-react';

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const ordersPerPage = 10;

  const dummyOrders = [
    {
      id: 'ORD23842',
      customer: {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '9876543210'
      },
      date: '2025-04-27T14:23:01',
      total: 2499,
      status: 'pending',
      paymentMethod: 'UPI',
      items: [
        { id: 'P1001', name: 'Marvel T-Shirt XL', quantity: 1, price: 999 },
        { id: 'P2002', name: 'Spider-Man Hoodie L', quantity: 1, price: 1500 }
      ],
      shippingAddress: {
        street: '123 Main Road',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      }
    },
    {
      id: 'ORD23841',
      customer: {
        name: 'Rahul Patel',
        email: 'rahul@example.com',
        phone: '8765432109'
      },
      date: '2025-04-26T18:12:40',
      total: 3299,
      status: 'processing',
      paymentMethod: 'Credit Card',
      items: [
        { id: 'P3005', name: 'Iron Man Action Figure', quantity: 2, price: 1299 },
        { id: 'P4010', name: 'Captain America Shield Replica', quantity: 1, price: 999 }
      ],
      shippingAddress: {
        street: '456 Park Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      }
    },
    {
      id: 'ORD23840',
      customer: {
        name: 'Neha Singh',
        email: 'neha@example.com',
        phone: '7654321098'
      },
      date: '2025-04-25T09:34:15',
      total: 4999,
      status: 'shipped',
      paymentMethod: 'Net Banking',
      items: [
        { id: 'P5020', name: 'Thor Costume Set', quantity: 1, price: 4999 }
      ],
      shippingAddress: {
        street: '789 Lake View',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      }
    },
    {
      id: 'ORD23839',
      customer: {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        phone: '6543210987'
      },
      date: '2025-04-24T16:45:30',
      total: 1899,
      status: 'delivered',
      paymentMethod: 'Cash on Delivery',
      items: [
        { id: 'P6030', name: 'Black Widow T-Shirt S', quantity: 1, price: 899 },
        { id: 'P7040', name: 'Hulk Mug', quantity: 1, price: 499 },
        { id: 'P8050', name: 'Avengers Keychain Set', quantity: 1, price: 499 }
      ],
      shippingAddress: {
        street: '101 Hill Road',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001'
      }
    },
    {
      id: 'ORD23838',
      customer: {
        name: 'Sanjay Gupta',
        email: 'sanjay@example.com',
        phone: '5432109876'
      },
      date: '2025-04-23T11:20:45',
      total: 7999,
      status: 'cancelled',
      paymentMethod: 'Debit Card',
      items: [
        { id: 'P9060', name: 'Thanos Infinity Gauntlet', quantity: 1, price: 7999 }
      ],
      shippingAddress: {
        street: '202 River View',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700001'
      }
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setOrders(dummyOrders);
        setFilteredOrders(dummyOrders);
      } catch (err) {
        setError('Failed to fetch orders. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter criteria change
    let result = [...orders];

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(order => order.date.startsWith(today));
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      result = result.filter(order => new Date(order.date) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      result = result.filter(order => new Date(order.date) >= monthAgo);
    }

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        order.customer.name.toLowerCase().includes(term) ||
        order.customer.email.toLowerCase().includes(term) ||
        order.items.some(item => item.name.toLowerCase().includes(term))
      );
    }

    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'highest') {
      result.sort((a, b) => b.total - a.total);
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => a.total - b.total);
    }

    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, statusFilter, dateFilter, searchTerm, sortBy]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-600 text-yellow-100', icon: <Clock size={14} className="mr-1" /> },
      processing: { color: 'bg-blue-600 text-blue-100', icon: <RefreshCw size={14} className="mr-1" /> },
      shipped: { color: 'bg-purple-600 text-purple-100', icon: <Truck size={14} className="mr-1" /> },
      delivered: { color: 'bg-green-600 text-green-100', icon: <CheckCircle size={14} className="mr-1" /> },
      cancelled: { color: 'bg-red-600 text-red-100', icon: <XCircle size={14} className="mr-1" /> },
    };

    const { color, icon } = statusConfig[status] || { color: 'bg-gray-600 text-gray-100', icon: <AlertCircle size={14} className="mr-1" /> };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setIsUpdatingStatus(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update order status in the state
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      );
      
      setOrders(updatedOrders);
      
      // If an order is selected, update it too
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      
    } catch (error) {
      console.error('Failed to update order status:', error);
      setError('Failed to update order status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {selectedOrder ? (
        // Order Details View
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <ShoppingBag className="mr-2" />
              Order Details
            </h2>
            <button 
              onClick={closeOrderDetails} 
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm transition-colors"
            >
              Back to Orders
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-750 rounded-lg p-5 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedOrder.id}</h3>
                    <p className="text-gray-400 flex items-center mt-1">
                      <Calendar size={16} className="mr-1" /> 
                      {formatDate(selectedOrder.date)}
                    </p>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Update Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button
                          key={status}
                          disabled={isUpdatingStatus || selectedOrder.status === status}
                          onClick={() => handleStatusChange(selectedOrder.id, status)}
                          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                            selectedOrder.status === status
                              ? 'bg-blue-600 text-white cursor-not-allowed'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-md font-semibold text-white mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center mr-3">
                            <Package size={16} />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-white">{item.name}</h5>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">₹{item.price}</p>
                          <p className="text-xs text-gray-400">₹{item.price} × {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-gray-400 mb-1">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.total}</span>
                    </div>
                    <div className="flex justify-between text-gray-400 mb-1">
                      <span>Shipping</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-gray-400 mb-3">
                      <span>Tax</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-white font-bold">
                      <span>Total</span>
                      <span>₹{selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-750 rounded-lg p-5 mb-6">
                <h3 className="text-md font-semibold text-white mb-3 flex items-center">
                  <User size={16} className="mr-1" /> Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-white">{selectedOrder.customer.name}</p>
                  <p className="text-gray-400">{selectedOrder.customer.email}</p>
                  <p className="text-gray-400">{selectedOrder.customer.phone}</p>
                </div>
              </div>
              
              <div className="bg-gray-750 rounded-lg p-5 mb-6">
                <h3 className="text-md font-semibold text-white mb-3">Shipping Address</h3>
                <div className="space-y-1 text-sm text-gray-400">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                  <p>{selectedOrder.shippingAddress.pincode}</p>
                </div>
              </div>
              
              <div className="bg-gray-750 rounded-lg p-5">
                <h3 className="text-md font-semibold text-white mb-3">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method</span>
                    <span className="text-white">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-green-400">Paid</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex-1 flex items-center justify-center">
                  <FileText size={16} className="mr-1" /> Generate Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Orders List View
        <div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 sm:p-6 border-b border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
              <ShoppingBag className="mr-3" size={24} />
              Order Management
            </h2>
            <p className="text-blue-100 mt-2">
              View, filter and manage customer orders
            </p>
          </div>
          
          <div className="p-4 sm:p-6">
            {error && (
              <div className="mb-6 bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-3 rounded flex items-center">
                <AlertCircle size={20} className="mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search order ID, customer or product..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="appearance-none bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Amount</option>
                    <option value="lowest">Lowest Amount</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw size={32} className="text-blue-500 animate-spin" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-gray-750 rounded-lg p-8 text-center">
                <ShoppingBag size={48} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No orders found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                    ? 'Try adjusting your filters to see more results.' 
                    : 'There are no orders in the system yet.'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto bg-gray-750 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {currentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {order.customer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            ₹{order.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button 
                              onClick={() => handleViewOrder(order)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-400">
                      Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastOrder, filteredOrders.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredOrders.length}</span> orders
                    </p>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === 1
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-3 py-1 rounded text-sm ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === totalPages
                            ? 'text-gray-500 cursor-not-allowed'
                            : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAdmin;