import React, { useState, useEffect, useRef, useCallback } from "react";
import { getAllSearchProducts } from "../../Api/admin";
import { Search, Check, X } from "lucide-react"; // Add Lucide icons if available

const ProductSearchPopup = ({ isOpen, onClose, onSelect, selectedIds }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Reference for the observer
  const observer = useRef();
  // Reference for the last product element
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    setSearchResults([]);
    setHasMore(true);
  };

  // Effect to fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getAllSearchProducts(searchTerm, page);

        if (response.success) {
          if (page === 1) {
            setSearchResults(response.data);
          } else {
            setSearchResults((prev) => [...prev, ...response.data]);
          }

          // Check if there are more pages to load
          setHasMore(response.pagination?.hasNextPage || false);
        } else {
          console.error("Error fetching products:", response.message);
          if (page === 1) setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        if (page === 1) setSearchResults([]);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    // Fetch data on initial load and on page/search changes
    fetchProducts();
  }, [searchTerm, page]);

  // Initialize selected items from props
  useEffect(() => {
    if (selectedIds) {
      setSelectedItems(selectedIds);
    }
  }, [selectedIds]);

  const toggleProductSelection = (productId) => {
    const isSelected = selectedItems.includes(productId);

    if (isSelected) {
      setSelectedItems(selectedItems.filter((id) => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const handleConfirm = () => {
    console.log("Selected items:", selectedItems);
    onSelect(selectedItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 w-full max-w-lg overflow-hidden transition-all duration-300 animate-fadeIn">
        <div className="p-5 border-b border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-white">Select Products</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="relative mt-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
          {initialLoad ? (
            <div className="flex justify-center items-center py-8">
              <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-3 text-gray-300">Loading products...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="divide-y divide-gray-700">
              {searchResults.map((product, index) => {
                // Add ref to last element for infinite scroll
                const isLastElement = index === searchResults.length - 1;
                const isSelected = selectedItems.includes(product._id);
                
                return (
                  <li
                    key={product.product_id}
                    ref={isLastElement ? lastProductElementRef : null}
                    className={`p-3 cursor-pointer transition-colors duration-200 hover:bg-gray-700 flex items-center ${
                      isSelected ? "bg-gray-700" : ""
                    }`}
                    onClick={() => toggleProductSelection(product._id)}
                  >
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-12 w-12 rounded overflow-hidden border border-gray-600">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{product.name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{product.product_id}</p>
                    </div>
                    
                    <div className="flex-shrink-0 ml-3">
                      {isSelected ? (
                        <div className="bg-blue-500 text-white h-6 w-6 rounded-full flex items-center justify-center">
                          <Check size={14} />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full border border-gray-500"></div>
                      )}
                    </div>
                  </li>
                );
              })}
              
              {loading && (
                <li className="p-4 text-center">
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-400 text-sm">Loading more...</span>
                  </div>
                </li>
              )}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-300 font-medium">No products found</p>
              <p className="text-gray-500 text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-750 flex items-center justify-between">
          <div className="text-gray-300 text-sm">
            <span className="font-medium">{selectedItems.length}</span> product{selectedItems.length !== 1 ? 's' : ''} selected
          </div>
          
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
              onClick={handleConfirm}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchPopup;

