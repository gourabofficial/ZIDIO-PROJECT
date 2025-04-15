import React from "react";
import HeroSection from "../../components/Hero/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeatureProduct";
import TrendingProductsPage from "../../components/TrandingProducts/TrandingProductsPage";
import HotProduct from "../../components/FeaturedProducts/Hotlist";
import CropTopsPage from "../../components/WomenCollection/CroptopPages";

 const Home = () => {
  return (
    <div>
      <div className="min-h-screen">
        <HeroSection />
        <FeaturedProducts />
        <TrendingProductsPage />
        <HotProduct />
        <CropTopsPage />
      </div>
    </div>
  );
};

export default Home;