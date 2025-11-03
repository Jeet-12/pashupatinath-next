"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Type definitions (These must match the definitions used in your API)
interface Category {
  id: number;
  title: string;
  slug: string;
}

interface Tag {
  id: number;
  title: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description?: string;
  photo: string;
  created_at: string;
  updated_at: string;
  status: string;
  added_by?: string;
  post_cat_id?: number;
  post_tag_id?: number;
  category?: Category;
  tags?: Tag[] | null;
}

interface BlogResponse {
  status: string;
  post?: {
    data?: Post[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
  posts?: Post[];
  rcnt_post?: Post[];
  message?: string;
}

export default function BlogPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Get API base URL
  const getApiBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8000';
  };

  // Safe tags extractor function
  const extractTagsFromPosts = (posts: Post[]): Tag[] => {
    const allTags: Tag[] = [];
    
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (tag && tag.id && !allTags.find(t => t.id === tag.id)) {
            allTags.push(tag);
          }
        });
      }
    });
    
    return allTags;
  };

  // Fetch blog posts
  useEffect(() => {
    const fetchBlogPosts = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const baseUrl = getApiBaseUrl();
        let url: string;
        
        if (category) {
          url = `${baseUrl}/api/blog-cat/${category}`;
        } else if (tag) {
          url = `${baseUrl}/api/blog-tag/${tag}`;
        } else {
          const params = new URLSearchParams({
            page: currentPage.toString(),
            show: '9'
          });
          url = `${baseUrl}/api/blog?${params}`;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BlogResponse = await response.json();
        
        if (data.status === 'success') {
          let postsData: Post[] = [];
          let recentData: Post[] = [];

          if (category || tag) {
            postsData = data.posts || data.post?.data || [];
            recentData = data.rcnt_post || [];
          } else {
            postsData = data.post?.data || data.posts || [];
            recentData = data.rcnt_post || [];
            setTotalPages(data.post?.last_page || 1);
          }

          const safePosts = postsData.map(post => ({
            ...post,
            tags: Array.isArray(post.tags) ? post.tags : []
          }));

          const safeRecentPosts = recentData.map(post => ({
            ...post,
            tags: Array.isArray(post.tags) ? post.tags : []
          }));

          setPosts(safePosts);
          setRecentPosts(safeRecentPosts);

          const extractedTags = extractTagsFromPosts(safePosts);
          setTags(extractedTags);

        } else {
          throw new Error(data.message || 'Failed to fetch blog posts');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load blog posts';
        setError(errorMessage);
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [category, tag, currentPage]);

  // Fetch categories from postCategory endpoint
  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const baseUrl = getApiBaseUrl();
        const url = `${baseUrl}/api/postCategory`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Get current filter name for display
  const getCurrentFilterName = (): string => {
    if (category) {
      const foundCategory = categories.find(cat => cat.slug === category);
      return foundCategory?.title || 'Category';
    }
    if (tag) {
      const foundTag = tags.find(t => t.slug === tag);
      return foundTag?.title || 'Tag';
    }
    return 'Latest Spiritual Articles';
  };

  // Handle page change
  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear filters
  const clearFilters = (): void => {
    setCurrentPage(1);
    window.location.href = '/blog';
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get placeholder image URL
  const getImageUrl = (photo: string): string => {
    if (!photo || photo === 'null' || photo === 'undefined') {
      return '/images/blog-placeholder.jpg';
    }
    if (photo.startsWith('http')) {
      return photo;
    }
    return `${getApiBaseUrl()}${photo}`;
  };

  // Safe tags renderer
  const renderTags = (postTags: Tag[] | null | undefined) => {
    if (!postTags || !Array.isArray(postTags)) {
      return null;
    }

    const safeTags = postTags.filter(tag => tag && tag.title);
    
    if (safeTags.length === 0) {
      return null;
    }

    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {safeTags.slice(0, 3).map(tag => (
          <span key={tag.id} className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-200 shadow-sm">
            {tag.title}
          </span>
        ))}
        {safeTags.length > 3 && (
          <span className="text-amber-600 text-xs font-medium bg-amber-50 px-2 py-1.5 rounded-full border border-amber-200">
            +{safeTags.length - 3} more
          </span>
        )}
      </div>
    );
  };

  // Function to strip HTML and get plain text
  const stripHtml = (html: string): string => {
    if (typeof document === 'undefined') {
      return html.replace(/<[^>]*>/g, '');
    }
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Function to safely render HTML content with line clamp
  const renderHtmlContent = (content: string, maxLength: number = 120) => {
    const plainText = stripHtml(content);
    const truncated = plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
    
    return (
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
        {truncated}
      </p>
    );
  };

  // Calculate reading time
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const text = stripHtml(content);
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-25 via-orange-25 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">📿</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-amber-800 mb-3">Loading Spiritual Wisdom</h3>
          <p className="text-amber-600 max-w-md mx-auto text-lg">
            Discovering enlightening articles for your spiritual journey...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-25 via-orange-25 to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-100">
          <div className="text-7xl mb-6">🌀</div>
          <h2 className="text-3xl font-bold text-amber-800 mb-3">Connection Interrupted</h2>
          <p className="text-amber-600 mb-8 text-lg">{error}</p>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
            >
              Try Again
            </button>
            <button 
              onClick={clearFilters}
              className="w-full bg-white text-amber-600 px-8 py-4 rounded-2xl border-2 border-amber-200 hover:bg-amber-50 transition-all duration-300 font-semibold text-lg shadow-sm hover:shadow-md"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-25 via-orange-25 to-amber-50">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 text-white py-24 lg:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[url('/images/spiritual-pattern.svg')] opacity-10"></div>
        <div className="absolute top-10 left-10 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-sm mb-8 border border-white/30 shadow-2xl">
              <span className="text-3xl">📖</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent leading-tight">
              Spiritual Blog
            </h1>
            <p className="text-amber-100 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-8 font-light">
              Discover ancient wisdom, Rudraksha insights, and spiritual practices to illuminate your modern life journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
                <span className="text-amber-100 font-semibold">📿 {posts.length} Enlightening Articles</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
                <span className="text-amber-100 font-semibold">✨ Daily Spiritual Insights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Breadcrumb */}
      <section className="bg-white/80 backdrop-blur-sm border-b border-amber-100/50 py-5 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-3 text-sm font-medium">
            <Link href="/" className="text-amber-600 hover:text-amber-700 transition-all duration-300 flex items-center group">
              <span className="text-lg">🏠</span>
              <span className="ml-2 group-hover:underline">Home</span>
            </Link>
            <span className="text-amber-300 text-lg">›</span>
            <Link href="/blog" className="text-amber-600 hover:text-amber-700 transition-all duration-300 group">
              <span className="group-hover:underline">Spiritual Blog</span>
            </Link>
            {(category || tag) && (
              <>
                <span className="text-amber-300 text-lg">›</span>
                <span className="text-amber-800 font-semibold bg-amber-100 px-3 py-1 rounded-full text-sm">
                  {getCurrentFilterName()}
                </span>
              </>
            )}
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content - 2/3 width */}
          <div className="lg:w-2/3">
            {/* Enhanced Filter Header */}
            <div className="mb-16 text-center">
              <div className="inline-flex flex-col items-center justify-center px-8 py-6 bg-white rounded-3xl shadow-2xl border border-amber-100/70 mb-8 backdrop-blur-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse"></span>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
                    {getCurrentFilterName()}
                  </h2>
                  <span className="w-3 h-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse delay-500"></span>
                </div>
                <p className="text-amber-600 text-lg font-medium">
                  {posts.length} spiritual article{posts.length !== 1 ? 's' : ''} to enlighten your path
                </p>
              </div>
              
              {/* Active Filters */}
              {(category || tag) && (
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-2xl text-base font-semibold shadow-lg flex items-center space-x-3">
                    <span>🏷️</span>
                    <span>{category ? `Category: ${getCurrentFilterName()}` : `Tag: ${getCurrentFilterName()}`}</span>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="bg-white text-amber-600 px-6 py-3 rounded-2xl border-2 border-amber-200 hover:bg-amber-50 transition-all duration-300 text-base font-semibold shadow-sm hover:shadow-md flex items-center space-x-2"
                  >
                    <span>✕</span>
                    <span>Clear Filter</span>
                  </button>
                </div>
              )}
            </div>

            {/* Enhanced Blog Posts Grid */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                {posts.map((post) => {
                  const readingTime = calculateReadingTime(post.summary || post.description || '');
                  
                  return (
                    <article 
                      key={post.id} 
                      className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100/50 hover:border-amber-200/70 hover:scale-105"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        {/* Featured Image with Enhanced Overlay */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={getImageUrl(post.photo)}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/blog-placeholder.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity duration-300"></div>
                          
                          {/* Category Badge */}
                          {post.category && (
                            <div className="absolute top-4 left-4">
                              <span className="bg-white/95 backdrop-blur-sm text-amber-700 px-4 py-2 rounded-2xl text-sm font-bold shadow-lg border border-amber-200">
                                {post.category.title}
                              </span>
                            </div>
                          )}
                          
                          {/* Reading Time */}
                          <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-sm flex items-center space-x-1">
                            <span>⏱️</span>
                            <span>{readingTime || 5} min</span>
                          </div>

                          {/* Hover Effect Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-7">
                          {/* Title */}
                          <h3 className="font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300 text-xl leading-tight min-h-[56px] flex items-start">
                            {post.title}
                          </h3>
                          
                          {/* Summary/Description */}
                          <div className="mb-5 min-h-[72px]">
                            {renderHtmlContent(post.summary || post.description || '', 120)}
                          </div>
                          
                          {/* Meta Information */}
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center space-x-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                                <span className="text-amber-700 font-medium">{formatDate(post.created_at)}</span>
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-amber-600 font-semibold group-hover:text-amber-700 transition-colors">
                              <span>Read More</span>
                              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </div>
                          </div>
                          
                          {/* Enhanced Tags */}
                          {renderTags(post.tags)}
                        </div>
                        
                        {/* Enhanced Hover Effect Border */}
                        <div className="absolute inset-0 rounded-3xl border-3 border-transparent group-hover:border-amber-300/30 transition-all duration-500 pointer-events-none"></div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-amber-100/50">
                <div className="text-9xl mb-8">📝</div>
                <h3 className="text-3xl font-bold text-amber-800 mb-4">No Articles Found</h3>
                <p className="text-amber-600 mb-10 max-w-md mx-auto text-xl leading-relaxed">
                  {category || tag 
                    ? `No spiritual articles found for "${getCurrentFilterName()}". Explore other categories to continue your journey.`
                    : 'The spiritual wisdom is being prepared. Please check back soon for enlightening content!'
                  }
                </p>
                {(category || tag) && (
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-5 rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold text-lg"
                  >
                    Explore All Spiritual Articles
                  </button>
                )}
              </div>
            )}

            {/* Enhanced Pagination */}
            {!category && !tag && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 mt-16 p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100/50">
                <div className="text-amber-600 font-semibold">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-3 px-6 py-3 bg-white border-2 border-amber-200 text-amber-600 rounded-2xl hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md font-semibold disabled:hover:shadow-sm"
                  >
                    <span>←</span>
                    <span>Previous</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-12 h-12 rounded-xl transition-all duration-300 font-bold text-lg ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-110'
                              : 'bg-white border-2 border-amber-200 text-amber-600 hover:bg-amber-50 shadow-sm hover:shadow-md'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-3 px-6 py-3 bg-white border-2 border-amber-200 text-amber-600 rounded-2xl hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md font-semibold disabled:hover:shadow-sm"
                  >
                    <span>Next</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar - 1/3 width */}
          <div className="lg:w-1/3">
            <div className="space-y-8 sticky top-24">
              {/* Enhanced Search Widget */}
              <div className="bg-white rounded-3xl shadow-xl p-7 border border-amber-100/50 backdrop-blur-sm">
                <h3 className="font-bold text-gray-800 mb-5 text-xl flex items-center">
                  <span className="text-amber-500 mr-3 text-2xl">🔍</span>
                  Search Spiritual Wisdom
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for wisdom, meditation, rudraksha..."
                    className="w-full px-5 pl-14 py-4 border-2 border-amber-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 bg-amber-25 placeholder-amber-400 text-amber-900 transition-all duration-300 text-lg font-medium"
                  />
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-amber-500 text-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Enhanced Categories Widget */}
              <div className="bg-white rounded-3xl shadow-xl p-7 border border-amber-100/50 backdrop-blur-sm">
                <h3 className="font-bold text-gray-800 mb-6 text-xl flex items-center">
                  <span className="text-amber-500 mr-3 text-2xl">📂</span>
                  Spiritual Categories
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/blog"
                    className={`flex items-center justify-between py-4 px-5 rounded-2xl transition-all duration-300 border-2 ${
                      !category 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-transparent' 
                        : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700 border-amber-200 hover:border-amber-300'
                    }`}
                  >
                    <span className="font-semibold text-lg">All Wisdom</span>
                    <span className={`text-sm font-bold ${!category ? 'text-amber-100' : 'text-gray-400'}`}>
                      {posts.length}
                    </span>
                  </Link>
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/blog?category=${cat.slug}`}
                      className={`flex items-center justify-between py-4 px-5 rounded-2xl transition-all duration-300 border-2 ${
                        category === cat.slug
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-transparent' 
                          : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700 border-amber-200 hover:border-amber-300'
                      }`}
                    >
                      <span className="font-semibold text-lg">{cat.title}</span>
                      <span className={`text-lg font-bold ${category === cat.slug ? 'text-amber-100' : 'text-amber-500'}`}>
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Enhanced Recent Posts Widget */}
              <div className="bg-white rounded-3xl shadow-xl p-7 border border-amber-100/50 backdrop-blur-sm">
                <h3 className="font-bold text-gray-800 mb-6 text-xl flex items-center">
                  <span className="text-amber-500 mr-3 text-2xl">🕒</span>
                  Recent Wisdom
                </h3>
                <div className="space-y-5">
                  {recentPosts.slice(0, 4).map(post => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="flex items-center space-x-5 group p-4 rounded-2xl hover:bg-amber-50 transition-all duration-300 border-2 border-transparent hover:border-amber-200"
                    >
                      <div className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300 relative">
                        <Image
                          src={getImageUrl(post.photo)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/blog-placeholder.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-2 text-base leading-tight mb-2">
                          {post.title}
                        </h4>
                        <p className="text-amber-500 text-sm font-medium">
                          {formatDate(post.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Enhanced Tags Widget */}
              <div className="bg-white rounded-3xl shadow-xl p-7 border border-amber-100/50 backdrop-blur-sm">
                <h3 className="font-bold text-gray-800 mb-6 text-xl flex items-center">
                  <span className="text-amber-500 mr-3 text-2xl">🏷️</span>
                  Spiritual Topics
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/blog"
                    className={`px-5 py-3 rounded-2xl text-base font-semibold transition-all duration-300 border-2 ${
                      !tag 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-transparent' 
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800 border-amber-200'
                    }`}
                  >
                    All Topics
                  </Link>
                  {tags.slice(0, 15).map(tagItem => (
                    <Link
                      key={tagItem.id}
                      href={`/blog?tag=${tagItem.slug}`}
                      className={`px-5 py-3 rounded-2xl text-base font-semibold transition-all duration-300 border-2 ${
                        tag === tagItem.slug
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg border-transparent' 
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800 border-amber-200'
                      }`}
                    >
                      {tagItem.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Enhanced Newsletter Widget */}
              <div className="bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border border-amber-400/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300/15 rounded-full -translate-x-8 translate-y-8 blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="font-bold mb-4 text-2xl">Spiritual Insights</h3>
                  <p className="text-amber-100 mb-6 text-lg leading-relaxed font-light">
                    Receive weekly wisdom about Rudraksha, meditation techniques, and spiritual growth directly in your inbox.
                  </p>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Enter your email for wisdom..."
                      className="w-full px-5 py-4 rounded-2xl bg-amber-500/80 border-2 border-amber-400 text-white placeholder-amber-200 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white backdrop-blur-sm text-lg font-medium"
                    />
                    <button className="w-full bg-white text-amber-600 py-4 rounded-2xl font-bold text-lg hover:bg-amber-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                      Subscribe to Wisdom
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}