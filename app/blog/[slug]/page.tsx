"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Type definitions
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

interface Author {
  id: number;
  name: string;
  email?: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  photo: string;
  created_at: string;
  updated_at: string;
  status: string;
  added_by?: string;
  post_cat_id?: number;
  post_tag_id?: number;
  quote?: string;
  tags?: string;
  cat_info?: Category | null;
  tag_info?: Tag | null;
  author_info?: Author | null;
}

interface BlogDetailResponse {
  status: string;
  post?: Post;
  rcnt_post?: Post[];
  message?: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get API base URL
  const getApiBaseUrl = (): string => {
    return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8000';
  };

  // Fetch blog post details
  useEffect(() => {
    const fetchBlogPost = async (): Promise<void> => {
      if (!slug) {
        setError('No slug provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const baseUrl = getApiBaseUrl();
        const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
        const url = `${cleanBaseUrl}/api/blog-detail/${encodeURIComponent(slug)}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog post not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: BlogDetailResponse = await response.json();
        
        if (data.status === 'success' && data.post) {
          setPost(data.post);
          setRecentPosts(data.rcnt_post || []);
        } else {
          throw new Error(data.message || 'Failed to fetch blog post');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load blog post';
        setError(errorMessage);
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  // Get placeholder image URL
  const getImageUrl = (photo: string): string => {
    if (!photo || photo === 'null' || photo === 'undefined') {
      return '/images/blog-placeholder.jpg';
    }
    if (photo.startsWith('http')) {
      return photo;
    }
    const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
    const cleanPhoto = photo.startsWith('/') ? photo : `/${photo}`;
    return `${baseUrl}${cleanPhoto}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate reading time
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Get author name
  const getAuthorName = (): string => {
    if (post?.author_info?.name) {
      return post.author_info.name;
    }
    if (post?.added_by) {
      return post.added_by;
    }
    return 'Anonymous';
  };

  // Parse tags from string
  const parseTags = (tagsString?: string): string[] => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  // Share functions
  // const shareOnFacebook = () => {
  //   const url = window.location.href;
  //   const title = post?.title || '';
  //   window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
  // };

  // const shareOnTwitter = () => {
  //   const url = window.location.href;
  //   const title = post?.title || '';
  //   window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  // };

  // const shareOnLinkedIn = () => {
  //   const url = window.location.href;
  //   window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  // };

  // const shareOnWhatsApp = () => {
  //   const url = window.location.href;
  //   const title = post?.title || '';
  //   window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
  // };

  // const shareOnPinterest = () => {
  //   const url = window.location.href;
  //   const title = post?.title || '';
  //   const media = post?.photo ? getImageUrl(post.photo) : '';
  //   window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(title)}&media=${encodeURIComponent(media)}`, '_blank');
  // };

  // Generate complete HTML content including all elements
  const generateCompleteHtmlContent = () => {
    if (!post) return '';

    const tags = parseTags(post.tags);
    let htmlContent = '';

    // Add quote if exists
    if (post.quote) {
      htmlContent += `
        <div class="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white p-8 rounded-3xl text-center relative overflow-hidden border-2 border-amber-300 shadow-2xl mb-8">
          <div class="absolute top-2 left-4 text-6xl opacity-20 text-white">❝</div>
          <div class="absolute bottom-2 right-4 text-6xl opacity-20 text-white">❞</div>
          <div class="relative z-10">
            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
              <span class="text-2xl text-white">💎</span>
            </div>
            <blockquote class="text-2xl md:text-3xl font-light italic leading-relaxed text-white">
              "${post.quote}"
            </blockquote>
          </div>
        </div>
      `;
    }

    // Add summary if exists
    if (post.summary) {
      htmlContent += `
        <div class="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-l-4 border-orange-500 p-8 rounded-3xl shadow-lg mb-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4 shadow-md border border-orange-400">
              <span class="text-white text-xl">✨</span>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-orange-800">Key Insights</h3>
              <div class="w-16 h-1 bg-orange-500 rounded-full mt-2"></div>
            </div>
          </div>
          <p class="text-orange-900 text-lg leading-relaxed font-medium pl-16">
            ${post.summary}
          </p>
        </div>
      `;
    }

    // Add main content with orange and Rudraksha theme
    htmlContent += `
      <div class="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-amber-200 mb-8">
        <div class="prose prose-xl max-w-none 
          prose-headings:font-bold prose-headings:leading-tight
          prose-h1:text-4xl prose-h1:text-orange-800 prose-h1:border-b-2 prose-h1:border-orange-300 prose-h1:pb-4
          prose-h2:text-3xl prose-h2:text-orange-700 prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:text-orange-600 prose-h3:mt-10 prose-h3:mb-4
          prose-h4:text-xl prose-h4:text-orange-500 prose-h4:mt-8 prose-h4:mb-3
          prose-p:text-orange-900 prose-p:leading-relaxed prose-p:text-lg prose-p:my-6
          prose-p:bg-white/60 prose-p:px-6 prose-p:py-4 prose-p:rounded-2xl prose-p:border-l-4 prose-p:border-orange-400
          prose-a:text-orange-600 prose-a:font-semibold prose-a:no-underline 
          hover:prose-a:text-orange-700 hover:prose-a:underline
          prose-strong:text-orange-800 prose-strong:font-bold
          prose-ul:text-orange-900 prose-ol:text-orange-900
          prose-li:leading-relaxed prose-li:text-lg prose-li:my-2
          prose-li:bg-white/70 prose-li:px-4 prose-li:py-2 prose-li:rounded-xl prose-li:border-l-2 prose-li:border-orange-300
          prose-blockquote:border-l-4 prose-blockquote:border-orange-500 
          prose-blockquote:bg-gradient-to-r prose-blockquote:from-orange-50 prose-blockquote:to-amber-100
          prose-blockquote:italic prose-blockquote:py-6 prose-blockquote:px-8 
          prose-blockquote:rounded-2xl prose-blockquote:text-xl prose-blockquote:text-orange-800
          prose-blockquote:shadow-lg
          prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border-4 prose-img:border-orange-300
          prose-pre:bg-gradient-to-br prose-pre:from-orange-900 prose-pre:to-amber-900 
          prose-pre:text-orange-100 prose-pre:rounded-2xl prose-pre:shadow-xl prose-pre:border-2 prose-pre:border-orange-600
          prose-code:bg-orange-100 prose-code:text-orange-800 prose-code:px-3 prose-code:py-1 
          prose-code:rounded-lg prose-code:font-semibold prose-code:border prose-code:border-orange-300
          prose-table:shadow-2xl prose-table:rounded-2xl prose-table:overflow-hidden prose-table:border-2 prose-table:border-orange-300
          prose-th:bg-gradient-to-r prose-th:from-orange-500 prose-th:to-amber-500 
          prose-th:text-white prose-th:font-bold prose-th:text-lg
          prose-td:border-t prose-td:border-orange-200 prose-td:bg-white/80
          prose-td:text-orange-900 prose-td:font-medium">
          ${post.description}
        </div>
      </div>
    `;

    // Add tags if exists (from string field)
    if (tags.length > 0 || post.tag_info) {
      htmlContent += `
        <div class="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 shadow-2xl border-2 border-amber-300 mb-8">
          <div class="flex items-center mb-8">
            <div class="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mr-4 shadow-lg border border-white/30">
              <span class="text-white text-lg">🏷️</span>
            </div>
            <h4 class="text-2xl font-bold text-white">Related Topics</h4>
          </div>
          
          <div class="flex flex-wrap gap-3">
      `;

      // Tags from string field
      tags.forEach(tag => {
        htmlContent += `
          <span class="bg-white/20 text-white px-5 py-3 rounded-2xl text-base font-semibold hover:bg-white/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl border-2 border-white/30 hover:border-white/50 transform hover:scale-105">
            #${tag}
          </span>
        `;
      });

      // Single tag from relationship
      if (post.tag_info) {
        htmlContent += `
          <span class="bg-white text-orange-600 px-5 py-3 rounded-2xl text-base font-semibold hover:bg-orange-50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl border-2 border-white transform hover:scale-105">
            #${post.tag_info.title}
          </span>
        `;
      }

      htmlContent += `
          </div>
        </div>
      `;
    }

    // Add share section with all social media buttons
    htmlContent += `
      <div class="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-8 shadow-2xl border-2 border-amber-300">
        <div class="flex items-center mb-8">
          <div class="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mr-4 shadow-lg border border-white/30">
            <span class="text-white text-lg">📤</span>
          </div>
          <h4 class="text-2xl font-bold text-white">Share Spiritual Wisdom</h4>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <button onclick="shareOnFacebook()" class="flex flex-col items-center justify-center space-y-2 bg-white/20 text-white p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm border-2 border-white/30 hover:border-white/50 cursor-pointer">
            <span class="text-2xl">📘</span>
            <span>Facebook</span>
          </button>
          
          <button onclick="shareOnTwitter()" class="flex flex-col items-center justify-center space-y-2 bg-white/20 text-white p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm border-2 border-white/30 hover:border-white/50 cursor-pointer">
            <span class="text-2xl">🐦</span>
            <span>Twitter</span>
          </button>
          
          <button onclick="shareOnLinkedIn()" class="flex flex-col items-center justify-center space-y-2 bg-white/20 text-white p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm border-2 border-white/30 hover:border-white/50 cursor-pointer">
            <span class="text-2xl">💼</span>
            <span>LinkedIn</span>
          </button>
          
          <button onclick="shareOnWhatsApp()" class="flex flex-col items-center justify-center space-y-2 bg-white/20 text-white p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm border-2 border-white/30 hover:border-white/50 cursor-pointer">
            <span class="text-2xl">💚</span>
            <span>WhatsApp</span>
          </button>
          
          <button onclick="shareOnPinterest()" class="flex flex-col items-center justify-center space-y-2 bg-white/20 text-white p-4 rounded-2xl hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm border-2 border-white/30 hover:border-white/50 cursor-pointer">
            <span class="text-2xl">📌</span>
            <span>Pinterest</span>
          </button>
        </div>
        
        <div class="mt-6 p-4 bg-white/10 rounded-2xl border border-white/20">
          <p class="text-white/90 text-sm text-center font-medium">
            Spread the spiritual wisdom and help others on their journey
          </p>
        </div>
      </div>
    `;

    return htmlContent;
  };

  // Safe HTML content renderer
  const renderHtmlContent = (content: string) => {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-orange-800 mb-3">Loading Spiritual Wisdom</h3>
          <p className="text-orange-600 text-lg">Preparing this enlightening article for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-orange-200">
          <div className="text-8xl mb-6 text-orange-500">📿</div>
          <h2 className="text-3xl font-bold text-orange-800 mb-4">Article Not Found</h2>
          <p className="text-orange-700 text-lg mb-8 leading-relaxed bg-orange-50/50 p-4 rounded-2xl">{error}</p>
          <div className="space-y-4">
            <button 
              onClick={() => router.push('/blog')}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 font-bold text-lg border-2 border-orange-400"
            >
              Back to Spiritual Blog
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-white text-orange-600 px-8 py-4 rounded-2xl border-2 border-orange-300 hover:bg-orange-50 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-orange-200">
          <div className="text-8xl mb-6 text-orange-500">📝</div>
          <h2 className="text-3xl font-bold text-orange-800 mb-4">Article Not Available</h2>
          <p className="text-orange-700 text-lg mb-8 bg-orange-50/50 p-4 rounded-2xl">The requested spiritual article could not be found in our archives.</p>
          <button 
            onClick={() => router.push('/blog')}
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl border-2 border-orange-400"
          >
            Explore Spiritual Articles
          </button>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.description);
  const authorName = getAuthorName();
  const completeHtmlContent = generateCompleteHtmlContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Enhanced Header Section with Orange & Rudraksha Theme */}
      <section className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white py-20 lg:py-24 overflow-hidden border-b-2 border-amber-300">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        
        {/* Rudraksha Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl text-white">📿</div>
          <div className="absolute top-20 right-20 text-4xl text-white">📿</div>
          <div className="absolute bottom-20 left-20 text-5xl text-white">📿</div>
          <div className="absolute bottom-10 right-10 text-3xl text-white">📿</div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-orange-100 text-sm mb-8 font-medium">
              <Link href="/" className="hover:text-white transition-all duration-300 flex items-center group">
                <span className="mr-2 group-hover:scale-110 transition-transform">🏠</span>
                <span>Home</span>
              </Link>
              <span className="text-orange-200">›</span>
              <Link href="/blog" className="hover:text-white transition-all duration-300">
                Spiritual Blog
              </Link>
              <span className="text-orange-200">›</span>
              <span className="text-white font-semibold truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Article Header */}
            <div className="text-center">
              {/* Category */}
              {post.cat_info && (
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl text-base font-semibold mb-8 border-2 border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer shadow-lg">
                  <span className="w-3 h-3 bg-amber-300 rounded-full mr-3 animate-pulse"></span>
                  {post.cat_info.title}
                </div>
              )}
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight md:leading-tight lg:leading-tight">
                <span className="bg-gradient-to-r from-white via-amber-100 to-orange-100 bg-clip-text text-transparent">
                  {post.title}
                </span>
              </h1>
              
              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-orange-100 text-base font-medium">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border-2 border-white/20">
                  <span className="text-lg">📅</span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border-2 border-white/20">
                  <span className="text-lg">⏱️</span>
                  <span>{readingTime} min read</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-2xl border-2 border-white/20">
                  <span className="text-lg">✍️</span>
                  <span>By {authorName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Article Content - Main Column */}
          <div className="lg:w-2/3">
            <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-orange-200 overflow-hidden">
              {/* Featured Image */}
              <div className="relative aspect-video md:aspect-[21/9] overflow-hidden">
                <Image
                  src={getImageUrl(post.photo)}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/blog-placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <div className="flex items-center space-x-2 text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-orange-300">
                    <span>🖼️</span>
                    <span>Sacred Visual</span>
                  </div>
                </div>
              </div>

              {/* Complete HTML Content */}
              <div className="p-8 md:p-10 lg:p-12">
                {renderHtmlContent(completeHtmlContent)}
              </div>
            </article>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
              <button 
                onClick={() => router.push('/blog')}
                className="flex items-center space-x-3 text-orange-600 hover:text-orange-700 transition-all duration-300 font-bold text-lg group bg-white/80 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl border-2 border-orange-200 hover:border-orange-300"
              >
                <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
                <span>Back to Spiritual Blog</span>
              </button>
              
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-xl hover:shadow-2xl font-bold text-lg group border-2 border-orange-400"
              >
                <span>Back to Top</span>
                <span className="text-2xl group-hover:-translate-y-1 transition-transform">↑</span>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="space-y-8 sticky top-8">
              {/* Author Bio */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
                <h3 className="font-bold text-orange-800 mb-6 text-2xl flex items-center">
                  <span className="text-orange-500 mr-3 text-2xl">🕉️</span>
                  Spiritual Guide
                </h3>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border-2 border-orange-400">
                    {authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-800 text-xl">{authorName}</h4>
                    <p className="text-orange-600 font-semibold">Spiritual Mentor</p>
                  </div>
                </div>
                <p className="text-orange-700 text-base leading-relaxed font-medium bg-orange-50/50 p-4 rounded-2xl border-l-4 border-orange-500">
                  Dedicated to sharing ancient Vedic wisdom and spiritual insights that transform modern living through mindfulness and self-realization.
                </p>
              </div>

              {/* Recent Posts Widget */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-orange-200">
                <h3 className="font-bold text-orange-800 mb-6 text-2xl flex items-center">
                  <span className="text-orange-500 mr-3 text-2xl">📚</span>
                  More Spiritual Wisdom
                </h3>
                <div className="space-y-4">
                  {recentPosts.slice(0, 5).map(recentPost => (
                    <Link
                      key={recentPost.id}
                      href={`/blog/${recentPost.slug}`}
                      className="flex items-center space-x-4 group p-4 rounded-2xl hover:bg-orange-50/80 transition-all duration-300 border-2 border-transparent hover:border-orange-200 shadow-sm hover:shadow-md bg-white/50"
                    >
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-md border-2 border-orange-200">
                        <Image
                          src={getImageUrl(recentPost.photo)}
                          alt={recentPost.title}
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
                        <h4 className="font-semibold text-orange-800 group-hover:text-orange-700 transition-colors line-clamp-2 text-base leading-tight mb-1">
                          {recentPost.title}
                        </h4>
                        <p className="text-orange-600 text-sm font-medium">
                          {formatDate(recentPost.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Widget */}
              <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden border-2 border-amber-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/20 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-300/20 rounded-full translate-y-8 -translate-x-8"></div>
                
                {/* Rudraksha Icon */}
                <div className="absolute top-4 left-4 text-4xl opacity-20 text-white">📿</div>
                
                <div className="relative z-10">
                  <h3 className="font-bold mb-4 text-2xl text-white">Continue Your Journey</h3>
                  <p className="text-orange-100 mb-6 text-base leading-relaxed font-medium">
                    Receive weekly spiritual insights, ancient Vedic wisdom, and mindfulness practices directly in your inbox.
                  </p>
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Enter your email address..."
                      className="w-full px-5 py-4 rounded-2xl bg-white/20 border-2 border-orange-300 text-white placeholder-orange-200 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent backdrop-blur-sm font-medium text-base"
                    />
                    <button className="w-full bg-white text-orange-600 py-4 rounded-2xl font-bold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg border-2 border-white">
                      Subscribe for Wisdom
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add share functions */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function shareOnFacebook() {
              const url = window.location.href;
              const title = "${post.title}";
              window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&quote=' + encodeURIComponent(title), '_blank');
            }
            
            function shareOnTwitter() {
              const url = window.location.href;
              const title = "${post.title}";
              window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodeURIComponent(url), '_blank');
            }
            
            function shareOnLinkedIn() {
              const url = window.location.href;
              window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url), '_blank');
            }
            
            function shareOnWhatsApp() {
              const url = window.location.href;
              const title = "${post.title}";
              window.open('https://wa.me/?text=' + encodeURIComponent(title + ' ' + url), '_blank');
            }
            
            function shareOnPinterest() {
              const url = window.location.href;
              const title = "${post.title}";
              const media = "${post.photo ? getImageUrl(post.photo) : ''}";
              window.open('https://pinterest.com/pin/create/button/?url=' + encodeURIComponent(url) + '&description=' + encodeURIComponent(title) + '&media=' + encodeURIComponent(media), '_blank');
            }
          `,
        }}
      />
    </div>
  );
}