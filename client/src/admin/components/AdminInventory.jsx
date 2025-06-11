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
  Minus
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

  // Fetch inventory data
  const fetchInventory = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await getAllInventory(page, search, 10);
      
      if (response.success) {
        setInventory(response.inventory);
        setPagination(response.pagination);
      } else {
        toast.error(response.message || 'Failed to fetch inventory');
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
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

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Start editing an inventory item
  const startEditing = (item) => {
    setEditingItem(item._id);
    const stocksObj = {};
    item.stocks.forEach(stock => {
      stocksObj[stock.size] = stock.quantity;
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
    const quantity = Math.max(0, parseInt(newQuantity) || 0);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-b from-gray-900 to-gray-950 text-white p-8 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Package className="text-blue-400" size={28} />
          <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
          <div className="ml-auto text-sm text-gray-400 font-medium">
            {pagination.totalInventory > 0 && `${pagination.totalInventory} products total`}
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by product name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors"
            >
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* Inventory Table */}
        {inventory.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Inventory Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No inventory matches your search criteria.' : 'No products have been created yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-800/50 border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Product</th>
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Stock by Size</th>
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Total Stock</th>
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    {/* Product Info */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {item.product.image && (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-lg bg-gray-700"
                          />
                        )}
                        <div>
                          <h3 className="text-white font-medium text-sm">{item.product.name}</h3>
                          <p className="text-gray-400 text-xs">ID: {item.product.product_id}</p>
                          <p className="text-gray-400 text-xs">{item.product.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Stock by Size */}
                    <td className="py-4 px-4">
                      {editingItem === item._id ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                          {item.stocks.map((stock) => (
                            <div key={stock.size} className="flex flex-col items-center">
                              <label className="text-xs text-gray-400 mb-1">{stock.size}</label>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateStockQuantity(stock.size, (editStocks[stock.size] || 0) - 1)}
                                  className="p-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs"
                                  type="button"
                                >
                                  <Minus size={12} />
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  value={editStocks[stock.size] || 0}
                                  onChange={(e) => updateStockQuantity(stock.size, e.target.value)}
                                  className="w-16 px-2 py-1 text-center bg-gray-800 border border-gray-600 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                                />
                                <button
                                  onClick={() => updateStockQuantity(stock.size, (editStocks[stock.size] || 0) + 1)}
                                  className="p-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs"
                                  type="button"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                          {item.stocks.map((stock) => (
                            <div key={stock.size} className="text-center">
                              <div className="text-xs text-gray-400">{stock.size}</div>
                              <div className={`text-sm font-medium ${getStockStatusColor(stock.quantity)}`}>
                                {stock.quantity}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Total Stock */}
                    <td className="py-4 px-4">
                      <span className={`text-lg font-bold ${getStockStatusColor(item.totalQuantity)}`}>
                        {editingItem === item._id 
                          ? Object.values(editStocks).reduce((total, qty) => total + (parseInt(qty) || 0), 0)
                          : item.totalQuantity
                        }
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {item.totalQuantity === 0 ? (
                          <AlertTriangle className="text-red-500" size={16} />
                        ) : item.totalQuantity <= 5 ? (
                          <AlertTriangle className="text-yellow-500" size={16} />
                        ) : (
                          <CheckCircle className="text-green-500" size={16} />
                        )}
                        <span className={`text-sm font-medium ${getStockStatusColor(item.totalQuantity)}`}>
                          {getStockStatusText(item.totalQuantity)}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4">
                      {editingItem === item._id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => saveInventory(item)}
                            disabled={updating}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                          >
                            {updating ? <RefreshCw className="animate-spin" size={14} /> : <Save size={14} />}
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            disabled={updating}
                            className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                          >
                            <X size={14} />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(item)}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
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