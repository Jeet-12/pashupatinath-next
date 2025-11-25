"use client";

import Image from 'next/image';
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Product, RecentProduct, ProductsApiResponse, fetchProducts, addToWishlistApiWithNotify, singleAddToCart } from '../libs/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Types
type Filters = {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  categories: string[];
  discountRange: number;
  availability: 'all' | 'in-stock' | 'low-stock';
};

// Review Modal Component
const ReviewModal = memo(({ 
  product, 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: { rate: number; review: string; title?: string; photos?: File[] }) => void;
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !review.trim()) {
      alert('Please provide a rating and review text');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        rate: rating,
        review: review.trim(),
        title: title.trim() || undefined,
        photos: photos.length > 0 ? photos : undefined
      });
      
      // Reset form
      setRating(0);
      setTitle('');
      setReview('');
      setPhotos([]);
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files).slice(0, 5 - photos.length);
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-amber-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Write a Review</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 sm:p-2"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4 mt-3 sm:mt-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 relative bg-amber-50 rounded-xl overflow-hidden">
              <Image
                src={product.photo || '/placeholder-image.jpg'}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{product.title}</h3>
              <p className="text-amber-600 font-bold text-sm sm:text-base">₹{product.price.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Overall Rating *
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-xl sm:text-2xl focus:outline-none"
                >
                  <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Review Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-amber-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base"
            />
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="review" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-amber-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none text-sm sm:text-base"
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Add Photos ({photos.length}/5)
            </label>
            <div className="space-y-3 sm:space-y-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={photos.length >= 5}
                className="w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
              />
              
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-amber-50 rounded-lg sm:rounded-xl overflow-hidden">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 sm:space-x-4 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border-2 border-amber-500 text-amber-600 rounded-xl sm:rounded-2xl font-semibold hover:bg-amber-50 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0 || !review.trim()}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

ReviewModal.displayName = 'ReviewModal';

const ProductCard = memo(({ 
  product, 
  onWishlistToggle, 
  onAddToCart,
  isInWishlist 
}: { 
  product: Product;
  onWishlistToggle: (productId: number, slug?: string) => void;
  onAddToCart: (slug: string, price: number) => void;
  isInWishlist: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  
  const productImage = useMemo(() => {
    if (imageError) return '/placeholder-image.jpg';
    
    let imageUrl = "";
    if (Array.isArray(product.images) && product.images.length > 0) {
      imageUrl = product.images[0];
    } else if (Array.isArray(product.photos) && product.photos.length > 0) {
      imageUrl = product.photos[0];
    } else if (typeof product.photo === "string") {
      imageUrl = product.photo.split(",")[0].trim();
    } else if (typeof product.image === "string") {
      imageUrl = product.image.split(",")[0].trim();
    }

    if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("//")) {
      imageUrl = `https://www.pashupatinathrudraksh.com${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }

    return imageUrl || '/placeholder-image.jpg';
  }, [product, imageError]);

  const hasDiscount = (product.discount || 0) > 0;
  const currentPrice = useMemo(() => 
    hasDiscount
      ? Math.round(product.price - (product.price * (product.discount || 0)) / 100)
      : product.price,
    [hasDiscount, product.price, product.discount]
  );

  const discountAmount = useMemo(() => 
    hasDiscount ? product.price - currentPrice : 0,
    [hasDiscount, product.price, currentPrice]
  );

  const stock = product.stock || 0;
  const reviewsCount = product.reviews_count || 0;
  const reviewsAvgRate = product.reviews_avg_rate || 0;
  const mainCategory = product.cat_info?.title || 'Rudraksha';
  const subCategory = product.sub_cat_info?.title;
  const categorySlug = product.cat_info?.slug;

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleWishlistClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onWishlistToggle(product.id, product.slug);
  }, [product.id, product.slug, onWishlistToggle]);

  const handleAddToCartClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart(product.slug, currentPrice);
  }, [product.slug, currentPrice, onAddToCart]);

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 border border-amber-100/50 flex flex-col transform hover:-translate-y-0.5 sm:hover:-translate-y-1">
      <Link href={`/product-details/${product.slug}`} className="flex-1 flex flex-col">
        {/* Product Image */}
        <div className="relative h-40 sm:h-48 md:h-64 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
          <Image
            src={productImage}
            alt={product.title || 'Product image'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={handleImageError}
            priority={false}
            loading="lazy"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-2 sm:top-4 right-2 sm:right-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all duration-300 backdrop-blur-sm ${
              isInWishlist 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500 shadow-md'
            }`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          {/* Badges */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
            {product.isNew && (
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-lg sm:rounded-xl shadow-lg">NEW</span>
            )}
            {product.isBestSeller && (
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-lg sm:rounded-xl shadow-lg">BEST SELLER</span>
            )}
            {hasDiscount && (
              <span className="bg-gradient-to-r from-amber-700 to-orange-700 text-white text-xs font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-lg sm:rounded-xl shadow-lg">
                {product.discount}% OFF
              </span>
            )}
          </div>
          
          {/* Stock Badge */}
          {/* <div className={`absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white text-xs font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-lg sm:rounded-xl shadow-lg backdrop-blur-sm ${
            stock > 10 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : stock > 0 ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            {stock > 0 ? `${stock} in stock` : 'Out of Stock'}
          </div> */}
        </div>
        
        {/* Product Info */}
        <div className="p-3 sm:p-4 md:p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-sm sm:text-base md:text-xl text-gray-900 line-clamp-2 flex-1 leading-tight group-hover:text-amber-700 transition-colors duration-300 mb-2 sm:mb-3">
            {product.title || 'Untitled Product'}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="flex">
              {[1,2,3,4,5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${
                    star <= Math.floor(reviewsAvgRate) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600 font-medium">({reviewsCount})</span>
          </div>
          
          {/* Pricing */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-amber-600">
                  ₹{currentPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-gray-500 line-through text-xs sm:text-sm font-medium">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-amber-700 text-xs sm:text-sm font-semibold mt-0.5 sm:mt-1">
                      You Save ₹{discountAmount.toLocaleString()} ({product.discount}%)
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Recent Product Card Component
const RecentProductCard = memo(({ product }: { product: RecentProduct }) => {
  const [imageError, setImageError] = useState(false);
  
  const productImage = useMemo(() => {
    if (imageError) return '/placeholder-image.jpg';
    
    let imageUrl = "";
    if (Array.isArray(product.images) && product.images.length > 0) {
      imageUrl = product.images[0];
    } else if (Array.isArray(product.photos) && product.photos.length > 0) {
      imageUrl = product.photos[0];
    } else if (typeof product.photo === "string") {
      imageUrl = product.photo.split(",")[0].trim();
    } else if (typeof product.image === "string") {
      imageUrl = product.image.split(",")[0].trim();
    }

    if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("//")) {
      imageUrl = `https://www.pashupatinathrudraksh.com${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
    }

    return imageUrl || '/placeholder-image.jpg';
  }, [product, imageError]);

  const hasDiscount = (product.discount || 0) > 0;
  const currentPrice = useMemo(() => 
    hasDiscount
      ? Math.round(product.price - (product.price * (product.discount || 0)) / 100)
      : product.price,
    [hasDiscount, product.price, product.discount]
  );

  const discountAmount = useMemo(() => 
    hasDiscount ? product.price - currentPrice : 0,
    [hasDiscount, product.price, currentPrice]
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <Link
      href={`/product-details/${product.slug}`}
      className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:shadow-lg transition-all duration-300 border border-amber-100 hover:border-amber-200 transform hover:-translate-y-0.5 sm:hover:-translate-y-1 block"
    >
      <div className="relative h-24 sm:h-32 mb-2 sm:mb-3">
        <Image
          src={productImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover rounded-lg sm:rounded-xl group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          priority={false}
          loading="lazy"
        />
        {hasDiscount && (
          <span className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold py-0.5 px-1 sm:py-1 sm:px-2 rounded sm:rounded-lg shadow-lg">
            {product.discount}% OFF
          </span>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-amber-700 transition-colors mb-1 sm:mb-2">
        {product.title}
      </h3>
      <div className="flex items-center gap-1 sm:gap-2">
        <p className="text-amber-600 font-bold text-sm sm:text-base">₹{currentPrice.toLocaleString()}</p>
        {hasDiscount && (
          <p className="text-gray-500 line-through text-xs sm:text-sm">₹{product.price.toLocaleString()}</p>
        )}
      </div>
      {hasDiscount && (
        <p className="text-amber-700 text-xs font-semibold mt-0.5 sm:mt-1">
          Save ₹{discountAmount.toLocaleString()}
        </p>
      )}
    </Link>
  );
});

RecentProductCard.displayName = 'RecentProductCard';

// Price Range Slider Component
const PriceRangeSlider = memo(({ 
  min, 
  max, 
  value, 
  onChange 
}: { 
  min: number; 
  max: number; 
  value: { min: number; max: number }; 
  onChange: (min: number, max: number) => void;
}) => {
  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(parseInt(e.target.value), value.max - 1);
    onChange(newMin, value.max);
  }, [value.max, onChange]);

  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(parseInt(e.target.value), value.min + 1);
    onChange(value.min, newMax);
  }, [value.min, onChange]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between text-gray-900 font-semibold text-base sm:text-lg">
        <span>₹{value.min.toLocaleString()}</span>
        <span>₹{value.max.toLocaleString()}</span>
      </div>
      <div className="relative py-3 sm:py-4">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
          <span>Min: ₹{min.toLocaleString()}</span>
          <span>Max: ₹{max.toLocaleString()}</span>
        </div>
        
        <div className="relative h-2 sm:h-3 bg-gray-200 rounded-xl">
          <div 
            className="absolute h-2 sm:h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl"
            style={{
              left: `${((value.min - min) / (max - min)) * 100}%`,
              width: `${((value.max - value.min) / (max - min)) * 100}%`
            }}
          />
          
          <input
            type="range"
            min={min}
            max={max}
            value={value.min}
            onChange={handleMinChange}
            className="absolute w-full h-2 sm:h-3 opacity-0 cursor-pointer z-20"
          />
          
          <input
            type="range"
            min={min}
            max={max}
            value={value.max}
            onChange={handleMaxChange}
            className="absolute w-full h-2 sm:h-3 opacity-0 cursor-pointer z-20"
          />
        </div>
      </div>
    </div>
  );
});

PriceRangeSlider.displayName = 'PriceRangeSlider';

// Mobile Filter Modal Component
const MobileFilterModal = memo(({ 
  isOpen, 
  onClose, 
  filters, 
  priceRange,
  categories,
  discountRange,
  onFilterChange,
  onPriceChange,
  onCategoryToggle,
  onResetFilters
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  priceRange: { min: number; max: number };
  categories: any[];
  discountRange: { min: number; max: number };
  onFilterChange: (key: keyof Filters, value: any) => void;
  onPriceChange: (min: number, max: number) => void;
  onCategoryToggle: (categoryId: string) => void;
  onResetFilters: () => void;
}) => {
  const [activeSection, setActiveSection] = useState<string>('price');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-50 lg:hidden">
      <div className="bg-white rounded-t-2xl sm:rounded-t-3xl shadow-2xl w-full max-h-[85vh] sm:max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-amber-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Filters</h2>
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={onResetFilters}
              className="text-amber-600 hover:text-amber-800 font-semibold text-xs sm:text-sm bg-amber-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors"
            >
              Reset
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 sm:p-2 rounded-lg bg-gray-100"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[60vh] sm:h-[70vh]">
          {/* Sidebar Navigation */}
          <div className="w-1/3 bg-amber-50 border-r border-amber-100">
            <nav className="p-2 sm:p-4 space-y-1 sm:space-y-2">
              {[
                { id: 'price', label: 'Price Range'},
                { id: 'rating', label: 'Rating' },
                { id: 'categories', label: 'Categories'},
                { id: 'discount', label: 'Discount' },
                { id: 'availability', label: 'Availability' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left p-2 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-xs sm:text-sm ${
                    activeSection === item.id 
                      ? 'bg-white text-amber-700 shadow-lg font-semibold' 
                      : 'text-gray-600 hover:text-amber-600 hover:bg-white/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeSection === 'price' && (
              <div>
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-4 sm:mb-6">Price Range</h3>
                <PriceRangeSlider 
                  min={priceRange.min}
                  max={priceRange.max}
                  value={{ min: filters.minPrice, max: filters.maxPrice }}
                  onChange={onPriceChange}
                />
              </div>
            )}

            {activeSection === 'rating' && (
              <div>
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-4 sm:mb-6">Customer Rating</h3>
                <div className="space-y-3 sm:space-y-4">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.minRating === rating}
                        onChange={() => onFilterChange('minRating', rating)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-full mr-3 sm:mr-4 flex items-center justify-center transition-all duration-300 ${
                        filters.minRating === rating ? 'border-amber-500 bg-amber-500 scale-110' : 'border-gray-300 group-hover:border-amber-400'
                      }`}>
                        {filters.minRating === rating && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex items-center">
                        {[1,2,3,4,5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                          </svg>
                        ))}
                        <span className="ml-2 sm:ml-3 text-gray-700 font-medium text-xs sm:text-sm">& above</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'categories' && (
              <div>
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-4 sm:mb-6">Categories</h3>
                <div className="max-h-48 sm:max-h-60 overflow-y-auto space-y-2 sm:space-y-3 custom-scrollbar">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center cursor-pointer group p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-amber-50 transition-all duration-300">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.id)}
                        onChange={() => onCategoryToggle(category.id)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-lg mr-3 sm:mr-4 flex items-center justify-center transition-all duration-300 ${
                        filters.categories.includes(category.id) ? 'border-amber-500 bg-amber-500 scale-110' : 'border-gray-300 group-hover:border-amber-400'
                      }`}>
                        {filters.categories.includes(category.id) && (
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-700 font-medium flex-1 text-xs sm:text-sm">{category.title}</span>
                      <span className="text-xs sm:text-sm text-amber-600 bg-amber-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold">
                        {category.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'discount' && (
              <div>
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-4 sm:mb-6">Discount</h3>
                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="range"
                    min={discountRange.min}
                    max={discountRange.max}
                    value={filters.discountRange}
                    onChange={(e) => onFilterChange('discountRange', parseInt(e.target.value))}
                    className="w-full h-2 sm:h-3 bg-gray-200 rounded-xl appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 sm:[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-amber-500 [&::-webkit-slider-thumb]:to-orange-500 [&::-webkit-slider-thumb]:border-2 sm:[&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600 font-medium">
                    <span>Min: {filters.discountRange}%</span>
                    <span>Max: {discountRange.max}%</span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'availability' && (
              <div>
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-4 sm:mb-6">Availability</h3>
                <div className="space-y-3 sm:space-y-4">
                  {(['all', 'in-stock', 'low-stock'] as const).map(availability => (
                    <label key={availability} className="flex items-center cursor-pointer group p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-amber-50 transition-all duration-300">
                      <input
                        type="radio"
                        name="availability"
                        checked={filters.availability === availability}
                        onChange={() => onFilterChange('availability', availability)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-full mr-3 sm:mr-4 flex items-center justify-center transition-all duration-300 ${
                        filters.availability === availability ? 'border-amber-500 bg-amber-500 scale-110' : 'border-gray-300 group-hover:border-amber-400'
                      }`}>
                        {filters.availability === availability && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-700 font-medium capitalize text-xs sm:text-sm">
                        {availability === 'in-stock' ? 'In Stock' : availability === 'low-stock' ? 'Low Stock' : 'All Items'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-4 sm:p-6 border-t border-amber-100">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
});

MobileFilterModal.displayName = 'MobileFilterModal';

// Main Component
export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [recentProduct, setRecentProduct] = useState<RecentProduct[]>([]);
  const [showRecentProducts, setShowRecentProducts] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 50000,
    minRating: 0,
    categories: [],
    discountRange: 0,
    availability: 'all'
  });
  
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [activeUrlCategory, setActiveUrlCategory] = useState<string | null>(null);
  const [urlSearchQuery, setUrlSearchQuery] = useState<string | null>(null);

  // Memoized handlers
  const handleAddToCart = useCallback(async (slug: string, price: number) => {
    try {
      const res = await singleAddToCart({ slug, quantity: 1, total_price: price });
      const event = new CustomEvent('cartNotification', { 
        detail: { 
          message: res.success ? 'Added to cart successfully!' : res.message || 'Failed to add to cart', 
          type: res.success ? 'success' : 'error' 
        }
      });
      window.dispatchEvent(event);
    } catch {
      const event = new CustomEvent('cartNotification', { 
        detail: { message: 'Failed to add to cart', type: 'error' }
      });
      window.dispatchEvent(event);
    }
  }, []);

  const toggleWishlist = useCallback((productId: number, slug?: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );

    addToWishlistApiWithNotify({ slug }).catch(() => {
      // Optional: revert state on failure
    });
  }, []);

  // Load products with abort controller
  useEffect(() => {
    const abortController = new AbortController();
    
    const loadProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts: ProductsApiResponse = await fetchProducts();
        
        if (!abortController.signal.aborted) {
          setProducts(fetchedProducts.products || []);
          setRecentProduct(fetchedProducts.recent_products || []);

          if (fetchedProducts.products?.length) {
            const prices = fetchedProducts.products.map(p => p.price).filter(price => !isNaN(price));
            if (prices.length) {
              setFilters(prev => ({
                ...prev,
                minPrice: Math.min(...prices),
                maxPrice: Math.max(...prices),
              }));
            }
          }
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Error loading products:', error);
          setProducts([]);
          setRecentProduct([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      abortController.abort();
    };
  }, []);

  // Read URL parameters
  useEffect(() => {
    const searchFromUrl = searchParams?.get('search');
    const mainCategoryFromUrl = searchParams?.get('main-category');
    const categoryFromUrl = searchParams?.get('category');
    
    if (searchFromUrl) {
      setUrlSearchQuery(searchFromUrl);
      setSearchQuery(searchFromUrl);
      setShowRecentProducts(false);
    }
    
    if (mainCategoryFromUrl) {
      setActiveUrlCategory(mainCategoryFromUrl);
      setFilters(prev => ({
        ...prev,
        categories: [`main_category:${mainCategoryFromUrl}`]
      }));
    } else if (categoryFromUrl) {
      setActiveUrlCategory(categoryFromUrl);
      setFilters(prev => ({
        ...prev,
        categories: [`slug:${categoryFromUrl}`]
      }));
    }
  }, [searchParams]);

  // Update searchQuery state when URL search changes
  useEffect(() => {
    if (urlSearchQuery && urlSearchQuery !== searchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [urlSearchQuery, searchQuery]);

  // Responsive check
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileFilters(false);
      }
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Filter handlers
  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handlePriceChange = useCallback((min: number, max: number) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  }, []);

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }));
  }, []);

  const clearCategoryFilter = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      categories: []
    }));
    setActiveUrlCategory(null);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minRating: 0,
      categories: [],
      discountRange: 0,
      availability: 'all'
    });
    setSearchQuery('');
    setUrlSearchQuery(null);
    setActiveUrlCategory(null);
    setShowRecentProducts(true);
    
    const params = new URLSearchParams();
    window.history.replaceState({}, '', `${window.location.pathname}`);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('search', searchQuery.trim());
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
      setUrlSearchQuery(searchQuery.trim());
      setShowRecentProducts(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setUrlSearchQuery(null);
    const params = new URLSearchParams(window.location.search);
    params.delete('search');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    setShowRecentProducts(true);
  };

  // Memoized calculations
  const priceRange = useMemo(() => ({
    min: products.length > 0 ? Math.min(...products.map(p => p.price)) : 0,
    max: products.length > 0 ? Math.max(...products.map(p => p.price)) : 50000
  }), [products]);

  const discountRange = useMemo(() => ({
    min: products.length > 0 ? Math.min(...products.map(p => p.discount)) : 0,
    max: products.length > 0 ? Math.max(...products.map(p => p.discount)) : 30
  }), [products]);

  const categories = useMemo(() => {
    const categoryMap = new Map();
    
    products.forEach(product => {
      if (product.cat_info?.id && product.cat_info.title) {
        const categoryId = product.cat_info.id.toString();
        if (categoryMap.has(categoryId)) {
          const existing = categoryMap.get(categoryId);
          categoryMap.set(categoryId, { ...existing, count: existing.count + 1 });
        } else {
          categoryMap.set(categoryId, {
            id: categoryId,
            title: product.cat_info.title,
            slug: product.cat_info.slug,
            count: 1
          });
        }
      }
    });
    
    return Array.from(categoryMap.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [products]);

  const recentProducts = useMemo(() => 
    [...recentProduct]
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, 6),
    [recentProduct]
  );

  // Optimized product filtering
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const currentSearch = urlSearchQuery || searchQuery;
      if (currentSearch && !product.title.toLowerCase().includes(currentSearch.toLowerCase())) {
        return false;
      }
      
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }
      
      if ((product.reviews_avg_rate || 0) < filters.minRating) {
        return false;
      }
      
      if (filters.categories.length > 0) {
        const matchesCategory = filters.categories.some(filterCat => {
          if (filterCat.startsWith('main_category:')) {
            const mainCat = filterCat.replace('main_category:', '');
            return product.cat_info?.main_category === mainCat;
          }
          if (filterCat.startsWith('slug:')) {
            const slugFilter = filterCat.replace('slug:', '');
            return product.cat_info?.slug === slugFilter;
          }
          return product.cat_info?.id?.toString() === filterCat;
        });
        if (!matchesCategory) return false;
      }
      
      if (product.discount < filters.discountRange) {
        return false;
      }
      
      if (filters.availability === 'in-stock' && product.stock <= 0) {
        return false;
      }
      if (filters.availability === 'low-stock' && (product.stock <= 0 || product.stock > 5)) {
        return false;
      }
      
      return true;
    });
  }, [products, filters, searchQuery, urlSearchQuery]);

  // Optimized sorting
  const sortedProducts = useMemo(() => {
    const productsCopy = [...filteredProducts];
    
    const sortFunctions = {
      priceLowToHigh: (a: Product, b: Product) => a.price - b.price,
      priceHighToLow: (a: Product, b: Product) => b.price - a.price,
      rating: (a: Product, b: Product) => (b.reviews_avg_rate || 0) - (a.reviews_avg_rate || 0),
      discount: (a: Product, b: Product) => b.discount - a.discount,
      newest: (a: Product, b: Product) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime(),
      default: () => 0
    };

    return productsCopy.sort(sortFunctions[sortBy as keyof typeof sortFunctions] || sortFunctions.default);
  }, [filteredProducts, sortBy]);

  const activeFilterCount = useMemo(() => 
    (filters.minPrice > priceRange.min ? 1 : 0) +
    (filters.maxPrice < priceRange.max ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    filters.categories.length +
    (filters.discountRange > 0 ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0) +
    (urlSearchQuery ? 1 : 0) +
    (searchQuery ? 1 : 0),
  [filters, priceRange, urlSearchQuery, searchQuery]
  );

  const activeCategoryName = useMemo(() => {
    if (filters.categories.length > 0) {
      const filterCat = filters.categories[0];
      
      if (filterCat.startsWith('main_category:')) {
        const mainCat = filterCat.replace('main_category:', '');
        if (mainCat === 'rudraksha_accessories') {
          return 'Rudraksha Collection';
        }
        return mainCat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      
      if (filterCat.startsWith('slug:')) {
        const slug = filterCat.replace('slug:', '');
        const displayNames: Record<string, string> = {
          'siddhi-mala': 'Siddhi Mala',
          'jap-malas': 'Jap Malas',
          '1-mukhi': '1 Mukhi Rudraksha',
          '2-mukhi': '2 Mukhi Rudraksha',
          '3-mukhi': '3 Mukhi Rudraksha',
          '4-mukhi': '4 Mukhi Rudraksha',
          '5-mukhi': '5 Mukhi Rudraksha',
          '6-mukhi': '6 Mukhi Rudraksha',
          '7-mukhi': '7 Mukhi Rudraksha',
          '8-mukhi': '8 Mukhi Rudraksha',
          '9-mukhi': '9 Mukhi Rudraksha',
          '10-mukhi': '10 Mukhi Rudraksha',
          '11-mukhi': '11 Mukhi Rudraksha',
          '12-mukhi': '12 Mukhi Rudraksha',
          '13-mukhi': '13 Mukhi Rudraksha',
          '14-mukhi': '14 Mukhi Rudraksha',
        };
        return displayNames[slug] || slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      
      const category = categories.find(cat => cat.id === filterCat);
      return category?.title || 'Selected Category';
    }
    
    if (activeUrlCategory) {
      const category = categories.find(cat => cat.slug === activeUrlCategory);
      return category?.title || activeUrlCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return null;
  }, [activeUrlCategory, filters.categories, categories]);

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-4 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center py-16 sm:py-20">
            <div className="relative inline-block">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4 sm:mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl sm:text-2xl">📿</span>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Loading Spiritual Products</h3>
            <p className="text-gray-600 text-sm sm:text-base">Discovering divine Rudraksha beads for you...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 text-white py-6 sm:py-8 md:py-12 overflow-hidden mb-6 sm:mb-8 md:mb-12">
        <div className="absolute inset-0 bg-[url('/images/spiritual-pattern.svg')] opacity-10"></div>
        <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-orange-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent leading-tight">
              {urlSearchQuery 
                ? `Search Results` 
                : activeCategoryName 
                  ? `${activeCategoryName}` 
                  : 'Divine Collection'
              }
            </h1>
            <p className="text-amber-100 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 font-light">
              {urlSearchQuery 
                ? `Showing results for "${urlSearchQuery}"`
                : activeCategoryName
                ? `Discover authentic ${activeCategoryName} with spiritual significance and premium quality`
                : 'Discover authentic Nepali Rudraksha beads with spiritual significance and premium quality'
              }
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Recent Products Section with Toggle */}
        {recentProducts.length > 0 && !activeCategoryName && !urlSearchQuery && !searchQuery && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-12 border border-amber-100/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Recently Added</h2>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg">Fresh additions to our spiritual collection</p>
              </div>
              <button
                onClick={() => setShowRecentProducts(!showRecentProducts)}
                className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
              >
                {showRecentProducts ? 'Hide' : 'Show'} Recent
                <svg 
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${showRecentProducts ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {showRecentProducts && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {recentProducts.map(product => (
                  <RecentProductCard key={`recent-${product.id}`} product={product} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search and Controls Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-amber-100/50">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search for Rudraksha beads, malas, spiritual items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-14 pr-24 sm:pr-32 py-2 sm:py-3 md:py-4 border-2 border-amber-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-gray-900 placeholder-amber-400 text-sm sm:text-base font-medium transition-all duration-300"
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-20 sm:right-28 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 text-xs sm:text-sm"
                >
                  Search
                </button>
              </form>
            </div>
            
            {/* Controls - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex items-center gap-4 w-full lg:w-auto">
              {/* Filters Button */}
              <button 
                onClick={() => isMobile ? setShowMobileFilters(true) : setShowFilters(!showFilters)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              
              {/* View Toggle */}
              <div className="flex bg-amber-100 rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-amber-200">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' ? 'bg-white text-amber-600 shadow-lg' : 'text-amber-700 hover:text-amber-800'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                    viewMode === 'list' ? 'bg-white text-amber-600 shadow-lg' : 'text-amber-700 hover:text-amber-800'
                  }`}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-3 w-full">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              
              <select 
                className="flex-1 border-2 border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-gray-900 bg-white font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default" className="text-gray-900">Featured</option>
                <option value="priceLowToHigh" className="text-gray-900">Price: Low to High</option>
                <option value="priceHighToLow" className="text-gray-900">Price: High to Low</option>
                <option value="rating" className="text-gray-900">Highest Rated</option>
                <option value="discount" className="text-gray-900">Best Discount</option>
                <option value="newest" className="text-gray-900">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Desktop Filters Sidebar */}
          {!isMobile && showFilters && (
            <aside className="w-full lg:w-80 xl:w-96 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 h-fit sticky top-4 sm:top-8 border border-amber-100/50">
              <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Filters</h2>
                <div className="flex items-center gap-2 sm:gap-3">
                  {activeFilterCount > 0 && (
                    <button 
                      onClick={resetFilters}
                      className="text-amber-600 hover:text-amber-800 font-semibold text-xs sm:text-sm bg-amber-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Price Range Filter */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 md:mb-6">Price Range</h3>
                  <PriceRangeSlider 
                    min={priceRange.min}
                    max={priceRange.max}
                    value={{ min: filters.minPrice, max: filters.maxPrice }}
                    onChange={handlePriceChange}
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 md:mb-6">Customer Rating</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {[4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.minRating === rating}
                          onChange={() => handleFilterChange('minRating', rating)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-full mr-3 sm:mr-4 flex items-center justify-center transition-all duration-300 ${
                          filters.minRating === rating ? 'border-amber-500 bg-amber-500 scale-110' : 'border-gray-300 group-hover:border-amber-400'
                        }`}>
                          {filters.minRating === rating && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="flex items-center">
                          {[1,2,3,4,5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                            </svg>
                          ))}
                          <span className="ml-2 sm:ml-3 text-gray-700 font-medium text-xs sm:text-sm">& above</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories Filter */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 md:mb-6">Categories</h3>
                  <div className="max-h-60 sm:max-h-80 overflow-y-auto space-y-2 sm:space-y-3 custom-scrollbar">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center cursor-pointer group p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-amber-50 transition-all duration-300">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-lg mr-3 sm:mr-4 flex items-center justify-center transition-all duration-300 ${
                          filters.categories.includes(category.id) ? 'border-amber-500 bg-amber-500 scale-110' : 'border-gray-300 group-hover:border-amber-400'
                        }`}>
                          {filters.categories.includes(category.id) && (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700 font-medium flex-1 text-xs sm:text-sm">{category.title}</span>
                        <span className="text-xs sm:text-sm text-amber-600 bg-amber-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold">
                          {category.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Discount Filter */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 md:mb-6">Discount</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <input
                      type="range"
                      min={discountRange.min}
                      max={discountRange.max}
                      value={filters.discountRange}
                      onChange={(e) => handleFilterChange('discountRange', parseInt(e.target.value))}
                      className="w-full h-2 sm:h-3 bg-gray-200 rounded-xl appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 sm:[&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-amber-500 [&::-webkit-slider-thumb]:to-orange-500 [&::-webkit-slider-thumb]:border-2 sm:[&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600 font-medium">
                      <span>Min: {filters.discountRange}%</span>
                      <span>Max: {discountRange.max}%</span>
                    </div>
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 md:mb-6">Availability</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {(['all', 'in-stock', 'low-stock'] as const).map(availability => (
                      <label key={availability} className="flex items-center cursor-pointer group p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-amber-50 transition-all duration-300">
                        <input
                          type="radio"
                          name="availability"
                          checked={filters.availability === availability}
                          onChange={() => handleFilterChange('availability', availability)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-full mr-3 sm:mr-4 flex items-center justify-center transition-all duration-300 ${
                          filters.availability === availability ? 'border-amber-500 bg-amber-500 scale-110' : 'border-gray-300 group-hover:border-amber-400'
                        }`}>
                          {filters.availability === availability && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-700 font-medium capitalize text-xs sm:text-sm">
                          {availability === 'in-stock' ? 'In Stock' : availability === 'low-stock' ? 'Low Stock' : 'All Items'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Mobile Filter Modal */}
          <MobileFilterModal
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            filters={filters}
            priceRange={priceRange}
            categories={categories}
            discountRange={discountRange}
            onFilterChange={handleFilterChange}
            onPriceChange={handlePriceChange}
            onCategoryToggle={handleCategoryToggle}
            onResetFilters={resetFilters}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-amber-100/50">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4 md:gap-6">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {urlSearchQuery 
                      ? `Search: "${urlSearchQuery}"` 
                      : searchQuery 
                        ? `Search: "${searchQuery}"`
                        : activeCategoryName 
                          ? `${activeCategoryName}` 
                          : 'All Products'
                    }
                    <span className="text-base sm:text-lg md:text-xl font-normal text-gray-600 ml-2">({sortedProducts.length})</span>
                  </h2>
                  {activeFilterCount > 0 && (
                    <p className="text-gray-600 text-sm sm:text-base">
                      {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''} applied
                    </p>
                  )}
                </div>
                
                {/* Desktop Sort */}
                <div className="hidden lg:flex items-center gap-4">
                  <select 
                    className="border-2 border-amber-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-sm sm:text-base focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-gray-900 bg-white font-medium min-w-48"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default" className="text-gray-900">Sort by: Featured</option>
                    <option value="priceLowToHigh" className="text-gray-900">Price: Low to High</option>
                    <option value="priceHighToLow" className="text-gray-900">Price: High to Low</option>
                    <option value="rating" className="text-gray-900">Highest Rated</option>
                    <option value="discount" className="text-gray-900">Best Discount</option>
                    <option value="newest" className="text-gray-900">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {!loading && (
              <div className={`gap-3 sm:gap-4 md:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4'
                  : 'flex flex-col space-y-4 sm:space-y-6'
              }`}>
                {sortedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onWishlistToggle={toggleWishlist}
                    onAddToCart={handleAddToCart}
                    isInWishlist={wishlist.includes(product.id)}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && sortedProducts.length === 0 && (
              <div className="text-center py-12 sm:py-16 md:py-20 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-amber-100/50">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 md:mb-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl md:text-5xl">
                    {urlSearchQuery ? '🔍' : '😔'}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                  {urlSearchQuery ? 'No products found' : 'No products match your criteria'}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto leading-relaxed">
                  {urlSearchQuery 
                    ? `We couldn't find any products matching "${urlSearchQuery}". Try adjusting your search terms or browse all categories.`
                    : searchQuery
                    ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search terms.`
                    : activeCategoryName
                    ? `No products found in ${activeCategoryName} category. Try selecting a different category.`
                    : 'No products match your current filters. Try adjusting your criteria to see more results.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button 
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm sm:text-base"
                  >
                    {urlSearchQuery ? 'Browse All Products' : 'Reset Filters & Search'}
                  </button>
                  {urlSearchQuery && (
                    <button 
                      onClick={clearSearch}
                      className="bg-white text-amber-600 border-2 border-amber-500 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm sm:text-base"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #fef3c7;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f59e0b, #f97316);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #d97706, #ea580c);
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}