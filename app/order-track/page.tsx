"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

function OrderTrackInner() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill order number from URL if available
  useEffect(() => {
    const orderFromUrl = searchParams.get('order');
    if (orderFromUrl) {
      setOrderNumber(orderFromUrl);
      handleTrackOrder(orderFromUrl);
    }
    // searchParams is stable and handleTrackOrder is defined inline here; disable exhaustive-deps for this case
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTrackOrder = async (orderNum?: string) => {
    const trackOrder = orderNum || orderNumber;
    
    if (!trackOrder.trim()) {
      setError('Please enter an order number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call
      setTimeout(() => {
        // Mock tracking data
        const mockTrackingData = {
          orderNumber: trackOrder,
          status: 'shipped',
          orderDate: '2024-01-15',
          estimatedDelivery: '2024-01-20',
          customer: {
            name: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            phone: '+91 9876543210'
          },
          shippingAddress: {
            name: 'Rajesh Kumar',
            address: '123, MG Road, Brigade Road, 1st Floor',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            phone: '+91 9876543210'
          },
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
          tracking: {
            carrier: 'ShipRocket',
            trackingNumber: 'SR7894561230',
            timeline: [
              {
                status: 'ordered',
                title: 'Order Confirmed',
                description: 'Your order has been confirmed',
                date: '2024-01-15 10:30 AM',
                completed: true,
                current: false
              },
              {
                status: 'processed',
                title: 'Order Processed',
                description: 'Your items are being prepared for shipment',
                date: '2024-01-16 02:15 PM',
                completed: true,
                current: false
              },
              {
                status: 'shipped',
                title: 'Shipped',
                description: 'Your order has been shipped',
                date: '2024-01-17 11:00 AM',
                completed: true,
                current: true
              },
              {
                status: 'out_for_delivery',
                title: 'Out for Delivery',
                description: 'Your order is out for delivery',
                date: 'Expected 2024-01-20',
                completed: false,
                current: false
              },
              {
                status: 'delivered',
                title: 'Delivered',
                description: 'Your order has been delivered',
                date: 'Expected by 2024-01-20',
                completed: false,
                current: false
              }
            ],
            currentStatus: {
              location: 'Bangalore Sorting Center',
              update: 'Package in transit to delivery hub',
              timestamp: '2024-01-18 09:45 AM'
            }
          },
          totalAmount: 4300
        };
        
        setTrackingData(mockTrackingData);
        setIsLoading(false);
      }, 2000);
      
    } catch (err) {
      // keep a reference to the error for debugging while satisfying eslint
  const _err = err;
      setError('Order not found. Please check your order number.');
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      ordered: 'bg-blue-500',
      processed: 'bg-purple-500',
      shipped: 'bg-amber-500',
      out_for_delivery: 'bg-orange-500',
      delivered: 'bg-emerald-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      ordered: '📦',
      processed: '⚡',
      shipped: '🚚',
      out_for_delivery: '📬',
      delivered: '✅'
    };
    return icons[status] || '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
            </div>
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-700 bg-clip-text text-transparent mb-4">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Follow your spiritual journey as we deliver your sacred Rudraksha
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-8 mb-12 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Order Details</h2>
              <p className="text-gray-600">Check the status of your recent order</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number (e.g., PR123456)"
                  className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                />
              </div>
              <button
                onClick={() => handleTrackOrder()}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Tracking...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Track Order
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-8">
            {/* Order Summary Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl border border-white/20 p-8 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{trackingData.orderNumber}</h2>
                    <p className="text-gray-600">Placed on {trackingData.orderDate}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(trackingData.status)} text-white`}>
                      {getStatusIcon(trackingData.status)} {trackingData.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Current Status */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 text-lg mb-2">Current Status</h3>
                      <p className="text-blue-700 mb-2">{trackingData.tracking.currentStatus.update}</p>
                      <p className="text-blue-600 text-sm">
                        📍 {trackingData.tracking.currentStatus.location} • 🕒 {trackingData.tracking.currentStatus.timestamp}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Order Journey
                  </h3>

                  <div className="space-y-6">
                    {trackingData.tracking.timeline.map((step: any, index: number) => (
                      <div key={step.status} className="flex items-start space-x-4">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            step.completed 
                              ? 'bg-emerald-500 text-white' 
                              : step.current
                                ? 'bg-blue-500 text-white animate-pulse'
                                : 'bg-gray-200 text-gray-400'
                          }`}>
                            <span className="text-lg">{getStatusIcon(step.status)}</span>
                          </div>
                          {index < trackingData.tracking.timeline.length - 1 && (
                            <div className={`flex-1 w-1 mt-2 ${
                              step.completed ? 'bg-emerald-500' : 'bg-gray-200'
                            }`} style={{ height: '40px' }}></div>
                          )}
                        </div>

                        {/* Step content */}
                        <div className="flex-1 pb-6">
                          <div className={`p-4 rounded-xl border ${
                            step.current 
                              ? 'bg-blue-50 border-blue-200 shadow-sm' 
                              : step.completed
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                              <h4 className={`font-bold text-lg ${
                                step.current ? 'text-blue-900' : step.completed ? 'text-emerald-900' : 'text-gray-500'
                              }`}>
                                {step.title}
                              </h4>
                              <span className={`text-sm ${
                                step.current ? 'text-blue-600' : step.completed ? 'text-emerald-600' : 'text-gray-400'
                              }`}>
                                {step.date}
                              </span>
                            </div>
                            <p className={`${
                              step.current ? 'text-blue-700' : step.completed ? 'text-emerald-700' : 'text-gray-500'
                            }`}>
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Delivery Estimate */}
                <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Delivery Estimate
                  </h3>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-amber-900 font-bold text-lg text-center">
                      {trackingData.estimatedDelivery}
                    </p>
                    <p className="text-amber-700 text-sm text-center mt-1">
                      Expected delivery date
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {trackingData.items.map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                          <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-gray-900 font-bold">₹{item.price.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{trackingData.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Shipping To
                  </h3>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <p className="font-semibold text-purple-900">{trackingData.shippingAddress.name}</p>
                    <p className="text-purple-700 text-sm mt-1">{trackingData.shippingAddress.address}</p>
                    <p className="text-purple-700 text-sm">
                      {trackingData.shippingAddress.city}, {trackingData.shippingAddress.state} - {trackingData.shippingAddress.pincode}
                    </p>
                    <p className="text-purple-700 text-sm mt-2">📱 {trackingData.shippingAddress.phone}</p>
                  </div>
                </div>

                {/* Tracking Details */}
                <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Tracking Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Carrier</span>
                      <span className="font-semibold">{trackingData.tracking.carrier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number</span>
                      <span className="font-mono text-blue-600">{trackingData.tracking.trackingNumber}</span>
                    </div>
                    <button className="w-full bg-blue-500 text-white py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors text-sm">
                      View Detailed Tracking
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-8 backdrop-blur-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Need Help With Your Order?</h2>
                <p className="text-gray-600">Our support team is here to assist you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-blue-900 mb-2">Call Support</h3>
                  <p className="text-blue-700 text-sm">+91 73773 71008</p>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.932 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-green-900 mb-2">WhatsApp</h3>
                  <p className="text-green-700 text-sm">+91 73773 71008</p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-purple-900 mb-2">Email</h3>
                  <p className="text-purple-700 text-sm">support@pashupatinathrudraksh.com</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!trackingData && !isLoading && (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Your Order</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Enter your order number above to view real-time tracking information and delivery updates for your sacred Rudraksha.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📦</span>
                </div>
                <p className="font-semibold text-gray-900">Real-time Tracking</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🔄</span>
                </div>
                <p className="font-semibold text-gray-900">Live Updates</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">⏱️</span>
                </div>
                <p className="font-semibold text-gray-900">Delivery ETA</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5F3623] to-[#f5821f]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      }
    >
      <OrderTrackInner />
    </Suspense>
  );
}