import React, { useState, useEffect } from "react";
import ProductSearchPopup from "./ProductSearchPopup";
import { getProductsbyMultipleIds } from "../../Api/admin";
import { Trash } from "lucide-react";

const AdminSettingsNewArrival = ({ selectedIds = [], onSave }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedProductIds(selectedIds);
  }, [selectedIds]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (selectedProductIds.length === 0) {
        setProductDetails([]);
        return;
      }

      setLoading(true);
      try {
        const response = await getProductsbyMultipleIds(selectedProductIds);
        // console.log("Fetched product details:", response);
        if (response.success) {
          setProductDetails(response.data);
        } else {
          console.error("Failed to fetch product details:", response.message);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [selectedProductIds]);

  const handleProductSelection = (ids) => {
    setSelectedProductIds(ids);
    console.log("Selected product IDs updated:", ids);
  };

  const handleSave = () => {
    console.log("Saving product IDs:", selectedProductIds);
    onSave(selectedProductIds);
  };

  const removeProduct = (idToRemove) => {
    setSelectedProductIds((prev) => prev.filter((id) => id !== idToRemove));
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-4">New Arrivals</h2>
      <p className="text-gray-400 mb-4">
        Select products for the new arrivals section
      </p>

      <div className="mb-6">
        <div className="flex flex-wrap gap-4 mb-5 min-h-[80px] p-5 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
          {loading ? (
            <div className="w-full flex justify-center items-center py-4">
              <svg
                className="animate-spin h-5 w-5 text-blue-500 mr-3"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-gray-300 font-medium">Loading products...</p>
            </div>
          ) : selectedProductIds.length > 0 ? (
            productDetails.map((product) => (
              <div
                key={product._id}
                className="bg-gray-750 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-650 flex items-center group"
              >
                <div className="flex items-center p-3">
                  <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0 border border-gray-600 shadow-sm">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col ml-4 mr-6">
                    <p className="text-white text-sm font-semibold line-clamp-1 tracking-wide">
                      {product.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 font-mono">
                      {product.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeProduct(product._id)}
                  className="bg-gray-750 p-3 transition-all duration-200 h-full flex items-center justify-center border-l border-gray-650 group-hover:bg-gray-700 w-12"
                  title="Remove product"
                >
                  <Trash
                    size={18}
                    className="text-gray-400 group-hover:text-red-400 transition-colors duration-200"
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-gray-750 p-4 rounded-full mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <p className="text-gray-300 font-medium">No products selected</p>
              <p className="text-gray-500 text-sm mt-1">
                Click "Add Products" to showcase your new arrivals
              </p>
            </div>
          )}
        </div>

        <button
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md mb-4 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow"
          onClick={() => setIsPopupOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Products
        </button>
      </div>

      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        onClick={handleSave}
      >
        Save New Arrivals
      </button>

      <ProductSearchPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSelect={handleProductSelection}
        selectedIds={selectedProductIds}
      />
    </div>
  );
};

export default AdminSettingsNewArrival;
