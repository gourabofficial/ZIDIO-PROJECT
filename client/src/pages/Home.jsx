import { useEffect } from 'react';
import HeroSection from '../components/Hero/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts/FeatureProduct';
import TrendingProductsPage from '../components/TrandingProducts/TrandingProductsPage';
import HotProduct from './HotProduct';
import WomenCollection from './WomenCollection';

const Home = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProducts />
      <TrendingProductsPage />
      <HotProduct />
      <WomenCollection />
    </div>
  );
};

export default Home;