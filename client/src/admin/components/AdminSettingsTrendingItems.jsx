import React, { useState, useEffect } from "react";
import ProductSearchPopup from "./ProductSearchPopup"; 

const AdminSettingsTrendingItems = ({ selectedIds = [], onSave }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  useEffect(() => {
    setSelectedProductIds(selectedIds);
  }, [selectedIds]);

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
      <p className="text-gray-400 mb-4">Select products for the trending items</p>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-2 bg-gray-700 rounded-md">
          {selectedProductIds.length > 0 ? (
            selectedProductIds.map((id) => (
              <div
                key={id}
                className="bg-gray-600 px-3 py-1 rounded-full flex items-center"
              >
                <span className="text-white mr-2">{id}</span>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => removeProduct(id)}
                >
                  ×
                </button>
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
