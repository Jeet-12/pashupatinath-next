"use client";

import { useState, useEffect } from 'react';
import { 
  getUserProfile, 
  getUserOrders, 
  fetchWishlist,
  getCart,
  UserProfile,
  UserStats,
  Order,
  Product
} from '../../libs/api';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real user data from API
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch user profile and stats
      const profileResponse = await getUserProfile();
      if (profileResponse.success && profileResponse.data) {
        setUserData(profileResponse.data.profile);
        setUserStats(profileResponse.data.stats);
      }

      // Fetch recent orders (first page with 4 items)
      const ordersResponse = await getUserOrders(1, 4);
      if (ordersResponse.success && ordersResponse.data) {
        const orders = ordersResponse.data.data || [];
        setRecentOrders(orders);
        
        // Calculate order stats from ALL orders
        const allOrdersResponse = await getUserOrders(1, 100);
        const allOrders = allOrdersResponse.success ? (allOrdersResponse.data?.data || []) : [];
        
        const pending = allOrders.filter(order => 
          order.status.toLowerCase().includes('pending') || 
          order.status.toLowerCase().includes('processing')
        ).length;
        
        const completed = allOrders.filter(order => 
          order.status.toLowerCase().includes('delivered') || 
          order.status.toLowerCase().includes('completed')
        ).length;

        setOrderStats({
          totalOrders: allOrders.length,
          pendingOrders: pending,
          completedOrders: completed
        });
      }

      // Fetch wishlist
      const wishlistResponse = await fetchWishlist();
      if (wishlistResponse.success && wishlistResponse.data) {
        setWishlistItems(wishlistResponse.data || []);
      }

      // Fetch cart items
      const cartResponse = await getCart();
      if (cartResponse.success && cartResponse.data) {
        // Handle different cart response structures
        const cartData = cartResponse.data;
        if (Array.isArray(cartData)) {
          setCartItems(cartData);
        } else if (cartData.cart_items && Array.isArray(cartData.cart_items)) {
          setCartItems(cartData.cart_items);
        } else if (cartData.items && Array.isArray(cartData.items)) {
          setCartItems(cartData.items);
        }
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total cart items count
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-96"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center">
                    <div className="bg-gray-200 p-3 rounded-lg w-12 h-12"></div>
                    <div className="ml-4">
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded mb-4"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userData?.name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            {userStats ? `Member since ${formatDate(userStats.member_since)}` : 'Here\'s what\'s happening with your account today.'}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.totalOrders}</p>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderStats.pendingOrders}</p>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Wishlist</p>
                <p className="text-2xl font-bold text-gray-900">{wishlistItems.length ?? 0}</p>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cart Items</p>
                <p className="text-2xl font-bold text-gray-900">{getCartItemsCount()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              </div>
              <div className="p-6">
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {order.products_details?.[0]?.product_name || `Order #${order.order_number}`}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Order #{order.order_number} • {formatDate(order.order_date)}
                            {order.products_details && order.products_details.length > 1 && 
                              ` + ${order.products_details.length - 1} more items`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatCurrency(order.total_amount)}</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-gray-500">No orders yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start shopping to see your orders here</p>
                  </div>
                )}
                <button 
                  onClick={() => window.location.href = '/dashboard/user/orders'}
                  className="w-full mt-6 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  View All Orders
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Wishlist */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => window.location.href = '/dashboard/user/orders'}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative"
                  >
                    <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">My Orders</span>
                  </button>
                  
                  <button 
                    onClick={() => window.location.href = '/wishlist'}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative"
                  >
                    <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Wishlist</span>
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => window.location.href = '/cart'}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors relative"
                  >
                    <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">My Cart</span>
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => window.location.href = '/dashboard/user/profile'}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Profile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Wishlist */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">My Wishlist</h2>
              </div>
              <div className="p-6">
                {wishlistItems.length > 0 ? (
                  <div className="space-y-4">
                    {wishlistItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.photo ? (
                            <img 
                              src={item.photo} 
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">Image</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                          <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                        </div>
                        <button className="text-red-500 hover:text-red-700 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Your wishlist is empty</p>
                  </div>
                )}
                <button 
                  onClick={() => window.location.href = '/wishlist'}
                  className="w-full mt-4 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  View All Wishlist Items
                </button>
              </div>
            </div>

            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Cart Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {cartItems.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.product_image ? (
                            <img 
                              src={item.product_image} 
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">Img</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.product_name || 'Product'}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity || 1} • {formatCurrency(item.price || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {cartItems.length > 2 && (
                      <p className="text-sm text-gray-600 text-center">
                        + {cartItems.length - 2} more items in cart
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => window.location.href = '/cart'}
                    className="w-full mt-4 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    View Cart ({getCartItemsCount()} items)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.slice(0, 3).map((order) => (
                  <div key={order.id} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      order.status.toLowerCase().includes('delivered') ? 'bg-green-100' :
                      order.status.toLowerCase().includes('processing') ? 'bg-yellow-100' :
                      order.status.toLowerCase().includes('shipped') ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <svg className={`w-4 h-4 ${
                        order.status.toLowerCase().includes('delivered') ? 'text-green-600' :
                        order.status.toLowerCase().includes('processing') ? 'text-yellow-600' :
                        order.status.toLowerCase().includes('shipped') ? 'text-blue-600' : 'text-gray-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {order.status.toLowerCase().includes('delivered') ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : order.status.toLowerCase().includes('shipped') ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">
                        Order #{order.order_number} is {order.status.toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.order_date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}