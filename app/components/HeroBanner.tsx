"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

// interface BannerItem {
//   id: number;
//   title: string;
//   slug: string;
//   description: string | null;
//   photo: string;
//   status: string;
//   created_at: string;
//   updated_at: string;
// }

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 1920, height: 1080 });
  const [windowWidth, setWindowWidth] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  const slides =  [
        {
          id: 0,
          image: "https://www.pashupatinathrudraksh.com/storage/app/public/files/2/twpercentage.jpg",
          title: "20 percentage offer on all rudraksh",
        },
        {
          id: 1,
          image: "https://www.pashupatinathrudraksh.com/storage/app/public/files/2/Special%20Discount.jpg",
          title: "10 percentage offer on all rudraksh",
        },
        {
          id: 2,
          image: "https://www.pashupatinathrudraksh.com/storage/app/public/files/2/Current%20Event%20indore.jpg",
          title: "Indore Event",
        },
      ];


  useEffect(() => {
    setHasMounted(true);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleImageLoad = (e: any, index: number) => {
    if (index === currentSlide) {
      setImageDimensions({
        width: e.target.naturalWidth,
        height: e.target.naturalHeight,
      });
    }
  };

  const calculateHeight = () => {
    if (!hasMounted || windowWidth === 0) return 400;
    if (isMobile) return Math.min(windowWidth * (9 / 16), 500);
    const aspectRatio = imageDimensions.height / imageDimensions.width;
    const height = windowWidth * aspectRatio;
    return Math.max(400, Math.min(height, 800));
  };

  if (!hasMounted) return null;

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="relative w-full" style={{ height: `${calculateHeight()}px` }}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
              onLoad={(e) => handleImageLoad(e, index)}
            />
            <div className="absolute inset-0 bg-black/30"></div>

           
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 md:space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'bg-[#f5821f] scale-125' : 'bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
        className="hidden md:block absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 p-2 lg:p-3 rounded-full shadow-md hover:bg-white transition-colors"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 lg:w-6 lg:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
        className="hidden md:block absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 p-2 lg:p-3 rounded-full shadow-md hover:bg-white transition-colors"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 lg:w-6 lg:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="hidden md:block absolute top-1/4 right-10 lg:right-20 w-48 h-48 lg:w-72 lg:h-72 bg-[#f5821f]/20 rounded-full blur-xl lg:blur-3xl z-0"></div>
      <div className="hidden md:block absolute bottom-10 lg:bottom-20 left-10 lg:left-20 w-64 h-64 lg:w-96 lg:h-96 bg-[#5F3623]/20 rounded-full blur-xl lg:blur-3xl z-0"></div>
    </section>
  );
}
