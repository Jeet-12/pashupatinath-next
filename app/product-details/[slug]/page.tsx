"use client";

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchProductDetails, ProductDetails as ApiProductDetails, Review as ApiReview } from '../../libs/api';


type Product = ApiProductDetails;
type Review = ApiReview;

type RelatedProduct = {
  id: number;
  title: string;
  slug: string;
  price: number;
  oldPrice: number;
  rating: number;
  discount: number;
  stock: number;
  photo: string;
  category: string;
  isNew: boolean;
  isBestSeller: boolean;
};

// Desktop Zoom Component
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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  // Configuration
  const lensSize = 180;
  const zoomLevel = 2;
  const previewSize = 50;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || items[selectedIndex].type === 'video') return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate mouse position relative to container
    let mouseX = e.clientX - rect.left;
    let mouseY = e.clientY - rect.top;

    // Constrain lens position within container bounds
    const maxX = rect.width - lensSize / 2;
    const maxY = rect.height - lensSize / 2;
    
    mouseX = Math.max(lensSize / 2, Math.min(mouseX, maxX));
    mouseY = Math.max(lensSize / 2, Math.min(mouseY, maxY));

    // Update lens position
    setLensPosition({ x: mouseX, y: mouseY });

    // Calculate zoom position
    const backgroundX = (mouseX / rect.width) * 100;
    const backgroundY = (mouseY / rect.height) * 100;

    const zoomX = (backgroundX * zoomLevel) - (previewSize / 2);
    const zoomY = (backgroundY * zoomLevel) - (previewSize / 2);

    setZoomPosition({ x: zoomX, y: zoomY });
    setIsZoomActive(true);
  };

  const handleMouseLeave = () => {
    setIsZoomActive(false);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setIsZoomActive(false);
  };

  const currentItem = items[selectedIndex];

  return (
    <div className="hidden lg:block space-y-4">
      {/* Main Image Container */}
      <div 
        ref={containerRef}
        className="relative bg-white rounded-2xl p-4 shadow-lg cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded-full">NEW</span>
          )}
          {product.isBestSeller && (
            <span className="bg-purple-500 text-white text-xs font-bold py-1 px-3 rounded-full">BEST SELLER</span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Main Image/Video */}
        <div className="relative h-80 sm:h-96 rounded-xl overflow-hidden">
          {currentItem.type === 'image' ? (
            <Image
              src={currentItem.src}
              alt={product.title}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }}
            />
          ) : (
            <VideoPlayer src={currentItem.src} title={product.title} />
          )}
        </div>

        {/* Zoom Lens */}
        {currentItem.type === 'image' && isZoomActive && (
          <div
            ref={lensRef}
            className="absolute w-40 h-40 bg-white bg-opacity-20 border-2 border-amber-500 rounded-lg pointer-events-none z-10"
            style={{
              left: `${lensPosition.x - lensSize / 2}px`,
              top: `${lensPosition.y - lensSize / 2}px`,
            }}
          >
            <div className="absolute inset-0 border border-white border-opacity-50 rounded-lg" />
          </div>
        )}

        {/* Zoom Preview Container */}
        {currentItem.type === 'image' && isZoomActive && (
          <div
            ref={zoomRef}
            className="absolute left-full ml-4 top-0 w-96 h-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-20"
          >
            <div 
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: `url(${currentItem.src})`,
                backgroundSize: `${zoomLevel * 100}%`,
                backgroundPosition: `${-zoomPosition.x}px ${-zoomPosition.y}px`,
              }}
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-lg">
              Zoom Preview
            </div>
          </div>
        )}

        {/* Zoom Hint */}
        {currentItem.type === 'image' && !isZoomActive && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-lg pointer-events-none">
            Hover to zoom
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {items.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                selectedIndex === index 
                  ? 'border-amber-500 scale-105' 
                  : 'border-gray-300 hover:border-amber-300'
              }`}
            >
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={`${product.title} ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Trust Badges Component
const TrustBadges = () => {
  const badges = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Authenticity Guaranteed',
      description: '100% Genuine Rudraksha'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Secure Payment',
      description: 'Safe & Encrypted'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      title: 'Free Shipping',
      description: 'Above ₹2000'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
        </svg>
      ),
      title: 'Easy Returns',
      description: '7-Day Return Policy'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {badges.map((badge, index) => (
        <div key={index} className="flex items-center space-x-3 bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
          <div className="text-amber-600 bg-amber-50 p-2 rounded-lg">
            {badge.icon}
          </div>
          <div>
            <div className="font-semibold text-amber-900 text-sm">{badge.title}</div>
            <div className="text-gray-600 text-xs">{badge.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Review Images Component
const ReviewImages = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="flex space-x-2 mt-3">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className="w-16 h-16 rounded-lg border border-gray-300 overflow-hidden flex-shrink-0 hover:border-amber-500 transition-colors"
          >
            <Image
              src={image}
              alt={`Review image ${index + 1}`}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              className="absolute -top-12 right-0 text-white text-2xl z-10 hover:text-amber-500 transition-colors"
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
              className="object-contain max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

// Video Player Component
const VideoPlayer = ({ src, title }: { src: string; title: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/embed') || url.includes('vimeo.com/')) {
      return url;
    }
    
    if (url.includes('youtube.com')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url;
    }
    
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/);
      return videoId ? `https://player.vimeo.com/video/${videoId[1]}` : url;
    }
    
    return url;
  };

  return (
    <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
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

// Mobile Slider Component
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
      <div 
        className="relative h-80 bg-white rounded-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold py-1 px-3 rounded-full">NEW</span>
          )}
          {product.isBestSeller && (
            <span className="bg-purple-500 text-white text-xs font-bold py-1 px-3 rounded-full">BEST SELLER</span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Slides */}
        {items.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-300 ${
              index === currentIndex ? 'translate-x-0' : 
              index < currentIndex ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            {item.type === 'image' ? (
              <Image
                src={item.src}
                alt={`${product.title} ${index + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-image.jpg';
                }}
              />
            ) : (
              <VideoPlayer src={item.src} title={`${product.title} Video ${index + 1}`} />
            )}
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden ${
              currentIndex === index ? 'border-amber-500' : 'border-gray-300'
            }`}
          >
            {item.type === 'image' ? (
              <Image
                src={item.src}
                alt={`${product.title} ${index + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function ProductDetailsPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
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
          // Prefer the documented API shape (response.data.product),
          // but fall back to legacy shapes that some endpoints may return.
          const respAny = response as any;
          const productData = respAny.data?.product || respAny.product_detail || respAny.data?.product_detail || null;
          const reviewsData = respAny.data?.reviews || respAny.datacaps || [];
          const related = respAny.data?.related_products || respAny.product_detail?.rel_prods || [];

          setProduct(productData);
          setReviews(reviewsData || []);
          setRelatedProducts(related || []);
        } else {
          throw new Error((response as any)?.message || 'Failed to load product');
        }
      } catch (error) {
        console.error('Error loading product:', error);
        // You can set a default product or show error state
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
  };

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock) return;
    setQuantity(value);
  };

  const addToCart = () => {
    if (!product) return;
    console.log('Added to cart:', { product, quantity });
    // Implement your cart logic here
  };

  const buyNow = () => {
    if (!product) return;
    console.log('Buy now:', { product, quantity });
    // Implement your buy now logic here
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New review:', newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 5, title: '', comment: '' });
  };

  const getProductImage = (product: Product, index: number = 0) => {
    let productImage = "";

    if (Array.isArray(product.images) && product.images.length > 0) {
      productImage = product.images[index];
    } else if (Array.isArray(product.photos) && product.photos.length > 0) {
      productImage = product.photos[index];
    } else if (typeof product.photo === "string") {
      productImage = product.photo.split(",")[0].trim();
    } else if (typeof product.image === "string") {
      productImage = product.image.split(",")[0].trim();
    }

    if (productImage && !productImage.startsWith("http") && !productImage.startsWith("//")) {
      productImage = `https://www.pashupatinathrudraksh.com${productImage.startsWith("/") ? "" : "/"}${productImage}`;
    }

    return productImage || '/placeholder-image.jpg';
  };

  // Combine images and videos for media items
  const getMediaItems = () => {
    if (!product) return [];
    
    const items: Array<{ type: 'image' | 'video'; src: string }> = [];
    
    // Add images
    const productImages = product.images || [product.photo];
    productImages.forEach(image => {
      items.push({ type: 'image', src: getProductImage(product, productImages.indexOf(image)) });
    });
    
    // Add videos
    if (product.videos) {
      product.videos.forEach(video => {
        items.push({ type: 'video', src: video });
      });
    }
    
    return items;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-amber-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-amber-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-amber-200 rounded w-3/4"></div>
                <div className="h-4 bg-amber-200 rounded w-1/2"></div>
                <div className="h-6 bg-amber-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-amber-900 mb-4">Product Not Found</h1>
          <Link href="/products" className="bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const _productImages = product.images || [product.photo];
  const hasDiscount = product.discount > 0;
  const currentPrice = hasDiscount
    ? Math.round(product.price - (product.price * product.discount) / 100)
    : product.price;
  const discountAmount = product.price - currentPrice;
  const isInWishlist = wishlist.includes(product.id);
  const mediaItems = getMediaItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-amber-700 mb-8">
          <Link href="/" className="hover:text-amber-900">Home</Link>
          <span>›</span>
          <Link href="/products" className="hover:text-amber-900">Products</Link>
          <span>›</span>
          <span className="text-amber-900 font-medium">{product.title}</span>
        </nav>

        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Desktop Zoom Component */}
          <DesktopZoom items={mediaItems} product={product} />

          {/* Mobile Slider */}
          <MobileImageSlider items={mediaItems} product={product} />

          {/* Product Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-amber-900 mb-4">{product.title}</h1>
            
            {/* Rating and Category */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({product.rating})</span>
              </div>
              <span className="text-gray-500">|</span>
              <span className="text-amber-600 font-medium">{product.category}</span>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-4xl font-bold text-[#f5821f]">₹{currentPrice.toLocaleString()}</span>
                {hasDiscount && (
                  <span className="text-2xl text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
                )}
              </div>
              {hasDiscount && (
                <div className="text-green-600 font-semibold">
                  You Save ₹{discountAmount.toLocaleString()} ({product.discount}% OFF)
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
              product.stock > 10 ? 'bg-green-100 text-green-800' : 
              product.stock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} Left` : 'Out of Stock'}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-6 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.summary }} />

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-amber-600 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 text-gray-800 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:text-amber-600 disabled:opacity-50"
                  disabled={product.stock <= quantity}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`flex-1 font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center ${
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={buyNow}
                disabled={product.stock === 0}
                className={`flex-1 font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center ${
                  product.stock === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  isInWishlist
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-300 text-gray-600 hover:border-amber-500 hover:text-amber-500'
                }`}
              >
                <svg 
                  className="w-6 h-6" 
                  fill={isInWishlist ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust Badges */}
            <TrustBadges />

            {/* Tags */}
            {/* <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span key={tag} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div> */}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-12">
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {['description', 'specifications', 'reviews', 'shipping'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-shrink-0 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'reviews' && ` (${reviews.length})`}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-amber-900 mb-4">About this {product.title}</h3>
              <p 
  className="text-gray-700 leading-relaxed mb-6"
  dangerouslySetInnerHTML={{ __html: product.description }} 
/>
                
                {/* <h4 className="text-lg font-semibold text-amber-800 mb-3">Spiritual Significance</h4>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The {product.title} holds immense spiritual significance in Hindu mythology. It is believed to bring peace, 
                  prosperity, and spiritual enlightenment to the wearer. Each mukhi (face) represents different deities and 
                  carries unique energies.
                </p>

                <h4 className="text-lg font-semibold text-amber-800 mb-3">How to Use</h4>
                <ul className="text-gray-700 list-disc list-inside space-y-2">
                  <li>Wear it as a pendant or in a mala (prayer beads)</li>
                  <li>Clean regularly with dry cloth to maintain luster</li>
                  <li>Chant mantras while holding the rudraksha for enhanced benefits</li>
                  <li>Avoid contact with water and chemicals</li>
                </ul> */}
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-amber-800 mb-4">Product Details</h4>
                  <dl className="space-y-3">
                    <div>
                      <dt className="font-medium text-gray-700">Material</dt>
                      <dd className="text-gray-600">{product.specifications.material}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Origin</dt>
                      <dd className="text-gray-600">{product.specifications.origin}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Mukhi</dt>
                      <dd className="text-gray-600">{product.specifications.mukhi}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Size</dt>
                      <dd className="text-gray-600">{product.specifications.size}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Color</dt>
                      <dd className="text-gray-600">{product.specifications.color}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Weight</dt>
                      <dd className="text-gray-600">{product.specifications.weight}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">Natural</dt>
                      <dd className="text-gray-600">{product.specifications.natural ? 'Yes' : 'No'}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-amber-800 mb-4">Benefits</h4>
                  <ul className="space-y-2">
                    {product.specifications.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-2">Customer Reviews</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold text-amber-900">{product.rating}</div>
                      <div>
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">Based on {reviews.length} reviews</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors font-semibold mt-4 md:mt-0"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Review Form Modal */}
                {showReviewForm && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                      <h3 className="text-xl font-bold text-amber-900 mb-4">Write a Review</h3>
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                className="text-2xl focus:outline-none"
                              >
                                {star <= newReview.rating ? '⭐' : '☆'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={newReview.title}
                            onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors"
                          >
                            Submit Review
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-gray-500 text-sm">by {review.userName}</span>
                            {review.verified && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Verified Purchase</span>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-500 text-sm">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      
                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <ReviewImages images={review.images} />
                      )}
                      
                      <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-amber-800 mb-3">Shipping Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-amber-50 rounded-lg p-4">
                      <h5 className="font-semibold text-amber-900 mb-2">Standard Shipping</h5>
                      <p className="text-gray-700">4-7 business days</p>
                      <p className="text-gray-700">Free shipping on orders above ₹500</p>
                    </div>
                   
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-amber-800 mb-3">Return Policy</h4>
                  <p className="text-gray-700 mb-3">
                    We offer a 7-day return policy for all our rudraksha products. If you're not satisfied with your purchase, 
                    you can return it in original condition for a full refund.
                  </p>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Items must be returned in original packaging</li>
                    <li>Return shipping costs are borne by the customer</li>
                    <li>Refunds processed within 3-5 business days</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-amber-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <Link
                key={relatedProduct.id}
                href={`/product-details/${relatedProduct.slug}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getProductImage(relatedProduct as any)}
                    alt={relatedProduct.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {relatedProduct.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                      {relatedProduct.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-amber-900 line-clamp-2 mb-2 group-hover:text-amber-700">
                    {relatedProduct.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(relatedProduct.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">({relatedProduct.rating})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-[#f5821f]">₹{relatedProduct.price.toLocaleString()}</span>
                    {relatedProduct.oldPrice > relatedProduct.price && (
                      <span className="text-gray-500 line-through text-sm">₹{relatedProduct.oldPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}