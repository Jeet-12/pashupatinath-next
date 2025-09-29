"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


 const sampleAddresses: Address[] = [
    {
      id: 1,
      name: 'Rajesh Sharma',
      mobile: '9876543210',
      address: '123 Spiritual Lane, Ashram Road',
      city: 'Haridwar',
      state: 'Uttarakhand',
      pincode: '249401',
      landmark: 'Near Ganga Temple',
      isDefault: true
    },
    {
      id: 2,
      name: 'Rajesh Sharma',
      mobile: '9876543210',
      address: '456 Meditation Street, Rishikesh Road',
      city: 'Rishikesh',
      state: 'Uttarakhand',
      pincode: '249201',
      isDefault: false
    }
  ];

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

type Address = {
  id: number;
  name: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  // Sample addresses
 

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('rudraksha_cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          setCartItems(items);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
    setAddresses(sampleAddresses);
    setSelectedAddress(sampleAddresses.find(addr => addr.isDefault)?.id || null);
  }, []);

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('rudraksha_cart', JSON.stringify(cartItems));
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

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    const coupons = {
      'DIVINE10': 10,
      'RUDRAKSHA15': 15,
      'SPIRITUAL20': 20,
      'FIRSTORDER': 5
    };

    const discount = coupons[couponCode.toUpperCase() as keyof typeof coupons];
    if (discount) {
      setAppliedCoupon(couponCode.toUpperCase());
      setDiscountAmount(discount);
    } else {
      alert('Invalid coupon code. Please try again.');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return (subtotal * discountAmount) / 100;
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 5000 ? 0 : 100; // Free shipping above ₹5000
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const shipping = calculateShipping();
    return subtotal - discount + shipping;
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to proceed.');
      return;
    }

    if (!selectedAddress) {
      alert('Please select a delivery address.');
      return;
    }

    // Save order details and redirect to checkout
    const orderDetails = {
      items: cartItems,
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      shipping: calculateShipping(),
      total: calculateTotal(),
      addressId: selectedAddress,
      coupon: appliedCoupon
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
                <h2 className="text-2xl font-bold text-amber-900">
                  Cart Items ({cartItems.length})
                </h2>
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

              {/* Cart Items List */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-amber-100 rounded-xl hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image}
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
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">Delivery Address</h2>
              
              <div className="grid gap-4 md:grid-cols-2">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedAddress === address.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-black">{address.name}</h3>
                      {address.isDefault && (
                        <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full">Default</span>
                      )}
                    </div>
                    <p className="text-black text-sm mb-1">{address.address}</p>
                    <p className="text-black text-sm mb-1">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    {address.landmark && (
                      <p className="text-black text-sm mb-2">Landmark: {address.landmark}</p>
                    )}
                    <p className="text-black text-sm">Mobile: {address.mobile}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAddressForm(true)}
                className="mt-4 flex items-center gap-2 text-amber-600 hover:text-amber-800 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Address
              </button>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-black mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    disabled={!!appliedCoupon}
                    className="flex-1 border border-amber-200 rounded-xl p-3 text-black disabled:bg-gray-100"
                  />
                  {appliedCoupon ? (
                    <button
                      onClick={removeCoupon}
                      className="bg-red-500 text-white px-4 rounded-xl hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={applyCoupon}
                      className="bg-amber-500 text-white px-4 rounded-xl hover:bg-amber-600 transition-colors"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-green-600 text-sm mt-2">
                    Coupon <strong>{appliedCoupon}</strong> applied! {discountAmount}% discount.
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-black">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>₹{calculateSubtotal().toLocaleString()}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discountAmount}%)</span>
                    <span>-₹{calculateDiscount().toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-black">
                  <span>Shipping</span>
                  <span>{calculateShipping() === 0 ? 'FREE' : `₹${calculateShipping()}`}</span>
                </div>
                
                {calculateSubtotal() < 5000 && (
                  <div className="text-sm text-amber-600">
                    Add ₹{(5000 - calculateSubtotal()).toLocaleString()} more for free shipping!
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-black">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={proceedToCheckout}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>

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

      {/* Add Address Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Add New Address</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Full Name" className="w-full border border-amber-200 rounded-xl p-3 text-black" />
              <input type="tel" placeholder="Mobile Number" className="w-full border border-amber-200 rounded-xl p-3 text-black" />
              <textarea placeholder="Full Address" className="w-full border border-amber-200 rounded-xl p-3 text-black h-20" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" className="border border-amber-200 rounded-xl p-3 text-black" />
                <input type="text" placeholder="State" className="border border-amber-200 rounded-xl p-3 text-black" />
              </div>
              <input type="text" placeholder="Pincode" className="w-full border border-amber-200 rounded-xl p-3 text-black" />
              <input type="text" placeholder="Landmark (Optional)" className="w-full border border-amber-200 rounded-xl p-3 text-black" />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddressForm(false)}
                className="flex-1 border border-amber-500 text-amber-500 py-3 rounded-xl hover:bg-amber-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddressForm(false)}
                className="flex-1 bg-amber-500 text-white py-3 rounded-xl hover:bg-amber-600 transition-colors"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}