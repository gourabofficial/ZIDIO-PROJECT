import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";

// Slider content
const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1628426912206-d88e22da5c76?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Elevate Your Style",
    description: "Discover a collection that transcends ordinary fashion, crafted for those who embrace their unique identity",
    buttonText: "DISCOVER NOW",
    buttonLink: "/collections/nox-collection-ss1-0"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?q=80&w=3036&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "New Arrivals",
    description: "Experience our latest cosmic collection with premium fabrics and avant-garde designs",
    buttonText: "SHOP NEW",
    buttonLink: "/collections/new-arrivals"
  },
  {
    id: 3,
    image: "https://plus.unsplash.com/premium_photo-1664445407815-aed8dbc68488?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Limited Edition",
    description: "Explore our exclusive drops and limited releases before they're gone forever",
    buttonText: "SHOP LIMITED",
    buttonLink: "/collections/limited-edition"
  }
];

const Hero = () => {
  const heroRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const slideInterval = useRef(null);
  
  // Handle slide change with debounce to prevent rapid clicking
  const changeSlide = useCallback((direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (direction === 'next') {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    } else {
      setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    }
    
    // Reset auto slideshow timer when manually changing slides
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      startSlideshow();
    }
    
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);
  
  // Autoplay slideshow
  const startSlideshow = useCallback(() => {
    slideInterval.current = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 800);
      }
    }, 6000);
  }, [isAnimating]);
  
  // Initialize slideshow on component mount
  useEffect(() => {
    startSlideshow();
    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [startSlideshow]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const hero = heroRef.current;
      const rect = hero.getBoundingClientRect();
      
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      
      setMousePosition({ x, y });
    };

    const hero = heroRef.current;
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (hero) {
        hero.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background slides with parallax effect */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-out ${
            currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{ 
            backgroundImage: `url(${slide.image})`,
            backgroundPosition: `${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%`
          }}
        >
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/80 via-[#0f172a]/30 to-[#0f172a]/80 backdrop-blur-[2px]"></div>
          
          {/* Additional overlay effects */}
          <div 
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent opacity-60"
            style={{
              transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          ></div>
        </div>
      ))}
      
      {/* Stars background effect */}
      <div className="absolute top-0 left-0 w-full h-full starry-bg opacity-70 pointer-events-none"></div>
      
      {/* Content slides */}
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`container mx-auto px-4 py-16 absolute inset-0 flex flex-col items-center justify-center z-20 transition-all duration-1000 ease-out ${
            currentSlide === index 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-12'
          }`}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight text-balance text-center glowing-text">
            <span className="text-shimmer">{slide.title}</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-slate-200 text-center text-balance fade-in-up">
            {slide.description}
          </p>
          
          <div className="animate-float-subtle relative group">
            <div className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 opacity-70 blur-sm group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
            <Link
              to={slide.buttonLink}
              className="relative btn inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white font-medium rounded-md shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:scale-105"
            >
              <span className="mr-2">{slide.buttonText}</span>
              <FiArrowRight className="inline-block transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      ))}
      
      {/* Animated spotlight effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute w-[40%] h-[40%] rounded-full bg-gradient-radial from-purple-500/10 via-pink-500/5 to-transparent opacity-70 blur-3xl" 
          style={{ 
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'left 0.3s ease-out, top 0.3s ease-out'
          }}>
        </div>
      </div>
      
      {/* Navigation arrows */}
      <button 
        onClick={() => changeSlide('prev')}
        className="absolute left-4 md:left-8 z-30 bg-black/20 hover:bg-black/40 text-white p-3.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 focus:outline-none border border-white/10 shadow-lg"
        aria-label="Previous slide"
      >
        <FiArrowLeft className="text-xl" />
      </button>
      <button 
        onClick={() => changeSlide('next')}
        className="absolute right-4 md:right-8 z-30 bg-black/20 hover:bg-black/40 text-white p-3.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 focus:outline-none border border-white/10 shadow-lg"
        aria-label="Next slide"
      >
        <FiArrowRight className="text-xl" />
      </button>
      
      {/* Slider indicator dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setCurrentSlide(index);
              
              // Reset interval
              if (slideInterval.current) {
                clearInterval(slideInterval.current);
                startSlideshow();
              }
              
              setTimeout(() => setIsAnimating(false), 800);
            }}
            className={`h-3 rounded-full transition-all duration-500 ${
              currentSlide === index 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 w-10' 
                : 'bg-white/30 hover:bg-white/50 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Enhanced floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => {
          const size = Math.random() > 0.8 ? 2 : 1;
          const opacity = Math.random() * 0.6 + 0.3;
          
          return (
            <div 
              key={i}
              className={`absolute rounded-full animate-float`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: Math.random() > 0.3 ? 'white' : '#c4b5fd',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: opacity,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 15 + 10}s`
              }}
            />
          )
        })}
      </div>
    </div>
  );
};

export default Hero;