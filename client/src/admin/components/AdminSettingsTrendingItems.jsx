import React, { useState, useEffect } from 'react';

const AdminSettingsTrendingItems = ({ selectedIds = [], onSave }) => {
  const [productIds, setProductIds] = useState('');

  useEffect(() => {
    // Convert array to comma-separated string for the input
    setProductIds(selectedIds.join(', '));
  }, [selectedIds]);

  const handleSave = () => {
    // Convert the comma-separated string to an array, trim whitespace
    const idsArray = productIds.split(',').map(id => id.trim()).filter(id => id);
    onSave(idsArray);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Trending Items</h2>
      <p className="text-gray-400 mb-4">Enter product IDs for trending items section (comma-separated)</p>
      
      <textarea
        className="w-full p-2 bg-gray-700 text-white rounded-md mb-4"
        rows="3"
        placeholder="e.g. prod123, prod124, prod125"
        value={productIds}
        onChange={(e) => setProductIds(e.target.value)}
      />
      
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        onClick={handleSave}
      >
        Save Trending Items
      </button>
    </div>
  );
};

export default AdminSettingsTrendingItems;