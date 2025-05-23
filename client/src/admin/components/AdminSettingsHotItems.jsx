import React, { useState, useEffect } from "react";
import ProductSearchPopup from "./ProductSearchPopup";
import { getProductsbyMultipleIds } from "../../Api/admin";
import {
  Trash,
  PackagePlus,
  Flame,
  Save,
  AlertCircle,
  Loader,
  ShoppingBag,
  Info,
} from "lucide-react";

const AdminSettingsHotItems = ({ selectedIds = [], onSave }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Initialize selected IDs from props
  useEffect(() => {
    setSelectedProductIds(selectedIds);
    setIsDirty(false);
  }, [selectedIds]);

  // Fetch product details when selected IDs change
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (selectedProductIds.length === 0) {
        setProductDetails([]);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await getProductsbyMultipleIds(selectedProductIds);

        if (response.success) {
          // Maintain the order of products based on selectedProductIds
          const orderedProducts = selectedProductIds
            .map((id) => response.data.find((product) => product._id === id))
            .filter(Boolean); // Remove any undefined entries

          setProductDetails(orderedProducts);
        } else {
          setError(response.message || "Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(error.message || "An error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [selectedProductIds]);

  // Handle product selection from popup
  const handleProductSelection = (ids) => {
    setSelectedProductIds(ids);
    setIsDirty(true);
  };

  // Handle save button click
  const handleSave = async () => {
    if (!isDirty) return;

    setSaving(true);
    try {
      await onSave(selectedProductIds);
      setIsDirty(false);
    } catch (error) {
      console.error("Error saving hot items:", error);
      setError("Failed to save hot items. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Remove a product from selection
  const removeProduct = (idToRemove) => {
    setSelectedProductIds((prev) => prev.filter((id) => id !== idToRemove));
    setIsDirty(true);
  };

  return (
    <div className="space-y-6">
      {/* Error display */}
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-center">
          <AlertCircle className="mr-2 text-red-400 flex-shrink-0" size={18} />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-300 transition-colors"
          >
            &times;
          </button>
        </div>
      )}

      {/* Product Selection Area */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Flame className="text-orange-400 mr-2" size={18} />
            <h3 className="text-white font-medium">Hot Products</h3>
          </div>
          <div className="bg-orange-900/40 text-orange-300 text-xs font-medium px-2.5 py-1 rounded-full">
            {selectedProductIds.length} products
          </div>
        </div>

        <div className="min-h-[180px] bg-gray-800/50 rounded-lg border border-gray-700 p-2 overflow-hidden shadow-inner">
          {loading ? (
            <div className="flex justify-center items-center h-full py-12">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                  <div
                    className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-400 absolute top-0 left-0"
                    style={{ animationDuration: "1.2s" }}
                  ></div>
                </div>
                <p className="text-gray-300 font-medium mt-4">
                  Loading products...
                </p>
              </div>
            </div>
          ) : selectedProductIds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {productDetails.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-750 rounded-lg overflow-hidden transition-all duration-300
                    border border-gray-650 flex items-center group hover:shadow-md hover:border-orange-800/40"
                >
                  <div className="flex items-center flex-1 p-2.5">
                    <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0 border border-gray-600 shadow-sm bg-gray-800">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/150?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <ShoppingBag size={18} className="text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col ml-4 overflow-hidden">
                      <p className="text-white text-sm font-semibold line-clamp-1 tracking-wide">
                        {product.name}
                      </p>
                      <div className="flex items-center mt-1">
                        {product.discount > 0 ? (
                          <>
                            <span className="text-gray-400 text-xs font-medium line-through mr-2">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </span>
                            <span className="text-orange-400 text-xs font-medium mr-2">
                              ₹
                              {Number(
                                product.price -
                                  (product.price * product.discount) / 100
                              ).toLocaleString("en-IN")}
                            </span>
                            <span className="bg-green-900/40 text-green-400 text-xs px-1.5 py-0.5 rounded">
                              {product.discount}% off
                            </span>
                          </>
                        ) : (
                          <span className="text-orange-400 text-xs font-medium mr-2">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-1 font-mono overflow-hidden text-ellipsis">
                        ID: {product._id?.substring(0, 10)}...
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeProduct(product._id)}
                    className="bg-gray-750 p-3 transition-all duration-200 h-full flex items-center justify-center border-l border-gray-650 group-hover:bg-gray-700 w-12"
                    title="Remove product"
                  >
                    <Trash
                      size={16}
                      className="text-gray-400 group-hover:text-red-400 transition-colors duration-200"
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-750 p-4 rounded-full mb-3">
                <Flame size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-300 font-medium">No hot items selected</p>
              <p className="text-gray-500 text-sm mt-1 max-w-sm">
                Add products to showcase in the Hot Items section of your
                homepage
              </p>
              <button
                className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-md transition-all duration-200 flex items-center gap-2 font-medium"
                onClick={() => setIsPopupOpen(true)}
              >
                <PackagePlus size={16} />
                Select Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Help text */}
      <div className="bg-orange-900/20 border border-orange-700/30 rounded-lg px-4 py-3 text-orange-200 text-sm flex items-start">
        <Info className="text-orange-400 mr-2 flex-shrink-0 mt-0.5" size={16} />
        <div>
          <p className="font-medium mb-1">
            Hot Items appear in a dedicated homepage section
          </p>
          <p className="text-orange-300 opacity-80">
            These products will be prominently displayed to attract customer
            attention. Choose your best-selling or featured products.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <button
          className="px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-md transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow"
          onClick={() => setIsPopupOpen(true)}
        >
          <PackagePlus size={16} />
          Add Hot Products
        </button>

        <button
          className={`
            px-5 py-2.5 rounded-md transition-all duration-200 flex items-center gap-2 font-medium shadow-sm
            ${
              isDirty
                ? "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }
          `}
          onClick={handleSave}
          disabled={!isDirty || saving}
        >
          {saving ? (
            <>
              <Loader size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Product Search Popup */}
      <ProductSearchPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSelect={handleProductSelection}
        selectedIds={selectedProductIds}
        title="Select Hot Items"
        accentColor="orange"
      />
    </div>
  );
};

export default AdminSettingsHotItems;
