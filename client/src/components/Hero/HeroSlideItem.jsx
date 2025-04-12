import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const HeroSlideItem = ({ slide }) => {
  return (
    <div className="w-full max-w-[300px]"> {/* ✅ Limit max card width */}
      <div className="bg-[#171a29] rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-purple-500/20 hover:-translate-y-1 h-full flex flex-col">
        <div className="h-64 overflow-hidden">
          <img 
            src={slide.image} 
            alt={slide.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-bold mb-2 text-white">{slide.title}</h3>
          <p className="text-slate-300 mb-4 flex-grow">{slide.description}</p>
          
          <Link
            to={slide.buttonLink}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            <span className="mr-2">{slide.buttonText}</span>
            <FiArrowRight className="inline-block transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSlideItem;
