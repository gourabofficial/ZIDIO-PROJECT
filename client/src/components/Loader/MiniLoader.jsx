import React from 'react';
import PropTypes from 'prop-types';

const MiniLoader = ({ size = 'medium', fullScreen = false }) => {
  // Define size variants for the loader
  const sizeVariants = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-4',
  };

  // Apply appropriate classes based on size and animation
  const spinnerClasses = `${sizeVariants[size]} rounded-full animate-spin border-t-transparent border-l-transparent border-purple-500`;

  // Fullscreen loader with backdrop and spinner
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0c0e16]/80 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <div className={spinnerClasses}></div>
          <p className="mt-3 text-sm text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Inline spinner for smaller contexts
  return (
    <div className="flex items-center justify-center">
      <div className={spinnerClasses}></div>
    </div>
  );
};

// Define prop types for better type-checking
MiniLoader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullScreen: PropTypes.bool,
};

export default MiniLoader;