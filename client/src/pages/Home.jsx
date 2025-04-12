import { useEffect } from 'react';
import HeroSection from '../components/Hero/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts/FeatureProduct';

const Home = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProducts />
    </div>
  );
};

export default Home;