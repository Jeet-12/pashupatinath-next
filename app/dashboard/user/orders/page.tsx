"use client";

import { useState, useEffect } from 'react';

type OrderItem = {
  name: string;
  quantity: number;
  price: string;
  image: string;
};

type Order = {
  id: string;
  orderDate: string;
  deliveryDate?: string;
  items: OrderItem[];
  quantity: number;
  shippingCharge: string;
  total: string;
  status: string;
  trackingNumber?: string;
  address: string;
  paymentMethod: string;
  subtotal: string;
};

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Mock user data
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    membership: "Premium Member",
    totalOrders: 12,
    joinDate: "January 15, 2024"
  };

  // Mock orders data for the user
  const mockOrders = [
    {
      id: 'ORD-001',
      orderDate: '2024-03-15',
      deliveryDate: '2024-03-18',
      items: [
        { name: '5 Mukhi Rudraksha', quantity: 1, price: '$89.99', image: '/api/placeholder/60/60' },
        { name: 'Rudraksha Mala', quantity: 1, price: '$99.99', image: '/api/placeholder/60/60' }
      ],
      quantity: 2,
      shippingCharge: '$5.99',
      total: '$194.98',
      status: 'delivered',
      trackingNumber: 'TRK-789456123',
      address: '123 Main St, New York, NY 10001',
      paymentMethod: 'Credit Card',
      subtotal: '$189.99'
    },
    {
      id: 'ORD-002',
      orderDate: '2024-03-14',
      deliveryDate: '2024-03-20',
      items: [
        { name: '7 Mukhi Rudraksha', quantity: 1, price: '$149.99', image: '/api/placeholder/60/60' }
      ],
      quantity: 1,
      shippingCharge: '$0.00',
      total: '$149.99',
      status: 'shipped',
      trackingNumber: 'TRK-789456124',
      address: '123 Main St, New York, NY 10001',
      paymentMethod: 'PayPal',
      subtotal: '$149.99'
    },
    {
      id: 'ORD-003',
      orderDate: '2024-03-10',
      deliveryDate: '2024-03-12',
      items: [
        { name: 'Ganesh Rudraksha', quantity: 1, price: '$79.99', image: '/api/placeholder/60/60' },
        { name: 'Shiva Mala', quantity: 1, price: '$89.99', image: '/api/placeholder/60/60' },
        { name: 'Rudraksha Bracelet', quantity: 1, price: '$49.99', image: '/api/placeholder/60/60' }
      ],
      quantity: 3,
      shippingCharge: '$8.99',
      total: '$218.97',
      status: 'delivered',
      trackingNumber: 'TRK-789456125',
      address: '123 Main St, New York, NY 10001',
      paymentMethod: 'Credit Card',
      subtotal: '$209.98'
    },
    {
      id: 'ORD-004',
      orderDate: '2024-03-05',
      deliveryDate: '2024-03-08',
      items: [
        { name: 'Rudraksha Puja Kit', quantity: 1, price: '$59.99', image: '/api/placeholder/60/60' }
      ],
      quantity: 1,
      shippingCharge: '$4.99',
      total: '$64.98',
      status: 'delivered',
      trackingNumber: 'TRK-789456126',
      address: '123 Main St, New York, NY 10001',
      paymentMethod: 'Credit Card',
      subtotal: '$59.99'
    },
    {
      id: 'ORD-005',
      orderDate: '2024-03-01',
      deliveryDate: '2024-03-05',
      items: [
        { name: '9 Mukhi Rudraksha', quantity: 1, price: '$299.99', image: '/api/placeholder/60/60' }
      ],
      quantity: 1,
      shippingCharge: '$0.00',
      total: '$299.99',
      status: 'delivered',
      trackingNumber: 'TRK-789456127',
      address: '123 Main St, New York, NY 10001',
      paymentMethod: 'Credit Card',
      subtotal: '$299.99'
    },
    {
      id: 'ORD-006',
      orderDate: '2024-02-28',
      deliveryDate: '2024-03-02',
      items: [
        { name: 'Rudraksha Bracelet', quantity: 2, price: '$89.99', image: '/api/placeholder/60/60' }
      ],
      quantity: 2,
      shippingCharge: '$5.99',
      total: '$184.98',
      status: 'delivered',
      trackingNumber: 'TRK-789456128',
      address: '123 Main St, New York, NY 10001',
      paymentMethod: 'PayPal',
      subtotal: '$179.98'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
    // mockOrders is a stable local constant used to seed state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter orders
  useEffect(() => {
    let result = orders;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        case 'oldest':
          return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        case 'total_high':
          return parseFloat(b.total.replace('$', '')) - parseFloat(a.total.replace('$', ''));
        case 'total_low':
          return parseFloat(a.total.replace('$', '')) - parseFloat(b.total.replace('$', ''));
        default:
          return 0;
      }
    });

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [statusFilter, sortBy, orders]);

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Get status badge color and icon
  const getStatusInfo = (status: string) => {
    switch (status) {
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
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: '📦', action: 'View Details' };
    }
  };

  // Open order details modal
  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

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
                  {orders.filter(o => o.status === 'delivered').length}
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
                  {orders.filter(o => o.status === 'shipped' || o.status === 'processing').length}
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="delivered">Delivered</option>
                <option value="shipped">Shipped</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
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
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        <span className="mr-1">{statusInfo.icon}</span>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Ordered on {new Date(order.orderDate).toLocaleDateString()}
                      {order.deliveryDate && ` • Delivered on ${new Date(order.deliveryDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="mt-2 lg:mt-0 text-right">
                    <p className="text-2xl font-bold text-gray-900">{order.total}</p>
                    <p className="text-sm text-gray-600">{order.quantity} item{order.quantity > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
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
                      {order.trackingNumber && (
                        <span className="mr-4">Tracking: {order.trackingNumber}</span>
                      )}
                      <span>Payment: {order.paymentMethod}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="px-4 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                      >
                        {statusInfo.action}
                      </button>
                      {order.status === 'delivered' && (
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No Orders */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <button className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity">
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
                <h2 className="text-xl font-bold text-gray-900">Order Details - {selectedOrder.id}</h2>
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
                      <span className="text-gray-900">{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Date:</span>
                      <span className="text-gray-900">{selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString() : '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(selectedOrder.status).color}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="text-gray-900">{selectedOrder.trackingNumber}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment & Shipping</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="text-gray-900">{selectedOrder.paymentMethod}</span>
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
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">IMG</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
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
                    <span className="text-gray-900">{selectedOrder.shippingCharge}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  Download Invoice
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