"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type CartItem = {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  category: string;
};

type Address = {
  id: number;
  fullName: string;
  mobile: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  addressType: 'home' | 'work';
  isDefault: boolean;
};

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';

type Coupon = {
  code: string;
  discount: number;
  description: string;
  minAmount: number;
  validUntil?: string;
};

const CheckoutPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [address, setAddress] = useState<Address>({
    id: Date.now(),
    fullName: '',
    mobile: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    addressType: 'home',
    isDefault: false
  });
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('upi');
  const [isLoading, setIsLoading] = useState(false);
  const [showUpiPopup, setShowUpiPopup] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [showCouponList, setShowCouponList] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [_isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Available coupons
  const availableCoupons: Coupon[] = [
    {
      code: 'WELCOME100',
      discount: 100,
      description: 'Get ₹100 off on your first order',
      minAmount: 500
    },
    {
      code: 'RUDRAKSHA200',
      discount: 200,
      description: 'Get ₹200 off on Rudraksha products',
      minAmount: 1500
    },
    {
      code: 'SPIRITUAL150',
      discount: 150,
      description: 'Get ₹150 off on spiritual items',
      minAmount: 1200
    }
  ];

  // Mock cart data
  useEffect(() => {
    setCartItems([
      {
        id: 1,
        name: '5 Mukhi Nepali Rudraksha Bead - Authentic Spiritual Meditation Mala',
        price: 2500,
        originalPrice: 3500,
        quantity: 2,
        image: 'https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/8%20mm%20mala%20hand.jpeg',
        category: 'Rudraksha'
      },
      {
        id: 2,
        name: '6 Mukhi Rudraksha Bead - Premium Quality Spiritual Jewelry',
        price: 3200,
        originalPrice: 4200,
        quantity: 1,
        image: '/rudraksha-6mukhi.jpg',
        category: 'Rudraksha'
      }
    ]);

    // Load mock addresses
    const mockAddresses: Address[] = [
      {
        id: 1,
        fullName: 'Rajesh Kumar',
        mobile: '9876543210',
        pincode: '560001',
        address: '123, MG Road, Brigade Road, 1st Floor',
        city: 'Bangalore',
        state: 'Karnataka',
        landmark: 'Near UB City',
        addressType: 'home',
        isDefault: true
      }
    ];
    
    setAddresses(mockAddresses);
    setSelectedAddress(mockAddresses.find(addr => addr.isDefault) || mockAddresses[0]);
  }, []);

  // Calculate prices
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shippingFee = subtotal > 2000 ? 0 : 50;
  const upiDiscount = selectedPayment === 'upi' ? subtotal * 0.05 : 0;
  const codCharges = selectedPayment === 'cod' ? 50 : 0;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal - upiDiscount - couponDiscount + shippingFee + codCharges;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressTypeChange = (type: 'home' | 'work') => {
    setAddress(prev => ({
      ...prev,
      addressType: type
    }));
  };

  const handleSaveAddress = () => {
    if (!validateAddressForm()) return;

    const newAddress: Address = {
      ...address,
      id: Date.now(),
      isDefault: addresses.length === 0
    };

    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);
    setSelectedAddress(newAddress);
    setShowAddressForm(false);
    setShowAddressList(false);
    resetAddressForm();
    setActiveStep(2);
  };

  const resetAddressForm = () => {
    setAddress({
      id: Date.now(),
      fullName: '',
      mobile: '',
      pincode: '',
      address: '',
      city: '',
      state: '',
      landmark: '',
      addressType: 'home',
      isDefault: false
    });
  };

  const validateAddressForm = () => {
    const requiredFields: (keyof Address)[] = ['fullName', 'mobile', 'pincode', 'address', 'city', 'state'];
    for (const field of requiredFields) {
      const value = String(address[field] ?? '').trim();
      if (!value) {
        alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    if (address.mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (address.pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode');
      return false;
    }

    return true;
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressList(false);
    setActiveStep(2);
  };

  const handleSetDefaultAddress = (addressId: number) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
    setSelectedAddress(updatedAddresses.find(addr => addr.id === addressId) || null);
  };

  const handleDeleteAddress = (addressId: number) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    setAddresses(updatedAddresses);
    if (selectedAddress?.id === addressId) {
      setSelectedAddress(updatedAddresses[0] || null);
    }
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
    
    if (coupon) {
      if (subtotal < coupon.minAmount) {
        alert(`Minimum order amount of ₹${coupon.minAmount} required for this coupon`);
        return;
      }
      
      setAppliedCoupon(coupon);
      setCouponCode('');
      setShowCouponInput(false);
      setShowCouponList(false);
    } else {
      alert('Invalid coupon code. Please try a valid code from the list.');
    }
  };

  const handleApplyCouponFromList = (coupon: Coupon) => {
    if (subtotal < coupon.minAmount) {
      alert(`Minimum order amount of ₹${coupon.minAmount} required for this coupon`);
      return;
    }
    
    setAppliedCoupon(coupon);
    setCouponCode('');
    setShowCouponInput(false);
    setShowCouponList(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      setActiveStep(1);
      return;
    }

    if (!validateForm()) return;

    if (selectedPayment === 'upi') {
      setShowUpiPopup(true);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOrderSuccess(true);
    }, 2000);
  };

  const handleUpiPayment = () => {
    setIsLoading(true);
    // Simulate UPI payment processing
    setTimeout(() => {
      setIsLoading(false);
      setShowUpiPopup(false);
      setOrderSuccess(true);
    }, 3000);
  };

  const validateForm = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return false;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return false;
    }

    return true;
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full text-center transform hover:scale-105 transition-transform duration-300">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully! 🎉</h2>
          <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base leading-relaxed">
            Thank you for your purchase. Your order has been confirmed and will be shipped within 24 hours.
          </p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Order Total</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">₹{total.toLocaleString()}</p>
            <p className="text-green-600 text-xs md:text-sm mt-2">Including all discounts and charges</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/orders')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 md:py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              View Order Details
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 md:py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 text-sm md:text-base"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 py-4 md:py-8">
      <div className="container mx-auto px-3 md:px-4 max-w-7xl">
        {/* Header with Progress Steps */}
        <div className="text-center mb-6 md:mb-12">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white rounded-xl transition-colors md:hidden"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent flex-1 text-center">
              Complete Your Order
            </h1>
            <div className="w-6 md:hidden"></div> {/* Spacer for mobile */}
          </div>
          
          {/* Progress Steps - Responsive */}
          <div className="flex justify-center items-center mb-6 md:mb-8 px-2">
            <div className={`flex items-center ${activeStep >= 1 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 text-sm md:text-base ${
                activeStep >= 1 ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 font-semibold text-sm md:text-base hidden sm:block">Address</span>
            </div>
            
            <div className={`w-12 md:w-24 h-1 mx-2 md:mx-4 ${
              activeStep >= 2 ? 'bg-amber-500' : 'bg-gray-300'
            }`}></div>
            
            <div className={`flex items-center ${activeStep >= 2 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 text-sm md:text-base ${
                activeStep >= 2 ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-semibold text-sm md:text-base hidden sm:block">Payment</span>
            </div>
            
            <div className={`w-12 md:w-24 h-1 mx-2 md:mx-4 ${
              activeStep >= 3 ? 'bg-amber-500' : 'bg-gray-300'
            }`}></div>
            
            <div className={`flex items-center ${activeStep >= 3 ? 'text-amber-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 text-sm md:text-base ${
                activeStep >= 3 ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2 font-semibold text-sm md:text-base hidden sm:block">Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
          {/* Left Column - Address & Payment */}
          <div className="xl:col-span-2 space-y-4 md:space-y-8">
            {/* Delivery Address Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl border border-white/20 p-4 md:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6 lg:mb-8">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Delivery Address</h2>
                    <p className="text-gray-600 text-sm md:text-base">Where should we deliver your order?</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddressList(!showAddressList)}
                  className="bg-amber-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base w-full sm:w-auto"
                >
                  {showAddressList ? 'Hide Addresses' : 'Change Address'}
                </button>
              </div>

              {/* Selected Address Display */}
              {selectedAddress && !showAddressList && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-amber-200 shadow-sm mb-4 md:mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 md:mb-3">
                        <span className="text-lg md:text-xl font-bold text-gray-900">{selectedAddress.fullName}</span>
                        <div className="flex gap-2">
                          <span className="bg-amber-500 text-white text-xs md:text-sm px-2 md:px-3 py-1 rounded-full font-semibold">
                            {selectedAddress.addressType === 'home' ? '🏠 Home' : '🏢 Work'}
                          </span>
                          {selectedAddress.isDefault && (
                            <span className="bg-green-500 text-white text-xs md:text-sm px-2 md:px-3 py-1 rounded-full font-semibold">Default</span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 text-base md:text-lg mb-1 md:mb-2 font-medium">{selectedAddress.address}</p>
                      <p className="text-gray-600 text-sm md:text-base">
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      <p className="text-gray-600 text-sm md:text-base">📱 {selectedAddress.mobile}</p>
                      {selectedAddress.landmark && (
                        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">📍 Landmark: {selectedAddress.landmark}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Address List */}
              {showAddressList && (
                <div className="mb-4 md:mb-8 space-y-3 md:space-y-4 max-h-64 md:max-h-96 overflow-y-auto pr-2 md:pr-4">
                  {addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`border-2 rounded-xl md:rounded-2xl p-4 md:p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedAddress?.id === addr.id
                            ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg'
                            : 'border-gray-200 hover:border-amber-300 bg-white'
                        }`}
                        onClick={() => handleSelectAddress(addr)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 md:mb-3">
                              <span className="text-base md:text-lg font-bold text-gray-900">{addr.fullName}</span>
                              <div className="flex gap-2">
                                <span className={`text-xs md:text-sm px-2 md:px-3 py-1 rounded-full font-semibold ${
                                  addr.addressType === 'home' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {addr.addressType === 'home' ? '🏠 Home' : '🏢 Work'}
                                </span>
                                {addr.isDefault && (
                                  <span className="bg-green-100 text-green-800 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full font-semibold">Default</span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 font-medium mb-1 md:mb-2 text-sm md:text-base">{addr.address}</p>
                            <p className="text-gray-600 text-sm md:text-base">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-gray-600 text-sm md:text-base">📱 {addr.mobile}</p>
                            {addr.landmark && (
                              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">📍 {addr.landmark}</p>
                            )}
                          </div>
                          <div className="flex gap-2 sm:gap-3 sm:ml-4 sm:flex-col sm:items-end">
                            {!addr.isDefault && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetDefaultAddress(addr.id);
                                }}
                                className="text-green-600 hover:text-green-700 font-semibold text-xs md:text-sm bg-green-50 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-green-100 transition-colors w-full sm:w-auto text-center"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(addr.id);
                              }}
                              className="text-red-600 hover:text-red-700 font-semibold text-xs md:text-sm bg-red-50 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-red-100 transition-colors w-full sm:w-auto text-center"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                      <svg className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">No Addresses Found</h3>
                      <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Add your first delivery address to continue</p>
                    </div>
                  )}
                </div>
              )}

              {/* Add New Address Button */}
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full border-2 border-dashed border-amber-300 rounded-xl md:rounded-2xl py-4 md:py-6 text-amber-600 hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 font-bold text-base md:text-lg group"
                >
                  <div className="flex items-center justify-center space-x-2 md:space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span>Add New Address</span>
                  </div>
                </button>
              )}

              {/* Add Address Form */}
              {showAddressForm && (
                <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border-2 border-amber-200 shadow-lg mt-4 md:mt-6">
                  <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-500 rounded-lg md:rounded-xl flex items-center justify-center">
                      <svg className="w-4 h-4 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">Add New Address</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={address.fullName}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white transition-all duration-300 text-sm md:text-base"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Mobile Number *</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={address.mobile}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white transition-all duration-300 text-sm md:text-base"
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={address.pincode}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white transition-all duration-300 text-sm md:text-base"
                        placeholder="6-digit pincode"
                        maxLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white transition-all duration-300 text-sm md:text-base"
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>

                  <div className="mb-4 md:mb-6 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white transition-all duration-300 text-sm md:text-base"
                      placeholder="Enter your state"
                    />
                  </div>

                  <div className="mb-4 md:mb-6 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Address *</label>
                    <textarea
                      name="address"
                      value={address.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white transition-all duration-300 resize-none text-sm md:text-base"
                      placeholder="Enter your complete address with house number, street, area"
                    />
                  </div>

                  <div className="mb-4 md:mb-6 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Landmark (Optional)</label>
                    <input
                      type="text"
                      name="landmark"
                      value={address.landmark}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white transition-all duration-300 text-sm md:text-base"
                      placeholder="Nearby landmark for easy delivery"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
                    <button
                      onClick={() => handleAddressTypeChange('home')}
                      className={`flex-1 py-3 md:py-4 rounded-lg md:rounded-xl border-2 font-bold transition-all duration-300 text-sm md:text-base ${
                        address.addressType === 'home'
                          ? 'border-amber-500 bg-amber-500 text-white shadow-lg'
                          : 'border-gray-300 text-gray-600 hover:border-amber-300 bg-white'
                      }`}
                    >
                      🏠 Home Address
                    </button>
                    <button
                      onClick={() => handleAddressTypeChange('work')}
                      className={`flex-1 py-3 md:py-4 rounded-lg md:rounded-xl border-2 font-bold transition-all duration-300 text-sm md:text-base ${
                        address.addressType === 'work'
                          ? 'border-amber-500 bg-amber-500 text-white shadow-lg'
                          : 'border-gray-300 text-gray-600 hover:border-amber-300 bg-white'
                      }`}
                    >
                      🏢 Work Address
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button
                      onClick={handleSaveAddress}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => {
                        setShowAddressForm(false);
                        resetAddressForm();
                      }}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 text-sm md:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            {selectedAddress && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl border border-white/20 p-4 md:p-6 lg:p-8">
                <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6 lg:mb-8">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Payment Method</h2>
                    <p className="text-gray-600 text-sm md:text-base">Choose how you want to pay</p>
                  </div>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                  {/* UPI Option */}
                  <div
                    className={`border-2 rounded-xl md:rounded-2xl p-4 md:p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedPayment === 'upi'
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                        : 'border-gray-200 hover:border-green-300 bg-white'
                    }`}
                    onClick={() => setSelectedPayment('upi')}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                      <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6">
                        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-base md:text-lg lg:text-xl">UPI</span>
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">UPI Payment</h3>
                          <p className="text-gray-600 text-sm md:text-base">Google Pay, PhonePe, Paytm & more</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-4 mt-1 md:mt-2">
                            <span className="bg-green-100 text-green-800 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full font-semibold w-fit">
                              Recommended
                            </span>
                            <span className="text-green-600 font-bold text-sm md:text-base">5% Instant Discount</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-4">
                        {selectedPayment === 'upi' && (
                          <span className="text-green-600 text-sm md:text-base font-bold bg-green-100 px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-xl">
                            Save ₹{upiDiscount.toLocaleString()}
                          </span>
                        )}
                        <div className={`w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === 'upi' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                        }`}>
                          {selectedPayment === 'upi' && (
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COD Option */}
                  <div
                    className={`border-2 rounded-xl md:rounded-2xl p-4 md:p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedPayment === 'cod'
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                    onClick={() => setSelectedPayment('cod')}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
                      <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-6">
                        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg">
                          <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">Cash on Delivery</h3>
                          <p className="text-gray-600 text-sm md:text-base">Pay when you receive your order</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-4 mt-1 md:mt-2">
                            <span className="bg-purple-100 text-purple-800 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full font-semibold w-fit">
                              Convenient
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-4">
                        {selectedPayment === 'cod' && (
                          <span className="text-red-600 text-sm md:text-base font-bold bg-red-100 px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-xl">
                            +₹50 Charges
                          </span>
                        )}
                        <div className={`w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === 'cod' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                        }`}>
                          {selectedPayment === 'cod' && (
                            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-4 md:space-y-8">
            {/* Order Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl border border-white/20 p-4 md:p-6 lg:p-8 sticky top-4 md:top-8">
              <div className="flex items-center space-x-3 md:space-x-4 mb-4 md:mb-6 lg:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Order Summary</h2>
                  <p className="text-gray-600 text-sm md:text-base">{cartItems.length} items in cart</p>
                </div>
              </div>
              
              {/* Cart Items with Scroll */}
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 lg:mb-8 max-h-48 md:max-h-64 lg:max-h-80 overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg md:rounded-xl overflow-hidden flex-shrink-0 shadow-md relative">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-xs md:text-sm line-clamp-2 leading-tight">{item.name}</h3>
                      <div className="flex items-center space-x-1 md:space-x-2 mt-1 md:mt-2">
                        <p className="text-amber-600 font-bold text-sm md:text-base lg:text-lg">₹{item.price.toLocaleString()}</p>
                        {item.originalPrice > item.price && (
                          <p className="text-gray-500 text-xs md:text-sm line-through">₹{item.originalPrice.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                      <div className="flex items-center space-x-1 md:space-x-2 bg-gray-100 rounded-lg md:rounded-xl px-2 md:px-3 py-1 md:py-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm text-xs md:text-sm"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold text-gray-900 text-xs md:text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm text-xs md:text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 md:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 hover:bg-red-50 rounded-lg text-xs"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mb-4 md:mb-6 lg:mb-8">
                {!showCouponInput && !appliedCoupon ? (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="w-full text-center text-amber-600 hover:text-amber-700 font-bold py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-400 hover:bg-amber-50 transition-all duration-300 group text-sm md:text-base"
                  >
                    <div className="flex items-center justify-center space-x-2 md:space-x-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                      </div>
                      <span>Apply Coupon Code</span>
                    </div>
                  </button>
                ) : showCouponInput ? (
                  <div className="relative">
                    <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="w-full border-2 border-gray-200 rounded-lg md:rounded-xl px-3 md:px-4 lg:px-5 py-2 md:py-3 lg:py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white font-semibold transition-all duration-300 text-sm md:text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCouponList(!showCouponList)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-700 font-semibold bg-amber-50 px-2 py-1 rounded-lg text-xs md:text-sm"
                        >
                          View All
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 rounded-lg md:rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base flex-1"
                        >
                          Apply
                        </button>
                        <button
                          onClick={() => setShowCouponInput(false)}
                          className="border-2 border-gray-300 text-gray-700 px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 rounded-lg md:rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 text-sm md:text-base flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    
                    {/* Coupon List Dropdown */}
                    {showCouponList && (
                      <div className="absolute top-full left-0 right-0 bg-white border-2 border-amber-200 rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl z-20 mt-2 md:mt-3 p-3 md:p-4 lg:p-6">
                        <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
                          <h4 className="font-bold text-gray-900 text-base md:text-lg">Available Coupons</h4>
                          <button
                            onClick={() => setShowCouponList(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="space-y-2 md:space-y-3 max-h-32 md:max-h-48 lg:max-h-64 overflow-y-auto">
                          {availableCoupons.map((coupon) => (
                            <div
                              key={coupon.code}
                              className="flex items-center justify-between p-2 md:p-3 lg:p-4 border-2 border-gray-200 rounded-lg md:rounded-xl hover:border-amber-300 hover:bg-amber-50 cursor-pointer transition-all duration-300 group"
                              onClick={() => handleApplyCouponFromList(coupon)}
                            >
                              <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:gap-3 mb-1 md:mb-2">
                                  <span className="font-bold text-amber-700 text-sm md:text-base lg:text-lg">{coupon.code}</span>
                                  <span className="bg-green-100 text-green-800 text-xs md:text-sm px-2 py-1 rounded-full font-semibold w-fit">
                                    ₹{coupon.discount} OFF
                                  </span>
                                </div>
                                <p className="text-gray-600 text-xs md:text-sm">{coupon.description}</p>
                                <p className="text-gray-500 text-xs mt-1">
                                  Min. order: ₹{coupon.minAmount}
                                  {coupon.validUntil && ` • Valid until ${coupon.validUntil}`}
                                </p>
                              </div>
                              <div className="text-amber-600 group-hover:scale-110 transition-transform ml-2">
                                <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : appliedCoupon && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-green-500 rounded-lg md:rounded-xl flex items-center justify-center">
                          <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-green-800 font-bold text-sm md:text-base">Coupon Applied!</p>
                          <p className="text-green-700 text-xs md:text-sm">{appliedCoupon.code} - {appliedCoupon.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-3">
                        <span className="text-green-700 font-bold text-base md:text-lg lg:text-xl">-₹{appliedCoupon.discount}</span>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-red-500 hover:text-red-700 bg-red-50 p-1 md:p-2 rounded-lg transition-colors"
                        >
                          <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 md:space-y-3 lg:space-y-4 border-t border-gray-200 pt-3 md:pt-4 lg:pt-6">
                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm md:text-base">
                    <span>Product Discount</span>
                    <span className="font-bold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                {selectedPayment === 'upi' && upiDiscount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm md:text-base">
                    <span>UPI Discount (5%)</span>
                    <span className="font-bold">-₹{upiDiscount.toLocaleString()}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 text-sm md:text-base">
                    <span>Coupon Discount</span>
                    <span className="font-bold">-₹{appliedCoupon.discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 text-sm md:text-base">
                  <span>Shipping Fee</span>
                  <span className={shippingFee === 0 ? 'text-green-600 font-bold' : 'font-semibold'}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>

                {selectedPayment === 'cod' && codCharges > 0 && (
                  <div className="flex justify-between text-red-600 text-sm md:text-base">
                    <span>COD Charges</span>
                    <span className="font-bold">+₹{codCharges}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg md:text-xl lg:text-2xl font-bold text-gray-900 border-t border-gray-200 pt-2 md:pt-3 lg:pt-4">
                  <span>Total Amount</span>
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading || cartItems.length === 0 || !selectedAddress}
                className={`w-full mt-4 md:mt-6 lg:mt-8 py-3 md:py-4 lg:py-5 rounded-xl md:rounded-2xl font-bold text-base md:text-lg lg:text-xl transition-all duration-300 ${
                  isLoading || cartItems.length === 0 || !selectedAddress
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg md:shadow-xl lg:shadow-2xl hover:shadow-2xl md:hover:shadow-3xl transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-b-2 border-white mr-2 md:mr-3"></div>
                    <span className="text-sm md:text-base">Processing Your Order...</span>
                  </div>
                ) : (
                  `Place Order - ₹${total.toLocaleString()}`
                )}
              </button>

              {/* Security Badge */}
              <div className="flex items-center justify-center space-x-2 md:space-x-3 mt-3 md:mt-4 lg:mt-6 pt-3 md:pt-4 lg:pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-1 md:space-x-2 text-green-600">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-semibold text-xs md:text-sm">100% Secure Checkout</span>
                </div>
              </div>

              {/* Trust Badges - Moved inside order summary below security badge */}
              <div className="mt-3 md:mt-4 lg:mt-6 pt-3 md:pt-4 lg:pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 gap-2 md:gap-3 lg:gap-4">
                  <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg md:rounded-xl border border-amber-200">
                    <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-amber-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs md:text-sm">Authentic Products</p>
                      <p className="text-gray-600 text-xs">100% Genuine Certification</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg md:rounded-xl border border-green-200">
                    <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-green-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs md:text-sm">Free Shipping</p>
                      <p className="text-gray-600 text-xs">Above ₹2000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg md:rounded-xl border border-blue-200">
                    <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-blue-500 rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
                      <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-xs md:text-sm">Easy Returns</p>
                      <p className="text-gray-600 text-xs">7-Day Return Policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPI Payment Popup */}
      {showUpiPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-4 z-50">
          <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 max-w-sm md:max-w-md w-full transform hover:scale-105 transition-transform duration-300 mx-2">
            <div className="text-center mb-4 md:mb-6 lg:mb-8">
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 lg:mb-6 shadow-lg">
                <span className="text-white font-bold text-lg md:text-xl lg:text-2xl">UPI</span>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 md:mb-3">UPI Payment</h3>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg">Complete payment using your UPI app</p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg md:rounded-xl lg:rounded-2xl p-3 md:p-4 lg:p-6 mb-4 md:mb-6 lg:mb-8 border-2 border-green-200">
              <div className="flex justify-between items-center mb-2 md:mb-3 lg:mb-4">
                <span className="text-gray-700 font-semibold text-sm md:text-base">Amount to pay:</span>
                <span className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600">₹{total.toLocaleString()}</span>
              </div>
              <div className="text-green-700 font-semibold bg-green-100 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-center text-sm md:text-base">
                🎉 You saved ₹{upiDiscount.toLocaleString()} with UPI!
              </div>
            </div>

            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6 lg:mb-8">
              <button
                onClick={handleUpiPayment}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base lg:text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-2 md:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pay Securely Now
              </button>
              
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                <div className="bg-white border-2 border-blue-200 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 text-center hover:border-blue-300 transition-colors">
                  <div className="text-blue-500 font-bold text-xs md:text-sm">Google Pay</div>
                </div>
                <div className="bg-white border-2 border-purple-200 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 text-center hover:border-purple-300 transition-colors">
                  <div className="text-purple-500 font-bold text-xs md:text-sm">PhonePe</div>
                </div>
                <div className="bg-white border-2 border-blue-300 rounded-lg md:rounded-xl p-2 md:p-3 lg:p-4 text-center hover:border-blue-400 transition-colors">
                  <div className="text-blue-600 font-bold text-xs md:text-sm">Paytm</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowUpiPopup(false)}
              className="w-full border-2 border-gray-300 text-gray-700 py-2 md:py-3 lg:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300 text-sm md:text-base"
            >
              Cancel Payment
            </button>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @media (min-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;