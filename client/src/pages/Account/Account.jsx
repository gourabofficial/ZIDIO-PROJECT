// In your Account page component

// Add this in the account menu/options section
{currentUser && currentUser.role === 'admin' && (
  <Link
    to="/admin"
    className="flex items-center gap-3 p-4 bg-[#0c0e16] rounded-lg border border-gray-700 hover:border-[#c8a95a] transition-colors hover:text-[#c8a95a]"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FiSettings size={20} />
    <div>
      <h3 className="font-medium">Admin Dashboard</h3>
      <p className="text-sm text-gray-400">Manage the store</p>
    </div>
  </Link>
)}