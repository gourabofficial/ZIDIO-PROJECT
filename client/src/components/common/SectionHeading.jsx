import React from 'react';

const SectionHeading = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 relative inline-block">
        <span style={{ color: '#ffffff' }} className="text-white">{title}</span>
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
      </h2>
      {description && (
        <p style={{ color: '#cbd5e1' }} className="text-[#cbd5e1] text-center mt-4 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;