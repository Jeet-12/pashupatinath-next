"use client";
import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartQuantity } from "../libs/api";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Add this import

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
  product_id: number;
  discount?: number;
  amount?: string;
  cap?: any;
  thread?: any;
};

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number | null>(null);
  const [removingItem, setRemovingItem] = useState<number | null>(null);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);
  const pathname = usePathname(); // Get current path

  // Check if current page is checkout page
  const isCheckoutPage = pathname === '/checkout';

  const getImageUrl = (image: string | undefined): string => {
    if (!image) return "/placeholder-product.jpg";
    
    if (image.startsWith("http")) {
      return image;
    }
    
    // Handle relative paths
    if (image.startsWith("/")) {
      return `https://www.pashupatinathrudraksh.com${image}`;
    }
    
    return `https://www.pashupatinathrudraksh.com/${image}`;
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      console.log("Cart API Response:", res); // Debug log
      
      if (res && (res.success || (res as any).status === true)) {
        const data = res.data || res;
        
        // Handle the cart items array from your API response
        const cartItems = Array.isArray(data.cart_items) ? data.cart_items : [];
        
        console.log("Cart Items:", cartItems); // Debug log
        
        // Map server format to UI-friendly shape
        const mapped = cartItems.map((ci: any) => {
          // Use product_images field from your API response
          const imageUrl = ci.product_images || ci.image || ci.thumb || '';
          
          // Calculate price per item (amount / quantity)
          const itemPrice = ci.price || (ci.amount ? parseFloat(ci.amount) / (ci.quantity || 1) : 0);
          
          return {
            id: ci.id, // Use the cart item ID
            name: ci.product_name || ci.name,
            price: itemPrice,
            quantity: Number(ci.quantity || 1),
            image: getImageUrl(imageUrl),
            slug: ci.slug,
            product_id: ci.product_id,
            discount: ci.discount,
            amount: ci.amount,
            cap: ci.cap,
            thread: ci.thread
          };
        });

        setItems(mapped);
        
        // Set subtotal from API response or calculate from items
        if (data.subtotal !== undefined && data.subtotal !== null) {
          setSubtotal(Number(data.subtotal));
        } else if (mapped.length > 0) {
          const calculatedSubtotal = mapped.reduce((total: number, item: CartItem) => 
            total + (item.price || 0) * (item.quantity || 1), 0
          );
          setSubtotal(calculatedSubtotal);
        } else {
          setSubtotal(0);
        }
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    setRemovingItem(itemId);
    try {
      const result = await removeFromCart(itemId);
      if (result.success) {
        // Remove item from local state immediately
        setItems(prev => prev.filter(item => item.id !== itemId));
        
        // Update subtotal
        if (result.data?.subtotal !== undefined) {
          setSubtotal(result.data.subtotal);
        } else {
          // Recalculate subtotal locally
          const newItems = items.filter(item => item.id !== itemId);
          const newSubtotal = newItems.reduce((total, item) => 
            total + (item.price || 0) * (item.quantity || 1), 0
          );
          setSubtotal(newSubtotal);
        }
        
        // Trigger cart count update
        try { 
          window.dispatchEvent(new CustomEvent('countsUpdated')); 
        } catch {}
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setRemovingItem(null);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItem(itemId);
    try {
      const result = await updateCartQuantity(itemId, newQuantity);
      if (result.success) {
        // Update item quantity in local state
        setItems(prev => prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
        
        // Update subtotal
        if (result.data?.subtotal !== undefined) {
          setSubtotal(result.data.subtotal);
        } else {
          // Recalculate subtotal locally
          const newSubtotal = items.reduce((total, item) => 
            total + (item.price || 0) * (item.id === itemId ? newQuantity : item.quantity || 1), 0
          );
          setSubtotal(newSubtotal);
        }
        
        // Trigger cart count update
        try { 
          window.dispatchEvent(new CustomEvent('countsUpdated')); 
        } catch {}
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const incrementQuantity = (itemId: number) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      updateQuantity(itemId, (item.quantity || 1) + 1);
    }
  };

  const decrementQuantity = (itemId: number) => {
    const item = items.find(item => item.id === itemId);
    if (item && item.quantity && item.quantity > 1) {
      updateQuantity(itemId, item.quantity - 1);
    }
  };

  useEffect(() => {
    const onCountsUpdated = () => {
      fetchCart();
      
      // Don't open drawer on checkout page
      if (isCheckoutPage) {
        return;
      }
      
      // Check if we should prevent the drawer from opening
      const shouldPreventOpen = localStorage.getItem('preventCartDrawerOpen');
      if (shouldPreventOpen) {
        // Consume the flag so it doesn't affect future cart updates
        localStorage.removeItem('preventCartDrawerOpen');
      } else {
        setOpen(true);
      }
    };

    const onOpenEvent = () => {
      // Don't open drawer on checkout page
      if (isCheckoutPage) {
        return;
      }
      
      fetchCart();
      setOpen(true);
    };

    try {
      window.addEventListener('countsUpdated', onCountsUpdated as EventListener);
      window.addEventListener('openCartDrawer', onOpenEvent as EventListener);
      
      // Also listen to storage so cross-tab updates can fetch
      window.addEventListener('storage', (e) => {
        if (e.key === 'rudraksha_cart' || e.key === 'auth_invalid_at') {
          fetchCart();
        }
      });
    } catch {}

    // Fetch cart on initial load
    fetchCart();

    return () => {
      try {
        window.removeEventListener('countsUpdated', onCountsUpdated as EventListener);
        window.removeEventListener('openCartDrawer', onOpenEvent as EventListener);
      } catch {}
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckoutPage]); // Add isCheckoutPage as dependency

  const handleProceedToOrder = () => {
    setOpen(false);
    window.location.href = '/checkout';
  };

  const handleViewCart = () => {
    setOpen(false);
    window.location.href = '/cart';
  };

  const calculateTotalItems = () => {
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Format price with Indian Rupee symbol
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Don't render the cart drawer on checkout page
  if (isCheckoutPage) {
    return null;
  }

  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-50 pointer-events-none`}> 
      {/* Backdrop with smooth transition */}
      <div
        className={`absolute inset-0 bg-black/50 transition-all duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-label="Cart"
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl transform transition-all duration-300 pointer-events-auto
          ${open ? 'translate-x-0' : 'translate-x-full'}
          w-[min(95vw,480px)] max-w-[95vw] sm:w-[480px]
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white">
          <div>
            <h3 className="text-xl font-bold">Your Shopping Cart</h3>
            <p className="text-sm text-white/80 mt-1">
              {calculateTotalItems()} {calculateTotalItems() === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button 
            className="text-white hover:text-white/80 transition-colors p-2 rounded-full hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100%-120px)]">
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-[#f5821f] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading your cart...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h4>
                <p className="text-gray-600 mb-6">Add some products to get started</p>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group relative">
                    {/* Remove Button - Top Right */}
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={removingItem === item.id}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed z-10 shadow-md"
                      title="Remove item"
                    >
                      {removingItem === item.id ? (
                        <div className="animate-spin rounded-full w-3 h-3 border-b-2 border-white"></div>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>

                    <div className="flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                        {item.image ? (
                          <Image 
                            src={getImageUrl(item.image)} 
                            alt={item.name} 
                            width={80} 
                            height={80} 
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.className = 'w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center';
                                fallback.innerHTML = `
                                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                `;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 pr-4">
                          {item.name}
                        </h4>
                        
                        {/* Discount Badge */}
                        {item.discount && item.discount > 0 && (
                          <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2">
                            {item.discount}% OFF
                          </div>
                        )}
                        
                        {/* Price */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-[#5F3623]">
                            {formatPrice(item.price)}
                          </span>
                          
                          {/* Mobile Remove Button - Always visible on mobile */}
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={removingItem === item.id}
                            className="lg:hidden text-red-500 hover:text-red-700 p-1 rounded transition-colors disabled:opacity-50"
                            title="Remove item"
                          >
                            {removingItem === item.id ? (
                              <div className="animate-spin rounded-full w-4 h-4 border-b-2 border-red-500"></div>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => decrementQuantity(item.id)}
                                disabled={updatingItem === item.id || (item.quantity || 1) <= 1}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-md"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              
                              <span className="w-8 h-8 flex items-center justify-center text-sm font-medium bg-white text-black">
                                {updatingItem === item.id ? (
                                  <div className="animate-spin rounded-full w-4 h-4 border-b-2 border-[#5F3623]"></div>
                                ) : (
                                  item.quantity || 1
                                )}
                              </span>
                              
                              <button
                                onClick={() => incrementQuantity(item.id)}
                                disabled={updatingItem === item.id}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-md"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          
                          {/* Item Total */}
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatPrice((item.price || 0) * (item.quantity || 1))}
                            </p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              {/* Subtotal */}
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Subtotal</span>
                <span className="text-2xl font-bold text-[#5F3623]">
                  {subtotal !== null ? formatPrice(subtotal) : '₹0'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleProceedToOrder}
                  className="w-full bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={handleViewCart}
                  className="w-full bg-white text-gray-700 py-3 rounded-xl font-medium border-2 border-gray-300 hover:border-[#5F3623] hover:text-[#5F3623] transition-all duration-200"
                >
                  View Cart Details
                </button>
                
                <button
                  onClick={() => setOpen(false)}
                  className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Additional Info */}
              {/* <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Free shipping on orders over ₹999
                </p>
              </div> */}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}