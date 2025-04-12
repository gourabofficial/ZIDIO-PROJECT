import { useState } from 'react';

const ProductTabs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  
  return (
    <>
      <div className="border-b border-[#334155]">
        <div className="flex space-x-6">
          <TabButton 
            isActive={activeTab === 'description'} 
            onClick={() => setActiveTab('description')}
            label="Description"
          />
          <TabButton 
            isActive={activeTab === 'care'} 
            onClick={() => setActiveTab('care')}
            label="Care Instructions"
          />
          <TabButton 
            isActive={activeTab === 'sizing'} 
            onClick={() => setActiveTab('sizing')}
            label="Size Chart"
          />
        </div>
      </div>
      
      <div className="mt-6">
        {activeTab === 'description' && <DescriptionTab product={product} />}
        {activeTab === 'care' && <CareTab careInstructions={product.careInstructions} />}
        {activeTab === 'sizing' && <SizingTab sizeChart={product.sizeChart} />}
      </div>
    </>
  );
};

const TabButton = ({ isActive, onClick, label }) => {
  return (
    <button 
      className={`px-2 py-3 font-medium transition-colors relative ${isActive ? 'text-[#c4b5fd]' : 'text-[#cbd5e1] hover:text-white'}`}
      onClick={onClick}
    >
      {label}
      {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>}
    </button>
  );
};

const DescriptionTab = ({ product }) => {
  return (
    <div className="text-[#cbd5e1] space-y-4">
      <div className="whitespace-pre-line">
        {product.description}
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#334155]">
        <p className="font-medium mb-2 text-white">Country of Origin:</p>
        <p>{product.origin}</p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#334155]">
        <p className="font-medium mb-2 text-white">Manufactured by:</p>
        <p>{product.manufacturer}</p>
      </div>
    </div>
  );
};

const CareTab = ({ careInstructions }) => {
  return (
    <div className="text-[#cbd5e1]">
      <div className="whitespace-pre-line">
        {careInstructions}
      </div>
    </div>
  );
};

const SizingTab = ({ sizeChart }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[#cbd5e1] text-sm">
        <thead className="bg-[#1e293b] text-white">
          <tr>
            <th className="px-4 py-3 text-left">Size</th>
            <th className="px-4 py-3 text-left">Chest (inches)</th>
            <th className="px-4 py-3 text-left">Length (inches)</th>
            <th className="px-4 py-3 text-left">Sleeve (inches)</th>
            <th className="px-4 py-3 text-left">Shoulder (inches)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#334155]">
          {Object.entries(sizeChart).map(([size, measurements]) => (
            <tr key={size}>
              <td className="px-4 py-3 font-medium text-white">{size}</td>
              <td className="px-4 py-3">{measurements.chest}"</td>
              <td className="px-4 py-3">{measurements.length}"</td>
              <td className="px-4 py-3">{measurements.sleeve}"</td>
              <td className="px-4 py-3">{measurements.shoulder}"</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTabs;