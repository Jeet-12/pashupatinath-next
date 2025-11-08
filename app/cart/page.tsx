"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, removeFromCart, clearCart, updateCartQuantity } from '../libs/api';

type CartItem = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  quantity: number;
  image: string;
  category: string;
  maxQuantity: number;
  slug: string; // Added slug for API calls
  product_id: number; // Added product_id
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState<number | null>(null);
  const [clearingCart, setClearingCart] = useState(false);
  const [showOfferBadge, setShowOfferBadge] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<number[]>([]); // Track items being updated

  // Load cart items on component mount
  useEffect(() => {
    let mounted = true;
    
    const loadInitialData = async () => {
      try {
        setLoading(true);
        await loadCartItems();
      } catch (error) {
        console.error('Error loading cart data:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    const onCounts = () => loadCartItems();
    window.addEventListener('countsUpdated', onCounts as EventListener);

    return () => { 
      mounted = false; 
      window.removeEventListener('countsUpdated', onCounts as EventListener); 
    };
  }, []);

  const loadCartItems = async () => {
    try {
      const res = await getCart();
      
      if (res.success && res.data && Array.isArray(res.data.cart_items)) {
        const items = res.data.cart_items.map((ci: any) => {
          // Fix image URL handling
          let imageUrl = '';
          if (ci.product_images) {
            imageUrl = ci.product_images.startsWith('http') 
              ? ci.product_images 
              : `${process.env.NEXT_PUBLIC_APP_URL || ''}${ci.product_images}`;
          } else if (ci.product?.photos && Array.isArray(ci.product.photos)) {
            imageUrl = ci.product.photos[0] || '';
          } else if (ci.product?.photo) {
            imageUrl = ci.product.photo;
          }

          return {
            id: ci.id || ci.product_id,
            name: ci.product?.title || ci.name || ci.product_name || '',
            price: Number(ci.price || ci.product?.price || 0),
            oldPrice: Number(ci.product?.old_price || ci.product?.price || 0),
            discount: Number(ci.discount || 0),
            quantity: Number(ci.quantity || 1),
            image: imageUrl,
            category: ci.product?.category || ci.category || '',
            maxQuantity: Number(ci.product?.stock || ci.maxQuantity || 10),
            slug: ci.slug || ci.product?.slug || '',
            product_id: ci.product_id || ci.product?.id || ci.id
          };
        });
        setCartItems(items);
      } else {
        // fallback to localStorage
        try {
          const savedCart = localStorage.getItem('rudraksha_cart');
          if (savedCart) setCartItems(JSON.parse(savedCart));
        } catch {}
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    if (!loading) {
      try { 
        localStorage.setItem('rudraksha_cart', JSON.stringify(cartItems)); 
      } catch {}
    }
  }, [cartItems, loading]);

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const item = cartItems.find(item => item.id === id);
    if (!item) return;

    // Check if quantity exceeds max available
    if (newQuantity > item.maxQuantity) {
      alert(`Only ${item.maxQuantity} items available in stock`);
      return;
    }

    // Update local state immediately for better UX
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // Add to updating items
    setUpdatingItems(prev => [...prev, id]);

    try {
      // Call API to update quantity on server
      const result = await updateCartQuantity(id, newQuantity);
      
      if (!result.success) {
        // Revert local state if API call fails
        setCartItems(prev => 
          prev.map(item => 
            item.id === id 
              ? { ...item, quantity: item.quantity } // Keep original quantity
              : item
          )
        );
        alert(result.message || 'Failed to update quantity');
      } else {
        // Update with server data if needed
        if (result.data && result.data.cart_items) {
          await loadCartItems(); // Reload cart to get updated data
        }
        
        // Trigger cart count update
        try { 
          window.dispatchEvent(new CustomEvent('countsUpdated')); 
        } catch {}
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      // Revert local state on error
      setCartItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, quantity: item.quantity } // Keep original quantity
            : item
        )
      );
      alert('Failed to update quantity. Please try again.');
    } finally {
      // Remove from updating items
      setUpdatingItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  // Optimized quantity update functions
  const incrementQuantity = async (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      await updateQuantity(id, item.quantity + 1);
    }
  };

  const decrementQuantity = async (id: number) => {
    const item = cartItems.find(item => item.id === id);
    if (item && item.quantity > 1) {
      await updateQuantity(id, item.quantity - 1);
    }
  };

  const removeItem = async (id: number) => {
    setRemovingItem(id);
    try {
      const result = await removeFromCart(id);
      if (result.success) {
        setCartItems(prev => prev.filter(item => item.id !== id));
        // Trigger cart count update
        try { 
          window.dispatchEvent(new CustomEvent('countsUpdated')); 
        } catch {}
      } else {
        alert(result.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    } finally {
      setRemovingItem(null);
    }
  };

  const clearAllItems = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    setClearingCart(true);
    try {
      const result = await clearCart();
      if (result.success) {
        setCartItems([]);
        // Trigger cart count update
        try { 
          window.dispatchEvent(new CustomEvent('countsUpdated')); 
        } catch {}
      } else {
        alert(result.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart. Please try again.');
    } finally {
      setClearingCart(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    const orderDetails = {
      items: cartItems,
      subtotal: calculateSubtotal(),
      total: calculateTotal()
    };

    localStorage.setItem('current_order', JSON.stringify(orderDetails));
    router.push('/checkout');
  };

  const continueShopping = () => {
    router.push('/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="text-amber-900 mt-4">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-2xl mx-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-4">Your Cart is Empty</h1>
            <p className="text-amber-700 mb-6 md:mb-8 text-sm md:text-base">Discover our divine collection of Rudraksha beads and add some spiritual energy to your life.</p>
            <button
              onClick={continueShopping}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 md:px-8 md:py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold text-base md:text-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-4 md:py-8">
      <div className="container mx-auto px-3 md:px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-amber-900 mb-2 md:mb-3">Shopping Cart</h1>
          <p className="text-sm md:text-lg text-amber-700">Review your selected Rudraksha beads</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 md:mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-amber-900">
                    Cart Items ({cartItems.length})
                  </h2>
                  <p className="text-xs md:text-sm text-amber-600 mt-1">
                    Total: {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
                  <button
                    onClick={clearAllItems}
                    disabled={clearingCart}
                    className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 md:gap-2 disabled:opacity-50 text-sm md:text-base"
                  >
                    {clearingCart ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-red-600"></div>
                        Clearing...
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear All
                      </>
                    )}
                  </button>
                  <button
                    onClick={continueShopping}
                    className="text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-1 md:gap-2 text-sm md:text-base"
                  >
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-3 md:space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 p-3 md:p-4 border border-amber-100 rounded-lg md:rounded-xl hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 self-center sm:self-auto">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                          onError={(e) => {
                            // Fallback for broken images
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 md:w-8 md:h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <h3 className="font-semibold text-amber-900 text-base md:text-lg mb-1 line-clamp-2">{item.name}</h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-2">{item.category}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 justify-center sm:justify-start">
                        <span className="text-amber-600 font-bold text-base md:text-lg">₹{item.price.toLocaleString()}</span>
                        {item.oldPrice > item.price && (
                          <span className="text-gray-400 line-through text-xs md:text-sm">₹{item.oldPrice.toLocaleString()}</span>
                        )}
                        {item.discount > 0 && (
                          <span className="text-green-600 text-xs md:text-sm font-semibold">{item.discount}% OFF</span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls and Price */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          disabled={item.quantity <= 1 || updatingItems.includes(item.id)}
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-amber-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50"
                        >
                          {updatingItems.includes(item.id) ? (
                            <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-amber-600"></div>
                          ) : (
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          )}
                        </button>
                        
                        <span className="w-8 md:w-12 text-center font-semibold text-amber-900 text-sm md:text-base">
                          {updatingItems.includes(item.id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600 mx-auto"></div>
                          ) : (
                            item.quantity
                          )}
                        </span>
                        
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          disabled={item.quantity >= item.maxQuantity || updatingItems.includes(item.id)}
                          className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-amber-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50"
                        >
                          {updatingItems.includes(item.id) ? (
                            <div className="animate-spin rounded-full h-3 w-3 md:h-4 md:w-4 border-b-2 border-amber-600"></div>
                          ) : (
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Total Price */}
                      <div className="text-right min-w-[80px] md:min-w-[100px]">
                        <div className="font-bold text-amber-900 text-base md:text-lg">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 hidden sm:block">
                          ₹{item.price.toLocaleString()} × {item.quantity}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={removingItem === item.id || updatingItems.includes(item.id)}
                        className="p-1 md:p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove item"
                      >
                        {removingItem === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-red-500"></div>
                        ) : (
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 sticky top-4 md:top-6">
              <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-4 md:mb-6">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-black text-sm md:text-base">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{calculateSubtotal().toLocaleString()}</span>
                </div>
                {/* Add shipping, taxes, discounts here if needed */}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-3 md:pt-4 mb-4 md:mb-6">
                <div className="flex justify-between text-lg md:text-xl font-bold text-black">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 md:space-y-4">
                <div className="relative">
                  {/* Offer Badge */}
                  {showOfferBadge && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Offers Available!
                        <button 
                          onClick={() => setShowOfferBadge(false)}
                          className="ml-1 hover:text-amber-200 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                      {/* Triangle pointer */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-green-500"></div>
                    </div>
                  )}
                  
                  <button
                    onClick={proceedToCheckout}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 md:py-4 rounded-lg md:rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold text-base md:text-lg shadow-lg hover:shadow-xl relative"
                  >
                    Proceed to Checkout
                  </button>
                </div>
                
                <button
                  onClick={continueShopping}
                  className="w-full border border-amber-500 text-amber-500 py-3 md:py-4 rounded-lg md:rounded-xl hover:bg-amber-50 transition-all duration-300 font-semibold text-base md:text-lg"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Security Badges */}
              <div className="mt-4 md:mt-6 text-center">
                <div className="flex justify-center gap-3 md:gap-4 mb-2 md:mb-3">
                  <div className="text-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Secure</span>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-1 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 md:w-4 md:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">SSL Encrypted</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Your payment information is secure and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}