import React, { useState, useEffect } from "react";
import { Search, AlertCircle } from "lucide-react";
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
  const [filterRole, setFilterRole] = useState("all");
  const [limit, setLimit] = useState(10);

  // Fetch users
  const fetchUsers = async (page = 1, searchTerm = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await getAllSearchUsers(
        page,
        searchTerm,
        filterRole,
        limit
      );

      console.log("Fetched users:", response);

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

  // Filter handler
  const handleFilterChange = (e) => {
    setFilterRole(e.target.value);
    setCurrentPage(1);
  };

  // Limit handler
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
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

  // Apply filters when role or limit changes
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

          {/* Role filter */}
          <div className="md:w-48">
            <select
              value={filterRole}
              onChange={handleFilterChange}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          {/* Items per page */}
          <div className="md:w-48">
            <select
              value={limit}
              onChange={handleLimitChange}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <AdminUserTable
          users={users}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalUsers={totalUsers}
          limit={limit}
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
