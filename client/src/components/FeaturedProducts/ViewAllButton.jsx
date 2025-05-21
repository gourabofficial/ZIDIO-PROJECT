import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useState } from 'react';

const ViewAllButton = ({
  to = "/category",
  text = "VIEW ALL PRODUCTS",
  className = ""
}) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 300); // Reset click effect
  };

  return (
    <div className={`flex justify-center mt-12 ${className}`}>
      <Link
        to={to}
        onClick={handleClick}
        className="relative overflow-hidden px-8 py-3 rounded-xl group transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500 shadow-xl"
      >
        {/* Pure black background with blue hover flash */}
        <span
          className={`absolute inset-0 w-full h-full transition-all duration-300
            ${clicked
              ? "bg-black" // On click, stays black
              : "bg-black group-hover:bg-gradient-to-r group-hover:from-black group-hover:via-blue-700 group-hover:to-black"
            }`}
        ></span>

        {/* Blue glow effect on hover */}
        <span className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md bg-blue-500/30"></span>

        {/* Text and icon */}
        <span className="relative flex items-center justify-center text-white font-semibold tracking-wide uppercase">
          <span>{text}</span>
          <FiArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </Link>
    </div>
  );
};

export default ViewAllButton;
