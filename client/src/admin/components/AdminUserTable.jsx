import React from "react";
import { ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, Trash2, Shield, User, Users } from "lucide-react";

const AdminUserTable = ({
  users,
  loading,
  currentPage,
  totalPages,
  totalUsers,
  toggleUserStatus,
  deleteUser,
  goToPreviousPage,
  goToNextPage,
  goToPage,
}) => {
  // Enhanced loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4 bg-gray-700/30 rounded-lg border border-gray-600">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-400 absolute top-0 left-0" style={{animationDuration: '1.2s'}}></div>
        </div>
        <p className="text-gray-300 font-medium">Loading users...</p>
      </div>
    );
  }

  // Enhanced empty state
  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-700/50 rounded-lg p-8 text-center border border-gray-600 shadow-inner">
        <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-300 font-medium mb-2">No users found</p>
        <p className="text-gray-400 text-sm mb-4">Try adjusting your search criteria or add a new user.</p>
      </div>
    );
  }

  // Get user avatar with fallback to gradient color
  const getUserAvatar = (user) => {
    if (user.avatar) {
      return (
        <img
          className="h-10 w-10 object-cover rounded-full"
          src={user.avatar}
          alt={user.name || user.email}
        />
      );
    }
    
    // Generate a consistent color based on user email
    const colorIndex = user.email.charCodeAt(0) % 6;
    const gradients = [
      'from-pink-500 to-purple-500',
      'from-blue-500 to-teal-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-blue-500'
    ];
    
    return (
      <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${gradients[colorIndex]}`}>
        <span className="text-white font-medium">
          {(user.name?.charAt(0) || user.email.charAt(0)).toUpperCase()}
        </span>
      </div>
    );
  };

  // Get role badge with appropriate styling and icon
  const getRoleBadge = (role) => {
    let bgColor, textColor, icon;
    
    switch(role) {
      case 'admin':
        bgColor = 'bg-purple-900/70 border-purple-700';
        textColor = 'text-purple-200';
        icon = <Shield size={12} className="mr-1" />;
        break;
      case 'moderator':
        bgColor = 'bg-blue-900/70 border-blue-700';
        textColor = 'text-blue-200';
        icon = <Users size={12} className="mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-800/70 border-gray-700';
        textColor = 'text-gray-300';
        icon = <User size={12} className="mr-1" />;
    }
    
    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-4 font-medium rounded-full ${bgColor} ${textColor} border`}>
        {icon}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  // Truncate ID for display
  const truncateId = (id) => {
    if (!id) return '';
    return id.length > 10 ? `${id.substring(0, 5)}...${id.substring(id.length - 5)}` : id;
  };

  return (
    <div className="bg-gray-750 rounded-lg overflow-hidden border border-gray-700 shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800/70 backdrop-blur-sm">
            <tr>
              <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Joined Date
              </th>
              <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/70 bg-gray-750">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-700/50 transition-colors">
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getUserAvatar(user)}
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {user.name || 'Unnamed User'}
                      </div>
                      
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="text-sm text-white">{user.email}</div>
                  {user.emailVerified && (
                    <div className="text-xs text-green-400">Verified</div>
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="text-xs text-gray-400 font-mono">{truncateId(user._id)}</div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="text-sm text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => toggleUserStatus(user._id, user.active || false)}
                      className={`${user.active ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-gray-300'} 
                        transition-colors p-1.5 rounded-full hover:bg-gray-700`}
                      title={user.active ? "Deactivate user" : "Activate user"}
                    >
                      {user.active ? (
                        <ToggleRight className="transform transition-transform duration-200" size={20} />
                      ) : (
                        <ToggleLeft className="transform transition-transform duration-200" size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${user.name || user.email}?`)) {
                          deleteUser(user._id);
                        }
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors p-1.5 rounded-full hover:bg-gray-700"
                      title="Delete user"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination Controls */}
      <div className="px-6 py-4 bg-gray-800/40 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-400 font-medium">
          Showing <span className="text-white">{users.length}</span> of <span className="text-white">{totalUsers}</span> users
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-1">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md transition-colors ${
                currentPage === 1
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-blue-400 hover:bg-gray-700 hover:text-blue-300"
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            
            {/* Show up to 5 page buttons with ellipsis for many pages */}
            {(() => {
              let pages = [];
              const maxVisiblePages = 5;
              
              if (totalPages <= maxVisiblePages) {
                // Show all pages if there are few
                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
              } else {
                // Show first, last, current and surrounding pages
                const firstPage = 1;
                const lastPage = totalPages;
                
                if (currentPage <= 3) {
                  // Near the start
                  pages = [1, 2, 3, 4, '...', lastPage];
                } else if (currentPage >= totalPages - 2) {
                  // Near the end
                  pages = [firstPage, '...', totalPages - 3, totalPages - 2, totalPages - 1, lastPage];
                } else {
                  // In the middle
                  pages = [firstPage, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage];
                }
              }
              
              return pages.map((page, index) => {
                if (page === '...') {
                  return <span key={`ellipsis-${index}`} className="text-gray-500 px-2">...</span>;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[2rem] h-8 flex items-center justify-center rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              });
            })()}
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md transition-colors ${
                currentPage === totalPages
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-blue-400 hover:bg-gray-700 hover:text-blue-300"
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserTable;