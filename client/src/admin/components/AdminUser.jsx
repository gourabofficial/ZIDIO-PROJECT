import React, { useState, useEffect } from "react";
import { Search, AlertCircle, X, RefreshCw, Users } from "lucide-react";
import AdminUserTable from "./AdminUserTable";
import { getAllSearchUsers } from "../../Api/admin.js";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Fetch users
  const fetchUsers = async (page = 1, searchTerm = "") => {
    setLoading(true);
    setError("");
    setIsSearchActive(!!searchTerm);

    try {
      const response = await getAllSearchUsers(page, searchTerm);

      if (response.success) {
        setUsers(response.users);
        setTotalPages(response.pagination.totalPages);
        setCurrentPage(response.pagination.currentPage);
        setTotalUsers(response.pagination.totalUsers);
      } else {
        setError(response.message || "Failed to fetch users");
        setUsers([]);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("An error occurred while fetching users");
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

  // Reset search and show all users
  const handleReset = () => {
    setSearchQuery("");
    setCurrentPage(1);
    fetchUsers(1, "");
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
    console.log(
      `Toggling status for user ${userId} from ${currentStatus} to ${!currentStatus}`
    );
    // Update UI optimistically - in a real app, you would call an API here
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, active: !currentStatus } : user
      )
    );
  };

  // Delete user
  const deleteUser = async (userId) => {
    console.log("Deleting user with ID:", userId);
    // In a real app, you would call an API here
    // For now, just update the UI optimistically
    setUsers(users.filter((user) => user._id !== userId));
  };

  // Initial load
  useEffect(() => {
    fetchUsers(currentPage);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 mb-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-8">
          <Users className="text-blue-400" size={28} />
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <div className="ml-auto text-sm text-gray-400 font-medium">
            {totalUsers > 0 && `${totalUsers} users total`}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/40 backdrop-blur-sm border border-red-700/50 text-red-200 px-5 py-4 rounded-lg mb-6 flex items-center animate-fadeIn">
            <AlertCircle className="mr-3 text-red-400 flex-shrink-0" size={20} />
            <span className="font-medium">{error}</span>
            <button 
              onClick={() => setError("")} 
              className="ml-auto text-red-400 hover:text-red-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700/60 backdrop-blur-sm border border-gray-600 text-white rounded-lg py-3 pl-12 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition-all duration-300 placeholder-gray-400"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300"
                size={18}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-md transition-colors duration-300"
                title="Search users"
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Reset Button - Enhanced */}
          <button
            onClick={handleReset}
            disabled={!isSearchActive && searchQuery === ""}
            className={`
              px-5 py-3 rounded-lg flex items-center justify-center transition-all duration-300 font-medium
              ${
                isSearchActive || searchQuery 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg border border-blue-500" 
                  : "bg-gray-700/40 text-gray-400 cursor-not-allowed border border-gray-600"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:ring-offset-2 focus:ring-offset-gray-800
              active:scale-95 active:shadow-inner
            `}
            title={isSearchActive || searchQuery ? "Clear search and show all users" : "No active filters"}
          >
            <RefreshCw 
              className={`mr-2 transition-all ${loading && isSearchActive ? "animate-spin text-white" : ""}`} 
              size={18} 
            />
            Reset
          </button>
        </div>

        {/* User count display when search is active */}
        {isSearchActive && (
          <div className="mb-4 text-sm text-gray-300 bg-gray-700/30 inline-block py-1 px-3 rounded-full">
            {loading ? (
              <span className="flex items-center">
                <RefreshCw className="animate-spin mr-2" size={14} />
                Searching...
              </span>
            ) : (
              <span>Found {users.length} users for "{searchQuery}"</span>
            )}
          </div>
        )}

        {/* User Table */}
        <AdminUserTable
          users={users}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalUsers={totalUsers}
          toggleUserStatus={toggleUserStatus}
          deleteUser={deleteUser}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
};

export default AdminUser;