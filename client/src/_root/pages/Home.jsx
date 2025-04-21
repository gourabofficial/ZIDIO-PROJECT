import React from "react";
import HeroSection from "../../components/Hero/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeatureProduct";
import TrendingProductsPage from "../../components/TrandingProducts/TrandingProductsPage";
import HotProduct from "../../components/FeaturedProducts/Hotlist";

 const Home = () => {
  return (
    <div>
      <div className="min-h-screen">
        <HeroSection />
        <FeaturedProducts />
        <TrendingProductsPage />
        <HotProduct />
        
      </div>
    </div>
  );
};

export default Home;