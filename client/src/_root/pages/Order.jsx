import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiChevronLeft, FiPackage, FiClock, FiCheck, FiTruck, FiCalendar, FiMapPin, FiDollarSign, FiCreditCard } from 'react-icons/fi';
import { useAuthdata } from '../../context/AuthContext';
import MiniLoader from '../../components/Loader/MiniLoader';

const Order = () => {
  const { orderId } = useParams();
  const { currentUser } = useAuthdata();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to fetch orders
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API call
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/orders/user/${currentUser?.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setOrders(data.orders || []);
          
          // If orderId is provided in URL, select that order
          if (orderId) {
            const order = data.orders.find(o => o._id === orderId);
            if (order) setSelectedOrder(order);
          }
        } else {
          console.error("Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser, orderId]);

  // For demo purposes, create some mock orders if none exist
  useEffect(() => {
    if (!isLoading && orders.length === 0) {
      const mockOrders = [
        {
          _id: "ORD123456789",
          orderDate: new Date('2023-04-10').toISOString(),
          status: "delivered",
          items: [
            { _id: "1", name: "Gaming Headset Pro", price: 129.99, quantity: 1, image: "https://via.placeholder.com/80" },
            { _id: "2", name: "Mechanical Keyboard RGB", price: 149.99, quantity: 1, image: "https://via.placeholder.com/80" }
          ],
          shippingAddress: {
            street: "123 Main St",
            city: "Tech City",
            state: "CA",
            zipCode: "90210",
            country: "USA"
          },
          paymentMethod: "Credit Card",
          total: 279.98,
          trackingNumber: "TRK987654321"
        },
        {
          _id: "ORD987654321",
          orderDate: new Date('2023-03-25').toISOString(),
          status: "shipped",
          items: [
            { _id: "3", name: "Wireless Mouse", price: 59.99, quantity: 1, image: "https://via.placeholder.com/80" }
          ],
          shippingAddress: {
            street: "123 Main St",
            city: "Tech City",
            state: "CA",
            zipCode: "90210",
            country: "USA"
          },
          paymentMethod: "PayPal",
          total: 59.99,
          trackingNumber: "TRK123456789"
        }
      ];
      setOrders(mockOrders);
    }
  }, [isLoading, orders.length]);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'processing': return 'text-yellow-500';
      case 'shipped': return 'text-blue-500';
      case 'delivered': return 'text-green-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'processing': return <FiClock className="mr-2" />;
      case 'shipped': return <FiTruck className="mr-2" />;
      case 'delivered': return <FiCheck className="mr-2" />;
      case 'cancelled': return <FiX className="mr-2" />;
      default: return <FiPackage className="mr-2" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0e16] p-6 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
          {selectedOrder ? (
            <>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="mr-3 text-gray-400 hover:text-white"
              >
                <FiChevronLeft className="text-2xl" />
              </button>
              Order Details
            </>
          ) : 'My Orders'}
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <MiniLoader />
          </div>
        ) : selectedOrder ? (
          // Order Detail View
          <div className="bg-[#1e293b] rounded-xl p-6 shadow-lg">
            {/* Order header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-white">Order #{selectedOrder._id}</h2>
                <div className="flex items-center mt-2">
                  <FiCalendar className="text-gray-400 mr-2" />
                  <span className="text-gray-300">{formatDate(selectedOrder.orderDate)}</span>
                </div>
              </div>
              <div className={`flex items-center mt-4 md:mt-0 ${getStatusColor(selectedOrder.status)}`}>
                {getStatusIcon(selectedOrder.status)}
                <span className="capitalize font-medium">{selectedOrder.status}</span>
              </div>
            </div>

            {/* Order items */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map(item => (
                  <div key={item._id} className="flex items-center bg-[#0c111b] p-4 rounded-lg">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover mr-4"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80?text=Image';
                      }}
                    />
                    <div className="flex-grow">
                      <h4 className="text-white font-medium">{item.name}</h4>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-400">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </span>
                        <span className="text-white font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping details */}
              <div className="bg-[#0c111b] p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <FiMapPin className="mr-2 text-purple-400" />
                  Shipping Address
                </h3>
                <div className="text-gray-300 space-y-1">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
                
                {selectedOrder.trackingNumber && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Tracking Number</h4>
                    <p className="text-purple-400 font-medium">{selectedOrder.trackingNumber}</p>
                  </div>
                )}
              </div>
              
              {/* Payment details */}
              <div className="bg-[#0c111b] p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                  <FiCreditCard className="mr-2 text-purple-400" />
                  Payment Information
                </h3>
                <div className="text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="text-white">{selectedOrder.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white">${(selectedOrder.total - 10).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-white">$10.00</span>
                  </div>
                  <div className="border-t border-gray-700 my-2 pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-purple-400 text-lg">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              {selectedOrder.status === 'shipped' && (
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                  <FiTruck className="inline mr-2" />
                  Track Package
                </button>
              )}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors">
                  Cancel Order
                </button>
              )}
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                <FiDollarSign className="inline mr-2" />
                Buy Again
              </button>
            </div>
          </div>
        ) : orders.length > 0 ? (
          // Order list view
          <div className="grid gap-4">
            {orders.map(order => (
              <div 
                key={order._id}
                className="bg-[#1e293b] rounded-xl p-4 md:p-6 hover:bg-[#252f44] transition-colors cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-3 md:mb-0">
                    <h3 className="text-white font-medium">Order #{order._id}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-400">
                      <FiCalendar className="mr-1" />
                      <span>{formatDate(order.orderDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 items-center">
                    <div className={`flex items-center ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                    <div className="text-white font-medium">${order.total.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center overflow-x-auto">
                  <div className="flex-shrink-0 flex space-x-3">
                    {order.items.map((item, index) => (
                      <img 
                        key={index}
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-md object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/80?text=Image';
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="ml-3 text-gray-300 text-sm flex-shrink-0">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="bg-[#1e293b] rounded-xl p-12 text-center">
            <div className="w-20 h-20 mx-auto bg-[#0c111b] rounded-full flex items-center justify-center mb-6">
              <FiPackage className="text-purple-400 text-3xl" />
            </div>
            <h2 className="text-xl font-medium text-white mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-6">You haven't placed any orders with us yet.</p>
            <Link 
              to="/products"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;