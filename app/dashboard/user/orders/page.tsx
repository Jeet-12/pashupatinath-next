"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getUserOrders, getOrderDetails, downloadInvoiceSimple, ApiResponse } from '../../../libs/api';

type OrderItem = {
  name: string;
  quantity: number;
  price: string;
  image: string;
  product_id?: number;
  slug?: string;
  cap?: {
    id: number | null;
    name: string;
    price: number;
  };
  thread?: {
    id: number | null;
    name: string;
    price: number;
  };
};

type Order = {
  id: string;
  order_number: string;
  order_date: string;
  delivery_date?: string;
  items: OrderItem[];
  quantity: number;
  shipping_fee: string;
  total_amount: string;
  status: string;
  tracking_number?: string;
  address: string;
  payment_method: string;
  subtotal: string;
  created_at?: string;
  updated_at?: string;
  products_details?: any[];
};

type UserData = {
  name: string;
  email: string;
  membership: string;
  totalOrders: number;
  joinDate: string;
};

// Helper function to get first image from comma-separated string
const getFirstImage = (imageString: string): string => {
  if (!imageString) return '/api/placeholder/60/60';
  
  const images = imageString.split(',').map(img => img.trim());
  const firstImage = images[0];
  
  if (firstImage.startsWith('/storage')) {
    return `https://www.pashupatinathrudraksh.com${firstImage}`;
  }
  
  return firstImage || '/api/placeholder/60/60';
};

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: "Loading...",
    email: "Loading...",
    membership: "Member",
    totalOrders: 0,
    joinDate: "Loading..."
  });

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: ApiResponse = await getUserOrders(currentPage, 10);
      
      if (response.success && response.data) {
        const ordersData = response.data.data || response.data; 
        
        const formattedOrders: Order[] = ordersData.map((order: any) => {
          let orderItems: OrderItem[] = [];
          
          if (order.products && typeof order.products === 'string') {
            try {
              const products = JSON.parse(order.products);
              orderItems = products.map((item: any) => ({
                name: item.product_name || 'Product',
                quantity: item.quantity || 1,
                price: `₹${(item.price || 0).toLocaleString()}`,
                image: getFirstImage(item.image || ''),
                product_id: item.product_id,
                slug: item.slug,
                cap: item.cap || { id: null, name: 'Normal Capping', price: 0 },
                thread: item.thread || { id: null, name: 'Red Thread', price: 0 }
              }));
            } catch (e) {
              console.error('Error parsing products:', e);
            }
          } else if (order.products_details && Array.isArray(order.products_details)) {
            orderItems = order.products_details.map((item: any) => ({
              name: item.product_name || 'Product',
              quantity: item.quantity || 1,
              price: `₹${(item.price || 0).toLocaleString()}`,
              image: getFirstImage(item.product_images || item.image || ''),
              product_id: item.product_id,
              slug: item.slug,
              cap: item.cap || { id: null, name: 'Normal Capping', price: 0 },
              thread: item.thread || { id: null, name: 'Red Thread', price: 0 }
            }));
          }

          const address = [
            order.address1,
            order.address2,
            order.city,
            order.state,
            order.country,
            order.post_code
          ].filter(Boolean).join(', ');

          return {
            id: order.id?.toString() || order.order_number,
            order_number: order.order_number,
            order_date: order.created_at || order.order_date,
            delivery_date: order.delivery_date,
            items: orderItems,
            quantity: order.quantity || orderItems.reduce((sum: number, item: OrderItem) => sum + item.quantity, 0),
            shipping_fee: `₹${(order.shipping_fee || 0).toLocaleString()}`,
            total_amount: `₹${(order.total_amount || 0).toLocaleString()}`,
            status: order.status || 'pending',
            tracking_number: order.tracking_number || order.awb_code,
            address: address,
            payment_method: order.payment_method || 'Unknown',
            subtotal: `₹${(order.sub_total || 0).toLocaleString()}`,
            created_at: order.created_at,
            updated_at: order.updated_at
          };
        });

        setOrders(formattedOrders);
        setUserData(prev => ({
          ...prev,
          totalOrders: response.data?.total || formattedOrders.length
        }));
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const userFromStorage = localStorage.getItem('user');
      if (userFromStorage) {
        const user = JSON.parse(userFromStorage);
        setUserData(prev => ({
          ...prev,
          name: user.name || 'User',
          email: user.email || 'user@example.com',
          joinDate: new Date(user.created_at || Date.now()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }));
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchOrders();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter orders
  useEffect(() => {
    let result = orders;

    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    result = [...result].sort((a, b) => {
      const dateA = new Date(a.order_date || a.created_at || 0);
      const dateB = new Date(b.order_date || b.created_at || 0);
      
      switch (sortBy) {
        case 'newest':
          return dateB.getTime() - dateA.getTime();
        case 'oldest':
          return dateA.getTime() - dateB.getTime();
        case 'total_high':
          return parseFloat(b.total_amount.replace('₹', '').replace(/,/g, '')) - 
                 parseFloat(a.total_amount.replace('₹', '').replace(/,/g, ''));
        case 'total_low':
          return parseFloat(a.total_amount.replace('₹', '').replace(/,/g, '')) - 
                 parseFloat(b.total_amount.replace('₹', '').replace(/,/g, ''));
        default:
          return 0;
      }
    });

    setFilteredOrders(result);
  }, [statusFilter, sortBy, orders]);

  // Simple download function
  const downloadInvoice = (orderId: string) => {
    downloadInvoiceSimple(parseInt(orderId));
  };

  // Fetch detailed order information when modal opens
  const openOrderDetails = async (order: Order) => {
    try {
      const response: ApiResponse = await getOrderDetails(parseInt(order.id));
      
      if (response.success && response.data) {
        const detailedOrder = response.data;
        
        const updatedOrder: Order = {
          ...order,
          products_details: detailedOrder.products_details,
          tracking_number: detailedOrder.tracking_number || detailedOrder.awb_code,
          status: detailedOrder.status || order.status
        };
        
        setSelectedOrder(updatedOrder);
      } else {
        setSelectedOrder(order);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      setSelectedOrder(order);
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Get status badge color and icon
  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { color: 'bg-green-100 text-green-800', icon: '✅', action: 'View Details' };
      case 'shipped':
        return { color: 'bg-blue-100 text-blue-800', icon: '🚚', action: 'Track Order' };
      case 'processing':
        return { color: 'bg-yellow-100 text-yellow-800', icon: '⏳', action: 'View Status' };
      case 'pending':
        return { color: 'bg-orange-100 text-orange-800', icon: '📝', action: 'View Details' };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: '❌', action: 'View Details' };
      case 'new':
        return { color: 'bg-purple-100 text-purple-800', icon: '🆕', action: 'View Details' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: '📦', action: 'View Details' };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5F3623] mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load orders</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchOrders}
            className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <p className="text-gray-600 mt-2">Track and manage your orders</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Member since: {userData.joinDate}</span>
                <span className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white px-3 py-1 rounded-full text-xs">
                  {userData.membership}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{userData.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status.toLowerCase() === 'delivered').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => 
                    ['shipped', 'processing', 'new', 'pending'].includes(o.status.toLowerCase())
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sacred Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.reduce((sum, order) => sum + order.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="delivered">Delivered</option>
                <option value="shipped">Shipped</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="new">New</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="total_high">Total: High to Low</option>
                <option value="total_low">Total: Low to High</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {currentOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-gray-900">{order.order_number}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <span className="mr-1">{statusInfo.icon}</span>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Ordered on {formatDate(order.order_date)}
                      {order.delivery_date && ` • Delivered on ${formatDate(order.delivery_date)}`}
                    </p>
                  </div>
                  <div className="mt-2 lg:mt-0 text-right">
                    <p className="text-2xl font-bold text-gray-900">{order.total_amount}</p>
                    <p className="text-sm text-gray-600">{order.quantity} item{order.quantity > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image && item.image !== '/api/placeholder/60/60' ? (
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              width={48}
                              height={48}
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/api/placeholder/60/60';
                              }}
                            />
                          ) : (
                            <span className="text-xs text-gray-500">IMG</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          {(item.cap || item.thread) && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.cap && item.cap.id && `Cap: ${item.cap.name} (+₹${item.cap.price})`}
                              {item.cap && item.cap.id && item.thread && item.thread.id && ' • '}
                              {item.thread && item.thread.id && `Thread: ${item.thread.name} (+₹${item.thread.price})`}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-sm text-gray-600">
                      {order.tracking_number && (
                        <span className="mr-4">Tracking: {order.tracking_number}</span>
                      )}
                      <span>Payment: {order.payment_method}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="px-4 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                      >
                        {statusInfo.action}
                      </button>
                      
                      {/* Simple Download Button */}
                      <button
                        onClick={() => downloadInvoice(order.id)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Invoice</span>
                      </button>
                      
                      {order.status.toLowerCase() === 'delivered' && (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border text-black border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 border text-sm rounded-lg ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white border-transparent'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 text-black  rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No Orders */}
        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {statusFilter !== 'all' 
                ? `No orders with status "${statusFilter}"`
                : "You haven't placed any orders yet."
              }
            </p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Order Details - {selectedOrder.order_number}</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="text-gray-900">{formatDate(selectedOrder.order_date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Date:</span>
                      <span className="text-gray-900">{selectedOrder.delivery_date ? formatDate(selectedOrder.delivery_date) : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedOrder.status).color}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="text-gray-900">{selectedOrder.tracking_number || 'Not available'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment & Shipping</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="text-gray-900">{selectedOrder.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Address:</span>
                      <span className="text-gray-900 text-right">{selectedOrder.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                            {item.image && item.image !== '/api/placeholder/60/60' ? (  
                              <Image
                              src={item.image} 
                              alt={item.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/api/placeholder/60/60';
                              }}
                            />
                          ) : (
                            <span className="text-xs text-gray-500">IMG</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          {(item.cap || item.thread) && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.cap && item.cap.id && `Cap: ${item.cap.name} (+₹${item.cap.price})`}
                              {item.cap && item.cap.id && item.thread && item.thread.id && ' • '}
                              {item.thread && item.thread.id && `Thread: ${item.thread.name} (+₹${item.thread.price})`}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-medium text-gray-900">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Charge:</span>
                    <span className="text-gray-900">{selectedOrder.shipping_fee}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">{selectedOrder.total_amount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                <button 
                  onClick={() => downloadInvoice(selectedOrder.id)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Invoice</span>
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}