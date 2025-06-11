import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllSearchProducts, deleterProductById } from '../../Api/admin.js';
import { 
  Search, 
  AlertCircle, 
  RefreshCw,
  PackageOpen,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import AdminProductTable from './AdminProductTable';
import toast from 'react-hot-toast';

const AllProductList = () => {
  const navigate = useNavigate();
  
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  
  // Fetch products
  const fetchProducts = async (page = 1, searchTerm = '') => {
    setLoading(true);
    setError('');
    setIsSearchActive(!!searchTerm);
    
    try {
      const response = await getAllSearchProducts(searchTerm, page, limit);
      
      if (response.success) {
        // Update products with the data array
        setProducts(response.data);
        
        // Update pagination information
        if (response.pagination) {
          setTotalProducts(response.pagination.totalProducts);
          setTotalPages(response.pagination.totalPages);
          setCurrentPage(response.pagination.currentPage);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'An error occurred while fetching products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, searchQuery);
  };
  
  // Reset search
  const handleReset = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchProducts(1, '');
  };
  
  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(page);
    fetchProducts(page, searchQuery);
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

  // Product action handlers
  const handleViewProduct = (product) => {
    navigate(`/admin/products/${product._id || product.id}`);
  };

  const handleEditProduct = (product) => {
    navigate(`/admin/edit-product/${product._id || product.id}`);
  };

  const handleDeleteProduct = async (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const confirmDeleteProduct = async () => {
    const product = deleteModal.product;
    setDeleteModal({ isOpen: false, product: null });

    const loadingToast = toast.loading('Deleting product...', {
      style: {
        background: 'rgba(17, 24, 39, 0.9)',
        color: '#fff',
        border: '1px solid rgba(75, 85, 99, 0.3)',
      },
    });

    try {
      const response = await deleterProductById(product._id || product.id);
      
      if (response.success) {
        toast.success(`Product "${product.name}" deleted successfully!`, {
          id: loadingToast,
          style: {
            background: 'rgba(17, 24, 39, 0.9)',
            color: '#fff',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          },
        });
        
        // Refresh the product list
        fetchProducts(currentPage, searchQuery);
      } else {
        toast.error(response.message || 'Failed to delete product', {
          id: loadingToast,
          style: {
            background: 'rgba(17, 24, 39, 0.9)',
            color: '#fff',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          },
        });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.', {
        id: loadingToast,
        style: {
          background: 'rgba(17, 24, 39, 0.9)',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      });
    }
  };

  const cancelDeleteProduct = () => {
    setDeleteModal({ isOpen: false, product: null });
  };
  
  // Initial load
  useEffect(() => {
    fetchProducts(currentPage);
  }, []);
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-8 mb-8 border border-gray-700">
        <div className="flex items-center gap-3 mb-8">
          <PackageOpen className="text-blue-400" size={28} />
          <h1 className="text-2xl font-bold text-white">Product Management</h1>
          <div className="ml-auto text-sm text-gray-400 font-medium">
            {totalProducts > 0 && `${totalProducts} products total`}
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
                placeholder="Search products by name or SKU..."
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
                title="Search products"
              >
                <Search size={16} />
              </button>
            </form>
          </div>
          
          {/* Reset Button */}
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
            title={isSearchActive || searchQuery ? "Clear search" : "No active search"}
          >
            <RefreshCw 
              className={`mr-2 transition-all ${loading && isSearchActive ? "animate-spin text-white" : ""}`} 
              size={18} 
            />
            Clear Search
          </button>
          
          {/* Add Product Button */}
          <Link
            to="/admin/add-products"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-3 px-5 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg border border-green-500 font-medium active:scale-95"
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </Link>
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
                Found {products.length} products {searchQuery && `for "${searchQuery}"`}
              </span>
            )}
          </div>
        )}

        {/* Product Table */}
        <AdminProductTable 
          products={products}
          loading={loading}
          totalProducts={totalProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          limit={limit}
          goToPreviousPage={goToPreviousPage}
          goToNextPage={goToNextPage}
          goToPage={goToPage}
          onView={handleViewProduct}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity backdrop-blur-sm"
            onClick={cancelDeleteProduct}
          ></div>
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative transform overflow-hidden rounded-xl bg-gray-800 border border-gray-700 shadow-2xl transition-all w-full max-w-md">
              {/* Close button */}
              <button
                onClick={cancelDeleteProduct}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-300 transition-colors z-10"
              >
                <X size={20} />
              </button>
              
              {/* Modal content */}
              <div className="p-6">
                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                
                {/* Title */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Delete Product
                  </h3>
                  <p className="text-sm text-gray-300">
                    Are you sure you want to delete this product? This action will:
                  </p>
                </div>

                {/* Product Info */}
                {deleteModal.product && (
                  <div className="bg-gray-700/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      {deleteModal.product.image ? (
                        <img
                          src={deleteModal.product.image}
                          alt={deleteModal.product.name}
                          className="h-12 w-12 rounded-lg object-cover border border-gray-600"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500">
                          <PackageOpen className="h-6 w-6 text-white" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {deleteModal.product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {deleteModal.product._id?.substring(0, 12) || 'N/A'}...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning List */}
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 mb-6">
                  <ul className="text-xs text-red-200 space-y-1">
                    <li>• Remove product from all systems</li>
                    <li>• Delete from inventory</li>
                    <li>• Remove from user carts and wishlists</li>
                    <li>• Delete all product reviews</li>
                    <li>• Remove from homepage content</li>
                  </ul>
                  <p className="text-xs text-red-300 font-medium mt-2">
                    This action cannot be undone.
                  </p>
                </div>
                
                {/* Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={cancelDeleteProduct}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteProduct}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProductList;