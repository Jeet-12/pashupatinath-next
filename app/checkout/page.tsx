"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createOrder, getUserAddresses, createAddress, getCart, applyCoupon, removeCoupon, validateCoupon, getAvailableCoupons } from '../libs/api';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
    order_type: string;
    internal_order_id: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
    escape: boolean;
    confirm_close: boolean;
  };
  retry: {
    enabled: boolean;
    max_count: number;
  };
  timeout: number;
  remember_customer: boolean;
  readonly: {
    contact?: boolean;
    email?: boolean;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface AddressesResponseObject {
  data?: Address[];
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: any) => void) => void;
  close: () => void;
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

type CartItem = {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  category: string;
  slug?: string;
  product_id?: number;
  discount?: number;
  amount?: string;
  cap?: any;
  thread?: any;
};

type Address = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address_line_1: string;
  address_line_2?: string;
  postal_code: string;
  address_type: 'home' | 'work' | 'other';
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
};

type AddressFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address_line_1: string;
  address_line_2: string;
  postal_code: string;
  address_type: 'home' | 'work' | 'other';
  is_default: boolean;
};

type PaymentMethod = 'online' | 'cod';

type Coupon = {
  id: number;
  code: string;
  type: 'fixed' | 'percent';
  value: string;
  min_amount: string | null;
  max_discount_amount: string | null;
  description?: string;
  expiry_date?: string;
  user_id?: number | null;
};

const CheckoutPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [address, setAddress] = useState<AddressFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: 'India',
    state: '',
    city: '',
    address_line_1: '',
    address_line_2: '',
    postal_code: '',
    address_type: 'home',
    is_default: false
  });
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('online');
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [countdown, setCountdown] = useState(15);
  
  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  // Enhanced image URL handler
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

  // Helper function to get full name from address
  const getFullName = (addr: Address) => {
    return `${addr.first_name} ${addr.last_name}`.trim();
  };

  // Calculate prices with coupon support
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shippingFee = subtotal >= 2000 ? 0 : 100;
  
  // Calculate coupon discount
  const calculateCouponDiscount = () => {
    if (!appliedCoupon) return 0;

    let discountAmount = 0;

    if (appliedCoupon.type === 'percent') {
      discountAmount = (subtotal * parseFloat(appliedCoupon.value)) / 100;
      
      // Apply max discount limit if set
      if (appliedCoupon.max_discount_amount && discountAmount > parseFloat(appliedCoupon.max_discount_amount)) {
        discountAmount = parseFloat(appliedCoupon.max_discount_amount);
      }
    } else {
      discountAmount = parseFloat(appliedCoupon.value);
    }

    return Math.min(discountAmount, subtotal);
  };

  const couponDiscount = calculateCouponDiscount();
  
  // Payment-specific charges/discounts
  const onlineDiscount = selectedPayment === 'online' ? subtotal * 0.05 : 0;
  const codCharges = selectedPayment === 'cod' ? 50 : 0;
  
  const total = Math.max(0, subtotal - onlineDiscount - couponDiscount + shippingFee + codCharges);

  // Helper function to check if coupon is applicable based on minimum amount
  const isCouponApplicable = (coupon: Coupon): boolean => {
    if (!coupon.min_amount) return true;
    return subtotal >= parseFloat(coupon.min_amount);
  };

  // Helper function to format coupon discount text
  const getCouponDiscountText = (coupon: Coupon): string => {
    if (coupon.type === 'percent') {
      return `${parseFloat(coupon.value)}% OFF`;
    } else {
      return `₹${parseFloat(coupon.value).toLocaleString()} OFF`;
    }
  };

  // Helper function to get coupon requirements text
  const getCouponRequirements = (coupon: Coupon): string => {
    const requirements = [];
    
    if (coupon.min_amount) {
      requirements.push(`Min. order: ₹${parseFloat(coupon.min_amount).toLocaleString()}`);
    }
    
    if (coupon.max_discount_amount && coupon.type === 'percent') {
      requirements.push(`Max. discount: ₹${parseFloat(coupon.max_discount_amount).toLocaleString()}`);
    }
    
    return requirements.join(' • ');
  };

  // Add this useEffect to debug coupon state
  useEffect(() => {
    console.log('Coupon State:', {
      appliedCoupon,
      couponCode,
      couponDiscount,
      subtotal,
      availableCoupons: availableCoupons.length
    });
  }, [appliedCoupon, couponCode, couponDiscount, subtotal, availableCoupons]);

  useEffect(() => {
    if (orderSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [orderSuccess, router]);
  
  // Check screen size and load Razorpay
  useEffect(() => {
    const checkScreenSize = () => {
      // setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    // Load Razorpay SDK
    initializeRazorpay();
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Memoized load functions to prevent useEffect dependency issues
  const loadCartData = useCallback(async () => {
    try {
      const cartResponse = await getCart();
      console.log("Cart API Response:", cartResponse);
      
      if (cartResponse.success && cartResponse.data) {
        const cartData = cartResponse.data;
        let items: CartItem[] = [];

        // Handle the cart items array from your API response
        if (Array.isArray(cartData.cart_items)) {
          items = cartData.cart_items.map((item: any) => {
            console.log("Processing cart item:", item);
            
            let imageUrl = '';
            if (item.product_images) imageUrl = item.product_images;
            else if (item.image) imageUrl = item.image;
            else if (item.thumb) imageUrl = item.thumb;
            else if (item.product?.image) imageUrl = item.product.image;
            else if (item.product?.photo) imageUrl = item.product.photo;
            else if (item.product?.images?.[0]) imageUrl = item.product.images[0];
            else if (item.product?.photos?.[0]) imageUrl = item.product.photos[0];

            // Calculate price per item (amount / quantity)
            const itemPrice = item.price || (item.amount ? parseFloat(item.amount) / (item.quantity || 1) : 0);
            const originalPrice = itemPrice;

            return {
              id: item.id,
              name: item.product_name || item.name || 'Product',
              price: itemPrice,
              originalPrice: originalPrice,
              quantity: Number(item.quantity || 1),
              image: getImageUrl(imageUrl),
              category: 'Rudraksha',
              slug: item.slug || item.product_slug,
              product_id: item.product_id,
              discount: item.discount,
              amount: item.amount,
              cap: item.cap,
              thread: item.thread
            };
          });
        } else if (Array.isArray(cartData)) {
          // Fallback for different response structure
          items = cartData.map((item: any) => {
            const imageUrl = item.product_images || item.image || '';
            const itemPrice = item.price || (item.amount ? parseFloat(item.amount) / (item.quantity || 1) : 0);
            
            return {
              id: item.id || item.product_id,
              name: item.product_name || item.name,
              price: itemPrice,
              originalPrice: itemPrice,
              quantity: Number(item.quantity || 1),
              image: getImageUrl(imageUrl),
              category: 'Rudraksha',
              slug: item.slug || item.product_slug
            };
          });
        }

        console.log("Processed cart items:", items);
        setCartItems(items);

        // Check if there's an applied coupon in the cart response
        if (cartData.applied_coupon) {
          const couponData: Coupon = {
            id: cartData.applied_coupon.id,
            code: cartData.applied_coupon.code,
            type: cartData.applied_coupon.type,
            value: cartData.applied_coupon.discount_value?.toString() || cartData.applied_coupon.value,
            min_amount: cartData.applied_coupon.min_order_amount?.toString() || cartData.applied_coupon.min_amount || null,
            max_discount_amount: cartData.applied_coupon.max_discount_amount?.toString() || cartData.applied_coupon.max_discount_amount || null,
            description: cartData.applied_coupon.description
          };
          setAppliedCoupon(couponData);
        }
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Failed to load cart items');
    }
  }, []);

  const loadAddresses = useCallback(async () => {
    try {
      const addressesResponse = await getUserAddresses();
      if (addressesResponse.success && addressesResponse.data) {
        const addressesData = Array.isArray(addressesResponse.data) 
          ? addressesResponse.data 
          : (addressesResponse.data as AddressesResponseObject).data || []; 
        
        setAddresses(addressesData);
        const defaultAddress = addressesData.find((addr: Address) => addr.is_default);
        setSelectedAddress(defaultAddress || addressesData[0] || null);
      }
    } catch (err) {
      console.error('Error loading addresses:', err);
      setError('Failed to load addresses');
    }
  }, []);

  const loadAvailableCoupons = useCallback(async () => {
    try {
      const couponsResponse = await getAvailableCoupons();
      if (couponsResponse.success && couponsResponse.data) {
        setAvailableCoupons(couponsResponse.data as any);
      }
    } catch (err) {
      console.error('Error loading available coupons:', err);
    }
  }, []);

  useEffect(() => {
    loadCartData();
    loadAddresses();
    loadAvailableCoupons();
  }, [loadCartData, loadAddresses, loadAvailableCoupons]);

  const initializeRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        console.log('Razorpay already loaded');
        setRazorpayLoaded(true);
        resolve(true);
        return;
      }

      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        console.log('Razorpay script already exists, waiting for load...');
        existingScript.addEventListener('load', () => {
          console.log('Razorpay loaded from existing script');
          setRazorpayLoaded(true);
          resolve(true);
        });
        existingScript.addEventListener('error', () => {
          console.error('Existing Razorpay script failed to load');
          setRazorpayLoaded(false);
          resolve(false);
        });
        return;
      }

      // Create and load new script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      
      script.onload = () => {
        console.log('Razorpay SDK loaded successfully');
        setRazorpayLoaded(true);
        resolve(true);
      };
      
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK');
        setRazorpayLoaded(false);
        resolve(false);
      };
      
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAddressTypeChange = (type: 'home' | 'work' | 'other') => {
    setAddress(prev => ({
      ...prev,
      address_type: type
    }));
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) return;

    try {
      const response = await createAddress(address);
      
      if (response.success && response.data) {
        await loadAddresses();
        setShowAddressForm(false);
        setShowAddressList(false);
        resetAddressForm();
        setError('');
      } else {
        setError(response.message || 'Failed to save address');
      }
    } catch (err) {
      setError('Failed to save address');
    }
  };

  const resetAddressForm = () => {
    setAddress({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      country: 'India',
      state: '',
      city: '',
      address_line_1: '',
      address_line_2: '',
      postal_code: '',
      address_type: 'home',
      is_default: false
    });
  };

  const validateAddressForm = () => {
    const requiredFields: (keyof AddressFormData)[] = [
      'first_name', 'last_name', 'email', 'phone', 'state', 'city', 
      'address_line_1', 'postal_code'
    ];
    
    for (const field of requiredFields) {
      const value = String(address[field] ?? '').trim();
      if (!value) {
        setError(`Please fill in the ${field.replace(/_/g, ' ')}`);
        return false;
      }
    }
    
    if (address.phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (address.postal_code.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(address.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressList(false);
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    try {
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        is_default: addr.id === addressId
      }));
      setAddresses(updatedAddresses);
      setSelectedAddress(updatedAddresses.find(addr => addr.id === addressId) || null);
    } catch (err) {
      setError('Failed to set default address');
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
      if (selectedAddress?.id === addressId) {
        setSelectedAddress(updatedAddresses[0] || null);
      }
    } catch (err) {
      setError('Failed to delete address');
    }
  };

  // Enhanced Coupon Functions
  const validateCouponBeforeApply = (code: string): boolean => {
    const trimmedCode = code.trim().toUpperCase();
    
    if (!trimmedCode) {
      setCouponError('Please enter a coupon code');
      return false;
    }
    
    if (trimmedCode.length < 3) {
      setCouponError('Coupon code must be at least 3 characters');
      return false;
    }
    
    return true;
  };

  const handleApplyCoupon = async (codeOverride?: string) => {
    const codeToApply = codeOverride ? codeOverride : couponCode;
    const trimmedCode = codeToApply.trim().toUpperCase();
    
    if (!validateCouponBeforeApply(trimmedCode)) return;

    // Check if same coupon is already applied
    if (appliedCoupon && appliedCoupon.code === trimmedCode) {
      setCouponError('This coupon is already applied');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');

    try {
      console.log('Applying coupon:', trimmedCode);
      const response = await applyCoupon(trimmedCode);
      console.log('Coupon response:', response);
      
      if (response.success && response.data) {
        const couponData: Coupon = {
          id: response.data.id,
          code: response.data.code,
          type: response.data.type,
          value: response.data.discount_value?.toString() || '',
          min_amount: response.data.min_order_amount?.toString() || '',
          max_discount_amount: response.data.max_discount_amount?.toString() || '',
          description: response.data.description
        };
        
        setAppliedCoupon(couponData);
        setCouponCode('');
        setCouponError('');
        setShowCouponForm(false);
        setShowAvailableCoupons(false);
        
        // Show success message
        setError('Coupon applied successfully!');
        setTimeout(() => setError(''), 3000);
        
        // Refresh cart data to reflect coupon changes
        await loadCartData();
      } else {
        setCouponError(response.message || 'Invalid coupon code');
      }
    } catch (err: any) {
      console.error('Coupon application error:', err);
      setCouponError(err.message || 'Failed to apply coupon. Please try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      console.log('Removing coupon');
      const response = await removeCoupon();
      console.log('Remove coupon response:', response);
      
      if (response.success) {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
        setError('Coupon removed successfully');
        
        // Refresh cart data after removing coupon
        await loadCartData();
        
        // Clear success message after 3 seconds
        setTimeout(() => setError(''), 3000);
      } else {
        setCouponError(response.message || 'Failed to remove coupon');
      }
    } catch (err: any) {
      console.error('Remove coupon error:', err);
      setCouponError(err.message || 'Failed to remove coupon');
    }
  };

  const handleQuickApplyCoupon = async (coupon: Coupon) => {
    if (appliedCoupon && appliedCoupon.code === coupon.code) {
      setCouponError('This coupon is already applied');
      return;
    }

    if (!isCouponApplicable(coupon)) {
      setCouponError(`Minimum order of ₹${parseFloat(coupon.min_amount!).toLocaleString()} required for this coupon`);
      return;
    }

    setShowAvailableCoupons(false);
    setCouponError('');
    
    await handleApplyCoupon(coupon.code);
  };

  // Create Razorpay order using Laravel backend
  const createRazorpayOrder = async (): Promise<{ razorpay_order_id: string; internal_order_id: number }> => {
    try {
      if (!selectedAddress) {
        throw new Error('Please select a delivery address');
      }

      console.log('🔄 Creating integrated Razorpay order via Laravel...');

      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          address_id: selectedAddress.id,
          coupon_code: appliedCoupon?.code || '',
          referral_code: '', 
          token: localStorage.getItem('auth_token'),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success || !result.data?.razorpay_order_id) {
        throw new Error(result.message || 'Failed to create Razorpay order');
      }

      console.log('✅ Integrated Razorpay order created:', {
        razorpayOrderId: result.data.razorpay_order_id,
        internalOrderId: result.data.internal_order_id
      });

      return {
        razorpay_order_id: result.data.razorpay_order_id,
        internal_order_id: result.data.internal_order_id
      };

    } catch (err: any) {
      console.error('❌ Integrated Razorpay order creation error:', err);
      throw new Error(err.message || 'Failed to create payment order. Please try again.');
    }
  };

  // Enhanced Payment Verification with Order Completion via Laravel
  const verifyPaymentAndCompleteOrder = async (
    paymentResponse: RazorpayResponse, 
    internalOrderId: number
  ): Promise<{ success: boolean; order?: any; message: string }> => {
    try {
      console.log('🔄 Verifying payment and completing order via Laravel...');
      
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          order_id: internalOrderId
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || 'Verification request failed');
      }

      const result = await verifyResponse.json();
      console.log('🔐 Payment verification and order completion result:', result);
      
      if (result.success) {
        return {
          success: true,
          order: result.data,
          message: result.message
        };
      } else {
        return {
          success: false,
          message: result.message || 'Payment verification failed'
        };
      }
    } catch (err: any) {
      console.error('❌ Payment verification error:', err);
      return {
        success: false,
        message: err.message || 'Payment verification failed. Please contact support.'
      };
    }
  };

  // Main Razorpay Payment Processing
  const processRazorpayPayment = async () => {
    try {
      setIsLoading(true);
      setError('');

      console.log('Starting Razorpay payment process...');

      // Ensure Razorpay is loaded
      if (!razorpayLoaded) {
        console.log('Razorpay not loaded, initializing...');
        const loaded = await initializeRazorpay();
        if (!loaded) {
          setError('Payment gateway failed to load. Please refresh the page and try again.');
          setIsLoading(false);
          return;
        }
      }

      // Check if Razorpay is available
      if (!window.Razorpay) {
        setError('Payment service is not available. Please try again later.');
        setIsLoading(false);
        return;
      }

      console.log('Creating integrated Razorpay order via Laravel...');

      const { razorpay_order_id, internal_order_id } = await createRazorpayOrder();
      
      if (!razorpay_order_id || !internal_order_id) {
        setError('Failed to initialize payment. Please try again.');
        setIsLoading(false);
        return;
      }

      console.log('Opening Razorpay checkout with order ID:', razorpay_order_id);

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: Math.round(total * 100),
        currency: 'INR',
        name: 'Pashupatinath Rudraksha',
        description: 'Order Payment',
        image: '/logo.png',
        order_id: razorpay_order_id,
        handler: async function (response: RazorpayResponse) {
          try {
            console.log('Payment successful response:', response);
            
            // Verify payment signature AND complete order via Laravel
            console.log('Verifying payment signature and completing order via Laravel...');
            const verificationResult = await verifyPaymentAndCompleteOrder(response, internal_order_id);
            
            if (!verificationResult.success) {
              setError(verificationResult.message || 'Payment verification failed. Please contact support.');
              setIsLoading(false);
              return;
            }

            console.log('Payment verified and order completed successfully:', verificationResult.order);

            // Show success message
            setIsLoading(false);
            setOrderSuccess(true);
            setOrderId(verificationResult.order?.order_number || 'N/A');
            
          } catch (err) {
            console.error('Payment verification and order completion error:', err);
            setError('Failed to complete order. Please contact support with your payment ID.');
            setIsLoading(false);
          }
        },
        prefill: {
          name: selectedAddress ? `${selectedAddress.first_name} ${selectedAddress.last_name}`.trim() : '',
          email: selectedAddress?.email || '',
          contact: selectedAddress?.phone || '',
        },
        notes: {
          address: selectedAddress ? `${selectedAddress.address_line_1}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.postal_code}` : '',
          order_type: 'product_purchase',
          internal_order_id: internal_order_id.toString()
        },
        theme: {
          color: '#F59E0B',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            setError('Payment was cancelled. You can try again.');
            console.log('Payment modal dismissed by user');
          },
          escape: true,
          confirm_close: true
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 900,
        remember_customer: true,
        readonly: {
          contact: true,
          email: true
        }
      };

      // Create and open Razorpay instance
      const paymentObject = new window.Razorpay(options);
      
      // Add event listeners for better error handling
      paymentObject.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description || 'Please try again'}`);
        setIsLoading(false);
      });

      // Open the Razorpay checkout
      console.log('Opening Razorpay checkout...');
      paymentObject.open();
      
    } catch (err: any) {
      console.error('Razorpay payment error:', err);
      setError(err.message || 'Failed to initialize payment. Please try again.');
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Validate coupon if applied
    if (appliedCoupon) {
      const validation = await validateCoupon(appliedCoupon.code, subtotal);
      if (!validation.success) {
        setError('Applied coupon is no longer valid. Please remove it and try again.');
        return;
      }
    }

    setIsLoading(true);
    setError('');

    try {
      const orderData = {
        address_id: selectedAddress.id,
        payment_method: selectedPayment === 'online' ? 'razorpay' as const : 'cod' as const,
        coupon_code: appliedCoupon?.code || '',
      };

      console.log(selectedPayment);

      if (selectedPayment === 'online') {
        await processRazorpayPayment();
      } else {
        const response = await createOrder(orderData);

        if (response.success && response.data) {
          setIsLoading(false);
          setOrderSuccess(true);
          setOrderId(response.data.order_number);
        } else {
          setError(response.message || 'Failed to create order');
          setIsLoading(false);
        }
      }
    } catch (err: any) {
      console.error('Order error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
      setIsLoading(false);
    }
  };

  // Render Coupon Section
  const renderCouponSection = () => (
    <div className="mb-6">
      {appliedCoupon ? (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
              </div>
              <div>
                <span className="font-bold text-green-800">Coupon Applied</span>
                <p className="text-green-600 text-sm">{appliedCoupon.description}</p>
              </div>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-600 hover:text-red-700 text-sm font-semibold hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
            >
              Remove
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-green-800 font-semibold">{appliedCoupon.code}</span>
            <span className="text-green-600 font-bold text-lg">
              -₹{couponDiscount.toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {!showCouponForm ? (
            <div className="space-y-2">
              <button
                onClick={() => setShowCouponForm(true)}
                className="w-full text-amber-600 hover:text-amber-700 font-semibold text-sm bg-amber-50 hover:bg-amber-100 py-3 rounded-xl transition-all duration-300 border-2 border-dashed border-amber-300 hover:border-amber-400"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span>Apply Coupon Code</span>
                </div>
              </button>
              {availableCoupons.length > 0 && (
                <button
                  onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                  className="w-full text-blue-600 hover:text-blue-700 text-xs bg-blue-50 hover:bg-blue-100 py-2 rounded-lg transition-all duration-300"
                >
                  {showAvailableCoupons ? 'Hide Available Coupons' : `Show ${availableCoupons.length} Available Coupons`}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 border-2 border-amber-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 text-sm"
                />
                <button
                  onClick={() => handleApplyCoupon()}
                  disabled={isApplyingCoupon}
                  className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all duration-300 disabled:opacity-50 text-sm min-w-20"
                >
                  {isApplyingCoupon ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
              {couponError && (
                <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">{couponError}</p>
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowCouponForm(false);
                    setCouponError('');
                  }}
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
                {availableCoupons.length > 0 && (
                  <button
                    onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {showAvailableCoupons ? 'Hide Coupons' : 'View Available'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Available Coupons List */}
          {showAvailableCoupons && availableCoupons.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Available Coupons</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availableCoupons.map((coupon) => {
                  const isApplicable = isCouponApplicable(coupon);
                  // const isAlreadyApplied = appliedCoupon?.code === coupon.code;
                  
                  return (
                    <div
                      key={coupon.id}
                      className={`p-3 rounded-lg border transition-colors ${
                        isApplicable
                          ? 'bg-white border-gray-200 hover:border-amber-300 cursor-pointer'
                          : 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                      } `}
                      onClick={() => isApplicable && handleQuickApplyCoupon(coupon)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`font-bold ${
                              isApplicable  ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {coupon.code}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              isApplicable 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                            }`}>
                              {getCouponDiscountText(coupon)}
                            </span>
                          </div>
                          {coupon.description && (
                            <p className={`text-sm ${
                              isApplicable ? 'text-gray-600' : 'text-gray-500'
                            }`}>
                              {coupon.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {getCouponRequirements(coupon)}
                          </p>
                          {!isApplicable && coupon.min_amount && (
                            <p className="text-xs text-red-500 mt-1">
                              Add ₹{(parseFloat(coupon.min_amount) - subtotal).toLocaleString()} more to apply
                            </p>
                          )}
                          {/* {isAlreadyApplied && (
                            <p className="text-xs text-green-600 mt-1 font-semibold">
                              Coupon already applied
                            </p>
                          )} */}
                        </div>
                        <button 
                          className={`text-sm font-semibold px-3 py-1 rounded ${
                            isApplicable 
                              ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                              : 'text-gray-400 cursor-not-allowed'
                          }`}
                          disabled={!isApplicable }
                        >
                          {/* {isAlreadyApplied ? 'Applied' : 'Apply'} */}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full transform hover:scale-105 transition-all duration-500">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Order Confirmed!
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Thank you for your purchase. Your order is being processed.
            </p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                <p className="text-green-600 text-sm">#{orderId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Placed on</p>
                <p className="text-gray-900 font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">Items ({cartItems.length})</h4>
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center';
                            fallback.innerHTML = `
                              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            `;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-green-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              {cartItems.length > 3 && (
                <div className="text-center">
                  <p className="text-gray-500 text-sm">+{cartItems.length - 3} more items</p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-green-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coupon Discount</span>
                  <span className="text-green-600">-₹{couponDiscount.toLocaleString()}</span>
                </div>
              )}
              {onlineDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Online Payment Discount</span>
                  <span className="text-green-600">-₹{onlineDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              {codCharges > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">COD Charges</span>
                  <span className="text-red-600">+₹{codCharges}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-green-200">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-green-600">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          {selectedAddress && (
            <div className="bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                  <p className="text-gray-700 font-medium">{selectedAddress.first_name} {selectedAddress.last_name}</p>
                  <p className="text-gray-600 text-sm">
                    {selectedAddress.address_line_1}
                    {selectedAddress.address_line_2 && `, ${selectedAddress.address_line_2}`}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postal_code}
                  </p>
                  <p className="text-gray-600 text-sm">📱 {selectedAddress.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-purple-50 rounded-2xl p-5 mb-6 border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What's Next?
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>✅ Order confirmation email sent</p>
              <p>🔄 Order processing started</p>
              <p>📦 Expected dispatch within 24 hours</p>
              <p>🚚 Delivery in 3-5 business days</p>
            </div>
          </div>

          {/* Auto Redirect Timer */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">⏱</span>
              </div>
              <span className="text-orange-700 text-sm font-medium">
                Redirecting to home in <span className="font-bold">{countdown}</span> seconds
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard/user/orders')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>View Order Details</span>
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Complete Your Order
          </h1>
          <p className="text-gray-600 mt-2">Review your items and delivery details</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="xl:col-span-2 space-y-8">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                    <p className="text-gray-600">Where should we deliver your order?</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddressList(!showAddressList)}
                  className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {showAddressList ? 'Hide Addresses' : 'Change Address'}
                </button>
              </div>

              {/* Selected Address Display */}
              {selectedAddress && !showAddressList && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200 shadow-sm mb-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-gray-900">
                          {getFullName(selectedAddress)}
                        </span>
                        <div className="flex gap-2">
                          <span className="bg-amber-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                            {selectedAddress.address_type === 'home' ? '🏠 Home' : 
                             selectedAddress.address_type === 'work' ? '🏢 Work' : '📍 Other'}
                          </span>
                          {selectedAddress.is_default && (
                            <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-semibold">Default</span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 text-lg mb-2 font-medium">
                        {selectedAddress.address_line_1}
                        {selectedAddress.address_line_2 && `, ${selectedAddress.address_line_2}`}
                      </p>
                      <p className="text-gray-600">
                        {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.country} - {selectedAddress.postal_code}
                      </p>
                      <p className="text-gray-600">📱 {selectedAddress.phone}</p>
                      <p className="text-gray-600">📧 {selectedAddress.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Address List */}
              {showAddressList && (
                <div className="mb-8 space-y-4 max-h-96 overflow-y-auto pr-4">
                  {addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedAddress?.id === addr.id
                            ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg'
                            : 'border-gray-200 hover:border-amber-300 bg-white'
                        }`}
                        onClick={() => handleSelectAddress(addr)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg font-bold text-gray-900">
                                {getFullName(addr)}
                              </span>
                              <div className="flex gap-2">
                                <span className={`text-sm px-3 py-1 rounded-full font-semibold ${
                                  addr.address_type === 'home' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : addr.address_type === 'work'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {addr.address_type === 'home' ? '🏠 Home' : 
                                   addr.address_type === 'work' ? '🏢 Work' : '📍 Other'}
                                </span>
                                {addr.is_default && (
                                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-semibold">Default</span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 font-medium mb-2">
                              {addr.address_line_1}
                              {addr.address_line_2 && `, ${addr.address_line_2}`}
                            </p>
                            <p className="text-gray-600">
                              {addr.city}, {addr.state}, {addr.country} - {addr.postal_code}
                            </p>
                            <p className="text-gray-600">📱 {addr.phone}</p>
                            <p className="text-gray-600">📧 {addr.email}</p>
                          </div>
                          <div className="flex gap-3 ml-4 flex-col items-end">
                            {!addr.is_default && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetDefaultAddress(addr.id);
                                }}
                                className="text-green-600 hover:text-green-700 font-semibold text-sm bg-green-50 px-3 py-2 rounded-lg hover:bg-green-100 transition-colors"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(addr.id);
                              }}
                              className="text-red-600 hover:text-red-700 font-semibold text-sm bg-red-50 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                      <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Addresses Found</h3>
                      <p className="text-gray-600 mb-6">Add your first delivery address to continue</p>
                    </div>
                  )}
                </div>
              )}

              {/* Add New Address Button */}
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full border-2 border-dashed border-amber-300 rounded-2xl py-6 text-amber-600 hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 font-bold text-lg group"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <span>Add New Address</span>
                  </div>
                </button>
              )}

              {/* Add Address Form */}
              {showAddressForm && (
                <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-8 border-2 border-amber-200 shadow-lg mt-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Add New Address</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={address.first_name}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={address.last_name}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={address.email}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={address.country}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 bg-gray-100"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      name="address_line_1"
                      value={address.address_line_1}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                    <input
                      type="text"
                      name="address_line_2"
                      value={address.address_line_2}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                      <input
                        type="text"
                        name="postal_code"
                        value={address.postal_code}
                        onChange={handleInputChange}
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                      <div className="flex space-x-2">
                        {(['home', 'work', 'other'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleAddressTypeChange(type)}
                            className={`flex-1 border-2 rounded-xl py-3 text-sm font-semibold transition-all ${
                              address.address_type === type
                                ? 'border-amber-500 bg-amber-500 text-white'
                                : 'border-gray-300 text-gray-700 hover:border-amber-300'
                            }`}
                          >
                            {type === 'home' ? '🏠 Home' : type === 'work' ? '🏢 Work' : '📍 Other'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={address.is_default}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Set as default address</label>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={handleSaveAddress}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Save Address
                    </button>
                    <button
                      onClick={() => {
                        setShowAddressForm(false);
                        resetAddressForm();
                      }}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                  <p className="text-gray-600">Choose how you want to pay</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Online Payment Option */}
                <div
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedPayment === 'online'
                      ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                      : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                  onClick={() => setSelectedPayment('online')}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === 'online' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {selectedPayment === 'online' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Online Payment</h3>
                      <p className="text-green-600 font-semibold">Get 5% OFF</p>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-8 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">V</span>
                      </div>
                      <div className="w-8 h-6 bg-yellow-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">M</span>
                      </div>
                      <div className="w-8 h-6 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">R</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Pay securely with Credit/Debit card, UPI, Net Banking
                  </p>
                  <div className="mt-4 p-3 bg-green-50 rounded-xl">
                    <p className="text-green-700 text-sm font-semibold">
                      ✅ Secure & Encrypted • Instant Confirmation • 5% Discount Applied
                    </p>
                  </div>
                </div>

                {/* COD Payment Option */}
                <div
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedPayment === 'cod'
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                  onClick={() => setSelectedPayment('cod')}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPayment === 'cod' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}>
                      {selectedPayment === 'cod' && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Cash on Delivery</h3>
                      <p className="text-red-600 font-semibold">₹50 Extra Charges</p>
                    </div>
                    <div className="text-2xl">💰</div>
                  </div>
                  <p className="text-gray-600">
                    Pay when your order is delivered
                  </p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                    <p className="text-blue-700 text-sm font-semibold">
                      ⚠️ ₹50 COD charges apply • Pay cash to delivery agent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Product Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Products ({cartItems.length})</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center';
                              fallback.innerHTML = `
                                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              `;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-600">{item.category}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-bold text-amber-600">₹{item.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        </div>
                        {/* Show discount if available */}
                        {item.discount && item.discount > 0 && (
                          <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                            {item.discount}% OFF
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Coupon Section */}
              {renderCouponSection()}

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Discount</span>
                    <span className="text-green-600 font-semibold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="text-green-600 font-semibold">-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                {selectedPayment === 'online' && onlineDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Online Payment Discount (5%)</span>
                    <span className="text-green-600 font-semibold">-₹{onlineDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900 font-semibold">
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>

                {selectedPayment === 'cod' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">COD Charges</span>
                    <span className="text-red-600 font-semibold">+₹{codCharges}</span>
                  </div>
                )}

                {subtotal < 2000 && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                    Add ₹{(2000 - subtotal).toLocaleString()} more for FREE shipping!
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-xl">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-bold text-amber-600">₹{total.toLocaleString()}</span>
                </div>
                <div className="mt-2 space-y-1">
                  {selectedPayment === 'online' && onlineDiscount > 0 && (
                    <p className="text-green-600 text-sm">
                      You save ₹{(onlineDiscount + couponDiscount).toLocaleString()} with online payment & coupon!
                    </p>
                  )}
                  {selectedPayment === 'cod' && couponDiscount > 0 && (
                    <p className="text-green-600 text-sm">
                      You save ₹{couponDiscount.toLocaleString()} with coupon!
                    </p>
                  )}
                  {selectedPayment === 'cod' && (
                    <p className="text-red-600 text-sm">
                      ₹{codCharges} COD charges added
                    </p>
                  )}
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isLoading || !selectedAddress}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : selectedPayment === 'online' ? (
                  `Pay Now - ₹${total.toLocaleString()}`
                ) : (
                  `Place Order - ₹${total.toLocaleString()}`
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>100% Secure Payment • SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;