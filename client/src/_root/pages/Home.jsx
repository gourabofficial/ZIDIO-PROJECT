import React, { useEffect } from "react";
import HeroSection from "../../components/Hero/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeatureProduct";
import TrendingProductsPage from "../../components/TrandingProducts/TrandingProductsPage";
import HotProduct from "../../components/FeaturedProducts/Hotlist";
import { getHomeContent } from "../../Api/public";

const Home = () => {
  // fetchHomeContent

  const FetcHomeContent = async () => {
    const res = await getHomeContent();
    console.log(res);
  };

  useEffect(() => {
    FetcHomeContent();
  }, []);

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
