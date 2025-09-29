"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function BlogSlider({ homeData = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  //console.log(homeData);

  // Use homeData if available, otherwise fallback to sample data
  const blogPosts = homeData && homeData.length > 0 ? homeData : [
    {
      id: 1,
      title: "The Spiritual Significance of Rudraksha",
      excerpt: "Discover how Rudraksha beads can enhance your spiritual practice and bring positive energy into your life.",
      date: "May 15, 2023",
      category: "Spirituality",
      photo: "/placeholder-blog-1.jpg"
    },
    {
      id: 2,
      title: "How to Choose the Right Rudraksha for You",
      excerpt: "A comprehensive guide to selecting the perfect Rudraksha based on your needs and astrological chart.",
      date: "June 2, 2023",
      category: "Guide",
      photo: "/placeholder-blog-2.jpg"
    },
    {
      id: 3,
      title: "The History of Rudraksha in Ancient Texts",
      excerpt: "Explore references to Rudraksha in ancient scriptures and their significance throughout history.",
      date: "June 18, 2023",
      category: "History",
      photo: "/placeholder-blog-3.jpg"
    },
    {
      id: 4,
      title: "Meditation Techniques with Rudraksha",
      excerpt: "Learn powerful meditation techniques that incorporate Rudraksha beads for deeper spiritual connection.",
      date: "July 5, 2023",
      category: "Meditation",
      photo: "/placeholder-blog-4.jpg"
    },
    {
      id: 5,
      title: "Scientific Benefits of Wearing Rudraksha",
      excerpt: "Discover what modern science says about the benefits of wearing Rudraksha beads.",
      date: "July 22, 2023",
      category: "Science",
      photo: "/placeholder-blog-5.jpg"
    },
    {
      id: 6,
      title: "Caring for Your Rudraksha Beads",
      excerpt: "Essential tips for cleaning, maintaining, and preserving the energy of your Rudraksha beads.",
      date: "August 10, 2023",
      category: "Care",
      photo: "/placeholder-blog-6.jpg"
    }
  ];

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
              <div key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
                    {post.excerpt || 'No excerpt available.'}
                  </p>
                  <button className="text-[#f5821f] font-semibold flex items-center hover:text-[#5F3623] transition-colors">
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
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