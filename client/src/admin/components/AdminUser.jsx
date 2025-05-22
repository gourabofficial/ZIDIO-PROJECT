import React, { useState, useEffect } from "react";
import { Search, AlertCircle, X } from "lucide-react";
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

  // Fetch users
  const fetchUsers = async (page = 1, searchTerm = "") => {
    setLoading(true);
    setError("");

    try {
      console.log(searchTerm);

      const response = await getAllSearchUsers(page, searchTerm);

      // console.log("Fetched users:", response);

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

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="mr-2" size={18} />
            Reset
          </button>
        </div>

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
