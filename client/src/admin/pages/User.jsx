import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronDown, 
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  Lock,
  Unlock,
  Trash2,
  Edit,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  ArrowLeft,
  ExternalLink,
  Settings,
  ShoppingBag
} from 'lucide-react';

const User = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const usersPerPage = 10;

  // Dummy users data
  const dummyUsers = [
    {
      id: 'USR1001',
      name: 'Rohit Sharma',
      email: 'rohit@example.com',
      phone: '9876543210',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      role: 'customer',
      status: 'active',
      joinDate: '2024-12-15T10:30:00',
      lastLogin: '2025-04-26T14:22:51',
      address: {
        street: '123 Main Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      orders: 12,
      totalSpent: 24895
    },
    {
      id: 'USR1002',
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '8765432109',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      role: 'customer',
      status: 'active',
      joinDate: '2025-01-05T15:45:30',
      lastLogin: '2025-04-25T09:15:22',
      address: {
        street: '456 Park Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001'
      },
      orders: 8,
      totalSpent: 15650
    },
    {
      id: 'USR1003',
      name: 'Amit Kumar',
      email: 'amit@example.com',
      phone: '7654321098',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      role: 'admin',
      status: 'active',
      joinDate: '2024-09-28T08:15:10',
      lastLogin: '2025-04-27T11:30:45',
      address: {
        street: '789 Lake View',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001'
      },
      orders: 0,
      totalSpent: 0
    },
    {
      id: 'USR1004',
      name: 'Neha Singh',
      email: 'neha@example.com',
      phone: '6543210987',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      role: 'customer',
      status: 'inactive',
      joinDate: '2025-02-10T12:20:15',
      lastLogin: '2025-04-01T16:45:30',
      address: {
        street: '101 Hill Road',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001'
      },
      orders: 3,
      totalSpent: 5200
    },
    {
      id: 'USR1005',
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      phone: '5432109876',
      avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
      role: 'customer',
      status: 'active',
      joinDate: '2025-03-01T09:50:25',
      lastLogin: '2025-04-27T08:10:15',
      address: {
        street: '202 River View',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700001'
      },
      orders: 6,
      totalSpent: 11450
    },
    {
      id: 'USR1006',
      name: 'Ananya Gupta',
      email: 'ananya@example.com',
      phone: '4321098765',
      avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      role: 'moderator',
      status: 'active',
      joinDate: '2024-11-20T14:30:40',
      lastLogin: '2025-04-26T20:15:30',
      address: {
        street: '303 Green Park',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001'
      },
      orders: 2,
      totalSpent: 3500
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setUsers(dummyUsers);
        setFilteredUsers(dummyUsers);
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter criteria change
    let result = [...users];

    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }

    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.id.toLowerCase().includes(term) ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term)
      );
    }

    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'most_orders') {
      result.sort((a, b) => b.orders - a.orders);
    } else if (sortBy === 'highest_spent') {
      result.sort((a, b) => b.totalSpent - a.totalSpent);
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, roleFilter, statusFilter, searchTerm, sortBy]);

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

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-red-600 text-red-100', label: 'Admin' },
      moderator: { color: 'bg-purple-600 text-purple-100', label: 'Moderator' },
      customer: { color: 'bg-blue-600 text-blue-100', label: 'Customer' }
    };

    const { color, label } = roleConfig[role] || { color: 'bg-gray-600 text-gray-100', label: role };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-600 text-green-100', icon: <CheckCircle size={14} className="mr-1" /> },
      inactive: { color: 'bg-yellow-600 text-yellow-100', icon: <AlertCircle size={14} className="mr-1" /> },
      suspended: { color: 'bg-red-600 text-red-100', icon: <XCircle size={14} className="mr-1" /> }
    };

    const { color, icon } = statusConfig[status] || { color: 'bg-gray-600 text-gray-100', icon: <AlertCircle size={14} className="mr-1" /> };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsEditMode(false);
  };

  const handleEditUser = () => {
    setEditedUser({...selectedUser});
    setIsEditMode(true);
  };

  const handleSaveUser = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user in local state
      const updatedUsers = users.map(user => 
        user.id === editedUser.id ? editedUser : user
      );
      
      setUsers(updatedUsers);
      setSelectedUser(editedUser);
      setIsEditMode(false);
      
    } catch (error) {
      console.error('Failed to update user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (like address.city)
      const [parent, child] = name.split('.');
      setEditedUser({
        ...editedUser,
        [parent]: {
          ...editedUser[parent],
          [child]: value
        }
      });
    } else {
      setEditedUser({
        ...editedUser,
        [name]: value
      });
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user status in the state
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus } 
          : user
      );
      
      setUsers(updatedUsers);
      
      // If a user is selected and we're changing their status, update them too
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
      
    } catch (error) {
      console.error('Failed to update user status:', error);
      setError('Failed to update user status. Please try again.');
    }
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setIsEditMode(false);
    setEditedUser(null);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {selectedUser ? (
        // User Details View
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <UserIcon className="mr-2" />
              {isEditMode ? 'Edit User' : 'User Details'}
            </h2>
            <button 
              onClick={closeUserDetails} 
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm transition-colors flex items-center"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Users
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 order-2 lg:order-1">
              {/* User Profile Card */}
              <div className="bg-gray-750 rounded-lg overflow-hidden mb-6">
                <div className="p-4 text-center bg-gradient-to-r from-blue-600 to-blue-800">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img 
                      src={selectedUser.avatar} 
                      alt={selectedUser.name} 
                      className="rounded-full object-cover w-full h-full border-4 border-gray-800"
                    />
                    {selectedUser.status === 'active' && (
                      <span className="absolute bottom-1 right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-gray-800"></span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white">
                    {isEditMode 
                      ? <input 
                          type="text" 
                          name="name" 
                          value={editedUser.name} 
                          onChange={handleInputChange}
                          className="bg-blue-700 bg-opacity-50 border border-blue-500 rounded text-center text-white px-2 py-1 w-full"
                        /> 
                      : selectedUser.name
                    }
                  </h3>
                  
                  <div className="mt-2">
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-700">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">Email</p>
                        {isEditMode 
                          ? <input 
                              type="email" 
                              name="email" 
                              value={editedUser.email} 
                              onChange={handleInputChange}
                              className="bg-gray-700 border border-gray-600 rounded text-white px-2 py-1 text-sm w-full"
                            /> 
                          : <p className="text-sm text-white">{selectedUser.email}</p>
                        }
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-400 mr-3" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">Phone</p>
                        {isEditMode 
                          ? <input 
                              type="text" 
                              name="phone" 
                              value={editedUser.phone} 
                              onChange={handleInputChange}
                              className="bg-gray-700 border border-gray-600 rounded text-white px-2 py-1 text-sm w-full"
                            /> 
                          : <p className="text-sm text-white">{selectedUser.phone}</p>
                        }
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <UserIcon size={16} className="text-gray-400 mr-3 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-400">Address</p>
                        {isEditMode ? (
                          <div className="space-y-2 mt-1">
                            <input 
                              type="text" 
                              name="address.street" 
                              value={editedUser.address.street} 
                              onChange={handleInputChange}
                              placeholder="Street"
                              className="bg-gray-700 border border-gray-600 rounded text-white px-2 py-1 text-sm w-full"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input 
                                type="text" 
                                name="address.city" 
                                value={editedUser.address.city} 
                                onChange={handleInputChange}
                                placeholder="City"
                                className="bg-gray-700 border border-gray-600 rounded text-white px-2 py-1 text-sm"
                              />
                              <input 
                                type="text" 
                                name="address.state" 
                                value={editedUser.address.state} 
                                onChange={handleInputChange}
                                placeholder="State"
                                className="bg-gray-700 border border-gray-600 rounded text-white px-2 py-1 text-sm"
                              />
                            </div>
                            <input 
                              type="text" 
                              name="address.pincode" 
                              value={editedUser.address.pincode} 
                              onChange={handleInputChange}
                              placeholder="PIN Code"
                              className="bg-gray-700 border border-gray-600 rounded text-white px-2 py-1 text-sm w-full"
                            />
                          </div>
                        ) : (
                          <p className="text-sm text-white">
                            {selectedUser.address.street}, {selectedUser.address.city}<br />
                            {selectedUser.address.state}, {selectedUser.address.pincode}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-400">Joined</p>
                        <p className="text-sm text-white">{formatDate(selectedUser.joinDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-400">Last Login</p>
                        <p className="text-sm text-white">{formatDate(selectedUser.lastLogin)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isEditMode ? (
                  <div className="p-4 bg-gray-700 border-t border-gray-600 flex justify-between">
                    <button 
                      onClick={() => setIsEditMode(false)} 
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveUser} 
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors disabled:opacity-70"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw size={14} className="mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} className="mr-1" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-700 border-t border-gray-600 flex justify-between">
                    <button 
                      onClick={handleEditUser} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors"
                    >
                      <Edit size={14} className="mr-1" />
                      Edit Profile
                    </button>
                    {selectedUser.status === 'active' ? (
                      <button 
                        onClick={() => handleStatusChange(selectedUser.id, 'inactive')} 
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors"
                      >
                        <Lock size={14} className="mr-1" />
                        Deactivate
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusChange(selectedUser.id, 'active')} 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors"
                      >
                        <Unlock size={14} className="mr-1" />
                        Activate
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              {selectedUser.role === 'customer' && (
                <div className="bg-gray-750 rounded-lg p-5">
                  <h3 className="text-md font-semibold text-white mb-3 flex items-center">
                    <ShoppingBag size={16} className="mr-1" /> Order Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">Total Orders</p>
                      <p className="text-white text-lg font-semibold mt-1">{selectedUser.orders}</p>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">Total Spent</p>
                      <p className="text-white text-lg font-semibold mt-1">₹{selectedUser.totalSpent}</p>
                    </div>
                  </div>
                  <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center transition-colors">
                    <ExternalLink size={14} className="mr-1" />
                    View Order History
                  </button>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2 order-1 lg:order-2">
              {isEditMode ? (
                <div className="bg-gray-750 rounded-lg p-5 mb-6">
                  <h3 className="text-md font-semibold text-white mb-4">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">User Role</label>
                      <select
                        name="role"
                        value={editedUser.role}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="customer">Customer</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Account Status</label>
                      <select
                        name="status"
                        value={editedUser.status}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 border-gray-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-300">Email verified</span>
                      </label>
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4 text-blue-600 border-gray-500 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-300">Phone verified</span>
                      </label>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-sm font-medium text-white mb-3">Reset Password</h4>
                      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                        <Lock size={14} className="mr-1" />
                        Generate New Password
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-750 rounded-lg p-5 mb-6">
                  <h3 className="text-md font-semibold text-white mb-4">Activity Timeline</h3>
                  
                  <div className="relative pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-700">
                    <div className="relative">
                      <div className="absolute left-[-2rem] top-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <UserIcon size={12} className="text-white" />
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-white">Logged in from <span className="text-blue-400">Mumbai, India</span></p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(selectedUser.lastLogin)}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-[-2rem] top-1 w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                        <ShoppingBag size={12} className="text-white" />
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-white">Placed order <span className="text-blue-400">#ORD23842</span></p>
                        <p className="text-xs text-gray-400 mt-1">25 Apr, 2025 - 14:22</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-[-2rem] top-1 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                        <Settings size={12} className="text-white" />
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-white">Updated profile information</p>
                        <p className="text-xs text-gray-400 mt-1">20 Apr, 2025 - 10:15</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-[-2rem] top-1 w-5 h-5 rounded-full bg-yellow-600 flex items-center justify-center">
                        <UserIcon size={12} className="text-white" />
                      </div>
                      <div className="bg-gray-700 rounded-lg p-3">
                        <p className="text-sm text-white">Account created</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(selectedUser.joinDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {!isEditMode && (
                <div className="bg-gray-750 rounded-lg p-5">
                  <h3 className="text-md font-semibold text-white mb-4">Security & Permissions</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                      <div>
                        <p className="text-sm text-white font-medium">Admin Access</p>
                        <p className="text-xs text-gray-400 mt-1">Can manage all aspects of the site</p>
                      </div>
                      <div>
                        {selectedUser.role === 'admin' ? (
                          <span className="px-2 py-1 bg-green-600 bg-opacity-20 text-green-400 text-xs rounded-full">Enabled</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-600 bg-opacity-20 text-gray-400 text-xs rounded-full">Disabled</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                      <div>
                        <p className="text-sm text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-400 mt-1">Extra security for account</p>
                      </div>
                      <div>
                        <span className="px-2 py-1 bg-gray-600 bg-opacity-20 text-gray-400 text-xs rounded-full">Not Setup</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                      <div>
                        <p className="text-sm text-white font-medium">Email Verified</p>
                        <p className="text-xs text-gray-400 mt-1">Email address has been verified</p>
                      </div>
                      <div>
                        <span className="px-2 py-1 bg-green-600 bg-opacity-20 text-green-400 text-xs rounded-full">Verified</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-white font-medium">Password Last Changed</p>
                        <p className="text-xs text-gray-400 mt-1">15 Mar, 2025</p>
                      </div>
                      <div>
                        <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
                          <RefreshCw size={12} className="mr-1" />
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {!isEditMode && (
            <div className="mt-6 flex justify-end">
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm flex items-center transition-colors">
                <Trash2 size={14} className="mr-1" />
                Delete Account
              </button>
            </div>
          )}
        </div>
      ) : (
        // Users List View
        <div>
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 sm:p-6 border-b border-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
              <Users className="mr-3" size={24} />
              User Management
            </h2>
            <p className="text-indigo-100 mt-2">
              View, search and manage user accounts
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
                  placeholder="Search by name, email, phone or ID..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="bg-gray-700 border border-gray-600 rounded-md py-2 pl-10 pr-4 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="appearance-none bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="customer">Customer</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none bg-gray-700 border border-gray-600 rounded-md py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
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
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                    <option value="most_orders">Most Orders</option>
                    <option value="highest_spent">Highest Spent</option>
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
            ) : filteredUsers.length === 0 ? (
              <div className="bg-gray-750 rounded-lg p-8 text-center">
                <Users size={48} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No users found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your filters to see more results.' 
                    : 'There are no users in the system yet.'}
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md inline-flex items-center">
                  <UserIcon size={16} className="mr-1" />
                  Add New User
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto bg-gray-750 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Contact Info
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Joined On
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {currentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  src={user.avatar} 
                                  alt={user.name} 
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">{user.name}</div>
                                <div className="text-sm text-gray-400">{user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{user.email}</div>
                            <div className="text-sm text-gray-400">{user.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDate(user.joinDate).split(',')[0]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleViewUser(user)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(
                                  user.id, 
                                  user.status === 'active' ? 'inactive' : 'active'
                                )}
                                className={`${
                                  user.status === 'active' 
                                    ? 'text-yellow-400 hover:text-yellow-300' 
                                    : 'text-green-400 hover:text-green-300'
                                } transition-colors`}
                                title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                              >
                                {user.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                              </button>
                            </div>
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
                      Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(indexOfLastUser, filteredUsers.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredUsers.length}</span> users
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
                              ? 'bg-indigo-600 text-white'
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

export default User;