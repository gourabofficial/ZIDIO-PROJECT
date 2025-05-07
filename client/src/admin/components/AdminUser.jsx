import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Edit, 
  Trash2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  RefreshCw,
  UserPlus,
  UserCheck,
  UserX,
  Eye
} from 'lucide-react';
import axiosInstance from '../../Api/config';

const AdminUser = () => {
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filterRole, setFilterRole] = useState('');
  
  // User roles
  const roles = ['User', 'Admin', 'Moderator'];
  
  // Fetch users
  const fetchUsers = async (page = 1, searchTerm = '') => {
    setLoading(true);
    setError('');
    
    try {
      const params = { 
        page, 
        limit,
        ...(searchTerm && { search: searchTerm }),
        ...(filterRole && { role: filterRole.toLowerCase() })
      };
      
      const response = await axiosInstance.get('/users', { params });
      
      if (response.data.success) {
        setUsers(response.data.users || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalUsers(response.data.totalItems || 0);
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while fetching users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchQuery);
  };
  
  // Filter handler
  const handleFilterChange = (e) => {
    setFilterRole(e.target.value);
    setCurrentPage(1);
  };
  
  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    fetchUsers(page, searchQuery);
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
  
  // Toggle user status
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}/status`, {
        active: !currentStatus
      });
      
      if (response.data.success) {
        // Update the user in the local state
        setUsers(users.map(user => 
          user._id === userId ? { ...user, active: !currentStatus } : user
        ));
      } else {
        throw new Error(response.data.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while updating user');
    }
  };
  
  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      
      if (response.data.success) {
        // Remove the user from the local state
        setUsers(users.filter(user => user._id !== userId));
        setTotalUsers(totalUsers - 1);
      } else {
        throw new Error(response.data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while deleting user');
    }
  };
  
  // Apply filters when role changes
  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [filterRole, limit]);
  
  // Initial load
  useEffect(() => {
    fetchUsers(currentPage);
  }, []);
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
        
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
                placeholder="Search users by name or email..."
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
          
          {/* Role Filter */}
          <div className="w-full md:w-64">
            <div className="relative">
              <select
                value={filterRole}
                onChange={handleFilterChange}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 pl-10 pr-4 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                {roles.map((role) => (
                  <option key={role} value={role.toLowerCase()}>
                    {role}
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
            onClick={() => {
              setSearchQuery('');
              setFilterRole('');
              fetchUsers(1);
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
          >
            <RefreshCw size={18} className="mr-2" />
            Reset
          </button>
          
          {/* Add User Button */}
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
          >
            <UserPlus size={18} className="mr-2" />
            Add User
          </button>
        </div>
        
        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10">
                    <div className="flex justify-center">
                      <RefreshCw size={30} className="animate-spin text-blue-500" />
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10">
                    <div className="text-center text-gray-400">
                      <p className="text-lg">No users found</p>
                      <p className="text-sm mt-1">Try a different search or add a new user</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-650">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-600 rounded-full overflow-hidden">
                          {user.profileImage ? (
                            <img 
                              className="h-10 w-10 object-cover" 
                              src={user.profileImage} 
                              alt={user.name} 
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-gray-300">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {user._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-white">
                      {user.email}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${user.role === 'admin' ? 'bg-purple-900 text-purple-300' : 
                          user.role === 'moderator' ? 'bg-blue-900 text-blue-300' : 
                          'bg-gray-900 text-gray-300'}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${user.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}
                      >
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-400 hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-yellow-400 hover:text-yellow-300"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user._id, user.active)}
                          className={`${user.active ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'}`}
                          title={user.active ? 'Deactivate User' : 'Activate User'}
                        >
                          {user.active ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">
              Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
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

export default AdminUser;