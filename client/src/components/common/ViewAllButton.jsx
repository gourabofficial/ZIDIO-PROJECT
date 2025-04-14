import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const ViewAllButton = ({ text = "text", url = "url" }) => {
  return (
    <div className="flex justify-center ">
      <Link 
        to={url}
        className="px-6 py-3 bg-[#1e293b] text-white rounded-md hover:bg-[#334155] transition-all duration-300 flex items-center group"
      >
        <span>{text}</span>
        <FiArrowRight className="ml-2 transform transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default ViewAllButton;