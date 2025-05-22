import React from "react";
import { ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

const AdminUserTable = ({
  users,
  loading,
  currentPage,
  totalPages,
  totalUsers,
  limit,
  toggleUserStatus,
  deleteUser,
  goToPreviousPage,
  goToNextPage,
  goToPage,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-700 rounded-lg p-6 text-center">
        <p className="text-gray-300">No users found.</p>
      </div>
    );
  }

  return (
    <div>
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
                ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Joined Date
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-650">
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-600 rounded-full overflow-hidden">
                      {user.avatar ? (
                        <img
                          className="h-10 w-10 object-cover"
                          src={user.avatar}
                          alt={user.email}
                        />
                      ) : (
                        <div className="h-10 w-10 flex items-center justify-center text-gray-300">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-white">
                  {user.email}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        user.role === "admin"
                          ? "bg-purple-900 text-purple-300"
                          : user.role === "moderator"
                          ? "bg-blue-900 text-blue-300"
                          : "bg-gray-900 text-gray-300"
                      }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-white">
                  {user._id}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-sm text-white">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleUserStatus(user._id, user.active || false)}
                      className="text-blue-400 hover:text-blue-300"
                      title={user.active ? "Deactivate user" : "Activate user"}
                    >
                      {user.active ? (
                        <ToggleRight size={20} />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-400 hover:text-red-300"
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

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {users.length} of {totalUsers} users
        </div>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-1 rounded ${
                currentPage === 1
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-blue-500 hover:bg-gray-700"
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-1 rounded ${
                currentPage === totalPages
                  ? "text-gray-500 cursor-not-allowed"
                  : "text-blue-500 hover:bg-gray-700"
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserTable;
