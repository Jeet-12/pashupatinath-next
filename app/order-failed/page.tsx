"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function OrderFailedInner() {
  const _searchParams = useSearchParams();
  const _router = useRouter();
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSupport, setShowSupport] = useState(false);

  useEffect(() => {
    // Simulate fetching error details
    const fetchErrorDetails = async () => {
      try {
        // In a real app, you would fetch error details from your API
        // const orderId = searchParams.get('order_id');
        // const response = await fetch(`/api/orders/${orderId}/status`);
        // const data = await response.json();

        // Mock data for demonstration
        setTimeout(() => {
          setErrorDetails({
            orderNumber: `PR${Date.now()}`,
            errorCode: 'PAYMENT_DECLINED',
            errorMessage: 'Payment was declined by your bank',
            suggestedActions: [
              'Check your bank account balance',
              'Verify card details are correct',
              'Try a different payment method',
              'Contact your bank for assistance'
            ],
            timestamp: new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            amount: 2499
          });
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setIsLoading(false);
      }
    };

    fetchErrorDetails();
  }, []);

  const retryPayment = () => {
    // In a real app, this would redirect to payment retry
    _router.push('/checkout?retry=true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your order status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Error Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-2xl relative">
              <svg 
                className="w-16 h-16 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
              
              {/* Pulsing ring effect */}
              <div className="absolute inset-0 rounded-full border-4 border-rose-200 animate-ping"></div>
            </div>
            
            {/* Warning icon */}
            <div className="absolute -top-2 -right-2">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-red-700 bg-clip-text text-transparent mb-4">
            Payment Failed
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            We couldn't process your payment. Don't worry, your items are still reserved.
          </p>
          <p className="text-gray-500">
            Order #{errorDetails?.orderNumber} • {errorDetails?.timestamp}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Error Details Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-rose-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What Happened?
              </h2>
              
              <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-2xl p-6 border border-rose-100 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-900 text-lg mb-2">{errorDetails?.errorMessage}</h3>
                    <p className="text-rose-700">
                      Error Code: <span className="font-mono bg-rose-100 px-2 py-1 rounded text-sm">{errorDetails?.errorCode}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Suggested Actions */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-emerald-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quick Solutions
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {errorDetails?.suggestedActions.map((action: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700 font-medium">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Amount Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Payment Summary
              </h2>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 text-lg">Order Amount</span>
                  <span className="text-3xl font-bold text-amber-600">₹{errorDetails?.amount.toLocaleString()}</span>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span>₹{errorDetails?.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-200 pt-3">
                    <span className="font-semibold">Total Amount</span>
                    <span className="font-bold">₹{errorDetails?.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Quick Actions */}
          <div className="space-y-6">
            {/* Retry Payment Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-6 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Try Again</h3>
              <p className="text-gray-600 mb-4 text-sm">
                You can retry the payment with the same details or choose a different method.
              </p>
              
              <button
                onClick={retryPayment}
                className="w-full bg-gradient-to-r from-rose-500 to-red-600 text-white py-4 rounded-2xl font-bold hover:from-rose-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mb-3 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Payment
              </button>
              
              <button className="w-full bg-white text-gray-600 border-2 border-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Use Different Card
              </button>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-xl border border-blue-100 p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">Need Help?</h3>
              <p className="text-blue-700 text-sm mb-4">
                Our support team is available to help you complete your purchase.
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => setShowSupport(true)}
                  className="w-full bg-white text-blue-600 border border-blue-200 py-3 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Get Help
                </button>
                
                <button className="w-full bg-green-600 text-white border border-green-600 py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.932 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                  </svg>
                  WhatsApp Support
                </button>
              </div>
            </div>

            {/* Cart Safety */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl shadow-xl border border-emerald-100 p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-emerald-900 mb-2">Your Items Are Safe</h3>
                <p className="text-emerald-700 text-sm">
                  We've reserved your selected Rudraksha items for the next 2 hours while you complete your payment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Modal */}
        {showSupport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full transform hover:scale-105 transition-transform duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Contact Support</h3>
                <p className="text-gray-600">We're here to help you complete your purchase</p>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="font-semibold text-blue-900">📞 Call Us</p>
                  <p className="text-blue-700">+91 73773 71008</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="font-semibold text-green-900">💬 WhatsApp</p>
                  <p className="text-green-700">+91 73773 71008</p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="font-semibold text-purple-900">📧 Email</p>
                  <p className="text-purple-700">support@pashupatinathrudraksh.com</p>
                </div>
              </div>

              <button
                onClick={() => setShowSupport(false)}
                className="w-full mt-6 bg-gray-500 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={retryPayment}
            className="bg-gradient-to-r from-rose-500 to-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-rose-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retry Payment
          </button>
          
          <Link
            href="/cart"
            className="bg-white text-rose-600 border-2 border-rose-200 px-8 py-4 rounded-2xl font-bold hover:bg-rose-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Back to Cart
          </Link>
          
          <Link
            href="/products"
            className="bg-white text-gray-600 border-2 border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Security Assurance */}
        <div className="bg-white rounded-3xl shadow-xl border border-white/20 p-8 backdrop-blur-sm">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Security is Our Priority</h3>
            <p className="text-gray-600">We use bank-level encryption to protect your payment information</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">SSL Encrypted</p>
              <p className="text-gray-600 text-sm">256-bit secure connection</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">PCI DSS Compliant</p>
              <p className="text-gray-600 text-sm">Payment card security standard</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">No Data Stored</p>
              <p className="text-gray-600 text-sm">We don't store your card details</p>
            </div>
          </div>
        </div>

        {/* Floating Help Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setShowSupport(true)}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center space-x-2 group"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Help</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5F3623] to-[#f5821f]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      }
    >
      <OrderFailedInner />
    </Suspense>
  );
}