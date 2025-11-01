
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
    return 'Latest Articles';
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
      <div className="mt-3 flex flex-wrap gap-1">
        {safeTags.slice(0, 2).map(tag => (
          <span key={tag.id} className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
            {tag.title}
          </span>
        ))}
        {safeTags.length > 2 && (
          <span className="text-gray-400 text-xs">+{safeTags.length - 2} more</span>
        )}
      </div>
    );
  };

  // Function to strip HTML and get plain text
  const stripHtml = (html: string): string => {
    if (typeof document === 'undefined') {
      // Server-side: simple regex to remove tags
      return html.replace(/<[^>]*>/g, '');
    }
    // Client-side: use DOM parser
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
      <div className="min-h-screen bg-gradient-to-br from-amber-25 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-amber-800 mb-2">Loading Spiritual Wisdom</h3>
          <p className="text-amber-600">Discovering articles for your journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-25 to-amber-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">📿</div>
          <h2 className="text-2xl font-bold text-amber-800 mb-2">Connection Interrupted</h2>
          <p className="text-amber-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              Try Again
            </button>
            <button 
              onClick={clearFilters}
              className="w-full bg-white text-amber-600 px-6 py-3 rounded-xl border border-amber-200 hover:bg-amber-50 transition-all duration-300 font-medium"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-25 via-white to-amber-50">
      {/* Enhanced Header Section */}
      <section className="relative bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-400/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm mb-6">
              <span className="text-2xl">📿</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
              Spiritual Blog
            </h1>
            <p className="text-amber-100 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
              Discover ancient wisdom, Rudraksha insights, and spiritual practices for modern life
            </p>
          </div>
        </div>
      </section>


      <section className="bg-white/80 backdrop-blur-sm border-b border-amber-100/50 py-4 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-3 text-sm">
            <Link href="/" className="text-amber-600 hover:text-amber-700 transition-colors font-medium flex items-center">
              <span>🏠</span>
              <span className="ml-1">Home</span>
            </Link>
            <span className="text-amber-300">❯</span>
            <Link href="/blog" className="text-amber-600 hover:text-amber-700 transition-colors font-medium">
              Blog
            </Link>
            {(category || tag) && (
              <>
                <span className="text-amber-300">❯</span>
                <span className="text-amber-800 font-semibold">{getCurrentFilterName()}</span>
              </>
            )}
          </nav>
</div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:w-2/3">
            {/* Enhanced Header with filter info */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center px-6 py-3 bg-white rounded-2xl shadow-lg border border-amber-100 mb-6">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></span>
                <h2 className="text-3xl font-bold text-amber-800">
                  {getCurrentFilterName()}
                </h2>
              </div>
              <p className="text-amber-600 text-lg">
                {posts.length} spiritual article{posts.length !== 1 ? 's' : ''} to enlighten your path
              </p>
              
              {/* Active Filters */}
              {(category || tag) && (
                <div className="flex justify-center items-center space-x-3 mt-4">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    {category ? `Category: ${getCurrentFilterName()}` : `Tag: ${getCurrentFilterName()}`}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="bg-white text-amber-600 px-4 py-2 rounded-full border border-amber-200 hover:bg-amber-50 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    ✕ Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Enhanced Blog Posts Grid */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => {
                  const readingTime = calculateReadingTime(post.summary || post.description || '');
                  
                  return (
                  
                    <article 
                      key={post.id} 
                      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100/50 hover:border-amber-200/70 hover:scale-105"
                    >
                          <Link href={`/blog/${post.slug}`}>
                      {/* Featured Image with Gradient Overlay */}
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300"></div>
                        
                        {/* Category Badge */}
                        {post.category && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/95 backdrop-blur-sm text-amber-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                              {post.category.title}
                            </span>
                          </div>
                        )}
                        
                        {/* Reading Time */}
                        <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                          ⏱️ {readingTime || 5} min
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        {/* Title */}
                        <h3 className="font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors duration-300 text-lg leading-tight">
                          {post.title}
                        </h3>
                        
                        {/* Summary/Description - Enhanced HTML content rendering */}
                        <div className="mb-4 min-h-[60px]">
                          {renderHtmlContent(post.summary || post.description || '', 120)}
                        </div>
                        
                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="flex items-center">
                              <span className="w-1 h-1 bg-amber-400 rounded-full mr-1"></span>
                              {formatDate(post.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-amber-600">
                            <span>✨</span>
                            <span>Read More</span>
                          </div>
                        </div>
                        
                        {/* Tags - Enhanced rendering */}
                        {renderTags(post.tags)}
                      </div>
                      
                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-amber-200/50 transition-all duration-500 pointer-events-none"></div>
                   </Link>
                    </article>
                    
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-100/50">
                <div className="text-8xl mb-6">📝</div>
                <h3 className="text-2xl font-bold text-amber-800 mb-3">No Articles Found</h3>
                <p className="text-amber-600 mb-8 max-w-md mx-auto text-lg">
                  {category || tag 
                    ? `No spiritual articles found for "${getCurrentFilterName()}". Explore other categories to continue your journey.`
                    : 'The spiritual wisdom is being prepared. Please check back soon for enlightening content!'
                  }
                </p>
                {(category || tag) && (
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
                  >
                    Explore All Articles
                  </button>
                )}
              </div>
            )}

            {/* Enhanced Pagination */}
            {!category && !tag && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 px-6 py-3 bg-white border border-amber-200 text-amber-600 rounded-2xl hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                >
                  <span>←</span>
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-12 h-12 rounded-xl transition-all duration-300 font-semibold ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg scale-110'
                          : 'bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 shadow-sm hover:shadow-md'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-2 px-6 py-3 bg-white border border-amber-200 text-amber-600 rounded-2xl hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar - 1/3 width */}
          <div className="lg:w-1/3">
            <div className="space-y-8">
              {/* Enhanced Search Widget */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-amber-100/50">
                <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                  <span className="text-amber-500 mr-2">🔍</span>
                  Search Spiritual Articles
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for wisdom..."
                    className="w-full px-4 pl-12 py-4 border border-amber-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-amber-25 placeholder-amber-400 text-amber-900 transition-all duration-300"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Enhanced Categories Widget */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-amber-100/50">
                <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                  <span className="text-amber-500 mr-2">📂</span>
                  Spiritual Categories
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/blog"
                    className={`flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-300 ${
                      !category 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg' 
                        : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700 border border-amber-100'
                    }`}
                  >
                    <span className="font-medium">All Wisdom</span>
                    <span className={`text-sm ${!category ? 'text-amber-100' : 'text-gray-400'}`}>
                      {posts.length}
                    </span>
                  </Link>
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/blog?category=${cat.slug}`}
                      className={`flex items-center justify-between py-3 px-4 rounded-2xl transition-all duration-300 ${
                        category === cat.slug
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700 border border-amber-100'
                      }`}
                    >
                      <span className="font-medium">{cat.title}</span>
                      <span className={`text-sm ${category === cat.slug ? 'text-amber-100' : 'text-gray-400'}`}>
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Enhanced Recent Posts Widget */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-amber-100/50">
                <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                  <span className="text-amber-500 mr-2">🕒</span>
                  Recent Wisdom
                </h3>
                <div className="space-y-4">
                  {recentPosts.slice(0, 4).map(post => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="flex items-center space-x-4 group p-3 rounded-2xl hover:bg-amber-50 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-300">
                        <Image
                          src={getImageUrl(post.photo)}
                          alt={post.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/blog-placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 group-hover:text-amber-700 transition-colors line-clamp-2 text-sm leading-tight mb-1">
                          {post.title}
                        </h4>
                        <p className="text-amber-500 text-xs">
                          {formatDate(post.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Enhanced Tags Widget */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border border-amber-100/50">
                <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                  <span className="text-amber-500 mr-2">🏷️</span>
                  Spiritual Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/blog"
                    className={`px-4 py-2 rounded-2xl text-sm transition-all duration-300 ${
                      !tag 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg' 
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800'
                    }`}
                  >
                    All Topics
                  </Link>
                  {tags.slice(0, 12).map(tagItem => (
                    <Link
                      key={tagItem.id}
                      href={`/blog?tag=${tagItem.slug}`}
                      className={`px-4 py-2 rounded-2xl text-sm transition-all duration-300 ${
                        tag === tagItem.slug
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg' 
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-800'
                      }`}
                    >
                      {tagItem.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Enhanced Newsletter Widget */}
              <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-amber-700 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/20 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-300/10 rounded-full -translate-x-4 translate-y-4"></div>
                
                <div className="relative z-10">
                  <h3 className="font-bold mb-3 text-lg flex items-center">
                    <span className="mr-2">✨</span>
                    Spiritual Insights
                  </h3>
                  <p className="text-amber-100 mb-4 text-sm leading-relaxed">
                    Receive weekly wisdom about Rudraksha, meditation techniques, and spiritual growth directly in your inbox.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email for wisdom..."
                      className="w-full px-4 py-3 rounded-2xl bg-amber-500/80 border border-amber-400 text-white placeholder-amber-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent backdrop-blur-sm"
                    />
                    <button className="w-full bg-white text-amber-600 py-3 rounded-2xl font-semibold hover:bg-amber-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
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