import React from 'react';

const CollectionHeader = ({ title }) => {
  return (
    <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h1>
  );
};

export default CollectionHeader;