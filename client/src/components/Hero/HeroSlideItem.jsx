import React from 'react';

const HeroSlideItem = ({ slide }) => {
  return (
    <div className="w-full max-w-[300px]"> 
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
          <p className="text-slate-300 mb-3">{slide.description}</p>
          <p className="text-slate-400 text-sm italic">{slide.extraDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSlideItem;
