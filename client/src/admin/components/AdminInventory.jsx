import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Edit, 
  Save, 
  X, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  PackageOpen,
  Filter
} from 'lucide-react';
import { getAllInventory, updateInventory } from '../../Api/admin';
import { toast } from 'react-toastify';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [editStocks, setEditStocks] = useState({});
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [error, setError] = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);

  // Fetch inventory data
  const fetchInventory = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError('');
      setIsSearchActive(!!search);
      const response = await getAllInventory(page, search, 10);
      
      if (response.success) {
        setInventory(response.inventory);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Failed to fetch inventory');
        toast.error(response.message || 'Failed to fetch inventory');
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setError('Failed to fetch inventory');
      toast.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory(currentPage, searchTerm);
  }, [currentPage]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchInventory(1, searchTerm);
  };

  // Reset search
  const handleReset = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchInventory(1, '');
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Start editing an inventory item
  const startEditing = (item) => {
    setEditingItem(item._id);
    const stocksObj = {};
    item.stocks.forEach(stock => {
      // Always set minimum of 1 for editing
      stocksObj[stock.size] = Math.max(1, stock.quantity);
    });
    setEditStocks(stocksObj);
  };

  // Reset stock values to original state
  const resetStockValues = (item) => {
    const stocksObj = {};
    item.stocks.forEach(stock => {
      // Reset to original values with minimum of 1
      stocksObj[stock.size] = Math.max(1, stock.quantity);
    });
    setEditStocks(stocksObj);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingItem(null);
    setEditStocks({});
  };

  // Update stock quantity
  const updateStockQuantity = (size, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    setEditStocks(prev => ({
      ...prev,
      [size]: quantity
    }));
  };

  // Save inventory changes
  const saveInventory = async (item) => {
    try {
      setUpdating(true);
      
      // Convert editStocks object back to stocks array
      const stocks = Object.entries(editStocks).map(([size, quantity]) => ({
        size,
        quantity: parseInt(quantity) || 0
      }));

      const response = await updateInventory(item.productId, stocks);
      
      if (response.success) {
        toast.success('Inventory updated successfully');
        // Update the local state
        setInventory(prev => prev.map(inv => 
          inv._id === item._id 
            ? {
                ...inv,
                stocks: stocks,
                totalQuantity: stocks.reduce((total, stock) => total + stock.quantity, 0)
              }
            : inv
        ));
        setEditingItem(null);
        setEditStocks({});
      } else {
        toast.error(response.message || 'Failed to update inventory');
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast.error('Failed to update inventory');
    } finally {
      setUpdating(false);
    }
  };

  // Get stock status color
  const getStockStatusColor = (quantity) => {
    if (quantity === 0) return 'text-red-500';
    if (quantity <= 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Get stock status text
  const getStockStatusText = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 5) return 'Low Stock';
    return 'In Stock';
  };

  // Filter inventory
  const getFilteredInventory = () => {
    if (filterStatus === 'all') return inventory;
    
    return inventory.filter(item => {
      if (filterStatus === 'out') return item.totalQuantity === 0;
      if (filterStatus === 'low') return item.totalQuantity > 0 && item.totalQuantity <= 5;
      if (filterStatus === 'in') return item.totalQuantity > 5;
      return true;
    });
  };

  const filteredInventory = getFilteredInventory();

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading inventory...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 mb-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-8">
          <PackageOpen className="text-blue-400" size={28} />
          <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
          <div className="ml-auto text-sm text-gray-400 font-medium">
            {pagination.totalInventory > 0 && `${pagination.totalInventory} products total`}
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
                placeholder="Search inventory by product name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700/60 backdrop-blur-sm border border-gray-600 text-white rounded-lg py-3 pl-12 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition-all duration-300 placeholder-gray-400"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300"
                size={18}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white p-1.5 rounded-md transition-colors duration-300"
                title="Search inventory"
              >
                <Search size={16} />
              </button>
            </form>
          </div>
          
          {/* Refresh All Stock Button */}
          <button
            onClick={() => fetchInventory(currentPage, searchTerm)}
            disabled={loading}
            className={`
              px-5 py-3 rounded-lg flex items-center justify-center transition-all duration-300 font-medium
              ${
                loading
                  ? "bg-gray-700/40 text-gray-400 cursor-not-allowed border border-gray-600"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-md hover:shadow-lg border border-green-500"
              }
              focus:outline-none focus:ring-2 focus:ring-green-500/70 focus:ring-offset-2 focus:ring-offset-gray-800
              active:scale-95 active:shadow-inner
            `}
            title="Refresh all product stock"
          >
            <RefreshCw 
              className={`mr-2 transition-all ${loading ? "animate-spin" : ""}`} 
              size={18} 
            />
            Refresh Stock
          </button>
          
          {/* Reset Search Button */}
          <button
            onClick={handleReset}
            disabled={!isSearchActive && searchTerm === ""}
            className={`
              px-5 py-3 rounded-lg flex items-center justify-center transition-all duration-300 font-medium
              ${
                isSearchActive || searchTerm 
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-md hover:shadow-lg border border-blue-500" 
                  : "bg-gray-700/40 text-gray-400 cursor-not-allowed border border-gray-600"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:ring-offset-2 focus:ring-offset-gray-800
              active:scale-95 active:shadow-inner
            `}
            title={isSearchActive || searchTerm ? "Clear search" : "No active search"}
          >
            <X 
              className="mr-2" 
              size={18} 
            />
            Clear Search
          </button>
          
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-700/60 backdrop-blur-sm border border-gray-600 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition-all duration-300"
          >
            <option value="all">All Stock Status</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Search status indicator */}
        {isSearchActive && (
          <div className="mb-4 text-sm text-gray-300 bg-gray-700/30 inline-block py-1 px-3 rounded-full">
            {loading ? (
              <span className="flex items-center">
                <RefreshCw className="animate-spin mr-2" size={14} />
                Searching...
              </span>
            ) : (
              <span>
                Found {filteredInventory.length} products {searchTerm && `for "${searchTerm}"`}
              </span>
            )}
          </div>
        )}

        {/* Inventory Items */}
        {filteredInventory.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <PackageOpen className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Inventory Found</h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'No inventory matches your current filters.' 
                : 'No products have been added to inventory yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredInventory.map((item) => (
              <div key={item._id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-gray-800/70 transition-all duration-300">
                {/* Product Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-600"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                        <Package className="text-gray-400" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{item.product.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>ID: {item.product.product_id}</span>
                      <span>Category: {item.product.category}</span>
                      <span className={`font-medium ${getStockStatusColor(item.totalQuantity)}`}>
                        Total: {item.totalQuantity} units
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.totalQuantity === 0 ? (
                      <span className="px-3 py-1 bg-red-900/40 text-red-400 rounded-full text-sm font-medium flex items-center gap-1">
                        <AlertTriangle size={14} />
                        Out of Stock
                      </span>
                    ) : item.totalQuantity <= 5 ? (
                      <span className="px-3 py-1 bg-yellow-900/40 text-yellow-400 rounded-full text-sm font-medium flex items-center gap-1">
                        <AlertTriangle size={14} />
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-900/40 text-green-400 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle size={14} />
                        In Stock
                      </span>
                    )}
                    <button
                      onClick={() => setExpandedProduct(expandedProduct === item._id ? null : item._id)}
                      className={`ml-2 px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 flex items-center gap-2 ${expandedProduct === item._id ? 'bg-blue-700/40 border-blue-500 text-blue-200' : 'bg-gray-700/40 border-gray-500 text-gray-300 hover:bg-blue-700/30 hover:text-blue-200'}`}
                    >
                      {expandedProduct === item._id ? 'Hide Stock' : 'Show Stock'}
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${expandedProduct === item._id ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Stock Table - Collapsible */}
                {expandedProduct === item._id && (
                  <div className="bg-gray-900/50 rounded-lg border border-gray-700 mb-4">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <Package size={16} />
                        Stock by Size
                        {editingItem === item._id && (
                          <span className="text-blue-400 text-sm">(Editing Mode)</span>
                        )}
                      </h4>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-800/50">
                            <th className="px-4 py-3 text-left text-gray-300 font-medium">Size</th>
                            <th className="px-4 py-3 text-left text-gray-300 font-medium">Current Stock</th>
                            <th className="px-4 py-3 text-left text-gray-300 font-medium">Status</th>
                            {editingItem === item._id && (
                              <th className="px-4 py-3 text-left text-gray-300 font-medium">Actions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {item.stocks.map((stock) => (
                            <tr key={stock.size} className="hover:bg-gray-800/30">
                              <td className="px-4 py-3">
                                <span className="text-white font-medium text-lg">{stock.size}</span>
                              </td>
                              <td className="px-4 py-3">
                                {editingItem === item._id ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateStockQuantity(stock.size, Math.max(1, (editStocks[stock.size] || 1) - 1))}
                                      className="p-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded border border-red-600/30 transition-colors"
                                      type="button"
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      value={editStocks[stock.size] !== undefined ? editStocks[stock.size] : 1}
                                      onChange={(e) => updateStockQuantity(stock.size, e.target.value)}
                                      className="w-20 px-3 py-1 text-center bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                      onClick={() => updateStockQuantity(stock.size, (editStocks[stock.size] || 0) + 1)}
                                      className="p-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded border border-green-600/30 transition-colors"
                                      type="button"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <span className={`text-2xl font-bold ${getStockStatusColor(stock.quantity)}`}>
                                    {stock.quantity}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  stock.quantity === 0 
                                    ? 'bg-red-900/40 text-red-400' 
                                    : stock.quantity <= 5 
                                      ? 'bg-yellow-900/40 text-yellow-400' 
                                      : 'bg-green-900/40 text-green-400'
                                }`}>
                                  {getStockStatusText(stock.quantity)}
                                </span>
                              </td>
                              {editingItem === item._id && (
                                <td className="px-4 py-3">
                                  <span className="text-sm text-gray-400">
                                    {editStocks[stock.size] !== stock.quantity ? '• Modified' : '• Unchanged'}
                                  </span>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    Last updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Never'}
                  </div>
                  <div className="flex items-center gap-2">
                    {editingItem === item._id ? (
                      <>
                        <button
                          onClick={() => resetStockValues(item)}
                          disabled={updating}
                          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          title="Reset to original values"
                        >
                          <RefreshCw size={16} />
                          Reset
                        </button>
                        <button
                          onClick={() => saveInventory(item)}
                          disabled={updating}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {updating ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                          Save Changes
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={updating}
                          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEditing(item)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Edit size={16} />
                        Edit Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalInventory)} of {pagination.totalInventory} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-gray-300">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;