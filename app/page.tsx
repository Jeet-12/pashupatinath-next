"use client";

import { useState, useEffect } from 'react';
import SacredCollections from "./components/BannerCatalog";
import BlogSection from "./components/BlogSlider";
import ElegantCategorySlider from "./components/ExclusiveSlider";
import FAQPage from "./components/FAQ";
import HeroBanner from "./components/HeroBanner";
import MissionPage from "./components/MissionChooseUs";
import SacredCollection from "./components/SacredProduct";
import { homeData, ApiResponse } from './libs/api';

// Skeleton Loader Components
const SacredCollectionSkeleton = () => (
  <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ElegantCategorySliderSkeleton = () => (
  <section className="py-16 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded w-72 mx-auto mb-4 animate-pulse"></div>
      </div>
      <div className="flex space-x-6 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-80 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const BlogSectionSkeleton = () => (
  <section className="py-16 bg-amber-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SacredCollectionsSkeleton = () => (
  <section className="py-16 bg-gradient-to-b from-white to-amber-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded w-56 mx-auto mb-4 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded-xl w-40"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeContent, setHomeContent] = useState<any>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response: ApiResponse = await homeData();
        console.log('Home data fetched successfully:', response);
        if (response) {
          setHomeContent(response);
          
        } else {
          setHomeContent({
            product_lists: [],
            category_lists: [],
            exclusiveproduct_lists: [],
            posts: []
          });
        }
      } catch (err: any) {
        console.error('Error fetching home data:', err);
        setError(err.message || 'An error occurred while loading content');
        setHomeContent({
          product_lists: [],
          category_lists: [],
          exclusiveproduct_lists: [],
          posts: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="home-page">
        <HeroBanner />
        <SacredCollectionSkeleton />
        <SacredCollectionsSkeleton />
        <ElegantCategorySliderSkeleton />
        <BlogSectionSkeleton />
        <MissionPage />
        <FAQPage />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="home-page">
        <HeroBanner />
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Unable to Load Content</h2>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2">Please check your internet connection and try again.</p>
        </div>
        <MissionPage />
        <FAQPage />
      </div>
    );
  }

  // Check if we have any data to show
  const hasProducts = homeContent?.product_lists?.length > 0;
  const hasCategories = homeContent?.category_lists?.length > 0;
  const hasExclusiveProducts = homeContent?.exclusiveproduct_lists?.length > 0;
  const hasBlogPosts = homeContent?.posts?.length > 0;

  // If no data at all, show a message
  if (!hasProducts && !hasCategories && !hasExclusiveProducts && !hasBlogPosts) {
    return (
      <div className="home-page">
        <HeroBanner />
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">No Content Available</h2>
          <p className="text-gray-600">Please check back later for updates.</p>
        </div>
        <MissionPage />
        <FAQPage />
      </div>
    );
  }

  // Only show components when data is loaded and available
  return (
    <div className="home-page">
      <HeroBanner />
      
      {/* Only show SacredCollection if we have products or categories */}
      {(hasProducts || hasCategories) && (
        <SacredCollection 
          products={homeContent?.product_lists || []}  
          categories={homeContent?.category_lists || []} 
        />
      )}

      {/* SacredCollections - show only if it has content */}
      <SacredCollections />

      {/* Only show ElegantCategorySlider if we have exclusive products */}
      {hasExclusiveProducts && (
        <ElegantCategorySlider products={homeContent?.exclusiveproduct_lists || []} />
      )}

      {/* Only show BlogSection if we have posts */}
      {hasBlogPosts && (
        <BlogSection homeData={homeContent?.posts || []} />
      )}

      {/* Always show these components */}
      <MissionPage />
      <FAQPage />
    </div>
  );
}