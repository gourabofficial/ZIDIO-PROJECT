import React from 'react';

const TrendingHeader = () => {
  return (
    <div className="mb-12 ">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        <span className="relative">
          Trending Products
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></span>
        </span>
      </h1>
      <p className="text-center text-slate-300 max-w-2xl mx-auto">
        Discover our hottest products that everyone is talking about right now. Updated weekly based on popularity and customer favorites.
      </p>
    </div>
  );
};

export default TrendingHeader;