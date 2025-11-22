"use client";

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addToWishlistApiWithNotify, singleAddToCart, createReview } from '../../libs/api';
import Link from 'next/link';
import { fetchProductDetails, ProductDetails as ApiProductDetails, Review as ApiReview } from '../../libs/api';
import { motion, AnimatePresence } from 'framer-motion';

// Types based on your data structure
type Product = ApiProductDetails & {
  cat_info?: {
    id: number;
    title: string;
    slug: string;
    main_category: string;
    photo?: string;
    summary?: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  get_review?: Review[];
  rel_prods?: RelatedProduct[];
};

type Review = ApiReview & {
  user_info?: {
    id: number;
    name: string;
    email: string;
    photo?: string;
    provider?: string;
    review: string;
    
  };
   photo?: string; 
  images?: string[];
  rate:number;
  created_at:string;
};

type RelatedProduct = {
  id: number;
  title: string;
  slug: string;
  price: number;
  discount: number;
  stock: number;
  photo: string;
  condition: string;
  rating?: number;
  is_featured?: boolean;
};

type NewReviewState = {
  rating: number;
  title: string;
  comment: string;
  photos?: File[];
};

// Fixed Desktop Zoom Component with Proper Image Display
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
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const zoomImageRef = useRef<HTMLImageElement>(null);

  // Configuration
  const lensSize = 150;
  const zoomLevel = 2.5;
  const previewSize = 600;

  // Update container and image size
  useEffect(() => {
    const updateSizes = () => {
      if (containerRef.current && imageRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Container dimensions (accounting for padding)
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        setContainerSize({ 
          width: containerWidth, 
          height: containerHeight 
        });

        // Get the actual displayed image size from the DOM
        const img = imageRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
          const displayedWidth = img.clientWidth;
          const displayedHeight = img.clientHeight;
          
          // Calculate image position (centered)
          const offsetX = (containerWidth - displayedWidth) / 2;
          const offsetY = (containerHeight - displayedHeight) / 2;
          
          setImageSize({
            width: displayedWidth,
            height: displayedHeight
          });
          
          setImagePosition({
            x: offsetX,
            y: offsetY
          });
        }
      }
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    
    return () => window.removeEventListener('resize', updateSizes);
  }, [selectedIndex, imageLoaded]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || !imageRef.current || items[selectedIndex].type === 'video' || !imageLoaded) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate mouse position relative to container
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Only activate zoom if mouse is over the image
    const isOverImage = mouseX >= imagePosition.x && 
                       mouseX <= imagePosition.x + imageSize.width && 
                       mouseY >= imagePosition.y && 
                       mouseY <= imagePosition.y + imageSize.height;
    
    if (!isOverImage || imageSize.width === 0) {
      setIsZoomActive(false);
      return;
    }

    // Calculate relative position within the image (0 to 1)
    const relativeX = (mouseX - imagePosition.x) / imageSize.width;
    const relativeY = (mouseY - imagePosition.y) / imageSize.height;

    // Constrain lens position within image bounds
    const lensX = Math.max(imagePosition.x, Math.min(mouseX - lensSize / 2, imagePosition.x + imageSize.width - lensSize));
    const lensY = Math.max(imagePosition.y, Math.min(mouseY - lensSize / 2, imagePosition.y + imageSize.height - lensSize));

    setLensPosition({ 
      x: lensX, 
      y: lensY 
    });

    // Calculate zoom image position (inverse of cursor position)
    const zoomX = relativeX * (imageSize.width * zoomLevel - previewSize);
    const zoomY = relativeY * (imageSize.height * zoomLevel - previewSize);

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
    setImageSize({ width: 0, height: 0 });
    setImagePosition({ x: 0, y: 0 });
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageLoaded(true);
    
    // Trigger size calculation after a brief delay to ensure DOM is updated
    setTimeout(() => {
      if (containerRef.current && img) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const displayedWidth = img.clientWidth;
        const displayedHeight = img.clientHeight;
        
        const offsetX = (containerRect.width - displayedWidth) / 2;
        const offsetY = (containerRect.height - displayedHeight) / 2;
        
        setImageSize({
          width: displayedWidth,
          height: displayedHeight
        });
        
        setImagePosition({
          x: offsetX,
          y: offsetY
        });
      }
    }, 100);
  };

  const currentItem = items[selectedIndex];

  return (
    <div className="hidden lg:block space-y-4 lg:space-y-8 relative">
      {/* Main Image Container */}
      <motion.div 
        ref={containerRef}
        className="relative bg-gradient-to-br from-white via-amber-25 to-orange-25 rounded-2xl lg:rounded-4xl p-8 shadow-xl lg:shadow-3xl cursor-crosshair border-2 border-amber-100/50 backdrop-blur-sm"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{zIndex:'10'}}
      >
        {/* Premium Badges */}
        <div className="absolute top-4 lg:top-8 left-4 lg:left-8 flex flex-col gap-2 lg:gap-4 z-20">
          {product.discount > 0 && (
            <motion.span 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white text-xs lg:text-base font-black py-2 lg:py-3 px-3 lg:px-6 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-2xl border-2 border-white/20 backdrop-blur-sm"
            >
              🏷️ {product.discount}% OFF
            </motion.span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs lg:text-base font-black py-2 lg:py-3 px-3 lg:px-6 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-2xl border-2 border-white/20 backdrop-blur-sm"
            >
              ⚡ Only {product.stock} Left
            </motion.span>
          )}
        </div>

        {/* Main Image/Video */}
        <div className="relative h-64 sm:h-80 lg:h-[500px] rounded-xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50/50 to-orange-100/50 border-2 border-amber-200/30 flex items-center justify-center">
          {currentItem.type === 'image' ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 lg:w-16 lg:h-16 border-4 border-amber-500 border-t-transparent rounded-full"
                  />
                </div>
              )}
              <img
                ref={imageRef}
                src={currentItem.src}
                alt={product.title}
                className={`max-w-full max-h-full object-contain transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleImageLoad}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.jpg';
                  setImageLoaded(true);
                }}
              />
            </>
          ) : (
            <VideoPlayer src={currentItem.src} title={product.title} />
          )}
        </div>

        {/* Enhanced Zoom Lens */}
        {currentItem.type === 'image' && isZoomActive && imageLoaded && imageSize.width > 0 && (
          <motion.div
            ref={lensRef}
            className="absolute border-2 lg:border-3 border-amber-400 rounded-lg lg:rounded-xl pointer-events-none z-30 shadow-2xl lg:shadow-3xl bg-gradient-to-br from-amber-200/20 to-orange-200/20 backdrop-blur-sm"
            style={{
              width: `${lensSize}px`,
              height: `${lensSize}px`,
              left: `${lensPosition.x}px`,
              top: `${lensPosition.y}px`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 border-2 border-white/80 rounded-lg lg:rounded-xl" />
          </motion.div>
        )}

        {/* Enhanced Zoom Preview - Using actual img element */}
        {currentItem.type === 'image' && isZoomActive && imageLoaded && imageSize.width > 0 && (
          <motion.div
            ref={zoomRef}
            className="absolute left-full ml-4 lg:ml-8 top-0 w-[350px] h-[350px] lg:w-[600px] lg:h-[600px] bg-white rounded-2xl lg:rounded-3xl shadow-2xl lg:shadow-3xl border-2 border-amber-200 overflow-hidden z-50"
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative w-full h-full overflow-hidden">
              <img
                ref={zoomImageRef}
                src={currentItem.src}
                alt={`Zoomed view of ${product.title}`}
                className="absolute min-w-none min-h-none"
                style={{
                  width: `${imageSize.width * zoomLevel}px`,
                  height: `${imageSize.height * zoomLevel}px`,
                  objectFit: 'none',
                  objectPosition: `${zoomPosition.x}px ${zoomPosition.y}px`,
                  maxWidth: 'none',
                  maxHeight: 'none'
                }}
              />
            </div>
            <div className="absolute bottom-3 lg:bottom-6 left-3 lg:left-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs lg:text-base px-3 lg:px-4 py-2 lg:py-3 rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl font-bold">
              🔍 Zoom View
            </div>
          </motion.div>
        )}

        {/* Enhanced Zoom Hint */}
        {currentItem.type === 'image' && !isZoomActive && imageLoaded && (
          <motion.div 
            className="absolute bottom-4 lg:bottom-8 right-4 lg:right-8 bg-gradient-to-r from-black/90 to-black/70 text-white text-xs lg:text-base px-3 lg:px-5 py-2 lg:py-4 rounded-xl lg:rounded-2xl backdrop-blur-sm pointer-events-none shadow-xl lg:shadow-2xl border border-white/10 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="flex items-center space-x-2 lg:space-x-3">
              <span className="text-lg lg:text-xl">🔍</span>
              <span className="font-semibold text-xs lg:text-base">Hover to Zoom</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced Thumbnail Strip */}
      {items.length > 1 && (
        <motion.div 
          className="flex space-x-2 lg:space-x-4 overflow-x-auto pb-2 scrollbar-hide justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {items.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 h-16 lg:w-28 lg:h-28 rounded-lg lg:rounded-2xl border-2 lg:border-3 overflow-hidden transition-all duration-500 shadow-lg lg:shadow-xl hover:shadow-xl lg:hover:shadow-2xl ${
                selectedIndex === index 
                  ? 'border-amber-500 scale-105 lg:scale-110 shadow-amber-300 bg-amber-50' 
                  : 'border-gray-200 hover:border-amber-300 bg-white'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.type === 'image' ? (
                <img
                  src={item.src}
                  alt={`${product.title} ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <svg className="w-6 h-6 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
const ReviewStars = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4 lg:w-5 lg:h-5',
    lg: 'w-5 h-5 lg:w-6 lg:h-6',
    xl: 'w-6 h-6 lg:w-8 lg:h-8'
  };

  return (
    <div className="flex items-center space-x-0.5 lg:space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.svg
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating 
              ? 'text-yellow-400 fill-current drop-shadow-sm' 
              : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
          whileHover={{ scale: 1.2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
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
      description: 'All Orders'
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 mb-6 lg:mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, staggerChildren: 0.1 }}
    >
      {badges.map((badge, index) => (
        <motion.div 
          key={index}
          className="flex items-center space-x-3 lg:space-x-4 bg-gradient-to-br from-white to-amber-50 rounded-xl lg:rounded-3xl p-3 lg:p-5 border-2 border-amber-100 shadow-lg hover:shadow-xl lg:hover:shadow-2xl transition-all duration-500 group hover:border-amber-200"
          whileHover={{ scale: 1.02, y: -2 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 + index * 0.1 }}
        >
          <div className="text-xl lg:text-3xl group-hover:scale-110 transition-transform duration-300">{badge.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-amber-900 text-xs lg:text-sm leading-tight truncate">{badge.title}</div>
            <div className="text-gray-600 text-xs mt-0.5 lg:mt-1 truncate">{badge.description}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
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
    <div className="relative bg-black rounded-xl lg:rounded-3xl overflow-hidden aspect-video border-2 border-amber-200/30">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-900 to-orange-900">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 lg:w-20 lg:h-20 border-4 border-amber-500 border-t-transparent rounded-full"
          />
        </div>
      )}
      <iframe
        src={getVideoEmbedUrl(src)}
        title={title}
        className="w-full h-full rounded-xl lg:rounded-3xl"
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
        className="relative h-64 sm:h-80 bg-gradient-to-br from-white via-amber-25 to-orange-25 rounded-2xl lg:rounded-4xl overflow-hidden shadow-xl lg:shadow-3xl border-2 border-amber-100/50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Premium Badges */}
        <div className="absolute top-3 lg:top-6 left-3 lg:left-6 flex flex-col gap-2 lg:gap-3 z-20">
          {product.discount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-red-500 to-orange-600 text-white text-xs lg:text-sm font-black py-1 lg:py-2 px-2 lg:px-4 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-2xl border-2 border-white/20"
            >
              🔥 {product.discount}% OFF
            </motion.span>
          )}
        </div>

        {/* Slides */}
        {items.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-out ${
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
          className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 lg:p-4 rounded-xl lg:rounded-2xl z-20 backdrop-blur-sm border border-white/20"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.9)" }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-black/70 text-white p-2 lg:p-4 rounded-xl lg:rounded-2xl z-20 backdrop-blur-sm border border-white/20"
          whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.9)" }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-3 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 lg:space-x-3 z-20">
          {items.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-500 ${
                index === currentIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              whileHover={{ scale: 1.3 }}
            />
          ))}
        </div>

        {/* Enhanced Slide Counter */}
        <div className="absolute bottom-3 lg:bottom-6 right-3 lg:right-6 bg-black/70 text-white text-xs lg:text-sm px-2 lg:px-4 py-1 lg:py-2 rounded-xl lg:rounded-2xl backdrop-blur-sm z-20 border border-white/20">
          {currentIndex + 1} / {items.length}
        </div>
      </motion.div>

      {/* Enhanced Thumbnail Strip */}
      {items.length > 1 && (
        <motion.div 
          className="flex space-x-2 lg:space-x-4 mt-4 lg:mt-6 overflow-x-auto pb-2 lg:pb-3 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {items.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 lg:w-24 lg:h-24 rounded-xl lg:rounded-2xl border-2 lg:border-3 overflow-hidden transition-all duration-500 shadow-lg ${
                currentIndex === index 
                  ? 'border-amber-500 scale-105 lg:scale-110 shadow-amber-300 bg-amber-50' 
                  : 'border-gray-200 hover:border-amber-300 bg-white'
              }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={`${product.title} ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <svg className="w-4 h-4 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  
  const total = reviews.reduce((sum, review) => sum + (review.rating || 5), 0);
  return Math.round((total / reviews.length) * 10) / 10;
};

// Main Product Details Component
export default function ProductDetailsClient({
  product: initialProduct,
  reviews: initialReviews,
  relatedProducts: initialRelatedProducts,
}: {
  product: Product | null;
  reviews: Review[];
  relatedProducts: RelatedProduct[];
}) {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>(initialRelatedProducts);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(!initialProduct); // Only show loading if no initial product
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const [newReview, setNewReview] = useState<NewReviewState>({
    rating: 5,
    title: '',
    comment: '',
    photos: []
  });

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
        // Handle error silently or show subtle notification
      } else {
        try { 
          window.dispatchEvent(new CustomEvent('countsUpdated')); 
        } catch {}
        // Show success notification
      }
    } catch (error) {
      console.error('Add to cart error:', error);
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
      }
    } catch (error) {
      console.error('Buy now error:', error);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSubmittingReview(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      // Prepare form data for file uploads
      const formData = new FormData();
      formData.append('product_slug', product.slug);
      formData.append('rate', newReview.rating.toString());
      formData.append('review', newReview.comment);
      
      if (newReview.title) {
        formData.append('title', newReview.title);
      }

      // Add photos if any
      if (newReview.photos && newReview.photos.length > 0) {
        newReview.photos.forEach(photo => {
          formData.append('photos[]', photo);
        });
      }

      // Submit review to API
      const result = await createReview({
        product_slug: product.slug,
        rate: newReview.rating,
        review: newReview.comment,
        title: newReview.title,
        photos: newReview.photos
      });

      if (result.success) {
        setReviewSuccess(true);
        
        // Reset form
        setNewReview({
          rating: 5,
          title: '',
          comment: '',
          photos: []
        });
        
        // Close form after success
        setTimeout(() => {
          setShowReviewForm(false);
          setReviewSuccess(false);
          
          // Reload product data to show the new review
          const loadProductData = async () => {
            try {
              const slug = params.slug as string;
              const response = await fetchProductDetails(slug);
              if (response) {
                const respAny = response as any;
                let reviewsData: Review[] = [];
                
                if (respAny.data?.product) {
                  reviewsData = respAny.data.product.get_review || [];
                } else if (respAny.product_detail) {
                  reviewsData = respAny.product_detail.get_review || [];
                } else if (respAny.data?.product_detail) {
                  reviewsData = respAny.data.product_detail.get_review || [];
                } else {
                  reviewsData = respAny.get_review || [];
                }
                
                setReviews(reviewsData);
              }
            } catch (error) {
              console.error('Error reloading reviews:', error);
            }
          };
          
          loadProductData();
        }, 2000);
      } else {
        setReviewError(result.message || 'Failed to submit review. Please try again.');
      }
    } catch (error: any) {
      console.error('Review submission error:', error);
      setReviewError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return;

  const newPhotos = Array.from(files).slice(0, 5 - (newReview.photos?.length || 0));
  
  // Validate file types and sizes
  const validPhotos = newPhotos.filter(file => {
    const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
    const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
    
    if (!isValidType) {
      console.warn(`Invalid file type: ${file.type}`);
      return false;
    }
    if (!isValidSize) {
      console.warn(`File too large: ${file.size} bytes`);
      return false;
    }
    
    return true;
  });

  setNewReview(prev => ({
    ...prev,
    photos: [...(prev.photos || []), ...validPhotos]
  }));

  e.target.value = '';
};

  const handleRemoveImage = (index: number) => {
    setNewReview(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || []
    }));
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
      <div className="min-h-screen bg-gradient-to-br from-amber-25 via-orange-25 to-amber-50 py-4 lg:py-8">
        <div className="container mx-auto px-3 lg:px-4">
          <motion.div 
            className="animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-6 lg:h-8 bg-amber-200 rounded-xl lg:rounded-2xl w-1/3 lg:w-1/4 mb-4 lg:mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
              <div className="h-48 lg:h-96 bg-gradient-to-br from-amber-200 to-orange-200 rounded-xl lg:rounded-3xl"></div>
              <div className="space-y-4 lg:space-y-6">
                <div className="h-6 lg:h-10 bg-amber-200 rounded-xl lg:rounded-2xl w-3/4"></div>
                <div className="h-4 lg:h-6 bg-amber-200 rounded-xl lg:rounded-2xl w-1/2"></div>
                <div className="h-5 lg:h-8 bg-amber-200 rounded-xl lg:rounded-2xl w-1/4"></div>
                <div className="h-20 lg:h-32 bg-amber-200 rounded-xl lg:rounded-2xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-25 via-orange-25 to-amber-50 py-4 lg:py-8">
        <div className="container mx-auto px-3 lg:px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6">
              <svg className="w-8 h-8 lg:w-16 lg:h-16 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl lg:text-3xl font-bold text-amber-900 mb-3 lg:mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-4 lg:mb-8 text-sm lg:text-base">The product you're looking for doesn't exist or has been moved.</p>
            <Link 
              href="/products" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-sm lg:text-base"
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

  // Structured Data for SEO
  const generateProductJsonLd = () => {
    if (!product) return null;

    const hasDiscount = product.discount > 0;
    const currentPrice = hasDiscount
      ? Math.round(product.price - (product.price * product.discount) / 100)
      : product.price;

    const productJsonLd = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.title,
      image: getImageUrl(product.photo?.split(',')[0]?.trim()),
      description: product.summary || product.description,
      sku: product.id.toString(),
      brand: {
        '@type': 'Brand',
        name: 'Pashupatinath Rudraksh',
      },
      offers: {
        '@type': 'Offer',
        url: `https://www.pashupatinathrudraksh.com/product-details/${product.slug}`,
        priceCurrency: 'INR',
        price: currentPrice.toString(),
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
      ...(reviews && reviews.length > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: averageRating.toString(),
          reviewCount: reviews.length.toString(),
        },
        review: reviews.map(review => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: review.user_info?.name || 'Anonymous' },
          datePublished: review.created_at,
          reviewBody: review.review,
          reviewRating: { '@type': 'Rating', ratingValue: review.rate.toString() },
        })),
      }),
    };
    return JSON.stringify(productJsonLd);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-25 via-orange-25 to-amber-50 py-4 lg:py-8">
      <div className="container mx-auto px-3 lg:px-4">
        {/* Enhanced Breadcrumb */}
        <motion.nav 
          className="flex items-center space-x-2 lg:space-x-3 text-xs lg:text-sm text-amber-700 mb-4 lg:mb-8 flex-wrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/" className="hover:text-amber-900 transition-colors font-medium flex items-center space-x-1 lg:space-x-2">
            <span className="text-sm lg:text-base">🏠</span>
            <span className="truncate">Home</span>
          </Link>
          {/* SEO: Add JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: generateProductJsonLd()! }}
          />

          <span className="text-amber-400">›</span>
          <Link href="/products" className="hover:text-amber-900 transition-colors font-medium flex items-center space-x-1 lg:space-x-2">
            <span className="text-sm lg:text-base">📦</span>
            <span className="truncate">Products</span>
          </Link>
          <span className="text-amber-400">›</span>
          <span className="text-amber-900 font-bold bg-amber-100 px-2 lg:px-4 py-1 lg:py-2 rounded-xl lg:rounded-2xl text-xs lg:text-sm truncate max-w-[150px] lg:max-w-none">
            {product.title}
          </span>
        </motion.nav>

        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-16">
          {/* Desktop Zoom Component */}
          <DesktopZoom items={mediaItems} product={product} />

          {/* Mobile Slider */}
          <MobileImageSlider items={mediaItems} product={product} />

          {/* Enhanced Product Info */}
          <motion.div 
            className="bg-gradient-to-br from-white via-amber-25 to-orange-25 rounded-2xl lg:rounded-4xl p-4 lg:p-8 shadow-xl lg:shadow-3xl border-2 border-amber-100/50 backdrop-blur-sm"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <h1 className="text-xl lg:text-4xl xl:text-5xl font-bold text-amber-900 mb-4 lg:mb-6 leading-tight bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
              {product.title}
            </h1>
            
            {/* Rating and Category */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 mb-4 lg:mb-8">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <ReviewStars rating={averageRating} size="lg" />
                <span className="text-lg lg:text-2xl font-bold text-gray-700">({averageRating})</span>
              </div>
              <span className="hidden sm:block text-amber-400 text-lg lg:text-2xl">|</span>
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 lg:px-6 py-1 lg:py-3 rounded-xl lg:rounded-2xl text-sm lg:text-base font-black shadow-lg max-w-max">
                {product.cat_info?.title || 'Rudraksha'}
              </span>
            </div>

            {/* Enhanced Description */}
            <motion.div 
              className="text-gray-700 mb-4 lg:mb-8 leading-relaxed text-sm lg:text-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl lg:rounded-3xl p-3 lg:p-6 border-2 border-amber-200/50 shadow-lg  "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              {product.summary ? (
                <div className="text-xs lg:text-base" dangerouslySetInnerHTML={{ __html: product.summary }} />
              ) : product.description ? (
                <div className="text-xs lg:text-base" dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                'No description available'
              )}
            </motion.div>

            {/* Enhanced Quantity Selector */}
            <motion.div 
              className="flex items-center space-x-3 lg:space-x-6 mb-4 lg:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <span className="text-gray-700 font-black text-base lg:text-xl">Quantity:</span>
              <div className="flex items-center bg-white border-2 border-amber-300 rounded-xl lg:rounded-3xl shadow-xl lg:shadow-2xl overflow-hidden">
                <motion.button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 lg:px-8 py-2 lg:py-5 text-gray-600 hover:text-amber-600 disabled:opacity-30 transition-all duration-200 text-lg lg:text-2xl font-black"
                  disabled={quantity <= 1}
                  whileHover={{ scale: 1.05, backgroundColor: "#fef3c7" }}
                  whileTap={{ scale: 0.9 }}
                >
                  -
                </motion.button>
                <span className="px-4 lg:px-10 py-2 lg:py-5 text-gray-800 font-black text-lg lg:text-2xl bg-amber-50 min-w-12 lg:min-w-24 text-center border-x-2 border-amber-200">
                  {quantity}
                </span>
                <motion.button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 lg:px-8 py-2 lg:py-5 text-gray-600 hover:text-amber-600 disabled:opacity-30 transition-all duration-200 text-lg lg:text-2xl font-black"
                  disabled={product.stock <= quantity}
                  whileHover={{ scale: 1.05, backgroundColor: "#fef3c7" }}
                  whileTap={{ scale: 0.9 }}
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 lg:gap-5 mb-4 lg:mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              <motion.button
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`flex-1 font-black py-3 lg:py-6 rounded-xl lg:rounded-3xl transition-all duration-500 flex items-center justify-center text-base lg:text-xl ${
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl lg:shadow-3xl hover:shadow-2xl lg:hover:shadow-4xl transform hover:-translate-y-1 lg:hover:-translate-y-2'
                }`}
                whileHover={product.stock === 0 ? {} : { scale: 1.02 }}
                whileTap={product.stock === 0 ? {} : { scale: 0.98 }}
              >
                <svg className="w-4 h-4 lg:w-7 lg:h-7 mr-2 lg:mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </motion.button>
              <motion.button
                onClick={buyNow}
                disabled={product.stock === 0}
                className={`flex-1 font-black py-3 lg:py-6 rounded-xl lg:rounded-3xl transition-all duration-500 flex items-center justify-center text-base lg:text-xl ${
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-[#493723] hover:bg-[#3a2c1c] text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                }`}
                whileHover={product.stock === 0 ? {} : { scale: 1.02 }}
                whileTap={product.stock === 0 ? {} : { scale: 0.98 }}
              >
                <svg className="w-4 h-4 lg:w-7 lg:h-7 mr-2 lg:mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Buy Now
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <TrustBadges />
          </motion.div>
        </div>

        {/* Enhanced Product Details Tabs */}
        <motion.div 
          className="bg-gradient-to-br from-white via-amber-25 to-orange-25 rounded-2xl lg:rounded-4xl shadow-xl lg:shadow-3xl mb-8 lg:mb-16 border-2 border-amber-100/50 overflow-hidden backdrop-blur-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {/* Enhanced Tab Headers */}
          <div className="border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 overflow-x-auto scrollbar-hide">
            <nav className="flex min-w-max">
              {['description', 'reviews', 'shipping', 'benefits'].map(tab => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-4 lg:px-10 py-3 lg:py-6 font-black text-sm lg:text-lg border-b-4 transition-all duration-500 ${
                    activeTab === tab
                      ? 'border-amber-500 text-amber-600 bg-white shadow-lg'
                      : 'border-transparent text-gray-500 hover:text-amber-500 hover:bg-white/70'
                  }`}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    {tab === 'description' }
                    {tab === 'reviews'}
                    {tab === 'shipping'}
                    {tab === 'benefits'}
                    <span className="whitespace-nowrap">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                    {tab === 'reviews' && (
                      <span className="bg-amber-500 text-white text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full">
                        {reviews.length}
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-4 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === 'description' && (
                  <div className="prose prose-sm lg:prose-lg max-w-none">
                    <h3 className="text-xl lg:text-4xl font-black text-amber-900 mb-4 lg:mb-8 bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
                      About this Sacred {product.title}
                    </h3>
                    <div 
                      className="text-gray-700 leading-relaxed text-sm lg:text-xl space-y-3 lg:space-y-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl lg:rounded-3xl p-4 lg:p-8 border-2 border-amber-200/50"
                      dangerouslySetInnerHTML={{ 
                        __html: product.description || product.summary || 'No description available' 
                      }} 
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
                    handleImageUpload={handleImageUpload}
                    handleRemoveImage={handleRemoveImage}
                    isSubmittingReview={isSubmittingReview}
                    reviewSuccess={reviewSuccess}
                    reviewError={reviewError}
                  />
                )}

                {activeTab === 'shipping' && (
                  <EnhancedShippingInfo />
                )}

                {/* {activetab === 'benefits' && (
                  <EnhancedBenefitsSection product={product} />
                )} */}
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

// Enhanced Reviews Section Component - FIXED IMAGE UPLOAD AND DISPLAY
const EnhancedReviewsSection = ({
  product,
  reviews,
  averageRating,
  showReviewForm,
  setShowReviewForm,
  newReview,
  setNewReview,
  handleReviewSubmit,
  handleImageUpload,
  handleRemoveImage,
  isSubmittingReview,
  reviewSuccess,
  reviewError
}: {
  product: Product;
  reviews: Review[];
  averageRating: number;
  showReviewForm: boolean;
  setShowReviewForm: React.Dispatch<React.SetStateAction<boolean>>;
  newReview: NewReviewState;
  setNewReview: React.Dispatch<React.SetStateAction<NewReviewState>>;
  handleReviewSubmit: (e: React.FormEvent) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: (index: number) => void;
  isSubmittingReview: boolean;
  reviewSuccess: boolean;
  reviewError: string;
}) => {
  const handleStarClick = (star: number) => {
    setNewReview((prev: NewReviewState) => ({ ...prev, rating: star }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewReview((prev: NewReviewState) => ({ ...prev, title: e.target.value }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReview((prev: NewReviewState) => ({ ...prev, comment: e.target.value }));
  };

  // Helper function to parse review images from the photo field
  const getReviewImages = (review: Review): string[] => {
    if (!review || !review.photo) return [];
    
    try {
      // The photo field contains a JSON string array
      const parsed = JSON.parse(review.photo);
      if (Array.isArray(parsed)) {
        return parsed.map(img => {
          // Clean up the URL if needed (remove escape characters)
          const cleanUrl = img.replace(/\\/g, '');
          return cleanUrl;
        });
      }
      return [];
    } catch (error) {
      console.error('Error parsing review images:', error);
      return [];
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Enhanced Header with Better Layout */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-8">
        <div className="flex-1">
          <h3 className="text-xl lg:text-3xl font-black text-amber-900 mb-4 bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
            Customer Experiences
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl lg:text-5xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                {averageRating}
              </div>
              <ReviewStars rating={averageRating} size="lg" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-semibold text-sm lg:text-base">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
              <span className="hidden sm:block text-amber-400">•</span>
              <span className="text-green-600 font-semibold text-sm lg:text-base flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified Purchases
              </span>
            </div>
          </div>
        </div>
        
        {/* Review Button - Toggles form visibility */}
        <motion.button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className={`px-6 lg:px-8 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 font-bold text-sm lg:text-base shadow-lg hover:shadow-xl flex items-center gap-2 lg:gap-3 min-w-[160px] justify-center ${
            showReviewForm 
              ? 'bg-gray-500 text-white hover:bg-gray-600' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
          }`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {showReviewForm ? 'Cancel Review' : 'Write Review'}
        </motion.button>
      </div>

      {/* Success/Error Messages */}
      {reviewSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-800 font-medium">Review submitted successfully! Thank you for your feedback.</span>
          </div>
        </motion.div>
      )}

      {reviewError && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="text-red-800 font-medium">{reviewError}</span>
          </div>
        </motion.div>
      )}

      {/* Inline Review Form - Appears just below the button */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div 
            className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 border-2 border-amber-200 shadow-xl"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <h4 className="text-lg lg:text-xl font-black text-black mb-6 lg:mb-8 flex items-center gap-2">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Share Your Experience
            </h4>

            <form onSubmit={handleReviewSubmit} className="space-y-6 lg:space-y-8">
              {/* Rating Section */}
              <div>
                <label className="block text-base font-bold text-black mb-3 lg:mb-4">Your Rating *</label>
                <div className="flex gap-2 lg:gap-3 justify-center lg:justify-start">
                  {[1, 2, 3, 4, 5].map(star => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className="text-3xl lg:text-4xl focus:outline-none transition-transform duration-200"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {star <= newReview.rating ? (
                        <span className="text-yellow-400 drop-shadow-sm">⭐</span>
                      ) : (
                        <span className="text-gray-300">☆</span>
                      )}
                    </motion.button>
                  ))}
                </div>
                <div className="text-center lg:text-left mt-2">
                  <span className="text-sm text-black font-medium">
                    {newReview.rating === 5 ? 'Excellent - Loved it! ⭐⭐⭐⭐⭐' :
                     newReview.rating === 4 ? 'Good - Happy with purchase ⭐⭐⭐⭐' :
                     newReview.rating === 3 ? 'Average - It was okay ⭐⭐⭐' :
                     newReview.rating === 2 ? 'Poor - Not satisfied ⭐⭐' : 
                     'Very Poor - Disappointed ⭐'}
                  </span>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-base font-bold text-black mb-2 lg:mb-3">Review Title *</label>
                <input
                  type="text"
                  value={newReview.title}
                  onChange={handleTitleChange}
                  className="w-full border border-gray-300 rounded-xl lg:rounded-2xl px-4 py-3 lg:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base text-black placeholder-black bg-white"
                  placeholder="Summarize your experience in a few words..."
                  required
                  disabled={isSubmittingReview}
                />
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block text-base font-bold text-black mb-2 lg:mb-3">Detailed Review *</label>
                <textarea
                  value={newReview.comment}
                  onChange={handleCommentChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl lg:rounded-2xl px-4 py-3 lg:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base text-black placeholder-black resize-none bg-white"
                  placeholder="Share your detailed experience with this product. What did you like? How has it helped you?"
                  required
                  disabled={isSubmittingReview}
                />
                <div className="text-right mt-2">
                  <span className="text-sm text-black">
                    {newReview.comment.length}/500 characters
                  </span>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-base font-bold text-black mb-2 lg:mb-3">
                  Add Photos ({newReview.photos?.length || 0}/5)
                </label>
                
                {/* File Input Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl lg:rounded-2xl p-6 text-center hover:border-amber-400 transition-colors cursor-pointer bg-gray-50/50">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="review-images"
                    multiple 
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={(newReview.photos?.length || 0) >= 5 || isSubmittingReview}
                  />
                  <label htmlFor="review-images" className="cursor-pointer block">
                    <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-black font-medium mb-1">Click to upload photos</p>
                    <p className="text-black text-sm">PNG, JPG, WEBP up to 5MB each • Max 5 photos</p>
                    {(newReview.photos?.length || 0) >= 5 && (
                      <p className="text-amber-600 text-sm mt-2 font-medium">Maximum 5 photos reached</p>
                    )}
                  </label>
                </div>

                {/* Image Previews */}
                {(newReview.photos?.length || 0) > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-black mb-3 font-medium">Photo Previews:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {newReview.photos?.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={URL.createObjectURL(photo)} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200 group-hover:opacity-80 transition-opacity"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors shadow-lg"
                            title="Remove photo"
                            disabled={isSubmittingReview}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4 border-t border-gray-200">
                <motion.button
                  type="submit"
                  disabled={isSubmittingReview}
                  className={`flex-1 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 font-bold text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    isSubmittingReview
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                  }`}
                  whileHover={isSubmittingReview ? {} : { scale: 1.02 }}
                  whileTap={isSubmittingReview ? {} : { scale: 0.98 }}
                >
                  {isSubmittingReview ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Submit Review
                    </>
                  )}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(false);
                    setNewReview({ rating: 5, title: '', comment: '', photos: [] });
                  }}
                  disabled={isSubmittingReview}
                  className="flex-1 border border-gray-300 text-black py-3 lg:py-4 rounded-xl lg:rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-base flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Reviews List with Image Display */}
      <div className="space-y-4 lg:space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const reviewImages = getReviewImages(review);
            
            return (
              <motion.div 
                key={review.id} 
                className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 lg:gap-4 mb-3 lg:mb-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mb-2">
                      <ReviewStars rating={review.rate || 5} size="md" />
                      <span className="text-gray-700 font-semibold text-sm lg:text-base">
                        {review.user_info?.name || 'Anonymous User'}
                      </span>
                      {review.user_info?.email && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    
                    {review.review && (
                      <p className="text-gray-700 text-sm lg:text-base leading-relaxed mb-3">{review.review}</p>
                    )}

                    {/* Review Images Display */}
                    {reviewImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Attached Photos:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {reviewImages.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={imageUrl} 
                                alt={`Review photo ${index + 1}`}
                                className="w-full h-20 lg:h-40 object-fill rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(imageUrl, '_blank')}
                              />
                              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs lg:text-sm bg-gray-50 px-2 py-1 rounded-full self-start lg:self-center">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'Recently'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    Helpful ({0})
                  </button>
                  <button className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          /* Enhanced Empty State - Only show when form is not open */
          !showReviewForm && (
            <div className="text-center py-8 lg:py-12 bg-white rounded-xl lg:rounded-2xl border border-amber-100">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 lg:w-10 lg:h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h4 className="text-lg lg:text-xl font-bold text-amber-900 mb-2">No Reviews Yet</h4>
              <p className="text-gray-600 text-sm lg:text-base mb-6 max-w-md mx-auto">
                Be the first to share your spiritual experience with this sacred product.
              </p>
              <motion.button
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 lg:px-8 py-2 lg:py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-bold text-sm lg:text-base shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Write First Review
              </motion.button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Enhanced Shipping Information Component
const EnhancedShippingInfo = () => {
  return (
    <div className="space-y-6 lg:space-y-10">
      <div>
        <h4 className="text-lg lg:text-3xl font-black text-amber-800 mb-4 lg:mb-8">🚚 Shipping Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl lg:rounded-3xl p-4 lg:p-8 border-2 border-amber-200 shadow-lg lg:shadow-2xl">
            <h5 className="font-black text-amber-900 text-lg lg:text-2xl mb-2 lg:mb-4">Standard Shipping</h5>
            <p className="text-gray-700 text-sm lg:text-lg mb-2 lg:mb-3 flex items-center space-x-2 lg:space-x-3">
              <span className="text-sm lg:text-base">⏱️</span>
              <span>5-7 business days</span>
            </p>
            <p className="text-gray-700 text-sm lg:text-lg flex items-center space-x-2 lg:space-x-3">
              <span className="text-sm lg:text-base">🎁</span>
              <span className="font-semibold text-green-600">Free shipping on all orders</span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl lg:rounded-3xl p-4 lg:p-8 border-2 border-green-200 shadow-lg lg:shadow-2xl">
            <h5 className="font-black text-green-900 text-lg lg:text-2xl mb-2 lg:mb-4">Express Shipping</h5>
            <p className="text-gray-700 text-sm lg:text-lg mb-2 lg:mb-3 flex items-center space-x-2 lg:space-x-3">
              <span className="text-sm lg:text-base">⚡</span>
              <span>2-3 business days</span>
            </p>
            <p className="text-gray-700 text-sm lg:text-lg flex items-center space-x-2 lg:space-x-3">
              <span className="text-sm lg:text-base">📞</span>
              <span className="font-semibold text-blue-600">Contact us for express shipping rates</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Benefits Section Component
const EnhancedBenefitsSection = ({ product }: { product: Product }) => {
  const benefits = [
    {
      icon: '🧘',
      title: 'Spiritual Alignment',
      description: 'Promotes inner peace and spiritual growth'
    },
    {
      icon: '💫',
      title: 'Positive Energy',
      description: 'Attracts positive vibrations and removes negativity'
    },
    {
      icon: '🛡️',
      title: 'Protection',
      description: 'Acts as a protective shield against negative energies'
    },
    {
      icon: '🎯',
      title: 'Focus & Concentration',
      description: 'Enhances meditation and mental clarity'
    },
    {
      icon: '❤️',
      title: 'Emotional Balance',
      description: 'Brings emotional stability and harmony'
    },
    {
      icon: '🌟',
      title: 'Divine Connection',
      description: 'Strengthens connection with higher consciousness'
    }
  ];

  return (
    <div>
      <h3 className="text-xl lg:text-4xl font-black text-amber-900 mb-6 lg:mb-12 bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
        Spiritual Benefits
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-br from-white to-amber-50 rounded-xl lg:rounded-3xl p-4 lg:p-8 border-2 border-amber-200 shadow-lg lg:shadow-2xl hover:shadow-xl lg:hover:shadow-3xl transition-all duration-500 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="text-2xl lg:text-4xl mb-2 lg:mb-4 group-hover:scale-110 transition-transform duration-300">{benefit.icon}</div>
            <h4 className="font-black text-amber-900 text-base lg:text-xl mb-2 lg:mb-3">{benefit.title}</h4>
            <p className="text-gray-700 text-sm lg:text-lg leading-relaxed">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Related Products Component
const EnhancedRelatedProducts = ({ relatedProducts, getImageUrl }: any) => {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <motion.div 
      className="mb-8 lg:mb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
    >
      <h2 className="text-xl lg:text-4xl font-black text-amber-900 mb-6 lg:mb-12 text-center bg-gradient-to-r from-amber-900 to-orange-900 bg-clip-text text-transparent">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
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
              className="bg-gradient-to-br from-white to-amber-50 rounded-xl lg:rounded-3xl shadow-lg lg:shadow-2xl hover:shadow-xl lg:hover:shadow-3xl transition-all duration-500 border-2 border-amber-100 overflow-hidden group"
              whileHover={{ y: -5, scale: 1.01 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href={`/product-details/${relatedProduct.slug}`}>
                <div className="relative h-40 lg:h-56 overflow-hidden">
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
                    <span className="absolute top-2 lg:top-4 left-2 lg:left-4 bg-gradient-to-r from-red-500 to-orange-600 text-white text-xs lg:text-sm font-black py-1 lg:py-2 px-2 lg:px-4 rounded-lg lg:rounded-2xl shadow-lg lg:shadow-2xl border-2 border-white/20">
                      🔥 {relatedProduct.discount}% OFF
                    </span>
                  )}
                  {relatedProduct.is_featured && (
                    <span className="absolute top-2 lg:top-4 right-2 lg:right-4 bg-[#493723] from-green-500 to-emerald-600 text-white text-xs lg:text-sm font-black py-1 lg:py-2 px-2 lg:px-4 rounded-lg lg:rounded-2xl shadow-lg lg:shadow-2xl border-2 border-white/20">
                      ✨ FEATURED
                    </span>
                  )}
                </div>
                <div className="p-3 lg:p-6">
                  <h3 className="font-black text-amber-900 line-clamp-2 mb-2 lg:mb-4 group-hover:text-amber-700 transition-colors text-sm lg:text-lg leading-tight">
                    {relatedProduct.title}
                  </h3>
                  <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-4">
                    <ReviewStars rating={productRating} size="sm" />
                    <span className="text-gray-600 text-xs lg:text-base">({productRating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg lg:text-2xl font-black bg-gradient-to-r from-[#f5821f] to-orange-600 bg-clip-text text-transparent">
                      ₹{currentPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-gray-500 line-through text-xs lg:text-base font-semibold">₹{relatedProduct.price.toLocaleString()}</span>
                    )}
                  </div>
                  <motion.button
                    className="w-full mt-3 lg:mt-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 lg:py-4 rounded-lg lg:rounded-2xl font-black hover:from-amber-600 hover:to-orange-600 transition-all duration-500 shadow-lg hover:shadow-xl text-sm lg:text-base"
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