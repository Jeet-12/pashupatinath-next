"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  title: string;
  name?: string;
  photo: string;
  summary?: string;
  description?: string;
  price?: number;
  discount?: number;
  originalPrice?: number;
  cat_title?: string;
  category?: string;
  images?: string[];
  photos?: string[];
  image?: string;
}

interface ElegantCategorySliderProps {
  products?: Product[];
}

export default function ElegantCategorySlider({ products }: ElegantCategorySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
 const autoSlideRef = useRef<NodeJS.Timeout | number | null>(null);


  // Transform products to categories format using your existing logic
  const categories = products && products.length > 0 
    ? products.map(product => {
        let productImage = '/placeholder-image.jpg';

        // Use your existing image handling logic
        if (Array.isArray(product.images) && product.images.length > 0) {
          productImage = product.images[0];
        } else if (Array.isArray(product.photos) && product.photos.length > 0) {
          productImage = product.photos[0];
        } else if (typeof product.photo === "string") {
          productImage = product.photo.split(",")[0].trim();
        } else if (typeof product.image === "string") {
          productImage = product.image.split(",")[0].trim();
        }

        // Format the URL
        if (
          productImage &&
          productImage !== '/placeholder-image.jpg' &&
          !productImage.startsWith("http") &&
          !productImage.startsWith("//")
        ) {
          productImage = `https://www.pashupatinathrudraksh.com${productImage.startsWith("/") ? "" : "/"
            }${productImage}`;
        }

        return {
          id: product.id,
          name: (product.title || product.name || "").length > 20
            ? (product.title || product.name || "").substring(0, 20) + "..."
            : (product.title || product.name || ""),
          image: productImage,
          discount: product.discount ? `${product.discount}% Off` : product.discount,
          price: product.price
            ? `₹${Number(product.price).toFixed(2)}`
            : product.price,
          originalPrice:
            product.originalPrice ||
            (product.price ? `₹${Number(product.price).toFixed(2)}` : ""),
          category: product.cat_title || product.category,
          description: extractDescription(product.summary || product.description || 'Divine blessing'),
          benefits: extractBenefits(product.summary || product.description || 'Spiritual benefits')
        };
      })
    : [];

  // Helper function to extract description from HTML content
  function extractDescription(htmlContent: string): string {
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const sentences = text.split('.');
    return sentences[0]?.trim() || 'Divine blessing';
  }

  // Helper function to extract benefits from HTML content
  function extractBenefits(htmlContent: string): string {
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const sentences = text.split('.');
    return sentences[1]?.trim() || 'Spiritual benefits';
  }

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Determine how many items to show based on screen size
  const itemsToShow = isMobile ? 2 : 4;

  useEffect(() => {
  if (categories.length === 0) return;

  autoSlideRef.current = setInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
  }, 4000);

  return () => {
    if (autoSlideRef.current !== null) {
      clearInterval(autoSlideRef.current as number);
    }
  };
}, [categories.length]);


  // Navigate to next items
  const nextItems = () => {
    if (categories.length === 0) return;
    
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % categories.length
    );
    
    // Reset auto slide timer on manual navigation
    if (autoSlideRef.current !== null) {
  clearInterval(autoSlideRef.current as number);
  autoSlideRef.current = setInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
  }, 4000);
}

  };

  // Navigate to previous items
  const prevItems = () => {
    if (categories.length === 0) return;
    
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + categories.length) % categories.length
    );
    
    // Reset auto slide timer on manual navigation
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % categories.length
        );
      }, 4000);
    }
  };

  // Calculate transform value for sliding animation
  const getTransformValue = () => {
    if (categories.length === 0) return 'translateX(0%)';
    return `translateX(-${currentIndex * (100 / itemsToShow)}%)`;
  };

  // Clone categories for infinite loop effect
  const extendedCategories = categories.length > 0 
    ? [...categories, ...categories, ...categories] 
    : [];

  // Don't render if no categories
  if (categories.length === 0) {
    return (
      <section className="w-full py-12 bg-gradient-to-b from-amber-50 to-orange-50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5F3623] mb-4">
            Exclusive Rudraksha Collection
          </h2>
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 bg-gradient-to-b from-amber-50 to-orange-50 relative overflow-hidden">
      {/* Decorative curved elements */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5F3623] relative z-10">
              Exclusive Rudraksha Collection
            </h2>
            <div className="absolute -bottom-2 left-1/4 w-1/2 h-2 bg-amber-300/40 rounded-full -z-10"></div>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Discover the divine energy of authentic Nepalese Rudraksha beads, carefully selected for their spiritual properties
          </p>
        </div>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Main slider container with curved edges */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-amber-100">
            {/* Navigation arrows */}
            <button
              onClick={prevItems}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg hover:bg-amber-50 transition-all duration-300 border border-amber-200 group"
              aria-label="Previous categories"
              disabled={categories.length === 0}
            >
              <svg className="w-5 h-5 text-amber-800 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextItems}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg hover:bg-amber-50 transition-all duration-300 border border-amber-200 group"
              aria-label="Next categories"
              disabled={categories.length === 0}
            >
              <svg className="w-5 h-5 text-amber-800 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Slider with curved design */}
            <div className="relative overflow-hidden">
              <div 
                ref={sliderRef}
                className="transition-transform duration-700 ease-in-out py-8"
                style={{ transform: getTransformValue() }}
              >
                <div className={`grid gap-6 mx-4`} style={{ 
                  gridTemplateColumns: `repeat(${extendedCategories.length}, minmax(0, 1fr))`,
                  width: `${extendedCategories.length * (100 / itemsToShow)}%`
                }}>
                  {extendedCategories.map((category, index) => (
                    <div
                      key={`${category.id}-${index}`}
                      className="relative group cursor-pointer"
                    >
                      {/* Card with curved design */}
                      <div className="bg-gradient-to-b from-white to-amber-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-amber-100 h-full flex flex-col">
                        {/* Image container with curved bottom */}
                        <div className="relative h-44 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/5 to-amber-600/5 z-10"></div>
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-contain scale-90 group-hover:scale-95 transition-transform duration-700"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-image.jpg';
                              target.onerror = null;
                            }}
                          />
                          
                          {/* Discount badge */}
                          {category.discount && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold py-1 px-2 rounded-full shadow-md">
                              {category.discount}
                            </div>
                          )}
                          
                          {/* Floating label */}
                          {/* <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-semibold py-1 px-3 rounded-full shadow-md">
                            {category.name}
                          </div> */}
                          
                          {/* Curved bottom for image section */}
                          <div className="absolute -bottom-4 left-0 w-full h-8 bg-white rounded-t-3xl"></div>
                        </div>
                        
                        {/* Content section */}
                        <div className="p-5 pt-6 flex flex-col flex-grow relative">
                          {/* Decorative curve separator */}
                          <div className="absolute -top-4 left-0 w-full flex justify-center">
                            <div className="w-16 h-4 bg-amber-100 rounded-b-full"></div>
                          </div>
                          
                          <h3 className="font-semibold text-amber-900 text-center mb-2">{category.name}</h3>
                        
                          
                          {/* Price section */}
                          <div className="flex justify-center items-center gap-2 mb-3">
                            {category.price && (
                              <span className="text-lg font-bold text-amber-800">
                                {category.price}
                              </span>
                            )}
                            {category.originalPrice && category.originalPrice !== category.price && (
                              <span className="text-sm text-gray-500 line-through">
                                {category.originalPrice}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-auto text-center">
                            <button className="text-xs font-medium py-2 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                              Explore
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Dots indicator with curved design */}
          <div className="flex justify-center mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-amber-100">
              <div className="flex space-x-2">
                {categories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentIndex % categories.length === index 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 scale-110' 
                        : 'bg-amber-200 hover:bg-amber-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute left-10 bottom-10 w-24 h-24 bg-amber-300/10 rounded-full blur-xl"></div>
        <div className="absolute right-10 top-1/4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
      </div>
      
      {/* Bottom curved element */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
}