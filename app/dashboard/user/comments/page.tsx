"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserComments, deleteUserComment, Comment } from '../../../libs/api';

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isModalOpen, _setIsModalOpen] = useState(false);
  const [_isEditModalOpen, _setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchUserComments();
  }, []);

  const fetchUserComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getUserComments();
      
      
      if (response.success) {
        // Ensure comments is always an array
        const commentsData = Array.isArray(response.data) ? response.data : [];
        setComments(commentsData);
        
        if (commentsData.length === 0) {
          setError('No comments found');
        }
      } else {
        // Handle authentication errors specifically
        if (response.message.includes('Authentication') || response.message.includes('login')) {
          setError('Please log in to view your comments');
        } else {
          setError(response.message || 'Failed to fetch comments');
        }
      }
    } catch (err) {
      console.error('Error in fetchUserComments:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setComments([]); // Ensure comments is always an array
    } finally {
      setLoading(false);
    }
  };

  // Safe filter function
  const safeFilterComments = (filterFn: (comment: Comment) => boolean): number => {
    if (!Array.isArray(comments)) {
      return 0;
    }
    return comments.filter(filterFn).length;
  };

  // Statistics with safe array checks
  const activeComments = safeFilterComments(c => c.status === 'active');
  const totalComments = Array.isArray(comments) ? comments.length : 0;
  const thisMonthComments = safeFilterComments(c => {
    try {
      const commentDate = new Date(c.created_at);
      const now = new Date();
      return commentDate.getMonth() === now.getMonth() && 
             commentDate.getFullYear() === now.getFullYear();
    } catch {
      return false;
    }
  });

  const handleViewComment = (comment: Comment) => {
    setSelectedComment(comment);
    _setIsModalOpen(true);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(commentId);
      const response = await deleteUserComment(commentId);

      if (response.success) {
        // Remove the comment from the local state
        setComments(prev => {
          if (!Array.isArray(prev)) return [];
          return prev.filter(comment => comment.id !== commentId);
        });
        if (selectedComment?.id === commentId) {
          _setIsModalOpen(false);
        }
      } else {
        setError(response.message || 'Failed to delete comment');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    if (status === 'active') {
      return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
  };

  // Ensure comments is always treated as an array in render
  const displayComments = Array.isArray(comments) ? comments : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="text-center mb-12">
              <div className="h-8 bg-amber-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-amber-200 rounded w-96 mx-auto mb-6"></div>
              <div className="h-12 bg-amber-300 rounded w-48 mx-auto"></div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6 border border-amber-100">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-amber-200 rounded-lg mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-amber-200 rounded w-24 mb-2"></div>
                      <div className="h-6 bg-amber-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comments Skeleton */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-amber-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-amber-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="w-20 h-6 bg-amber-200 rounded"></div>
                </div>
                <div className="h-4 bg-amber-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-amber-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        {/* <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            My Comments
          </h1>
          <p className="text-lg text-amber-700 max-w-2xl mx-auto mb-6">
            Manage and review all your comments across our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/dashboard/user" 
              className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <button
              onClick={fetchUserComments}
              className="inline-flex items-center px-6 py-3 bg-white text-amber-700 rounded-lg hover:bg-amber-50 transition-all duration-200 font-medium border border-amber-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div> */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-amber-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Total Comments</p>
                <p className="text-2xl font-bold text-amber-900">{totalComments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-amber-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Active Comments</p>
                <p className="text-2xl font-bold text-green-900">{activeComments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-amber-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">This Month</p>
                <p className="text-2xl font-bold text-blue-900">{thisMonthComments}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {/* {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )} */}

        {/* Comments List */}
        {displayComments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-amber-100">
            <svg className="w-16 h-16 text-amber-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="text-xl font-semibold text-amber-800 mb-2">No Comments Yet</h3>
            <p className="text-amber-600 mb-6">You haven&apos;t posted any comments yet.</p>
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Explore Blog Posts
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {displayComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-amber-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                      {comment.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {comment.user?.name || 'You'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                        {comment.updated_at !== comment.created_at && (
                          <span className="text-amber-600 ml-2">(edited)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={getStatusBadge(comment.status)}>
                      {comment.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed text-lg">{comment.comment}</p>
                </div>

                {comment.post && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Posted on: {comment.post.title}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewComment(comment)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors duration-200"
                        title="View Details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {}}
                        disabled={actionLoading === comment.id}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        title="Edit Comment"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={actionLoading === comment.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        title="Delete Comment"
                      >
                        {actionLoading === comment.id ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                      <Link
                        href={`/blog/${comment.post.slug}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title="View Post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rest of the modals remain the same */}
        {/* Comment Detail Modal */}
        {isModalOpen && selectedComment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal content remains the same */}
            </div>
          </div>
        )}

        {/* Edit Comment Modal */}
        {_isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full">
              {/* Modal content remains the same */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}