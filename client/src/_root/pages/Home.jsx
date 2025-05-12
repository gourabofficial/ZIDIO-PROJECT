import React, { useEffect, useState } from "react";
import HeroSection from "../../components/Hero/HeroSection";
import FeaturedProducts from "../../components/FeaturedProducts/FeatureProduct";
import TrendingProductsPage from "../../components/TrandingProducts/TrandingProductsPage";
import HotProduct from "../../components/FeaturedProducts/Hotlist";
import { getHomeContent } from "../../Api/public";

const Home = () => {
  const [homeContent, setHomeContent] = useState();

  // fetchHomeContent
  const FetcHomeContent = async () => {
    const res = await getHomeContent();
    setHomeContent(res.data);
  };

  useEffect(() => {
    FetcHomeContent();
  }, []);

  return (
    <div>
      <div className="min-h-screen">
        <HeroSection />
        <FeaturedProducts newArrival={homeContent?.newArrivals} />
        <TrendingProductsPage trendingProduct={homeContent?.trendingItems} />
        <HotProduct HotProduct={homeContent?.hotItems} />
      </div>
    </div>
  );
};

export default Home;
