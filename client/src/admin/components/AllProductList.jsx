import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllSearchProducts } from '../../Api/admin.js';

import { 
  Search, 
  AlertCircle, 
  Filter,
} from 'lucide-react';
import AdminProductTable from './AdminProductTable';

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
  const [filterCategory, setFilterCategory] = useState('');
  
  // Fetch products
  const fetchProducts = async (page = 1, searchTerm = '') => {
    setLoading(true);
    setError('');
    
    try {
      const response = await getAllSearchProducts(searchTerm, page, limit);
      
      // console.log('Response from getAllSearchProducts:', response);
      
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
  
  // Filter handler
  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
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
    // Navigate to product detail page
    navigate(`/admin/products/${product._id || product.id}`);
  };

  const handleEditProduct = (product) => {
    // Navigate to edit product page
    navigate(`/admin/edit-product/${product._id || product.id}`);
  };

  const handleDeleteProduct = (product) => {
    // Implement delete functionality or confirmation dialog
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      // Call delete API
      console.log('Delete product:', product);
      // After successful deletion, refresh the product list
      fetchProducts(currentPage);
    }
  };
  
  // Apply filters when category changes
  useEffect(() => {
    fetchProducts(currentPage, searchQuery);
  }, [filterCategory, limit]);
  
  // Initial load
  useEffect(() => {
    fetchProducts(currentPage);
  }, []);
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-6">Product Management</h1>
        
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
                placeholder="Search products..."
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
          
          {/* Filter dropdown could go here */}
          
          {/* Add Product Button */}
          <Link
            to="/admin/add-products"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
          >
            + Add Product
          </Link>
        </div>

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