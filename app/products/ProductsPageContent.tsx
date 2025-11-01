"use client";

import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import { Product, RecentProduct, ProductsApiResponse, fetchProducts, addToWishlistApiWithNotify, singleAddToCart } from '../libs/api';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Filters = {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  minstock: number;
  categories: string[];
  tags: string[];
  discountRange: number;
  availability: 'all' | 'in-stock' | 'low-stock';
};

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [recentProduct, setRecentProduct] = useState<RecentProduct[]>([]);
  const [showRecentProducts, setShowRecentProducts] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 50000,
    minRating: 0,
    minstock: 0,
    categories: [],
    tags: [],
    discountRange: 0,
    availability: 'all'
  });
  
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [urlCategory, setUrlCategory] = useState<string | null>(null);
  const [activeUrlCategory, setActiveUrlCategory] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Add to cart handler which calls backend
  const handleAddToCart = async (slug: string, price: number) => {
    try {
      const res = await singleAddToCart({ slug, quantity: 1, total_price: price });
      if (res.success) {
        alert('Added to cart');
      } else {
        alert(res.message || 'Failed to add to cart');
      }
    } catch {
      // ignore errors for now
    }
  };

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts: ProductsApiResponse = await fetchProducts();
        console.log('Fetched products:', fetchedProducts);
        
        setProducts(fetchedProducts.products || []);
        setRecentProduct(fetchedProducts.recent_products || []);

        // Update price range only if we have products
        if (fetchedProducts.products && fetchedProducts.products.length > 0) {
          const prices = fetchedProducts.products.map(p => p.price).filter(price => !isNaN(price));
          if (prices.length > 0) {
            setFilters(prev => ({
              ...prev,
              minPrice: Math.min(...prices),
              maxPrice: Math.max(...prices),
            }));
          }
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Set empty arrays on error
        setProducts([]);
        setRecentProduct([]);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    loadProducts();
  }, []);

  // Handle URL parameters after products are loaded
  useEffect(() => {
    if (!isInitialLoad && products.length > 0) {
      const mainCategoryFromUrl = searchParams?.get('main-category');
      const categoryFromUrl = searchParams?.get('category');
      
      // CASE 1: Main category filtering (from header navigation)
      if (mainCategoryFromUrl) {
        console.log('Main Category from URL detected:', mainCategoryFromUrl);
        setUrlCategory(mainCategoryFromUrl);
        setActiveUrlCategory(mainCategoryFromUrl);
        
        setFilters(prev => ({
          ...prev,
          categories: [`main_category:${mainCategoryFromUrl}`]
        }));
      }
      // CASE 2: Slug-based filtering (individual categories)
      else if (categoryFromUrl) {
        console.log('Category from URL detected:', categoryFromUrl);
        setUrlCategory(categoryFromUrl);
        setActiveUrlCategory(categoryFromUrl);
        
        setFilters(prev => ({
          ...prev,
          categories: [`slug:${categoryFromUrl}`]
        }));
      }
    }
  }, [searchParams, products, isInitialLoad]);

  // Calculate min and max values for filters
  const priceRange = useMemo(() => ({
    min: products?.length > 0 ? Math.min(...products.map(p => p.price)) : 0,
    max: products?.length > 0 ? Math.max(...products.map(p => p.price)) : 50000
  }), [products]);

  const discountRange = useMemo(() => ({
    min: products?.length > 0 ? Math.min(...products.map(p => p.discount)) : 0,
    max: products?.length > 0 ? Math.max(...products.map(p => p.discount)) : 30
  }), [products]);

  // Get unique categories from products
  const categories = useMemo(() => {
    const categoryMap = new Map();
    
    products.forEach(product => {
      if (product.cat_info && product.cat_info.id && product.cat_info.title) {
        const categoryId = product.cat_info.id.toString();
        const categoryTitle = product.cat_info.title;
        const categorySlug = product.cat_info.slug;
        
        if (categoryMap.has(categoryId)) {
          // Update count if category already exists
          const existing = categoryMap.get(categoryId);
          categoryMap.set(categoryId, {
            ...existing,
            count: existing.count + 1
          });
        } else {
          // Add new category
          categoryMap.set(categoryId, {
            id: categoryId,
            title: categoryTitle,
            slug: categorySlug,
            count: 1
          });
        }
      }
    });
    
    return Array.from(categoryMap.values())
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [products]);

  // Get recent products (last 6 added)
  const recentProducts = useMemo(() => {
    return [...recentProduct]
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, 6);
  }, [recentProduct]);

  // Check screen size
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Filter handlers
  const handlePriceChange = (min: number, max: number) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  // Category toggle - works with both header navigation and manual selection
  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleCategoryFromUrl = (categorySlug: string, categoryName: string) => {
    // Use slug-based filtering for manual category selection
    setFilters(prev => ({
      ...prev,
      categories: [`slug:${categorySlug}`]
    }));
    setActiveUrlCategory(categorySlug);
  };

  const clearCategoryFilter = () => {
    setFilters(prev => ({
      ...prev,
      categories: []
    }));
    setActiveUrlCategory(null);
    setUrlCategory(null);
  };

  const resetFilters = () => {
    setFilters({
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      minRating: 0,
      minstock: 0,
      categories: [],
      tags: [],
      discountRange: 0,
      availability: 'all'
    });
    setSearchQuery('');
    setActiveUrlCategory(null);
    setUrlCategory(null);
  };

  // Wishlist handlers
  const toggleWishlist = (productId: number, slug?: string) => {
    // Optimistic UI update
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );

    // Fire-and-forget backend call
    (async () => {
      try {
        await addToWishlistApiWithNotify({ slug });
      } catch {
        // ignore errors for now; optionally revert state on failure
      }
    })();
  };

  // Image URL handler
  const getProductImage = (product: Product | RecentProduct) => {
    let productImage = "";

    if (Array.isArray(product.images) && product.images.length > 0) {
      productImage = product.images[0];
    } else if (Array.isArray(product.photos) && product.photos.length > 0) {
      productImage = product.photos[0];
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

  // UPDATED: Filter and sort products with proper category matching
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Price filter
    filtered = filtered.filter(product => 
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );
    
    // Rating filter
    const productRating = (product: Product) => product.reviews_avg_rate || 0;
    filtered = filtered.filter(product => 
      productRating(product) >= filters.minRating
    );
    
    // Stock filter
    filtered = filtered.filter(product => 
      product.stock >= filters.minstock
    );
    
    // UPDATED: Category filter - handle different filter types
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => {
        return filters.categories.some(filterCat => {
          // Handle main_category filters (from main-category URL param)
          if (filterCat.startsWith('main_category:')) {
            const mainCat = filterCat.replace('main_category:', '');
            return product.cat_info?.main_category === mainCat;
          }
          
          // Handle slug-based filters (from category URL param)
          if (filterCat.startsWith('slug:')) {
            const slugFilter = filterCat.replace('slug:', '');
            return product.cat_info?.slug === slugFilter;
          }
          
          // Handle normal category ID filters (from manual selection in filters)
          const productCategoryId = product.cat_info?.id?.toString();
          return filterCat === productCategoryId;
        });
      });
    }
    
    // Discount filter
    filtered = filtered.filter(product => 
      product.discount >= filters.discountRange
    );
    
    // Availability filter
    if (filters.availability === 'in-stock') {
      filtered = filtered.filter(product => product.stock > 0);
    } else if (filters.availability === 'low-stock') {
      filtered = filtered.filter(product => product.stock > 0 && product.stock <= 5);
    }
    
    return filtered;
  }, [filters, searchQuery, products]);

  const sortedProducts = useMemo(() => {
    const productsCopy = [...filteredProducts];
    
    switch (sortBy) {
      case 'priceLowToHigh': return productsCopy.sort((a, b) => a.price - b.price);
      case 'priceHighToLow': return productsCopy.sort((a, b) => b.price - a.price);
      case 'rating': return productsCopy.sort((a, b) => (b.reviews_avg_rate || 0) - (a.reviews_avg_rate || 0));
      case 'discount': return productsCopy.sort((a, b) => b.discount - a.discount);
      case 'newest': return productsCopy.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      default: return productsCopy;
    }
  }, [filteredProducts, sortBy]);

  const activeFilterCount = useMemo(() => {
    return (
      (filters.minPrice > priceRange.min ? 1 : 0) +
      (filters.maxPrice < priceRange.max ? 1 : 0) +
      (filters.minRating > 0 ? 1 : 0) +
      (filters.minstock > 0 ? 1 : 0) +
      filters.categories.length +
      filters.tags.length +
      (filters.discountRange > 0 ? 1 : 0) +
      (filters.availability !== 'all' ? 1 : 0)
    );
  }, [filters, priceRange]);

  // Get active category name for display
  const activeCategoryName = useMemo(() => {
    if (filters.categories.length > 0) {
      const filterCat = filters.categories[0];
      
      // Main category filters
      if (filterCat.startsWith('main_category:')) {
        const mainCat = filterCat.replace('main_category:', '');
        if (mainCat === 'rudraksha_accessories') {
          return 'Rudraksha Collection';
        }
        return mainCat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
      
      // Slug-based filters
      if (filterCat.startsWith('slug:')) {
        const slug = filterCat.replace('slug:', '');
        // Convert slug to display name
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
      
      // Normal category ID filters
      const category = categories.find(cat => cat.id === filterCat);
      return category?.title || 'Selected Category';
    }
    
    if (activeUrlCategory) {
      const category = categories.find(cat => cat.slug === activeUrlCategory);
      return category?.title || activeUrlCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return null;
  }, [activeUrlCategory, filters.categories, categories]);

  // Rest of the component remains the same...
  const ProductCard = ({ product }: { product: Product }) => {
    const productImage = getProductImage(product);
    const isInWishlist = wishlist.includes(product.id);

    // Safely handle potentially undefined values
    const hasDiscount = (product.discount || 0) > 0;
    const currentPrice = hasDiscount
      ? Math.round(product.price - (product.price * (product.discount || 0)) / 100)
      : product.price;
    const discountAmount = hasDiscount
      ? product.price - currentPrice
      : 0;
    
    const stock = product.stock || 0;
    const reviewsCount = product.reviews_count || 0;
    const reviewsAvgRate = product.reviews_avg_rate || 0;

    // Get category information
    const mainCategory = product.cat_info?.title || 'Rudraksha';
    const subCategory = product.sub_cat_info?.title;
    const categorySlug = product.cat_info?.slug;

    return (
      <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100 flex flex-col transform hover:-translate-y-1">
        {/* Make the card clickable */}
        <Link href={`/product-details/${product.slug}`} className="flex-1 flex flex-col">
          {/* Product Image */}
          <div className="relative h-48 sm:h-64 overflow-hidden">
            <Image
              src={productImage}
              alt={product.title || 'Product image'}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-image.jpg';
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent link navigation
                toggleWishlist(product.id);
              }}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                isInWishlist 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
            >
              <svg 
                className="w-5 h-5" 
                fill={isInWishlist ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-full">NEW</span>
              )}
              {product.isBestSeller && (
                <span className="bg-purple-500 text-white text-xs font-bold py-1 px-2 rounded-full">BEST SELLER</span>
              )}
              {hasDiscount && (
                <span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                  {product.discount}% OFF
                </span>
              )}
            </div>
            
            {/* Stock Badge */}
            <div className={`absolute bottom-3 left-3 text-white text-xs font-bold py-1 px-2 rounded-full ${
              stock > 10 ? 'bg-green-500' : stock > 0 ? 'bg-amber-500' : 'bg-red-500'
            }`}>
              {stock > 0 ? `${stock} left` : 'Out of Stock'}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="p-3 sm:p-5 flex flex-col flex-grow">
            {/* Category Badge */}
            <div className="mb-2">
              <Link 
                href={`/products?category=${categorySlug}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCategoryFromUrl(categorySlug || '', mainCategory);
                }}
                className="inline-block bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full hover:bg-amber-200 transition-colors"
              >
                {mainCategory}
              </Link>
              {subCategory && (
                <span className="text-xs text-gray-500 ml-1">• {subCategory}</span>
              )}
            </div>
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-amber-900 line-clamp-2 flex-1">
                {product.title || 'Untitled Product'}
              </h3>
            </div>
            
            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(reviewsAvgRate) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">({reviewsCount})</span>
            </div>
            
            {/* Pricing */}
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-[#f5821f]">
                    ₹{currentPrice.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-gray-500 line-through text-sm">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-green-600 text-sm font-semibold">
                        You Save ₹{discountAmount.toLocaleString()} ({product.discount}%)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 px-5 pb-5">
            <button
              disabled={stock === 0}
            className={`flex-1 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center text-sm ${
              stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
            }`}
              onClick={(e) => { e.preventDefault(); handleAddToCart(product.slug, currentPrice); }}
          >
            {stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add to cart
              </>
            )}
          </button>
          <button
            disabled={stock === 0}
            className={`px-4 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center text-sm ${
              stock === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-3">
            {activeCategoryName ? `${activeCategoryName} Collection` : 'Divine Rudraksha Collection'}
          </h1>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto">
            Discover authentic Nepali Rudraksha beads with spiritual significance and premium quality
          </p>
          
          {/* Active Category Badge */}
          {activeCategoryName && (
            <div className="mt-4 flex justify-center items-center gap-2">
              <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {activeCategoryName}
              </span>
              <button
                onClick={clearCategoryFilter}
                className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center gap-1"
              >
                Clear Filter
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>      

        {/* Recent Products Section with Toggle */}
        {recentProducts.length > 0 && !activeCategoryName && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Recently Added Products</h2>
              <button
                onClick={() => setShowRecentProducts(!showRecentProducts)}
                className="flex items-center gap-2 text-amber-600 hover:text-amber-800 text-sm font-semibold"
              >
                {showRecentProducts ? 'Hide' : 'Show'} Recent Products
                <svg 
                  className={`w-4 h-4 transition-transform ${showRecentProducts ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {showRecentProducts && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {recentProducts.map(product => {
                  const productImage = getProductImage(product);
                  const hasDiscount = product.discount > 0;
                  const currentPrice = hasDiscount
                    ? Math.round(product.price - (product.price * product.discount) / 100)
                    : product.price;
                  const discountAmount = hasDiscount
                    ? product.price - currentPrice
                    : 0;
                  return (
                    <Link
                      key={`recent-${product.id}`}
                      href={`/product-details/${product.slug}`}
                      className="group bg-gray-50 rounded-xl p-3 hover:shadow-md transition-shadow block"
                    >
                      <div className="relative h-32 mb-2">
                        <Image
                          src={productImage}
                          alt={product.title}
                          fill
                          className="object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      <h3 className="font-semibold text-black text-sm line-clamp-2">{product.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[#f5821f] font-bold text-sm">₹{currentPrice.toLocaleString()}</p>
                        {hasDiscount && (
                          <>
                            <p className="text-gray-500 line-through text-xs">₹{product.price.toLocaleString()}</p>
                          </>
                        )}
                      </div>
                      {hasDiscount && (
                        <p className="text-green-600 text-xs font-semibold mt-1">
                          You Save ₹{discountAmount.toLocaleString()} ({product.discount}%)
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for Rudraksha beads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black"
              />
              <svg className="w-5 h-5 absolute left-4 top-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              
              <div className="flex bg-amber-100 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white text-amber-600 shadow' : 'text-amber-700'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white text-amber-600 shadow' : 'text-amber-700'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          {(showFilters || !isMobile) && (
            <aside className="w-full lg:w-80 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-black">Filters</h2>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button 
                      onClick={resetFilters}
                      className="text-sm text-amber-600 hover:text-amber-800"
                    >
                      Clear All
                    </button>
                  )}
                  {isMobile && (
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Price Range Filter */}
                <div>
                  <h3 className="font-semibold mb-4 text-black">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-black">
                      <span>₹{filters.minPrice.toLocaleString()}</span>
                      <span>₹{filters.maxPrice.toLocaleString()}</span>
                    </div>
                    <div className="relative py-4">
                      {/* Min and Max Labels */}
                      <div className="flex justify-between text-xs text-black mb-2">
                        <span>Min: ₹{priceRange.min.toLocaleString()}</span>
                        <span>Max: ₹{priceRange.max.toLocaleString()}</span>
                      </div>
                      
                      {/* Custom Dual Range Slider */}
                      <div className="relative h-2 bg-gray-200 rounded-lg">
                        <div 
                          className="absolute h-2 bg-amber-500 rounded-lg"
                          style={{
                            insetInlineStart: `${((filters.minPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                            inlineSize: `${((filters.maxPrice - filters.minPrice) / (priceRange.max - priceRange.min)) * 100}%`
                          }}
                        />
                        
                        {/* Min Price Thumb */}
                        <input
                          type="range"
                          min={priceRange.min}
                          max={priceRange.max}
                          value={filters.minPrice}
                          onChange={(e) => {
                            const value = Math.min(parseInt(e.target.value), filters.maxPrice - 1);
                            handlePriceChange(value, filters.maxPrice);
                          }}
                          className="absolute w-full h-2 opacity-0 cursor-pointer z-20"
                        />
                        
                        {/* Max Price Thumb */}
                        <input
                          type="range"
                          min={priceRange.min}
                          max={priceRange.max}
                          value={filters.maxPrice}
                          onChange={(e) => {
                            const value = Math.max(parseInt(e.target.value), filters.minPrice + 1);
                            handlePriceChange(filters.minPrice, value);
                          }}
                          className="absolute w-full h-2 opacity-0 cursor-pointer z-20"
                        />
                        
                        {/* Custom Thumbs */}
                        <div 
                          className="absolute w-4 h-4 bg-amber-600 rounded-full -top-1 cursor-pointer border-2 border-white shadow-lg z-10"
                          style={{ insetInlineStart: `calc(${((filters.minPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}% - 8px)` }}
                        />
                        
                        <div 
                          className="absolute w-4 h-4 bg-amber-600 rounded-full -top-1 cursor-pointer border-2 border-white shadow-lg z-10"
                          style={{ insetInlineStart: `calc(${((filters.maxPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}% - 8px)` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-black">Customer Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <label key={rating} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.minRating === rating}
                          onChange={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
                          filters.minRating === rating ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                        }`}>
                          {filters.minRating === rating && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-black">& above</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-black">Categories</h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {categories.map(category => (
                      <label key={category.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.id)}
                          onChange={() => handleCategoryToggle(category.id)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                          filters.categories.includes(category.id) ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                        }`}>
                          {filters.categories.includes(category.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-black flex-1">{category.title}</span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {category.count}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Discount Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-black">Discount</h3>
                  <input
                    type="range"
                    min={discountRange.min}
                    max={discountRange.max}
                    value={filters.discountRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, discountRange: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-black"
                  />
                  <div className="flex justify-between text-sm text-black mt-1">
                    <span>Min: {filters.discountRange}%</span>
                    <span>Max: {discountRange.max}%</span>
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <h3 className="font-semibold mb-3 text-black">Availability</h3>
                  <div className="space-y-2">
                    {(['all', 'in-stock', 'low-stock'] as const).map(availability => (
                      <label key={availability} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="availability"
                          checked={filters.availability === availability}
                          onChange={() => setFilters(prev => ({ ...prev, availability }))}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
                          filters.availability === availability ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                        }`}>
                          {filters.availability === availability && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-black capitalize">
                          {availability === 'in-stock' ? 'In Stock' : availability === 'low-stock' ? 'Low Stock' : 'All Items'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-black">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 
                     activeCategoryName ? `${activeCategoryName} Products` : 'All Rudraksha Beads'}
                    <span className="text-lg font-normal text-gray-500 ml-2">({sortedProducts.length} products)</span>
                  </h2>
                  {activeFilterCount > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''} applied
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <select 
                    className="border border-amber-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-black bg-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="default" className="text-black">Sort by: Featured</option>
                    <option value="priceLowToHigh" className="text-black">Price: Low to High</option>
                    <option value="priceHighToLow" className="text-black">Price: High to Low</option>
                    <option value="rating" className="text-black">Highest Rated</option>
                    <option value="discount" className="text-black">Best Discount</option>
                    <option value="newest" className="text-black">Newest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                <p className="text-black mt-4">Loading products...</p>
              </div>
            )}

            {/* Product Grid */}
            {!loading && (
              <div className={`gap-4 md:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                  : 'flex flex-col space-y-4 md:space-y-6'
              }`}>
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && sortedProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="w-24 h-24 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">No products found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery 
                    ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search or filters.`
                    : activeCategoryName
                    ? `No products found in ${activeCategoryName} category. Try selecting a different category.`
                    : 'No products match your current filters. Try adjusting your criteria to see more results.'
                  }
                </p>
                <button 
                  onClick={resetFilters}
                  className="bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors font-semibold"
                >
                  {activeCategoryName ? 'Show All Products' : 'Reset Filters & Search'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Make slider thumb black */
        .slider-black::-webkit-slider-thumb {
          background: #000;
          border: 2px solid #fff;
        }
        .slider-black::-moz-range-thumb {
          background: #000;
          border: 2px solid #fff;
        }
      `}</style>
    </div>
  );
}