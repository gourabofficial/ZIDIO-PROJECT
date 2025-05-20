import React, { useState, useEffect } from "react";
import ProductSearchPopup from "./ProductSearchPopup";
import { getProductsbyMultipleIds } from "../../Api/admin";
import { Trash } from "lucide-react";

const AdminSettingsTrendingItems = ({ selectedIds = [], onSave }) => {
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
      <h2 className="text-xl font-semibold text-white mb-4">Trending Items</h2>
      <p className="text-gray-400 mb-4">
        Select products for the trending items
      </p>

      <div className="mb-4">
        <div className="flex flex-wrap gap-3 mb-4 min-h-[60px] p-2 bg-gray-700 rounded-md">
          {loading ? (
            <p className="text-gray-400">Loading products...</p>
          ) : selectedProductIds.length > 0 ? (
            productDetails.map((product) => (
              <div
                key={product._id}
                className="bg-gray-600 p-2 rounded-md flex items-center gap-10"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded mr-2"
                  />
                  <div className="flex flex-col">
                    <p className="text-white text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="text-gray-400 text-xs">{product.id}</p>
                  </div>
                </div>
                <Trash
                  className="text-red-500 cursor-pointer ml-auto"
                  onClick={() => removeProduct(product._id)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400">No products selected</p>
          )}
        </div>

        <button
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md mb-4"
          onClick={() => setIsPopupOpen(true)}
        >
          Add Products
        </button>
      </div>

      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        onClick={handleSave}
      >
        Save Trending Items
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

export default AdminSettingsTrendingItems;
