import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { getFilteredProducts } from '../../Api/ProductApi';

const Collection = () => {
  // Hooks for routing and URL management
  const location = useLocation();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Fixed limit value
  const PRODUCTS_PER_PAGE = 12;

  // Initialize filters from URL search params
  const [filters, setFilters] = useState(() => {
    return {
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      collection: id || "",
      size: searchParams.get("size") || "",
      offerStatus: searchParams.get("offerStatus") || "",
      page: parseInt(searchParams.get("page")) || 1,
      limit: PRODUCTS_PER_PAGE,
    };
  });

  // Filter options
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // Fetch products with given filters
  const fetchProducts = useCallback(async (filterParams) => {
    try {
      setLoading(true);

      // Create a params object for API
      const apiParams = {
        ...filterParams,
        collection: id // Ensure collection ID is always included
      };

      // Call the API
      const response = await getFilteredProducts(apiParams);
      console.log("API Response:", response);

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch products");
      }

      setProducts(response.products || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error("Error fetching collection products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Update URL with current filters
  const updateUrlWithFilters = useCallback((newFilters) => {
    // Create a new URLSearchParams object
    const newSearchParams = new URLSearchParams();

    // Add non-empty filters to the URL
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== "" && key !== "limit" && key !== "collection") {
        newSearchParams.set(key, value);
      }
    });

    // Update the URL without reloading the page
    setSearchParams(newSearchParams);
  }, [setSearchParams]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Update filters state with new value
    const updatedFilters = {
      ...filters,
      [name]: value,
      // Reset to page 1 when changing filters (except page parameter)
      ...(name !== "page" ? { page: 1 } : {}),
    };
    
    // Set the new filters
    setFilters(updatedFilters);
    
    // Update URL with new filters
    updateUrlWithFilters(updatedFilters);
    
    // Fetch products with new filters immediately
    fetchProducts(updatedFilters);
  };

  // Reset filters
  const resetFilters = () => {
    const resetState = {
      minPrice: "",
      maxPrice: "",
      collection: id,
      size: "",
      offerStatus: "",
      page: 1,
      limit: PRODUCTS_PER_PAGE,
    };
    
    setFilters(resetState);

    // Clear search params
    setSearchParams(new URLSearchParams());

    // Fetch products with reset filters
    fetchProducts(resetState);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    const updatedFilters = {
      ...filters,
      page: newPage,
    };
    
    setFilters(updatedFilters);

    // Update URL and fetch data
    updateUrlWithFilters(updatedFilters);
    fetchProducts(updatedFilters);
  };

  // Initial fetch and URL handling
  useEffect(() => {
    // Sync filters with URL params when location changes
    setFilters(prevFilters => ({
      ...prevFilters,
      collection: id,
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      size: searchParams.get("size") || "",
      offerStatus: searchParams.get("offerStatus") || "",
      page: parseInt(searchParams.get("page")) || 1,
      limit: PRODUCTS_PER_PAGE,
    }));

    // Fetch products with current filters
    fetchProducts({
      collection: id,
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      size: searchParams.get("size") || "",
      offerStatus: searchParams.get("offerStatus") || "",
      page: parseInt(searchParams.get("page")) || 1,
      limit: PRODUCTS_PER_PAGE,
    });
  }, [id, searchParams, location.pathname, fetchProducts]);

  // Format collection name for display
  const formatCollectionTitle = (collectionId) => {
    if (!collectionId) return "Collection";
    
    // Replace hyphens with spaces and capitalize each word
    return collectionId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20 bg-[#0c0e16]">
      {/* Collection header */}
      <h2 className="text-2xl md:text-3xl font-bold mb-8 relative inline-block">
        <span className="text-white">{formatCollectionTitle(id)}</span>
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
      </h2>

      {/* Filters section */}
      <div className="bg-[#0c0e16] p-6 rounded-lg mb-8 border border-[#334155]">
        <h2 className="text-xl font-semibold text-white mb-4">
          Filter Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Price range inputs */}
          <div>
            <label className="block text-gray-300 mb-2">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-[#1a1c2e] text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-[#1a1c2e] text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Size dropdown */}
          <div>
            <label className="block text-gray-300 mb-2">Size</label>
            <select
              name="size"
              value={filters.size}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-[#1a1c2e] text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Sizes</option>
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Offer status dropdown */}
          <div>
            <label className="block text-gray-300 mb-2">On Sale</label>
            <select
              name="offerStatus"
              value={filters.offerStatus}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-[#1a1c2e] text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Status</option>
              <option value="true">On Sale</option>
              <option value="false">Regular Price</option>
            </select>
          </div>
        </div>

        {/* Reset button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-[#1a1c2e] text-white rounded hover:bg-[#252840] transition-colors disabled:opacity-50 border border-[#334155]"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Filters"}
          </button>
        </div>
      </div>

      {/* Active filters display with clear buttons */}
      {(filters.minPrice || filters.maxPrice || filters.size || filters.offerStatus) && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.minPrice && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                Min: ${filters.minPrice}
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "minPrice", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                Max: ${filters.maxPrice}
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "maxPrice", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
            {filters.size && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                Size: {filters.size}
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "size", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
            {filters.offerStatus === "true" && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                On Sale
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "offerStatus", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
            {filters.offerStatus === "false" && (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                Regular Price
                <button 
                  className="ml-2 hover:text-gray-200" 
                  onClick={() => handleFilterChange({target: {name: "offerStatus", value: ""}})}
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading state with spinner */}
      {loading && (
        <div className="text-center py-16 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-400 text-xl">Loading products...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-16 bg-[#1a1c2e] rounded-lg border border-[#334155]">
          <p className="text-red-400 text-xl">Error: {error}</p>
          <button 
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded hover:opacity-90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Show message if no products found */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 bg-[#1a1c2e] rounded-lg border border-[#334155]">
          <p className="text-gray-400 text-xl">
            No products found in this collection.
          </p>
          <button 
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded hover:opacity-90 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && products.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1 || loading}
            className="px-4 py-2 bg-[#1a1c2e] text-white rounded mr-2 disabled:opacity-50 hover:bg-[#252840] transition-colors border border-[#334155]"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-[#1a1c2e] text-white rounded border border-[#334155]">
            Page {filters.page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= totalPages || loading}
            className="px-4 py-2 bg-[#1a1c2e] text-white rounded ml-2 disabled:opacity-50 hover:bg-[#252840] transition-colors border border-[#334155]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Collection;