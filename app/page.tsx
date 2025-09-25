"use client";

import { useState, useEffect } from 'react';
import RudrakshaConsultation from "./components/AstrologyConsultant";
import SacredCollections from "./components/BannerCatalog";
import BlogSection from "./components/BlogSlider";
import ElegantCategorySlider from "./components/ExclusiveSlider";
import FAQPage from "./components/FAQ";
import HeroBanner from "./components/HeroBanner";
import MissionPage from "./components/MissionChooseUs";
import SacredCollection from "./components/SacredProduct";
import { homeData, ApiResponse } from './libs/api';
import LoadingSpinner from './components/LoadingSpinner';



export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeContent, setHomeContent] = useState<any>(null);
 

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response: ApiResponse = await homeData();
       
          setHomeContent(response);
       
      } catch (err: any) {
        console.error('Error fetching home data:', err);
        setError(err.message || 'An error occurred while loading content');
        // Still set default content even on error
        setHomeContent({});
     
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }
  
  console.log(homeContent);
  

  return (
    <div className="home-page">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 text-center">
          <p>{error}</p>
          <p className="text-sm">Showing default content</p>
        </div>
      )}
     <HeroBanner homeData={homeContent.banners} />

      <SacredCollection products={homeContent.product_lists}  categories={homeContent.category_lists} />
      <SacredCollections />
      <ElegantCategorySlider products={homeContent.exclusiveproduct_lists} />
      <RudrakshaConsultation />
      <BlogSection homeData={homeContent.posts} />
      <MissionPage  />
      <FAQPage />
    </div>
  );
}