"use client";

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addToWishlistApiWithNotify, singleAddToCart } from '../../libs/api';
import Link from 'next/link';
import { fetchProductDetails, ProductDetails as ApiProductDetails, Review as ApiReview } from '../../libs/api';
import { motion, AnimatePresence } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

type Product = ApiProductDetails;
type Review = ApiReview;

type RelatedProduct = {
  id: number;
  title: string;
  slug: string;
  price: number;
  oldPrice?: number;
  rating: number;
  discount: number;
  stock: number;
  photo: string;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
};

// Define the type for the newReview state
type NewReviewState = {
  rating: number;
  title: string;
  comment: string;
};

// Enhanced Desktop Zoom Component with Fixed Zoom Logic
const DesktopZoom = ({ 
  items, 
  product 
}: { 
  items: Array<{ type: 'image' | 'video'; src: string }>;
  product: Product;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  // Configuration
  const lensSize = 100;
  const zoomLevel = 2;
  const previewSize = 400;

  // Update container size on mount and resize
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    
    return () => window.removeEventListener('resize', updateContainerSize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || items[selectedIndex].type === 'video' || !imageLoaded) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate mouse position relative to container
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    // Constrain lens position within container bounds
    const maxX = rect.width - lensSize;
    const maxY = rect.height - lensSize;
    
    mouseX = Math.max(0, Math.min(mouseX, maxX));
    mouseY = Math.max(0, Math.min(mouseY, maxY));

    // Update lens position (center the lens on cursor)
    setLensPosition({ 
      x: mouseX - lensSize / 2, 
      y: mouseY - lensSize / 2 
    });

    // Calculate zoom position (percentage based)
    const backgroundX = (mouseX / rect.width) * 100;
    const backgroundY = (mouseY / rect.height) * 100;

    // Calculate zoom image position (inverse of cursor position)
    const zoomX = (backgroundX / 100) * (rect.width * zoomLevel - previewSize);
    const zoomY = (backgroundY / 100) * (rect.height * zoomLevel - previewSize);

    setZoomPosition({ 
      x: -zoomX,
      y: -zoomY
    });
    
    setIsZoomActive(true);
  };

  const handleMouseLeave = () => {
    setIsZoomActive(false);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setIsZoomActive(false);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const currentItem = items[selectedIndex];

  return (
    <div className="hidden lg:block space-y-6">
      {/* Main Image Container */}
      <motion.div 
        ref={containerRef}
        className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-2xl cursor-crosshair border border-amber-100"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Premium Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
          {/* {product.is_featured && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg"
            >
              ✨ FEATURED
            </motion.span>
          )} */}
          {product.discount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-red-500 to-orange-600 text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg"
            >
              🔥 {product.discount}% OFF
            </motion.span>
          )}
        </div>

        {/* Main Image/Video */}
        <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100">
          {currentItem.type === 'image' ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
                  />
                </div>
              )}
              <Image
                src={currentItem.src}
                alt={product.title}
                fill
                className="object-contain transition-opacity duration-300"
                onLoad={handleImageLoad}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.jpg';
                }}
                style={{ opacity: imageLoaded ? 1 : 0 }}
              />
            </>
          ) : (
            <VideoPlayer src={currentItem.src} title={product.title} />
          )}
        </div>

        {/* Enhanced Zoom Lens */}
        {currentItem.type === 'image' && isZoomActive && imageLoaded && (
          <motion.div
            ref={lensRef}
            className="absolute border-2 border-amber-400 rounded-lg pointer-events-none z-10 shadow-2xl bg-white/10 backdrop-blur-sm"
            style={{
              width: `${lensSize}px`,
              height: `${lensSize}px`,
              left: `${lensPosition.x}px`,
              top: `${lensPosition.y}px`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="absolute inset-0 border-2 border-white/50 rounded-lg" />
          </motion.div>
        )}

        {/* Enhanced Zoom Preview */}
        {currentItem.type === 'image' && isZoomActive && imageLoaded && (
          <motion.div
            ref={zoomRef}
            className="absolute left-full ml-6 top-0 w-[400px] h-[400px] bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div 
              className="absolute inset-0 bg-no-repeat bg-origin-border"
              style={{
                backgroundImage: `url(${currentItem.src})`,
                backgroundSize: `${containerSize.width * zoomLevel}px ${containerSize.height * zoomLevel}px`,
                backgroundPosition: `${zoomPosition.x}px ${zoomPosition.y}px`,
              }}
            />
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm px-3 py-2 rounded-xl shadow-lg">
              🔍 Zoom Preview
            </div>
          </motion.div>
        )}

        {/* Enhanced Zoom Hint */}
        {currentItem.type === 'image' && !isZoomActive && (
          <motion.div 
            className="absolute bottom-6 right-6 bg-gradient-to-r from-black/80 to-black/60 text-white text-sm px-4 py-3 rounded-xl backdrop-blur-sm pointer-events-none shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center space-x-2">
              <span>🖱️ Hover to Zoom</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Thumbnail Strip */}
      {items.length > 1 && (
        <motion.div 
          className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {items.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-24 h-24 rounded-2xl border-3 overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl ${
                selectedIndex === index 
                  ? 'border-amber-500 scale-110 shadow-amber-200' 
                  : 'border-gray-300 hover:border-amber-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={`${product.title} ${index + 1}`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Review Stars Component
const ReviewStars = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating 
              ? 'text-yellow-400 fill-current' 
              : star <= Math.floor(rating) + 0.5 && star > rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      </div>
    );
};

// Premium Trust Badges Component
const TrustBadges = () => {
  const badges = [
    {
      icon: '🛡️',
      title: 'Authenticity Guaranteed',
      description: '100% Genuine Certification'
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: '256-bit SSL Encrypted'
    },
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'Above ₹2000 Orders'
    },
    {
      icon: '↩️',
      title: 'Easy Returns',
      description: '7-Day Return Policy'
    },
    {
      icon: '🙏',
      title: 'Blessed & Energized',
      description: 'Puja Certified'
    },
    {
      icon: '💎',
      title: 'Premium Quality',
      description: 'Handpicked Selection'
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
    >
      {badges.map((badge, index) => (
        <motion.div 
          key={index}
          className="flex items-center space-x-3 bg-gradient-to-br from-white to-amber-50 rounded-2xl p-4 border border-amber-200 shadow-sm hover:shadow-md transition-all duration-300"
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <div className="text-2xl">{badge.icon}</div>
          <div>
            <div className="font-bold text-amber-900 text-sm">{badge.title}</div>
            <div className="text-gray-600 text-xs">{badge.description}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Enhanced Review Images Component
const ReviewImages = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="flex space-x-2 mt-3">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => setSelectedImage(index)}
            className="w-16 h-16 rounded-xl border-2 border-gray-300 overflow-hidden flex-shrink-0 hover:border-amber-500 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={image}
              alt={`Review image ${index + 1}`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </motion.button>
        ))}
      </div>

      {/* Enhanced Image Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div 
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative max-w-6xl max-h-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <button
                className="absolute -top-16 right-0 text-white text-3xl z-10 hover:text-amber-500 transition-colors bg-black/50 rounded-full p-2"
                onClick={() => setSelectedImage(null)}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Image
                src={images[selectedImage]}
                alt={`Review image ${selectedImage + 1}`}
                width={800}
                height={600}
                className="object-contain max-h-[80vh] rounded-2xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Enhanced Video Player Component
const VideoPlayer = ({ src, title }: { src: string; title: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed') || url.includes('vimeo.com/')) {
      return url;
    }
    
    if (url.includes('youtube.com')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return videoId ? `https://www.youtube.com/embed/${videoId[1]}?autoplay=1&rel=0` : url;
    }
    
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/);
      return videoId ? `https://player.vimeo.com/video/${videoId[1]}?autoplay=1` : url;
    }
    
    return url;
  };

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
          />
        </div>
      )}
      <iframe
        src={getVideoEmbedUrl(src)}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

// Enhanced Mobile Slider Component
const MobileImageSlider = ({ 
  items, 
  product 
}: { 
  items: Array<{ type: 'image' | 'video'; src: string }>;
  product: Product;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="lg:hidden">
      <motion.div 
        className="relative h-80 bg-gradient-to-br from-white to-amber-50 rounded-3xl overflow-hidden shadow-2xl border border-amber-100"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Premium Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {/* {product.is_featured && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold py-2 px-3 rounded-full shadow-lg">
              ✨ FEATURED
            </span>
          )} */}
          {product.discount > 0 && (
            <span className="bg-gradient-to-r from-red-500 to-orange-600 text-white text-xs font-bold py-2 px-3 rounded-full shadow-lg">
              🔥 {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Slides */}
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ${
              index === currentIndex ? 'translate-x-0' : 
              index < currentIndex ? '-translate-x-full' : 'translate-x-full'
            }`}
            initial={false}
          >
            {item.type === 'image' ? (
              <Image
                src={item.src}
                alt={`${product.title} ${index + 1}`}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.jpg';
                }}
              />
            ) : (
              <VideoPlayer src={item.src} title={`${product.title} Video ${index + 1}`} />
            )}
          </motion.div>
        ))}

        {/* Enhanced Navigation Arrows */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-3 rounded-2xl z-10 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/60 text-white p-3 rounded-2xl z-10 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm z-10">
          {currentIndex + 1} / {items.length}
        </div>
      </motion.div>

      {/* Enhanced Thumbnail Strip */}
      {items.length > 1 && (
        <motion.div 
          className="flex space-x-3 mt-4 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {items.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-2xl border-2 overflow-hidden transition-all duration-300 shadow-lg ${
                currentIndex === index 
                  ? 'border-amber-500 scale-105 shadow-amber-200' 
                  : 'border-gray-300 hover:border-amber-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={`${product.title} ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Image URL Handler
const getImageUrl = (image: string | undefined, baseUrl: string = 'https://www.pashupatinathrudraksh.com'): string => {
  if (!image) return '/placeholder-product.jpg';
  
  if (image.startsWith('http')) {
    return image;
  }
  
  // Handle various image path formats
  if (image.startsWith('/storage/')) {
    return `${baseUrl}${image}`;
  }
  
  if (image.startsWith('/')) {
    return `${baseUrl}${image}`;
  }
  
  // Handle comma-separated images
  if (image.includes(',')) {
    const firstImage = image.split(',')[0].trim();
    return getImageUrl(firstImage, baseUrl);
  }
  
  return `${baseUrl}/${image}`;
};

// Calculate average rating from reviews
const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews || reviews.length === 0) return 5;
  
  // FIX: Access the rating property if it exists. Based on API response,
  // the Review type has 'rating' property which is the number of stars.
  // The provided reviews array only contains 0s, which is not correct for summing.
  // Assuming the actual review objects are correct from API, we sum the 'rating' property.
  const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
  return Math.round((total / reviews.length) * 10) / 10;
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // FIX: Use the defined NewReviewState type
  const [newReview, setNewReview] = useState<NewReviewState>({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);
      try {
        const slug = params.slug as string;
        if (!slug) {
          throw new Error('Product slug not found');
        }

        const response = await fetchProductDetails(slug);
        console.log('API Response:', response);
        
        if (response) {
          const respAny = response as any;
          console.log(respAny);
          const productData = respAny.data?.product || respAny.product_detail || respAny.data?.product_detail || respAny;
          const reviewsData = respAny.data?.product_detail?.get_review || respAny.product_detail.get_review || [];
          const related = respAny.data?.related_products || respAny.product_detail.rel_prods || [];
          console.log(related);
          

          setProduct(productData);
          setReviews(reviewsData || []);
          setRelatedProducts(related || []);
        } else {
          throw new Error((response as any)?.message || 'Failed to load product');
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [params.slug]);

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );

    (async () => {
      try {
        await addToWishlistApiWithNotify({ product_id: productId });
      } catch {
        // ignore — UI already updated optimistically
      }
    })();
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock) return;
    setQuantity(value);
  };

  const addToCart = async () => {
    if (!product) return;
    try {
      const total_price = currentPrice * quantity;
      const res = await singleAddToCart({ 
        slug: product.slug, 
        quantity, 
        total_price, 
        selected_cap: null, 
        selected_thread: null 
      });
      
      if (!res.success) {
        alert(res.message || 'Failed to add to cart');
      } else {
        try { 
          window.dispatchEvent(new CustomEvent('countsUpdated')); 
        } catch {}
        alert('Added to cart successfully!');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const buyNow = async () => {
    if (!product) return;
    
    try {
      // First add to cart
      const total_price = currentPrice * quantity;
      const res = await singleAddToCart({ 
        slug: product.slug, 
        quantity, 
        total_price, 
        selected_cap: null, 
        selected_thread: null 
      });
      
      if (res.success) {
        // Redirect to checkout page
        router.push('/checkout');
      } else {
        alert(res.message || 'Failed to process buy now. Please try again.');
      }
    } catch (error) {
      console.error('Buy now error:', error);
      alert('Failed to process buy now. Please try again.');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New review:', newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 5, title: '', comment: '' });
  };

  // Enhanced media items extraction
  const getMediaItems = () => {
    if (!product) return [];
    
    const items: Array<{ type: 'image' | 'video'; src: string }> = [];
    
    // Extract all images from various possible fields
    const allImages: string[] = [];
    
    // From photo field (comma separated)
    if (typeof product.photo === 'string') {
      if (product.photo.includes(',')) {
        allImages.push(...product.photo.split(',').map(img => img.trim()));
      } else {
        allImages.push(product.photo);
      }
    }
    
    // Add unique images
    const uniqueImages = [...new Set(allImages.filter(img => img && img.trim() !== ''))];
    uniqueImages.forEach(image => {
      items.push({ 
        type: 'image', 
        src: getImageUrl(image) 
      });
    });
    
    // Ensure at least one item
    if (items.length === 0) {
      items.push({ type: 'image', src: '/placeholder-product.jpg' });
    }
    
    return items;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
        <div className="container mx-auto px-4">
          <motion.div 
            className="animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-8 bg-amber-200 rounded-2xl w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl"></div>
              <div className="space-y-6">
                <div className="h-10 bg-amber-200 rounded-2xl w-3/4"></div>
                <div className="h-6 bg-amber-200 rounded-2xl w-1/2"></div>
                <div className="h-8 bg-amber-200 rounded-2xl w-1/4"></div>
                <div className="h-32 bg-amber-200 rounded-2xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been moved.</p>
            <Link 
              href="/products" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Explore Sacred Collection
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const hasDiscount = product.discount > 0;
  const currentPrice = hasDiscount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;
  const discountAmount = product.price - currentPrice;
  const isInWishlist = wishlist.includes(product.id);
  const mediaItems = getMediaItems();
  const averageRating = calculateAverageRating(reviews);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4">
        {/* Enhanced Breadcrumb */}
        <motion.nav 
          className="flex items-center space-x-3 text-sm text-amber-700 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/" className="hover:text-amber-900 transition-colors font-medium">🏠 Home</Link>
          <span className="text-amber-400">›</span>
          <Link href="/products" className="hover:text-amber-900 transition-colors font-medium">📦 Products</Link>
          <span className="text-amber-400">›</span>
          <span className="text-amber-900 font-bold">{product.title}</span>
        </motion.nav>

        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Desktop Zoom Component */}
          <DesktopZoom items={mediaItems} product={product} />

          {/* Mobile Slider */}
          <MobileImageSlider items={mediaItems} product={product} />

          {/* Enhanced Product Info */}
          <motion.div 
            className="bg-gradient-to-br from-white to-amber-50 rounded-3xl p-8 shadow-2xl border border-amber-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold text-amber-900 mb-4 leading-tight">{product.title}</h1>
            
            {/* Rating and Category */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <ReviewStars rating={averageRating} size="lg" />
                <span className="ml-3 text-gray-600 font-medium">({averageRating})</span>
              </div>
              <span className="text-amber-400">|</span>
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                {/* {product.cat_info?.title || 'Rudraksh'} */}
              </span>
            </div>

            {/* Enhanced Pricing */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-5xl font-bold bg-gradient-to-r from-[#f5821f] to-orange-600 bg-clip-text text-transparent">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-3xl text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
                )}
              </div>
              {hasDiscount && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-lg inline-block">
                  💰 Save ₹{discountAmount.toLocaleString()} ({product.discount}% OFF)
                </div>
              )}
            </div>

            {/* Enhanced Stock Status */}
            <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-base font-bold mb-6 shadow-lg ${
              product.stock > 10 ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 
              product.stock > 0 ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 
              'bg-gradient-to-r from-red-500 to-pink-600 text-white'
            }`}>
              {product.stock > 10 ? '✅ In Stock - Ready to Ship' : 
               product.stock > 0 ? `⚠️ Only ${product.stock} Left - Order Soon` : 
               '❌ Out of Stock'}
            </div>

            {/* Enhanced Description */}
            <div 
              className="text-gray-700 mb-6 leading-relaxed text-lg bg-amber-50 rounded-2xl p-6 border border-amber-200"
              dangerouslySetInnerHTML={{ __html: product.summary || product.description || 'No description available' }} 
            />

            {/* Enhanced Quantity Selector */}
            <div className="flex items-center space-x-6 mb-8">
              <span className="text-gray-700 font-bold text-lg">Quantity:</span>
              <div className="flex items-center bg-white border-2 border-amber-300 rounded-2xl shadow-lg overflow-hidden">
                <motion.button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-6 py-4 text-gray-600 hover:text-amber-600 disabled:opacity-30 transition-all duration-200 text-xl font-bold"
                  disabled={quantity <= 1}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  -
                </motion.button>
                <span className="px-8 py-4 text-gray-800 font-bold text-xl bg-amber-50 min-w-20 text-center">
                  {quantity}
                </span>
                <motion.button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-6 py-4 text-gray-600 hover:text-amber-600 disabled:opacity-30 transition-all duration-200 text-xl font-bold"
                  disabled={product.stock <= quantity}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  +
                </motion.button>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`flex-1 font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center text-lg ${
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1'
                }`}
                whileHover={product.stock === 0 ? {} : { scale: 1.02 }}
                whileTap={product.stock === 0 ? {} : { scale: 0.98 }}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </motion.button>
              <motion.button
                onClick={buyNow}
                disabled={product.stock === 0}
                className={`flex-1 font-bold py-5 rounded-2xl transition-all duration-300 flex items-center justify-center text-lg ${
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1'
                }`}
                whileHover={product.stock === 0 ? {} : { scale: 1.02 }}
                whileTap={product.stock === 0 ? {} : { scale: 0.98 }}
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Buy Now
              </motion.button>
              <motion.button
                onClick={() => toggleWishlist(product.id)}
                className={`p-5 rounded-2xl border-3 transition-all duration-300 ${
                  isInWishlist
                    ? 'border-red-500 bg-red-50 text-red-500 shadow-lg'
                    : 'border-gray-300 text-gray-600 hover:border-amber-500 hover:text-amber-500 hover:shadow-lg'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg 
                  className="w-7 h-7" 
                  fill={isInWishlist ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.button>
            </div>

            {/* Trust Badges */}
            <TrustBadges />
          </motion.div>
        </div>

        {/* Enhanced Product Details Tabs */}
        <motion.div 
          className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl mb-12 border border-amber-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Enhanced Tab Headers */}
          <div className="border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {['description', 'reviews', 'shipping'].map(tab => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-8 py-5 font-bold text-base border-b-3 transition-all duration-300 ${
                    activeTab === tab
                      ? 'border-amber-500 text-amber-600 bg-white shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-amber-500 hover:bg-white/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'reviews' && (
                    <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                      {reviews.length}
                    </span>
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'description' && (
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-3xl font-bold text-amber-900 mb-6">About this Sacred {product.title}</h3>
                    <div 
                      className="text-gray-700 leading-relaxed text-lg space-y-4"
                      dangerouslySetInnerHTML={{ __html: product.description || product.summary || 'No description available' }} 
                    />
                  </div>
                )}

                {/* Enhanced Reviews Tab */}
                {activeTab === 'reviews' && (
                  <EnhancedReviewsSection 
                    product={product}
                    reviews={reviews}
                    averageRating={averageRating}
                    showReviewForm={showReviewForm}
                    setShowReviewForm={setShowReviewForm}
                    newReview={newReview}
                    setNewReview={setNewReview}
                    handleReviewSubmit={handleReviewSubmit}
                  />
                )}

                {activeTab === 'shipping' && (
                  <EnhancedShippingInfo />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced Related Products */}
        <EnhancedRelatedProducts 
          relatedProducts={relatedProducts}
          getImageUrl={getImageUrl}
        />
      </div>
    </div>
  );
}

// Enhanced Reviews Section Component
const EnhancedReviewsSection = ({
  product,
  reviews,
  averageRating,
  showReviewForm,
  setShowReviewForm,
  newReview,
  setNewReview,
  handleReviewSubmit
}: {
  product: Product;
  reviews: Review[];
  averageRating: number;
  showReviewForm: boolean;
  setShowReviewForm: React.Dispatch<React.SetStateAction<boolean>>;
  newReview: NewReviewState;
  setNewReview: React.Dispatch<React.SetStateAction<NewReviewState>>;
  handleReviewSubmit: (e: React.FormEvent) => void;
}) => {
  // FIX: Explicitly type the anonymous function arguments
  const handleStarClick = (star: number) => {
    setNewReview((prev: NewReviewState) => ({ ...prev, rating: star }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewReview((prev: NewReviewState) => ({ ...prev, title: e.target.value }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview((prev: NewReviewState) => ({ ...prev, comment: e.target.value }));
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h3 className="text-3xl font-bold text-amber-900 mb-4">Customer Experiences</h3>
          <div className="flex items-center space-x-6">
            <div className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              {averageRating}
            </div>
            <div>
              <ReviewStars rating={averageRating} size="lg" />
              <p className="text-gray-600 text-lg mt-2">Based on {reviews.length} authentic reviews</p>
            </div>
          </div>
        </div>
        <motion.button
          onClick={() => setShowReviewForm(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl mt-6 lg:mt-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ✍️ Share Your Experience
        </motion.button>
      </div>

      {/* Enhanced Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-amber-200"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold text-amber-900 mb-6">Share Your Spiritual Experience</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Your Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => handleStarClick(star)}
                        className="text-4xl focus:outline-none transform hover:scale-110 transition-transform"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {star <= newReview.rating ? '⭐' : '☆'}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Review Title</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={handleTitleChange}
                    className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                    placeholder="Summarize your experience..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Detailed Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={handleCommentChange}
                    rows={5}
                    className="w-full border-2 border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                    placeholder="Share your spiritual journey with this product..."
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <motion.button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-bold text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit Review
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Reviews List */}
      <div className="space-y-8">
        {reviews.map((review: Review) => (
          <motion.div 
            key={review.id} 
            className="bg-gradient-to-br from-white to-amber-50 rounded-3xl p-6 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-bold text-gray-900 text-xl mb-2">{review.title || `Review by ${review.userName}`}</h4>
                <div className="flex items-center space-x-4">
                  <ReviewStars rating={review.rating || 5} size="md" />
                  <span className="text-gray-600 font-medium">by {review.userName || 'Anonymous'}</span>
                  {review.verified && (
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                      ✅ Verified Purchase
                    </span>
                  )}
                </div>
              </div>
{/*               <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Recently'}
              </span> */}
            </div>
{/*             <p className="text-gray-700 text-lg mb-4 leading-relaxed">{review.review || review.comment || 'No review text provided.'}</p> */}
            
            {/* Review Images */}
{/*             {review.photo && (
              <ReviewImages images={[review.photo]} />
            )}
             */}
            <div className="flex items-center justify-between mt-4">
              <button className="text-amber-600 hover:text-amber-700 font-semibold text-lg flex items-center space-x-2">
                <span>👍 Helpful ({review.helpful || 0})</span>
              </button>
            </div>
          </motion.div>
        ))}
        
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-amber-900 mb-2">No Reviews Yet</h4>
            <p className="text-gray-600 mb-6">Be the first to share your experience with this sacred product.</p>
            <motion.button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-bold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Write First Review
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Shipping Information Component
const EnhancedShippingInfo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-2xl font-bold text-amber-800 mb-6">🚚 Shipping Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
            <h5 className="font-bold text-amber-900 text-lg mb-3">Standard Shipping</h5>
            <p className="text-gray-700 mb-2">⏱️ 4-7 business days</p>
            <p className="text-gray-700">🎁 Free shipping on orders above ₹500</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <h5 className="font-bold text-green-900 text-lg mb-3">Express Shipping</h5>
            <p className="text-gray-700 mb-2">⚡ 2-3 business days</p>
            <p className="text-gray-700">💰 Additional charges apply</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-2xl font-bold text-amber-800 mb-6">↩️ Return & Exchange Policy</h4>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
          <p className="text-gray-700 mb-4 text-lg">
            We offer a <strong>7-day return policy</strong> for all our sacred rudraksha products. Your satisfaction is our priority.
          </p>
          <ul className="text-gray-700 space-y-3 text-lg">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Items must be returned in original condition with packaging
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Return shipping costs are the responsibility of the customer
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Refunds are processed within 3-5 business days
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Certified and blessed products ensure authenticity
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Enhanced Related Products Component
const EnhancedRelatedProducts = ({ relatedProducts, getImageUrl }: any) => {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <motion.div 
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <h2 className="text-3xl font-bold text-amber-900 mb-8 text-center">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((relatedProduct: any) => {
          const firstImage = relatedProduct.photo?.split(',')[0]?.trim();
  const productImage = getImageUrl(firstImage);
          const productRating = relatedProduct.rating || 5;
          const hasDiscount = relatedProduct.discount > 0;
          const currentPrice = hasDiscount
            ? Math.round(relatedProduct.price - (relatedProduct.price * relatedProduct.discount) / 100)
            : relatedProduct.price;

          return (
            <motion.div
              key={relatedProduct.id}
              className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-amber-100 overflow-hidden group"
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Link href={`/product-details/${relatedProduct.slug}`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={productImage}
                    alt={relatedProduct.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.jpg';
                    }}
                  />
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-600 text-white text-sm font-bold py-2 px-3 rounded-full shadow-lg">
                      🔥 {relatedProduct.discount}% OFF
                    </span>
                  )}
                  {relatedProduct.is_featured && (
                    <span className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold py-2 px-3 rounded-full shadow-lg">
                      ✨ FEATURED
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-amber-900 line-clamp-2 mb-3 group-hover:text-amber-700 transition-colors text-lg">
                    {relatedProduct.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <ReviewStars rating={productRating} size="sm" />
                    <span className="text-gray-600 text-sm">({productRating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold bg-gradient-to-r from-[#f5821f] to-orange-600 bg-clip-text text-transparent">
                      ₹{currentPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-gray-500 line-through text-sm">₹{relatedProduct.price.toLocaleString()}</span>
                    )}
                  </div>
                  <motion.button
                    className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Details
                  </motion.button>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};