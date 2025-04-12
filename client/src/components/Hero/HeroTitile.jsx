import React, { useEffect, useRef } from 'react';

const HeroTitle = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    if (titleRef.current) {
      const title = titleRef.current;
      const text = title.textContent;
      title.textContent = '';

      [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = `translateY(${Math.random() * 40 - 20}px) rotateZ(${Math.random() * 20 - 10}deg)`;
        span.style.transition = `all 0.5s ease`;
        span.style.transitionDelay = `${index * 0.03}s`;
        
        // Apply elegant white color with subtle glow
        span.style.color = '#ffffff';
        span.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(150, 170, 255, 0.3)';
        
        title.appendChild(span);

        setTimeout(() => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0) rotateZ(0)';
        }, 100);
      });
    }
  }, []);

  return (
    <div className="container mx-auto px-4 mb-8 relative">
      <div className="relative z-10 py-20 text-center">
        {/* Removed the title tag "Experience the Universe" */}
        
        {/* Main title with animation */}
        <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
          WELCOME TO COSMIC HEROS
        </h1>

        {/* Animated underline */}
        <div className="h-1 w-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full mx-auto mb-8 animate-expand"></div>

        <p className="text-center text-slate-300 max-w-2xl mx-auto text-lg mb-10 animate-fadeIn opacity-0" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          Discover exceptional products crafted for those who appreciate quality and refined elegance
        </p>

        <div className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full relative overflow-hidden group cursor-pointer animate-fadeIn opacity-0" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
          <span className="relative z-10 text-white font-medium">Explore Our Universe</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-indigo-600 to-purple-600 origin-left transition-transform duration-500"></div>
        </div>
      </div>

      {/* Animations CSS */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes expand {
          from { width: 0; }
          to { width: 200px; }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-expand {
          animation: expand 2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
};

export default HeroTitle;