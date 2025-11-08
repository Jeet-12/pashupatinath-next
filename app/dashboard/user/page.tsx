"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getUserProfile, 
  getUserOrders, 
  getCart,
  UserProfile,
  UserStats,
  Order,
  getUser
} from '../../libs/api';

export default function UserDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real user data from API and localStorage
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  // Get user data from localStorage
  const [localUser, setLocalUser] = useState<any>(null);

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Get user from localStorage on component mount
  useEffect(() => {
    const userFromStorage = getUser();
    setLocalUser(userFromStorage);
    console.log('User from localStorage:', userFromStorage);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user from localStorage first for immediate display
      const localUserData = getUser();
      if (localUserData) {
        setLocalUser(localUserData);
      }

      // Fetch user profile and stats from API
      const profileResponse = await getUserProfile();
      if (profileResponse.success && profileResponse.data) {
        setUserData(profileResponse.data.profile);
        setUserStats(profileResponse.data.stats);
      } else {
        // If API fails, use localStorage data
        if (localUserData) {
          const fallbackProfile: UserProfile = {
            id: localUserData.id || 0,
            name: localUserData.name || 'User',
            email: localUserData.email || '',
            mobile: localUserData.mobile || '',
            date_of_birth: localUserData.date_of_birth || '',
            gender: localUserData.gender || '',
            avatar: localUserData.avatar || '',
            email_verified_at: localUserData.email_verified_at || '',
            created_at: localUserData.created_at || new Date().toISOString(),
            updated_at: localUserData.updated_at || new Date().toISOString()
          };
          setUserData(fallbackProfile);
        }
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

  // Navigation handlers
  const navigateToOrders = () => {
    router.push('/dashboard/user/orders');
  };

  const navigateToCart = () => {
    router.push('/cart');
  };

  const navigateToProfile = () => {
    router.push('/dashboard/user/profile');
  };

  const navigateToProducts = () => {
    router.push('/products');
  };

  // Get user display name - prioritize localStorage for immediate display
  const getUserDisplayName = () => {
    if (localUser?.name) return localUser.name;
    if (userData?.name) return userData.name;
    return 'User';
  };

  // Get user email - prioritize localStorage for immediate display
  const getUserEmail = () => {
    if (localUser?.email) return localUser.email;
    if (userData?.email) return userData.email;
    return '';
  };

  // Get user avatar
  const getUserAvatar = () => {
    if (localUser?.avatar) return localUser.avatar;
    if (userData?.avatar) return userData.avatar;
    return null;
  };

  // Get member since date
  const getMemberSince = () => {
    if (userStats?.member_since) return userStats.member_since;
    if (localUser?.created_at) return localUser.created_at;
    return new Date().toISOString();
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

  // User info card component
  const UserInfoCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-4">
        {/* User Avatar */}
        <div className="relative">
          {getUserAvatar() ? (
            <img 
              src={getUserAvatar()} 
              alt={getUserDisplayName()}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-200"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* User Details */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{getUserDisplayName()}</h2>
          <p className="text-gray-600">{getUserEmail()}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Member since {formatDate(getMemberSince())}
            </div>
            {localUser?.mobile && (
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {localUser.mobile}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button 
            onClick={navigateToProfile}
            className="flex items-center space-x-1 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Additional User Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">{orderStats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{getCartItemsCount()}</div>
          <div className="text-sm text-gray-600">Cart Items</div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* User Info Card Skeleton */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
              </div>
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
        {/* User Info Card */}
        <UserInfoCard />

        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {getUserDisplayName()}!
          </h1>
          <p className="text-gray-600 mt-2">
            {userStats ? `Member since ${formatDate(userStats.member_since)}` : `Here's what's happening with your account today.`}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                            Order #{order.order_number}
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
                    <button 
                      onClick={navigateToProducts}
                      className="mt-4 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white py-2 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
                {recentOrders.length > 0 && (
                  <button 
                    onClick={navigateToOrders}
                    className="w-full mt-6 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    View All Orders
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Cart */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={navigateToOrders}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">My Orders</span>
                  </button>
                  
                  <button 
                    onClick={navigateToCart}
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
                    onClick={navigateToProfile}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Profile</span>
                  </button>

                  <button 
                    onClick={navigateToProducts}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Shop</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] rounded-lg shadow-sm p-6 text-center">
              <div className="text-white mb-4">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Continue Shopping</h3>
                <p className="text-amber-100">Discover our sacred collection of spiritual products</p>
              </div>
              <button 
                onClick={navigateToProducts}
                className="w-full bg-white text-[#5F3623] py-3 px-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                Browse Products
              </button>
            </div>

            {/* Cart Summary */}
            {/* {cartItems.length > 0 && (
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
                    onClick={navigateToCart}
                    className="w-full mt-4 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    View Cart ({getCartItemsCount()} items)
                  </button>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Recent Activity */}
        {/* <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
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
                      </p> */}
                      {/* <p className="text-xs text-gray-500">
                        {formatDate(order.order_date)}
                      </p> */}
                    {/* </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No recent activity</p>
                <button 
                  onClick={navigateToProducts}
                  className="mt-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}