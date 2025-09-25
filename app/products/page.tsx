"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  rating: number;
  discount: number;
  quantity: number;
  image: string;
};

type Filters = {
  minPrice: number;
  maxPrice: number;
  minRating: number;
  minQuantity: number;
};

// -------------------- Data --------------------
const products: Product[] = [
  { id: 1, name: '12 Mukhi Nepali Rudraksh', price: 25500, oldPrice: 30000, rating: 4, discount: 15, quantity: 5, image: '/placeholder-rudraksh.jpg' },
  { id: 2, name: '13 Mukhi Nepali Rudraksh', price: 34000, oldPrice: 40000, rating: 5, discount: 15, quantity: 2, image: '/placeholder-rudraksh.jpg' },
  { id: 3, name: '11 Mukhi Nepali Rudraksh', price: 21250, oldPrice: 25000, rating: 5, discount: 15, quantity: 8, image: '/placeholder-rudraksh.jpg' },
  { id: 4, name: '10 Mukhi Nepali Rudraksh', price: 13600, oldPrice: 16000, rating: 4, discount: 15, quantity: 10, image: '/placeholder-rudraksh.jpg' },
  { id: 5, name: '8 Mukhi Nepali Rudraksh', price: 6375, oldPrice: 7500, rating: 3, discount: 15, quantity: 15, image: '/placeholder-rudraksh.jpg' },
  { id: 6, name: '9 Mukhi Nepali Rudraksh', price: 12750, oldPrice: 15000, rating: 4, discount: 15, quantity: 7, image: '/placeholder-rudraksh.jpg' },
  { id: 7, name: '7 Mukhi Nepali Rudraksh', price: 2125, oldPrice: 2500, rating: 5, discount: 15, quantity: 20, image: '/placeholder-rudraksh.jpg' },
  { id: 8, name: '6 Mukhi Nepali Rudraksh', price: 800, oldPrice: 1000, rating: 4, discount: 20, quantity: 25, image: '/placeholder-rudraksh.jpg' },
  { id: 9, name: '4 Mukhi Nepali Rudraksh', price: 800, oldPrice: 1000, rating: 5, discount: 20, quantity: 12, image: '/placeholder-rudraksh.jpg' },
];

const recentlyAddedProducts = products.slice(-3);

const categories: string[] = [
  'Jap Malas', 'Ganesh', 'Siddhi Mala', '1 Mukhi', '2 Mukhi', '3 Mukhi', '4 Mukhi',
  '5 Mukhi', '6 Mukhi', '7 Mukhi', '8 Mukhi', '9 Mukhi', '10 Mukhi', '11 Mukhi', 
  '12 Mukhi', '13 Mukhi', '14 Mukhi'
];

export default function ProductsPage() {
 const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [showRecentProducts, setShowRecentProducts] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 50000,
    minRating: 0,
    minQuantity: 0
  });

  // Check screen size on mount and resize
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Calculate min and max values for filters
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));
  const minQuantity = Math.min(...products.map(p => p.quantity));
  const maxQuantity = Math.max(...products.map(p => p.quantity));

  const handleFilterChange = (filterName: keyof typeof filters, value: number) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 50000,
      minRating: 0,
      minQuantity: 0
    });
    setSelectedCategory(null);
    setSortBy('default');
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategory && !product.name.includes(selectedCategory)) {
      return false;
    }
    
    // Price filter
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }
    
    // Rating filter
    if (product.rating < filters.minRating) {
      return false;
    }
    
    // Quantity filter
    if (product.quantity < filters.minQuantity) {
      return false;
    }
    
    return true;
  });

  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceLowToHigh') return a.price - b.price;
    if (sortBy === 'priceHighToLow') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'quantity') return b.quantity - a.quantity;
    return a.id - b.id; // default sort by original order
  });

 const addToCart = (product: Product) => {
    console.log('Added to cart:', product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-4 md:py-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Recently Added Products Dropdown */}
        <div className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <button 
            className="w-full p-4 flex justify-between items-center text-left font-semibold text-gray-800 bg-orange-50 hover:bg-orange-100 transition"
            onClick={() => setShowRecentProducts(!showRecentProducts)}
          >
            <span>Recently Added Products</span>
            <svg 
              className={`w-5 h-5 transform transition-transform ${showRecentProducts ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showRecentProducts && (
            <div className="p-4 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recentlyAddedProducts.map((product) => (
                  <div key={`recent-${product.id}`} className="flex items-center bg-gray-50 rounded-lg p-3">
                    <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white font-bold text-sm">{product.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{product.name}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-gray-900 font-semibold">₹{product.price.toLocaleString()}</p>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile filter toggle button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold text-gray-800">
              {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
              <span className="text-sm font-normal text-gray-500 ml-2">({sortedProducts.length} products)</span>
            </h1>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>

          {/* Sidebar - Hidden on mobile unless toggled */}
          {(showFilters || !isMobile) && (
            <aside className="w-full lg:w-64 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-700">Filters</h2>
                <div className="flex items-center">
                  <button 
                    onClick={resetFilters}
                    className="text-sm text-orange-500 hover:text-orange-700 mr-2"
                  >
                    Reset
                  </button>
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
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-700">Categories</h3>
                <div className="max-h-40 overflow-y-auto">
                  <div 
                    className={`text-gray-800 px-3 py-2 rounded cursor-pointer ${!selectedCategory ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Products
                  </div>
                  {categories.map((cat) => (
                    <div 
                      key={cat} 
                      className={`text-gray-800 px-3 py-2 rounded cursor-pointer text-sm ${selectedCategory === cat ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-700">Price Range</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Min: ₹{filters.minPrice.toLocaleString()}</span>
                      <span>Max: ₹{filters.maxPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-700">Minimum Rating</h3>
                <div className="flex flex-wrap gap-2">
                  {[0, 1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('minRating', rating)}
                      className={`px-3 py-1 rounded-md text-sm ${filters.minRating === rating ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {rating === 0 ? 'All' : `${rating}+ Stars`}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-700">Minimum Quantity</h3>
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Min: {filters.minQuantity}</span>
                    <span>Max: {maxQuantity}</span>
                  </div>
                  <input
                    type="range"
                    min={minQuantity}
                    max={maxQuantity}
                    value={filters.minQuantity}
                    onChange={(e) => handleFilterChange('minQuantity', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with sorting options - Hidden on mobile */}
            {!isMobile && (
              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                <div>
                  <h1 className="text-xl font-bold text-gray-800">
                    {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
                    <span className="text-sm font-normal text-gray-500 ml-2">({sortedProducts.length} products)</span>
                  </h1>
                  {filters.minPrice > minPrice || filters.maxPrice < maxPrice || filters.minRating > 0 || filters.minQuantity > 0 ? (
                    <div className="text-xs text-gray-500 mt-1">
                      Active filters: 
                      {filters.minPrice > minPrice && ` Min Price: ₹${filters.minPrice.toLocaleString()}`}
                      {filters.maxPrice < maxPrice && ` Max Price: ₹${filters.maxPrice.toLocaleString()}`}
                      {filters.minRating > 0 && ` Min Rating: ${filters.minRating}+`}
                      {filters.minQuantity > 0 && ` Min Quantity: ${filters.minQuantity}`}
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <label className="text-gray-700 mr-2 text-sm">Sort by:</label>
                    <select 
                      className="border border-gray-300 rounded-md p-2 text-sm"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="default">Default</option>
                      <option value="priceLowToHigh">Price: Low to High</option>
                      <option value="priceHighToLow">Price: High to Low</option>
                      <option value="rating">Rating</option>
                      <option value="quantity">Quantity</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile sort dropdown */}
            {isMobile && (
              <div className="mb-4 bg-white p-3 rounded-lg shadow-sm">
                <select 
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Sort: Default</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="quantity">Quantity</option>
                </select>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map(product => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-amber-100 flex flex-col">
                  {/* Product Image */}
                  <div className="relative h-48 sm:h-56 md:h-52 lg:h-56 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                      {product.discount}% OFF
                    </div>

                    {/* Quantity Badge */}
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                      {product.quantity} left
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-base text-amber-900 mb-2 line-clamp-2">{product.name}</h3>
                    
                    {/* Rating block */}
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-xs text-gray-600">({product.rating})</span>
                    </div>
                    
                    {/* Pricing */}
                    <div className="mt-auto">
                      <div className="flex items-center mb-3">
                        <span className="text-lg font-bold text-[#f5821f]">₹{product.price.toLocaleString()}</span>
                        <span className="ml-2 text-gray-500 line-through text-sm">₹{product.oldPrice.toLocaleString()}</span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm mt-6">
                <svg className="w-16 h-16 mx-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 mt-4">No products found matching your filters.</p>
                <button 
                  onClick={resetFilters}
                  className="mt-4 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}