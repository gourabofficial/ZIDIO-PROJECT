import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllSearchProducts, deleterProductById } from '../../Api/admin.js';
import { 
  Search, 
  AlertCircle, 
  RefreshCw,
  PackageOpen,
  X,
  Plus
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
    if (window.confirm(`Are you sure you want to delete "${product.name}"?\n\nThis action will:\n- Remove the product from all systems\n- Delete from inventory\n- Remove from all user carts and wishlists\n- Remove from home page content\n- Delete all product reviews\n- Delete product images from cloud storage\n\nThis action cannot be undone.`)) {
      const loadingToast = toast.loading('Deleting product from all systems...', {
        style: {
          background: 'rgba(17, 24, 39, 0.9)',
          color: '#fff',
          border: '1px solid rgba(75, 85, 99, 0.3)',
        },
      });

      try {
        const response = await deleterProductById(product._id || product.id);
        
        if (response.success) {
          // Show detailed success message
          toast.success(
            `Product "${product.name}" deleted successfully!\n\n` +
            `✅ Product removed\n` +
            `✅ ${response.deletionResults?.cartItems || 0} cart references cleared\n` +
            `✅ ${response.deletionResults?.wishlistReferences || 0} wishlist references cleared\n` +
            `✅ ${response.deletionResults?.reviews || 0} reviews deleted\n` +
            `✅ ${response.deletionResults?.cloudinaryImages || 0} images deleted\n` +
            `✅ ${response.deletionResults?.homeContentReferences || 0} home page references removed`,
            {
              id: loadingToast,
              duration: 6000,
              style: {
                background: 'rgba(17, 24, 39, 0.9)',
                color: '#fff',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                maxWidth: '500px',
                whiteSpace: 'pre-line'
              },
            }
          );
          
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
    }
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
    </div>
  );
};

export default AllProductList;