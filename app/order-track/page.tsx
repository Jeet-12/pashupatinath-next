"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { productTrackOrder, ProductTrackOrderResponse, formatOrderStatus, formatPaymentStatus, getUserOrders, Order } from '../libs/api';

function OrderTrackInner() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Pre-fill order number from URL if available
  useEffect(() => {
    const orderFromUrl = searchParams.get('order');
    if (orderFromUrl) {
      setOrderNumber(orderFromUrl);
      handleTrackOrder(orderFromUrl);
    }
  }, [searchParams]);

  // Fetch user orders
  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const result = await getUserOrders(1, 50); // Get first 50 orders
      if (result.success && result.data?.data) {
        setUserOrders(result.data.data);
      }
    } catch (error) {
      console.error('Error fetching user orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleTrackOrder = async (orderNum?: string) => {
    const trackOrder = orderNum || orderNumber;
    
    if (!trackOrder.trim()) {
      setError('Please enter an order number');
      return;
    }

    setIsLoading(true);
    setError('');
    setIsDropdownOpen(false);
    
    try {
      const result: ProductTrackOrderResponse = await productTrackOrder(trackOrder);
      
      if (result.success && result.data) {
        setTrackingData({
          order: result.data.order,
          tracking_data: result.data.tracking_data
        });
      } else {
        setError(result.message || 'Order not found');
      }
    } catch (err) {
      setError('Failed to track order. Please try again.');
      console.error('Tracking error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderSelect = (order: Order) => {
    setOrderNumber(order.order_number);
    setSearchQuery('');
    setIsDropdownOpen(false);
    handleTrackOrder(order.order_number);
  };

  const filteredOrders = userOrders.filter(order =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toString().includes(searchQuery) ||
    order.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: any = {
      new: 'bg-blue-500',
      pending: 'bg-yellow-500',
      processing: 'bg-purple-500',
      shipped: 'bg-amber-500',
      delivered: 'bg-emerald-500',
      cancelled: 'bg-red-500'
    };
    return colors[status.toLowerCase()] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      new: '📦',
      pending: '⏳',
      processing: '⚡',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    return icons[status.toLowerCase()] || '📋';
  };

  const getTimelineFromStatus = (orderStatus: string, orderDate: string) => {
    const statusOrder = ['new', 'pending', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = statusOrder.indexOf(orderStatus.toLowerCase());
    
    return statusOrder.map((status, index) => {
      const isCompleted = index <= currentStatusIndex;
      const isCurrent = index === currentStatusIndex;
      
      let date = '';
      if (isCompleted) {
        // Simple date progression based on status
        const daysToAdd = index;
        const orderDateObj = new Date(orderDate);
        orderDateObj.setDate(orderDateObj.getDate() + daysToAdd);
        date = orderDateObj.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
      } else if (index === currentStatusIndex + 1) {
        // Next expected date
        const orderDateObj = new Date(orderDate);
        orderDateObj.setDate(orderDateObj.getDate() + index);
        date = `Expected ${orderDateObj.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short'
        })}`;
      }
      
      return {
        status,
        title: status.charAt(0).toUpperCase() + status.slice(1),
        description: getStatusDescription(status),
        date,
        completed: isCompleted,
        current: isCurrent
      };
    });
  };

  const getStatusDescription = (status: string) => {
    const descriptions: any = {
      new: 'Your order has been confirmed',
      pending: 'Your order is being processed',
      processing: 'Your items are being prepared for shipment',
      shipped: 'Your order has been shipped',
      delivered: 'Your order has been delivered'
    };
    return descriptions[status] || 'Order status updated';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
              <p className="text-gray-600">Select from your recent orders or enter order number</p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Order Selector Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select from your orders
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search your orders by order number, name, or ID..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                      {isLoadingOrders ? (
                        <div className="p-4 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="mt-2">Loading your orders...</p>
                        </div>
                      ) : filteredOrders.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          {searchQuery ? 'No orders found matching your search' : 'No orders found'}
                        </div>
                      ) : (
                        filteredOrders.map((order) => (
                          <button
                            key={order.id}
                            onClick={() => handleOrderSelect(order)}
                            className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-semibold text-gray-900">Order #{order.order_number}</div>
                                <div className="text-sm text-gray-600">
                                  {order.first_name} {order.last_name}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900">{formatCurrency(order.total_amount)}</div>
                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} text-white mt-1`}>
                                  {order.status.toUpperCase()}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              Placed on {formatDate(order.created_at)} • {order.quantity} items
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Or Divider */}
              <div className="flex items-center my-2">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-4 text-sm text-gray-500">or</div>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Manual Order Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter order number manually
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="Enter your order number (e.g., PR123456)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                    />
                  </div>
                  <button
                    onClick={() => handleTrackOrder()}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
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
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Recent Orders Quick Access */}
            {userOrders.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Access - Recent Orders</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {userOrders.slice(0, 6).map((order) => (
                    <button
                      key={order.id}
                      onClick={() => handleOrderSelect(order)}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="font-medium text-gray-900 text-sm">#{order.order_number}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {formatCurrency(order.total_amount)} • {formatDate(order.created_at)}
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} text-white mt-2`}>
                        {order.status.toUpperCase()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tracking Results */}
        {trackingData && trackingData.order && (
          <div className="space-y-8">
            {/* Order Summary Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-2xl border border-white/20 p-8 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order #{trackingData.order.order_number}</h2>
                    <p className="text-gray-600">Placed on {formatDate(trackingData.order.created_at)}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(trackingData.order.status)} text-white`}>
                      {getStatusIcon(trackingData.order.status)} {trackingData.order.status.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${formatPaymentStatus(trackingData.order.payment_status).color}`}>
                      {formatPaymentStatus(trackingData.order.payment_status).text}
                    </span>
                  </div>
                </div>

                {/* Current Status */}
                {trackingData.tracking_data?.data && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 mb-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-blue-900 text-lg mb-2">Shipping Status</h3>
                        <p className="text-blue-700 mb-2">
                          {trackingData.tracking_data.data.tracking_data?.shipment_track?.[0]?.current_status || 'In transit'}
                        </p>
                        <p className="text-blue-600 text-sm">
                          📍 {trackingData.tracking_data.data.tracking_data?.shipment_track?.[0]?.current_location || 'Processing center'} • 
                          🕒 {formatDateTime(trackingData.order.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tracking Timeline */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Order Journey
                  </h3>

                  <div className="space-y-6">
                    {getTimelineFromStatus(trackingData.order.status, trackingData.order.created_at).map((step: any, index: number) => (
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
                          {index < 4 && (
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
                {/* Order Summary */}
                <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between font-bold text-black text-lg">
                        <span>Total</span>
                        <span>₹{trackingData.order.total_amount?.toLocaleString()}</span>
                      </div>
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
                    <p className="font-semibold text-purple-900">{trackingData.order.first_name} {trackingData.order.last_name}</p>
                    <p className="text-purple-700 text-sm mt-1">{trackingData.order.address1}</p>
                    {trackingData.order.address2 && (
                      <p className="text-purple-700 text-sm">{trackingData.order.address2}</p>
                    )}
                    <p className="text-purple-700 text-sm">
                      {trackingData.order.city}, {trackingData.order.state} - {trackingData.order.post_code}
                    </p>
                    <p className="text-purple-700 text-sm mt-2">📱 {trackingData.order.phone}</p>
                    <p className="text-purple-700 text-sm">📧 {trackingData.order.email}</p>
                  </div>
                </div>

                {/* Tracking Details */}
                {trackingData.tracking_data?.data && (
                  <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Tracking Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carrier</span>
                        <span className="font-semibold">ShipRocket</span>
                      </div>
                      {trackingData.order.awb_code && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">AWB Code</span>
                          <span className="font-mono text-blue-600">{trackingData.order.awb_code}</span>
                        </div>
                      )}
                      {trackingData.order.tracking_url && (
                        <a 
                          href={trackingData.order.tracking_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full bg-blue-500 text-white py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors text-sm text-center block"
                        >
                          View Detailed Tracking
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Information */}
                <div className="bg-white rounded-3xl shadow-2xl border border-white/20 p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method</span>
                      <span className="font-semibold capitalize text-gray-600">
                        {trackingData.order.payment_method === 'cod' ? 'Cash on Delivery' : trackingData.order.payment_method}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className={`font-semibold ${formatPaymentStatus(trackingData.order.payment_status).color} px-2 py-1 rounded-full text-xs`}>
                        {formatPaymentStatus(trackingData.order.payment_status).text}
                      </span>
                    </div>
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
              Select an order from your recent purchases or enter your order number to view real-time tracking information.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📦</span>
                </div>
                <p className="font-semibold text-gray-900">Select Orders</p>
                <p className="text-sm text-gray-600 mt-1">Choose from your order history</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🔄</span>
                </div>
                <p className="font-semibold text-gray-900">Live Updates</p>
                <p className="text-sm text-gray-600 mt-1">Real-time tracking status</p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">⏱️</span>
                </div>
                <p className="font-semibold text-gray-900">Delivery ETA</p>
                <p className="text-sm text-gray-600 mt-1">Estimated delivery times</p>
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