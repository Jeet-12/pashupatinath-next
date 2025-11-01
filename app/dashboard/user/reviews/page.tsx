"use client";

import React, { useState, useEffect } from 'react';
import { 
  getUserReviews, 
  deleteReview, 
  getReviewStatistics, 
  createReview,
  updateReview,
  deleteReviewImage,
  Review, // <-- Imported from API
  ReviewStatistics, // <-- Imported from API
  CreateReviewData, // <-- Imported from API
  UpdateReviewData // <-- Imported from API
} from '../../../libs/api';

// NOTE: Relying on Review type from libs/api.ts which should contain nested types 

export default function UserReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // User data from API
  const [userData, setUserData] = useState({
    name: "User",
    totalReviews: 0,
    averageRating: 0,
    helpfulVotes: 0
  });

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUserReviews(currentPage, 6);
      
      if (response.success && response.data) {
        setReviews(response.data.data);
        
        // Update user data from statistics
        const statsResponse = await getReviewStatistics();
        if (statsResponse.success && statsResponse.data) {
          const stats = statsResponse.data as ReviewStatistics;
          setUserData(prev => ({
            ...prev,
            totalReviews: stats.total_reviews,
            averageRating: stats.average_rating,
            helpfulVotes: 0
          }));
        }
      } else {
        setError(response.message || 'Failed to fetch reviews');
      }
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  // Filter and sort reviews
  useEffect(() => {
    let result = reviews;

    if (filter !== 'all') {
      result = result.filter(review => review.status === filter);
    }

    result = [...result].sort((a: Review, b: Review) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      switch (sortBy) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'rating_high':
          return b.rating - a.rating;
        case 'rating_low':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpful || 0) - (a.helpful || 0);
        default:
          return 0;
      }
    });

    setFilteredReviews(result);
  }, [filter, sortBy, reviews]);

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  // Star rating component
  const StarRating: React.FC<{ rating: number; size?: 'sm' | 'lg'; interactive?: boolean; onRatingChange?: (rating: number) => void }> = ({ 
    rating, 
    size = 'sm', 
    interactive = false,
    onRatingChange 
  }) => {
    const starSize = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    
    const handleClick = (star: number) => {
      if (interactive && onRatingChange) {
        onRatingChange(star);
      }
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star: number) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => handleClick(star) : undefined}
            className={interactive ? "focus:outline-none" : ""}
            disabled={!interactive}
          >
            <svg
              className={`${starSize} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
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

  // Open create review
  const openCreateReview = () => {
    setIsCreateModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsCreateModalOpen(false);
    setSelectedReview(null);
    setEditReview(null);
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await deleteReview(reviewId);
        if (response.success) {
          setReviews(prev => prev.filter(review => review.id !== reviewId));
          closeModals();
          fetchReviews(); // Refresh statistics
        } else {
          alert(response.message || 'Failed to delete review');
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete review');
      }
    }
  };

  // Handle review update
  const handleUpdateReview = async (updatedReview: UpdateReviewData, reviewId: number) => {
    try {
      setSubmitting(true);
      const response = await updateReview(reviewId, updatedReview);
      if (response.success) {
        // Find and replace the updated review data in local state
        setReviews(prev => prev.map(review => 
          review.id === reviewId ? response.data! : review // Type assertion safe here as success implies data exists
        ));
        closeModals();
        fetchReviews(); // Re-fetch to ensure statistics are fresh
      } else {
        alert(response.message || 'Failed to update review');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle review creation
  const handleCreateReview = async (reviewData: CreateReviewData) => {
    try {
      setSubmitting(true);
      const response = await createReview(reviewData);
      if (response.success) {
        setReviews(prev => [response.data!, ...prev]); // Type assertion safe here
        closeModals();
        fetchReviews(); // Refresh statistics
      } else {
        alert(response.message || 'Failed to create review');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create review');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (reviewId: number, imageUrl: string) => {
    try {
      const response = await deleteReviewImage(reviewId, imageUrl);
      if (response.success) {
        // 1. Update primary review state
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { 
                ...review, 
                // FIX: Safely access images, providing empty array fallback
                images: (review.images || []).filter(img => img !== imageUrl) 
              }
            : review
        ));
        
        // 2. If viewing details modal
        if (selectedReview && selectedReview.id === reviewId) {
          setSelectedReview(prev => prev ? {
            ...prev,
            images: (prev.images || []).filter(img => img !== imageUrl)
          } : null);
        }
        
        // 3. If editing modal
        if (editReview && editReview.id === reviewId) {
            setEditReview(prev => prev ? {
                ...prev,
                images: (prev.images || []).filter(img => img !== imageUrl)
            } : null);
        }
      } else {
        alert(response.message || 'Failed to delete image');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete image');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5F3623] mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load reviews</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchReviews}
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
              <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-gray-600 mt-2">Manage your product reviews and feedback</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={openCreateReview}
                className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
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
                  <p className="text-2xl font-bold text-gray-900">{userData.averageRating.toFixed(1)}</p>
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
                <option value="active">Published</option>
                <option value="pending">Pending</option>
                <option value="inactive">Rejected</option>
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
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {review.product.image ? (
                      <img 
                        src={review.product.image} 
                        alt={review.product.name}
                        className="w-12 h-12 object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">IMG</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.product.name}</h3>
                    <p className="text-sm text-gray-600">{review.product.category} • ${review.product.price}</p>
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
                  {formatDate(review.date)}
                </span>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              </div>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="flex space-x-2 mb-4">
                  {review.images.map((image, index) => (
                    <div key={index} className="relative w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Review image ${index + 1}`}
                        className="w-16 h-16 object-cover"
                      />
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
                      {formatDate(review.reply.date)}
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
        {filteredReviews.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-[#5F3623] to-[#f5821f] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white">⭐</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600 mb-6">
              {filter !== 'all' 
                ? `No reviews with status "${filter}"`
                : "You haven't written any reviews yet."
              }
            </p>
            <button 
              onClick={openCreateReview}
              className="px-6 py-3 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Write Your First Review
            </button>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {isModalOpen && selectedReview && (
        <ReviewDetailsModal
          review={selectedReview}
          onEdit={() => openEditReview(selectedReview)}
          onDelete={() => handleDeleteReview(selectedReview.id)}
          onClose={closeModals}
          onDeleteImage={handleDeleteImage}
        />
      )}

      {/* Edit Review Modal */}
      {isEditModalOpen && editReview && (
        <EditReviewModal
          review={editReview}
          onSave={(data) => handleUpdateReview(data, editReview.id)}
          onClose={closeModals}
          submitting={submitting}
        />
      )}

      {/* Create Review Modal */}
      {isCreateModalOpen && (
        <CreateReviewModal
          onSave={handleCreateReview}
          onClose={closeModals}
          submitting={submitting}
        />
      )}
    </div>
  );
}

// Review Details Modal Component
function ReviewDetailsModal({ 
  review, 
  onEdit, 
  onDelete, 
  onClose,
  onDeleteImage 
}: { 
  review: Review; 
  onEdit: () => void; 
  onDelete: () => void; 
  onClose: () => void;
  onDeleteImage: (reviewId: number, imageUrl: string) => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const StarRating: React.FC<{ rating: number; size?: 'sm' | 'lg' }> = ({ rating, size = 'sm' }) => {
    const starSize = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {review.product.image ? (
                <img 
                  src={review.product.image} 
                  alt={review.product.name}
                  className="w-16 h-16 object-cover"
                />
              ) : (
                <span className="text-xs text-gray-500">IMG</span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{review.product.name}</h3>
              <p className="text-sm text-gray-600">{review.product.category}</p>
              <p className="text-lg font-bold text-gray-900">${review.product.price}</p>
            </div>
          </div>

          {/* Review Content */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <StarRating rating={review.rating} size="lg" />
              <span className="text-sm text-gray-500">
                {formatDate(review.date)}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{review.title}</h3>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Review Images</h4>
              <div className="grid grid-cols-3 gap-3">
                {review.images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden group">
                    <img 
                      src={image} 
                      alt={`Review image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this image?')) {
                            onDeleteImage(review.id, image);
                          }
                        }}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Store Reply */}
          {review.reply && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-blue-900">{review.reply.from}</span>
                <span className="text-sm text-blue-600">
                  {formatDate(review.reply.date)}
                </span>
              </div>
              <p className="text-blue-800">{review.reply.comment}</p>
            </div>
          )}

          {/* Review Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">{review.helpful}</div>
              <div className="text-gray-600">Helpful Votes</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">
                {review.verified ? 'Yes' : 'No'}
              </div>
              <div className="text-gray-600">Verified Purchase</div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            <button
              onClick={onEdit}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Edit Review
            </button>
            <button
              onClick={onDelete}
              className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit Review Modal Component
// Define the specific type for the Edit Form Data
interface EditFormData {
  rate: number;
  title: string;
  review: string;
  existing_images: string[];
}
function EditReviewModal({ 
  review, 
  onSave, 
  onClose,
  submitting 
}: { 
  review: Review; 
  onSave: (data: UpdateReviewData) => void; 
  onClose: () => void;
  submitting: boolean;
}) {
  const [formData, setFormData] = useState<EditFormData>({
    rate: review.rating,
    title: review.title,
    review: review.comment,
    existing_images: review.images || []
  });

  const [newImages, setNewImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      rate: formData.rate,
      title: formData.title,
      review: formData.review,
      existing_images: formData.existing_images,
      photos: newImages
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      existing_images: prev.existing_images.filter((img: string) => img !== imageUrl)
    }));
  };

  const StarRating: React.FC<{ 
    rating: number; 
    interactive?: boolean; 
    onRatingChange?: (rating: number) => void 
  }> = ({ 
    rating, 
    interactive = false,
    onRatingChange 
  }) => {
    const handleClick = (star: number) => {
      if (interactive && onRatingChange) {
        onRatingChange(star);
      }
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star: number) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            className="focus:outline-none"
          >
            <svg
              className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} cursor-pointer hover:scale-110 transition-transform`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Review</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarRating 
              rating={formData.rate} 
              interactive={true}
              // FIX: Explicitly type 'prev' to remove implicit any error
              onRatingChange={(rating) => setFormData((prev: EditFormData) => ({ ...prev, rate: rating }))}
            />
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
              value={formData.review}
              onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              required
            />
          </div>

          {/* Existing Images */}
          {formData.existing_images && formData.existing_images.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
              <div className="grid grid-cols-4 gap-2">
                {formData.existing_images.map((image: string, index: number) => (
                  <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
                    <img 
                      src={image} 
                      alt={`Existing image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
            />
            {newImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {newImages.map((file, index) => (
                  <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`New image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Create Review Modal Component
function CreateReviewModal({ 
  onSave, 
  onClose,
  submitting 
}: { 
  onSave: (data: CreateReviewData) => void; 
  onClose: () => void;
  submitting: boolean;
}) {
  const [formData, setFormData] = useState<Omit<CreateReviewData, 'photos'>>({
    product_slug: '',
    rate: 5,
    title: '',
    review: ''
  });

  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      photos: images
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const StarRating: React.FC<{ 
    rating: number; 
    interactive?: boolean; 
    onRatingChange?: (rating: number) => void 
  }> = ({ 
    rating, 
    interactive = false,
    onRatingChange 
  }) => {
    const handleClick = (star: number) => {
      if (interactive && onRatingChange) {
        onRatingChange(star);
      }
    };

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star: number) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            className="focus:outline-none"
          >
            <svg
              className={`w-8 h-8 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} cursor-pointer hover:scale-110 transition-transform`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Write New Review</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Slug</label>
            <input
              type="text"
              value={formData.product_slug}
              onChange={(e) => setFormData(prev => ({ ...prev, product_slug: e.target.value }))}
              placeholder="Enter product slug (e.g., 5-mukhi-rudraksha)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarRating 
              rating={formData.rate} 
              interactive={true}
              // FIX: Explicitly type 'prev' to remove implicit any error
              onRatingChange={(rating) => setFormData((prev: Omit<CreateReviewData, 'photos'>) => ({ ...prev, rate: rating }))}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your review a title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              required
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
              rows={6}
              placeholder="Share your experience with this product..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
              required
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F3623] focus:border-transparent"
            />
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.map((file, index) => (
                  <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden group">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={`New image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}