"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function OrderSuccessInner() {
  const _searchParams = useSearchParams();
  const _router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching order details
    const fetchOrderDetails = async () => {
      try {
        // In a real app, you would fetch order details from your API
        // const orderId = searchParams.get('order_id');
        // const response = await fetch(`/api/orders/${orderId}`);
        // const data = await response.json();

        // Mock data for demonstration
        setTimeout(() => {
          setOrderDetails({
            orderNumber: `PR${Date.now()}`,
            orderDate: new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }),
            totalAmount: 2499,
            paymentMethod: 'UPI',
            items: [
              {
                id: 1,
                name: '5 Mukhi Nepali Rudraksha Bead',
                price: 2500,
                quantity: 1,
                image: 'https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/8%20mm%20mala%20hand.jpeg'
              },
              {
                id: 2,
                name: 'Rudraksha Mala',
                price: 1800,
                quantity: 1,
                image: '/rudraksha-mala.jpg'
              }
            ],
            shippingAddress: {
              name: 'Rajesh Kumar',
              address: '123, MG Road, Brigade Road',
              city: 'Bangalore',
              state: 'Karnataka',
              pincode: '560001',
              phone: '+91 9876543210'
            },
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          });
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg 
                className="w-16 h-16 text-white animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-sm font-bold">🎉</span>
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase. Your spiritual journey begins now.
          </p>
          <p className="text-gray-500">
            Order #{orderDetails?.orderNumber} • {orderDetails?.orderDate}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Order Summary Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Items
              </h2>
              
              <div className="space-y-4">
                {orderDetails?.items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-600">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                    ₹{orderDetails?.totalAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-right">
                  Paid via {orderDetails?.paymentMethod}
                </p>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Delivery Information
              </h2>
              
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100">
                <p className="font-semibold text-gray-900 text-lg mb-2">{orderDetails?.shippingAddress.name}</p>
                <p className="text-gray-700 mb-1">{orderDetails?.shippingAddress.address}</p>
                <p className="text-gray-700">
                  {orderDetails?.shippingAddress.city}, {orderDetails?.shippingAddress.state} - {orderDetails?.shippingAddress.pincode}
                </p>
                <p className="text-gray-700 mt-2">📱 {orderDetails?.shippingAddress.phone}</p>
                
                <div className="mt-4 pt-4 border-t border-emerald-200">
                  <p className="text-sm text-emerald-700 font-semibold">
                    Estimated Delivery: {orderDetails?.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Quick Actions */}
          <div className="space-y-6">
            {/* Next Steps */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What's Next?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Order Confirmed</p>
                    <p className="text-sm text-gray-600">We've received your order</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Processing</p>
                    <p className="text-sm text-gray-600">We're preparing your items</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Shipped</p>
                    <p className="text-sm text-gray-600">On its way to you</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Delivered</p>
                    <p className="text-sm text-gray-600">Expected by {orderDetails?.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spiritual Blessing */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-xl border border-amber-100 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🕉️</span>
                </div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">Divine Blessings</h3>
                <p className="text-amber-700 text-sm">
                  May your Rudraksha bring peace, prosperity, and spiritual growth to your life.
                </p>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-xl border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Need Help?</h3>
              <p className="text-blue-700 text-sm mb-4">
                Our support team is here to help with any questions about your order.
              </p>
              <div className="space-y-2">
                <button className="w-full bg-white text-blue-600 border border-blue-200 py-2 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors text-sm">
                  📞 Call Support
                </button>
                <button className="w-full bg-white text-green-600 border border-green-200 py-2 px-4 rounded-xl font-semibold hover:bg-green-50 transition-colors text-sm">
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/orders"
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-emerald-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Order Details
          </Link>
          
          <Link
            href="/products"
            className="bg-white text-emerald-600 border-2 border-emerald-200 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Continue Shopping
          </Link>
          
          <button className="bg-white text-gray-600 border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Invoice
          </button>
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Authentic Products</p>
              <p className="text-gray-600 text-sm">100% Genuine Certification</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Free Shipping</p>
              <p className="text-gray-600 text-sm">Across India</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Easy Returns</p>
              <p className="text-gray-600 text-sm">7-Day Return Policy</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">Secure Payment</p>
              <p className="text-gray-600 text-sm">100% Safe & Encrypted</p>
            </div>
          </div>
        </div>

        {/* Floating Celebration */}
        <div className="fixed bottom-8 right-8">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-2xl shadow-2xl animate-bounce">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-bold text-sm">Order Successful!</p>
                <p className="text-xs opacity-90">Thank you for trusting us</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5F3623] to-[#f5821f]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      }
    >
      <OrderSuccessInner />
    </Suspense>
  );
}