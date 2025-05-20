import React, { useState, useEffect, useRef, useCallback } from "react";
import { getAllSearchProducts } from "../../Api/admin";

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
    setPage(1); // 
    setSearchResults([]); // Clear previous results
    setHasMore(true); // 
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">
          Select Products
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 bg-gray-700 text-white rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="max-h-60 overflow-y-auto mb-4">
          {initialLoad ? (
            <p className="text-gray-400 text-center py-4">Loading products...</p>
          ) : searchResults.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((product, index) => {
                // Add ref to last element for infinite scroll
                const isLastElement = index === searchResults.length - 1;
                return (
                  <li
                    key={product.product_id}
                    ref={isLastElement ? lastProductElementRef : null}
                    className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                      selectedItems.includes(product._id)
                        ? "bg-blue-600"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => toggleProductSelection(product._id)}
                  >
                    <div className="flex items-center space-x-2">
                      <span>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-full rounded mr-2"
                        />
                      </span>
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-xs text-gray-400">
                          {product.product_id}
                        </span>
                      </div>
                    </div>
                    {selectedItems.includes(product.product_id) && (
                      <span className="text-white">✓</span>
                    )}
                  </li>
                );
              })}
              {loading && (
                <li className="p-2 text-center text-gray-400">
                  Loading more products...
                </li>
              )}
            </ul>
          ) : (
            <p className="text-gray-400 text-center py-4">No products found</p>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <div className="text-white">
            Selected: {selectedItems.length} product(s)
          </div>
          <div>
            <button
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchPopup;
