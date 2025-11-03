"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Define the expected type for a single blog post based on your data structure
interface BlogPost {
  id: number;
  title: string;
  description: string;
  summary: string;
  quote: string;
  photo: string;
  slug: string;
  post_cat_id: number;
  post_tag_id: number | null;
  tags: string;
  status: string;
  added_by: number;
  created_at: string;
  updated_at: string;
}

// Define the props type
interface BlogSliderProps {
    homeData?: BlogPost[];
}

export default function BlogSlider({ homeData = [] }: BlogSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  // Transform the incoming data to match our component's needs
  const transformBlogData = (data: BlogPost[]) => {
    return data.map(post => ({
      id: post.id,
      title: post.title || 'Untitled Post',
      excerpt: extractExcerpt(post),
      date: formatDate(post.created_at),
      category: getCategoryName(post.post_cat_id),
      photo: post.photo
    }));
  };

  // Helper function to extract excerpt from available content
  const extractExcerpt = (post: BlogPost): string => {
    // Try description first, then summary, then quote
    const content = post.description || post.summary || post.quote || '';
    
    // Remove HTML tags and limit length
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return 'No date';
    }
  };

  // Helper function to get category name from ID
  const getCategoryName = (categoryId: number): string => {
    const categories: { [key: number]: string } = {
      1: 'Spirituality',
      2: 'Zodiac',
      3: 'Rudraksha',
      4: 'Meditation',
      // Add more categories as needed
    };
    return categories[categoryId] || 'Uncategorized';
  };

  // Use homeData if available, otherwise fallback to sample data
  const rawBlogPosts: BlogPost[] = homeData && homeData.length > 0 ? homeData : [
    {
      id: 5,
      title: "Rudraksha According to Your Rashi (Zodiac Sign) 2025 - Complete Buying Guide",
      description: "<p></p><p><span style=\"font-weight: bolder; font",
      summary: "<h4 style=\"margin-right: 0px; margin-bottom: 0px; margin-left: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-size-adjust: none; font-kerning: auto; font-optical-sizing: auto; font-feature-settings: normal; font-variation-settings: normal; font-variant-position: normal; font-variant-emoji: normal; font-stretch: normal; font-size: 11.5px; line-height: normal; font-family: Helvetica;\" class=\"\"><span style=\"font-weight: bolder;\"><span style=\"font-family: Arial;\">Rudraksha beads create electromagnetic&nbsp;</span><span style=\"font-family: Arial;\">fields that interact with your body's bioelectric&nbsp;</span><span style=\"font-family: Arial;\">field. When matched with your zodiac sign's ruling planet, this creates a harmonious resonance. Know what you should wear as per ypur zodiac sign.</span></span></h4><div><span style=\"font-weight: bolder;\"><span style=\"font-family: &quot;Times New Roman&quot;;\"><br></span></span></div>",
      quote: "<p><b style=\"font-family: Helvetica; font-size: 18px;\">रु</b><span style=\"font-family: Helvetica; font-size: 18px;\">द्रा</span><b style=\"font-family: Helvetica; font-size: 18px;\">क्ष </b><span style=\"font-family: Helvetica; font-size: 18px;\">राशि&nbsp;</span><b style=\"font-family: Helvetica; font-size: 18px;\">अ</b><span style=\"font-family: Helvetica; font-size: 18px;\">नुसा</span><b style=\"font-family: Helvetica; font-size: 18px;\">र - आप&nbsp;</b><span style=\"font-family: Helvetica; font-size: 18px;\">की राशि के लि</span><b style=\"font-family: Helvetica; font-size: 18px;\">ए </b><span style=\"font-family: Helvetica; font-size: 18px;\">कौ</span><b style=\"font-family: Helvetica; font-size: 18px;\">न </b><span style=\"font-family: Helvetica; font-size: 18px;\">सा&nbsp;</span><b style=\"font-family: Helvetica; font-size: 18px;\">रु</b><span style=\"font-family: Helvetica; font-size: 18px;\">द्रा</span><b style=\"font-family: Helvetica; font-size: 18px;\">क्ष पह</b><span style=\"font-family: Helvetica; font-size: 18px;\">नें |</span></p>",
      photo: "/storage/app/public/files/2/ZODIAC SIGN BLOG.png",
      slug: "rudraksha-according-to-your-rashi-zodiac-sign-2025-complete-buying-guide",
      post_cat_id: 2,
      post_tag_id: null,
      tags: "Rudraksh",
      status: "active",
      added_by: 36,
      created_at: "2025-09-16T13:33:06.000000Z",
      updated_at: "2025-09-19T11:56:53.000000Z"
    }
  ];

  const blogPosts = transformBlogData(rawBlogPosts);

  // Number of cards to show at once
  const cardsToShow = 2;
  const totalSlides = Math.ceil(blogPosts.length / cardsToShow);

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [totalSlides, blogPosts.length]);

  // Get current slide posts
  const getCurrentSlidePosts = () => {
    const startIndex = currentIndex * cardsToShow;
    return blogPosts.slice(startIndex, startIndex + cardsToShow);
  };

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Function to get complete image URL
  const getImageUrl = (imagePath: string | undefined): string => {
    if (!imagePath) return '/placeholder-blog.jpg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const domain = 'https://www.pashupatinathrudraksh.com';
    return `${domain}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
  };

  // FIX: Update navigateToBlog to accept an optional ID for specific post navigation
  const navigateToBlog = (id?: number) => {
    if (id) {
      // Navigate to the specific blog post using slug
      const post = rawBlogPosts.find(p => p.id === id);
      if (post && post.slug) {
        router.push(`/blog/${post.slug}`);
      } else {
        router.push('/blog');
      }
    } else {
      // Navigate to the main blog page
      router.push('/blog');
    }
  };

  // If no blog posts available, don't render the component
  if (!blogPosts || blogPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5F3623] mb-4">
            Latest From Blog
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover spiritual insights, Rudraksha knowledge, and ancient wisdom from our blog.
          </p>
        </div>

        {/* Blog Slider Container */}
        <div className="max-w-6xl mx-auto">
          {/* Blog Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {getCurrentSlidePosts().map((post) => (
              <div 
                key={post.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigateToBlog(post.id)}
              >
                <div className="h-48 bg-gradient-to-r from-amber-100 to-orange-100 relative overflow-hidden">
                  {post.photo ? (
                    <Image
                      src={getImageUrl(post.photo)}
                      alt={post.title || 'Blog post image'}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold text-[#f5821f] uppercase tracking-wider">
                      {post.category || 'Uncategorized'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {post.date || 'No date'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#5F3623] mb-3 line-clamp-2">
                    {post.title || 'Untitled Post'}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <button 
                    className="text-[#f5821f] font-semibold flex items-center hover:text-[#5F3623] transition-colors"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      navigateToBlog(post.id);
                    }}
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Blogs Button */}
          <div className="text-center mb-10">
            <button
              onClick={() => navigateToBlog()} // Calls navigateToBlog()
              className="bg-[#f5821f] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5F3623] transition-colors shadow-md hover:shadow-lg"
            >
              View All Blog Posts
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full mx-1 transition-all ${
                  index === currentIndex ? 'w-8 bg-[#f5821f]' : 'w-3 bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}