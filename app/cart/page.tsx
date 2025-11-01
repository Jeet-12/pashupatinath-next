"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, removeFromCart, clearCart } from '../libs/api';

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
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItem, setRemovingItem] = useState<number | null>(null);
  const [clearingCart, setClearingCart] = useState(false);

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
        const items = res.data.cart_items.map((ci: any) => ({
          id: ci.id || ci.product_id,
          name: ci.product?.title || ci.name || ci.product_name || '',
          price: Number(ci.price || ci.product?.price || 0),
          oldPrice: Number(ci.product?.old_price || ci.product?.price || 0),
          discount: Number(ci.discount || 0),
          quantity: Number(ci.quantity || 1),
          image: Array.isArray(ci.product?.photos) ? (ci.product.photos[0] || '') : (ci.product?.photo || ''),
          category: ci.product?.category || ci.category || '',
          maxQuantity: Number(ci.product?.stock || ci.maxQuantity || 10)
        }));
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

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
          : item
      )
    );
  };

  const removeItem = async (id: number) => {
    setRemovingItem(id);
    try {
      const result = await removeFromCart(id);
      if (result.success) {
        setCartItems(prev => prev.filter(item => item.id !== id));
        // The cart count update will be handled by the event listener
      } else {
        alert(result.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from cart');
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
        // The cart count update will be handled by the event listener
      } else {
        alert(result.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
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
      alert('Your cart is empty. Please add items to proceed.');
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
          <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-2xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Your Cart is Empty</h1>
            <p className="text-amber-700 mb-8">Discover our divine collection of Rudraksha beads and add some spiritual energy to your life.</p>
            <button
              onClick={continueShopping}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold text-lg"
            >
              Continue Shopping
            </button>
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
          <h1 className="text-4xl font-bold text-amber-900 mb-3">Shopping Cart</h1>
          <p className="text-lg text-amber-700">Review your selected Rudraksha beads</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-amber-900">
                    Cart Items ({cartItems.length})
                  </h2>
                  <p className="text-sm text-amber-600 mt-1">
                    Total: {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={clearAllItems}
                    disabled={clearingCart}
                    className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-2 disabled:opacity-50"
                  >
                    {clearingCart ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        Clearing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear All
                      </>
                    )}
                  </button>
                  <button
                    onClick={continueShopping}
                    className="text-amber-600 hover:text-amber-800 font-semibold flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-amber-100 rounded-xl hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_APP_URL}${item.image}`}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-amber-900 text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.category}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-amber-600 font-bold text-lg">₹{item.price.toLocaleString()}</span>
                        <span className="text-gray-400 line-through text-sm">₹{item.oldPrice.toLocaleString()}</span>
                        <span className="text-green-600 text-sm font-semibold">{item.discount}% OFF</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded-full border border-amber-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50"
                      >
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <span className="w-12 text-center font-semibold text-amber-900">{item.quantity}</span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="w-8 h-8 rounded-full border border-amber-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50"
                      >
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right min-w-[100px]">
                      <div className="font-bold text-amber-900 text-lg">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{item.price.toLocaleString()} × {item.quantity}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={removingItem === item.id}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove item"
                    >
                      {removingItem === item.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-black">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{calculateSubtotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-black">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={proceedToCheckout}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={continueShopping}
                  className="w-full border border-amber-500 text-amber-500 py-4 rounded-xl hover:bg-amber-50 transition-all duration-300 font-semibold text-lg"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Security Badges */}
              <div className="mt-6 text-center">
                <div className="flex justify-center gap-4 mb-3">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-1 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Secure</span>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-1 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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