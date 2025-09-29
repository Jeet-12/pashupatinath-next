"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type WishlistItem = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  rating: number;
  image: string;
  category: string;
  isNew: boolean;
  isBestSeller: boolean;
  quantity: number;
  addedDate: string;
};

export default function WishlistPage() {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recent' | 'price-low' | 'price-high' | 'name'>('recent');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Load wishlist items from localStorage on component mount
  useEffect(() => {
    const loadWishlistItems = () => {
      try {
        const savedWishlist = localStorage.getItem('rudraksha_wishlist');
        if (savedWishlist) {
          const items = JSON.parse(savedWishlist);
          setWishlistItems(items);
        }
      } catch (error) {
        console.error('Error loading wishlist items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWishlistItems();
  }, []);

  // Save wishlist items to localStorage whenever wishlist changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('rudraksha_wishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, loading]);

  const removeItem = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const moveAllToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('rudraksha_cart') || '[]');
    
    wishlistItems.forEach(item => {
      const existingItemIndex = cartItems.findIndex((cartItem: any) => cartItem.id === item.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        cartItems.push({
          id: item.id,
          name: item.name,
          price: item.price,
          oldPrice: item.oldPrice,
          discount: item.discount,
          quantity: 1,
          image: item.image,
          category: item.category,
          maxQuantity: item.quantity
        });
      }
    });

    localStorage.setItem('rudraksha_cart', JSON.stringify(cartItems));
    
    // Clear wishlist after moving to cart
    setWishlistItems([]);
    localStorage.removeItem('rudraksha_wishlist');
    
    alert('All items have been moved to your cart!');
  };

  const moveToCart = (item: WishlistItem) => {
    const cartItems = JSON.parse(localStorage.getItem('rudraksha_cart') || '[]');
    
    const existingItemIndex = cartItems.findIndex((cartItem: any) => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({
        id: item.id,
        name: item.name,
        price: item.price,
        oldPrice: item.oldPrice,
        discount: item.discount,
        quantity: 1,
        image: item.image,
        category: item.category,
        maxQuantity: item.quantity
      });
    }

    localStorage.setItem('rudraksha_cart', JSON.stringify(cartItems));
    removeItem(item.id);
    
    alert(`${item.name} has been moved to your cart!`);
  };

  const clearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlistItems([]);
      localStorage.removeItem('rudraksha_wishlist');
    }
  };

  const continueShopping = () => {
    router.push('/products');
  };

  // Get unique categories from wishlist items
  const categories = Array.from(new Set(wishlistItems.map(item => item.category)));

  // Filter and sort wishlist items
  const filteredAndSortedItems = wishlistItems
    .filter(item => 
      selectedCategories.length === 0 || selectedCategories.includes(item.category)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      }
    });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-amber-900 mt-4">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-amber-700 mb-6">
              Save your favorite Rudraksha beads here to keep track of items you love.
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <button
                onClick={continueShopping}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold text-lg"
              >
                Explore Rudraksha Collection
              </button>
              <p className="text-sm text-amber-600">
                Click the ♡ heart icon on any product to add it to your wishlist
              </p>
            </div>
          </div>

          {/* Suggested Products Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Popular Rudraksha Beads</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: '5 Mukhi Rudraksha', price: 1200, image: '/placeholder-rudraksh.jpg', category: '5 Mukhi' },
                { name: '7 Mukhi Rudraksha', price: 2125, image: '/placeholder-rudraksh.jpg', category: '7 Mukhi' },
                { name: '11 Mukhi Rudraksha', price: 21250, image: '/placeholder-rudraksh.jpg', category: '11 Mukhi' }
              ].map((product, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative h-32 mx-auto mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="font-semibold text-amber-900 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <p className="text-amber-600 font-bold">₹{product.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-3">Your Wishlist</h1>
          <p className="text-lg text-amber-700">
            Save your favorite Rudraksha beads for later ({wishlistItems.length} items)
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-amber-900">Filters</h2>
                {(selectedCategories.length > 0) && (
                  <button
                    onClick={() => setSelectedCategories([])}
                    className="text-sm text-amber-600 hover:text-amber-800"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="font-semibold text-black mb-3">Sort By</h3>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full border border-amber-200 rounded-xl p-3 text-black bg-white"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>

              {/* Categories Filter */}
              <div>
                <h3 className="font-semibold text-black mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                        selectedCategories.includes(category) ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
                      }`}>
                        {selectedCategories.includes(category) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-black">{category}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        ({wishlistItems.filter(item => item.category === category).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Wishlist Actions */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={moveAllToCart}
                  className="w-full bg-amber-500 text-white py-3 rounded-xl hover:bg-amber-600 transition-colors font-semibold"
                >
                  Move All to Cart
                </button>
                <button
                  onClick={clearWishlist}
                  className="w-full border border-red-500 text-red-500 py-3 rounded-xl hover:bg-red-50 transition-colors font-semibold"
                >
                  Clear Wishlist
                </button>
                <button
                  onClick={continueShopping}
                  className="w-full border border-amber-500 text-amber-500 py-3 rounded-xl hover:bg-amber-50 transition-colors font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-amber-900">
                    Saved Items ({filteredAndSortedItems.length})
                  </h2>
                  {selectedCategories.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                      Filtered by {selectedCategories.join(', ')}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Sort: {sortBy.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedItems.map((item) => (
                  <div key={item.id} className="group bg-white border border-amber-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                    {/* Product Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {item.isNew && (
                          <span className="bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-full">NEW</span>
                        )}
                        {item.isBestSeller && (
                          <span className="bg-purple-500 text-white text-xs font-bold py-1 px-2 rounded-full">BEST SELLER</span>
                        )}
                        <span className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">
                          {item.discount}% OFF
                        </span>
                      </div>

                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Remove from wishlist"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>

                      {/* Stock Status */}
                      <div className={`absolute bottom-3 right-3 text-white text-xs font-bold py-1 px-2 rounded-full ${
                        item.quantity > 10 ? 'bg-green-500' : item.quantity > 0 ? 'bg-amber-500' : 'bg-red-500'
                      }`}>
                        {item.quantity > 0 ? `${item.quantity} left` : 'Out of Stock'}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-amber-900 text-lg line-clamp-2 flex-1">{item.name}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2">{item.category}</span>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927C9.3 2.215 10.7 2.215 10.951 2.927l1.286 3.964a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.963c.251.712-.587 1.3-1.18.866l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.593.434-1.431-.154-1.18-.866l1.286-3.963a1 1 0 00-.364-1.118L2.067 9.39c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.964z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({item.rating})</span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xl font-bold text-[#f5821f]">₹{item.price.toLocaleString()}</span>
                          <span className="ml-2 text-gray-500 line-through text-sm">₹{item.oldPrice.toLocaleString()}</span>
                        </div>
                        <span className="text-green-600 text-sm font-semibold">
                          Save ₹{(item.oldPrice - item.price).toLocaleString()}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveToCart(item)}
                          disabled={item.quantity === 0}
                          className={`flex-1 font-semibold py-2 rounded-xl transition-all duration-300 flex items-center justify-center text-sm ${
                            item.quantity === 0 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                          }`}
                        >
                          {item.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        
                        <button
                          onClick={() => router.push(`/product/${item.id}`)}
                          className="px-4 py-2 border border-amber-500 text-amber-500 rounded-xl hover:bg-amber-50 transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>

                      {/* Added Date */}
                      <div className="text-xs text-gray-500 text-center mt-3">
                        Added on {new Date(item.addedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wishlist Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-amber-900 mb-4">Wishlist Summary</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-amber-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600">{wishlistItems.length}</div>
                  <div className="text-sm text-amber-700">Total Items</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{wishlistItems.reduce((total, item) => total + item.price, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">Total Value</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {wishlistItems.filter(item => item.isBestSeller).length}
                  </div>
                  <div className="text-sm text-purple-700">Best Sellers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}