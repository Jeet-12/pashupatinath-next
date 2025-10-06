"use client";

import React, { useState, useEffect } from 'react';

type Reply = {
  from: string;
  comment: string;
  date: string;
} | null;

type Product = {
  name: string;
  image: string;
  price: string;
  category: string;
};

type Review = {
  id: string;
  product: Product;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: string;
  verified: boolean;
  helpful: number;
  images: string[];
  reply: Reply;
};

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editReview, setEditReview] = useState<Review | null>(null);

  // Mock user data
  const userData = {
    name: "John Doe",
    totalReviews: 8,
    averageRating: 4.5,
    helpfulVotes: 12
  };

  // Mock reviews data
  const mockReviews = [
    {
      id: 'REV-001',
      product: {
        name: '5 Mukhi Rudraksha',
        image: '/api/placeholder/80/80',
        price: '$89.99',
        category: 'Rudraksha'
      },
      rating: 5,
      title: 'Amazing Spiritual Energy!',
      comment: 'This Rudraksha has brought so much peace and positive energy into my life. The quality is exceptional and I can feel its spiritual vibrations.',
      date: '2024-03-15',
      status: 'published',
      verified: true,
      helpful: 5,
      images: ['/api/placeholder/100/100', '/api/placeholder/100/100'],
      reply: {
        from: 'Pashupatinath Store',
        comment: 'Thank you for your wonderful feedback! We are delighted to hear about your positive experience.',
        date: '2024-03-16'
      }
    },
    {
      id: 'REV-002',
      product: {
        name: '7 Mukhi Rudraksha',
        image: '/api/placeholder/80/80',
        price: '$149.99',
        category: 'Rudraksha'
      },
      rating: 4,
      title: 'Good Quality Beads',
      comment: 'The beads are well-crafted and have a nice finish. Shipping was fast and packaging was secure. Would recommend!',
      date: '2024-03-10',
      status: 'published',
      verified: true,
      helpful: 3,
      images: ['/api/placeholder/100/100'],
      reply: null
    },
    {
      id: 'REV-003',
      product: {
        name: 'Ganesh Rudraksha Mala',
        image: '/api/placeholder/80/80',
        price: '$99.99',
        category: 'Mala'
      },
      rating: 5,
      title: 'Beautiful Mala for Meditation',
      comment: 'This mala is perfect for my daily meditation practice. The beads are evenly sized and the finish is smooth.',
      date: '2024-03-05',
      status: 'published',
      verified: true,
      helpful: 8,
      images: [],
      reply: {
        from: 'Pashupatinath Store',
        comment: 'We are happy to know the mala enhances your meditation practice. Thank you for choosing us!',
        date: '2024-03-06'
      }
    },
    {
      id: 'REV-004',
      product: {
        name: 'Rudraksha Bracelet',
        image: '/api/placeholder/80/80',
        price: '$49.99',
        category: 'Bracelet'
      },
      rating: 3,
      title: 'Decent but could be better',
      comment: 'The bracelet looks nice but the string quality could be improved. It feels a bit fragile for daily wear.',
      date: '2024-02-28',
      status: 'published',
      verified: true,
      helpful: 2,
      images: ['/api/placeholder/100/100'],
      reply: {
        from: 'Pashupatinath Store',
        comment: 'We appreciate your feedback. We are working on improving our string quality. Please contact support for a replacement.',
        date: '2024-02-29'
      }
    },
    {
      id: 'REV-005',
      product: {
        name: '9 Mukhi Rudraksha',
        image: '/api/placeholder/80/80',
        price: '$299.99',
        category: 'Rudraksha'
      },
      rating: 5,
      title: 'Worth Every Penny!',
      comment: 'This is a premium quality Rudraksha. The energy it emits is powerful and transformative. Excellent craftsmanship.',
      date: '2024-02-20',
      status: 'published',
      verified: true,
      helpful: 10,
      images: ['/api/placeholder/100/100', '/api/placeholder/100/100', '/api/placeholder/100/100'],
      reply: null
    },
    {
      id: 'REV-006',
      product: {
        name: 'Shiva Rudraksha Set',
        image: '/api/placeholder/80/80',
        price: '$199.99',
        category: 'Set'
      },
      rating: 4,
      title: 'Nice Collection',
      comment: 'Good variety of beads in the set. Perfect for gifting. Packaging was elegant.',
      date: '2024-02-15',
      status: 'pending',
      verified: true,
      helpful: 1,
      images: [],
      reply: null
    },
    {
      id: 'REV-007',
      product: {
        name: 'Rudraksha Puja Kit',
        image: '/api/placeholder/80/80',
        price: '$59.99',
        category: 'Kit'
      },
      rating: 2,
      title: 'Missing some items',
      comment: 'The kit arrived with missing essential items. Had to purchase separately. Disappointed.',
      date: '2024-02-10',
      status: 'published',
      verified: true,
      helpful: 0,
      images: [],
      reply: {
        from: 'Pashupatinath Store',
        comment: 'We sincerely apologize for the inconvenience. Our team will contact you to resolve this issue immediately.',
        date: '2024-02-11'
      }
    },
    {
      id: 'REV-008',
      product: {
        name: 'Basic Rudraksha',
        image: '/api/placeholder/80/80',
        price: '$29.99',
        category: 'Rudraksha'
      },
      rating: 4,
      title: 'Good for beginners',
      comment: 'Perfect for someone starting their spiritual journey. Affordable and genuine.',
      date: '2024-02-05',
      status: 'published',
      verified: true,
      helpful: 4,
      images: ['/api/placeholder/100/100'],
      reply: null
    }
  ];

  useEffect(() => {
    // Simulate API call
    setReviews(mockReviews);
    setFilteredReviews(mockReviews);
    // mockReviews is a stable local constant used only to seed state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort reviews
  useEffect(() => {
    let result = reviews;

    // Filter by status
    if (filter !== 'all') {
      result = result.filter(review => review.status === filter);
    }

    // Sort reviews
    result = [...result].sort((a: Review, b: Review) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'rating_high':
          return b.rating - a.rating;
        case 'rating_low':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    setFilteredReviews(result);
    setCurrentPage(1);
  }, [filter, sortBy, reviews]);

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  // Star rating component
  const StarRating: React.FC<{ rating: number; size?: 'sm' | 'lg' }> = ({ rating, size = 'sm' }) => {
    const starSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star: number) => (
          <svg
            key={star}
            className={`${starSize} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Open review details
  const openReviewDetails = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  // Open edit review
  const openEditReview = (review: Review) => {
    setEditReview(review);
    setIsEditModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedReview(null);
    setEditReview(null);
  };

  // Handle review update
  const handleUpdateReview = (updatedReview: Review) => {
    setReviews(prev => prev.map(review => 
      review.id === updatedReview.id ? updatedReview : review
    ));
    closeModals();
  };

  // Handle review deletion
  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      closeModals();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-gray-600 mt-2">Manage your product reviews and feedback</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity">
                Write New Review
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{userData.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center space-x-2">
                  <StarRating rating={Math.round(userData.averageRating)} />
                  <p className="text-2xl font-bold text-gray-900">{userData.averageRating}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Helpful Votes</p>
                <p className="text-2xl font-bold text-gray-900">{userData.helpfulVotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.status === 'pending').length}
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
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              >
                <option value="all">All Reviews</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating_high">Rating: High to Low</option>
                <option value="rating_low">Rating: Low to High</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500">IMG</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.product.name}</h3>
                    <p className="text-sm text-gray-600">{review.product.category} • {review.product.price}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                  {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                </span>
              </div>

              {/* Rating and Date */}
              <div className="flex items-center justify-between mb-3">
                <StarRating rating={review.rating} />
                <span className="text-sm text-gray-500">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              </div>

              {/* Review Images */}
              {review.images.length > 0 && (
                <div className="flex space-x-2 mb-4">
                  {review.images.map((image, index) => (
                    <div key={index} className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-gray-500">IMG</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Store Reply */}
              {review.reply && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-blue-900">Store Reply</span>
                    <span className="text-xs text-blue-600">
                      {new Date(review.reply.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">{review.reply.comment}</p>
                </div>
              )}

              {/* Review Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span>{review.helpful} helpful</span>
                  </span>
                  {review.verified && (
                    <span className="flex items-center space-x-1 text-green-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>Verified Purchase</span>
                    </span>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openReviewDetails(review)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEditReview(review)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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

        {/* No Reviews */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">⭐</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600 mb-6">You haven't written any reviews yet.</p>
            <button className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity">
              Write Your First Review
            </button>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {isModalOpen && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
                <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Product Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">IMG</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedReview.product.name}</h3>
                  <p className="text-sm text-gray-600">{selectedReview.product.category}</p>
                  <p className="text-lg font-bold text-gray-900">{selectedReview.product.price}</p>
                </div>
              </div>

              {/* Review Content */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={selectedReview.rating} size="lg" />
                  <span className="text-sm text-gray-500">
                    {new Date(selectedReview.date).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedReview.title}</h3>
                <p className="text-gray-700 leading-relaxed">{selectedReview.comment}</p>
              </div>

              {/* Review Images */}
              {selectedReview.images.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Review Images</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedReview.images.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-500">Image {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Store Reply */}
              {selectedReview.reply && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-blue-900">{selectedReview.reply.from}</span>
                    <span className="text-sm text-blue-600">
                      {new Date(selectedReview.reply.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-blue-800">{selectedReview.reply.comment}</p>
                </div>
              )}

              {/* Review Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">{selectedReview.helpful}</div>
                  <div className="text-gray-600">Helpful Votes</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-900">
                    {selectedReview.verified ? 'Yes' : 'No'}
                  </div>
                  <div className="text-gray-600">Verified Purchase</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3">
                <button
                  onClick={() => openEditReview(selectedReview)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Edit Review
                </button>
                <button
                  onClick={() => handleDeleteReview(selectedReview.id)}
                  className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {isEditModalOpen && editReview && (
        <EditReviewModal
          review={editReview}
          onSave={handleUpdateReview}
          onClose={closeModals}
        />
      )}
    </div>
  );
}

// Edit Review Modal Component
function EditReviewModal({ review, onSave, onClose }: { review: Review; onSave: (r: Review) => void; onClose: () => void }) {
  const [formData, setFormData] = useState({
    rating: review.rating,
    title: review.title,
    comment: review.comment
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...review,
      ...formData,
      date: new Date().toISOString().split('T')[0] // Update date
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Review</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className="text-2xl focus:outline-none"
                >
                  {star <= formData.rating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              required
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Update Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}