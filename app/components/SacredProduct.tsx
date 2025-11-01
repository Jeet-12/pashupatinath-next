"use client";

import Image from 'next/image';
import { useState, useRef } from 'react';
import { singleAddToCart, addToWishlistApiWithNotify } from '../libs/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

interface Category {
  id: number;
  title: string;
  slug?: string;
  photo?: string;
  main_category?: string;
}

interface SacredCollectionProps {
  products?: any[];
  categories?: Category[];
}

export default function SacredCollection({ products = [], categories = [] }: SacredCollectionProps) {
  const [cart, setCart] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [_isScrolling, _setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredCategories = categories.filter(cat => 
    cat.main_category === "rudraksha_accessories"
  );

  const mockBrandCategories = [
    {
      id: 1,
      title: "1 Mukhi",
      slug: "1-mukhi",
      photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/1%20mukhi.png",
    },
    {
      id: 2,
      title: "2 Mukhi",
      slug: "2-mukhi",
      photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/2_mukhi.png",
    },
    {
      id: 3,
      title: "3 Mukhi",
      slug: "3-mukhi",
      photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/3_mukhi.png",
    },
    {
      id: 4,
      title: "4 Mukhi",
      slug: "4-mukhi",
      photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/4_mukhi.jpeg",
    },
    {
      id: 5,
      title: "5 Mukhi",
      slug: "5-mukhi",
      photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/5%20mukhi.png",
    },
    {
      id: 6,
      title: "6 Mukhi",
      slug: "6-mukhi",
      photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/6%20mukhi.png",
    },
    {
      id: 7,
      title: "7 Mukhi",
      slug: "7-mukhi",
      photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/7%20mukhi.png",
    },
  ];

  const brandCategories = filteredCategories.length > 0 ? filteredCategories : mockBrandCategories;

  const defaultProducts = [
    {
      id: 1,
      name: "Jap Mala 108 beads (5mm)",
      image: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/5%20mm%20mala.jpeg",
      price: 499.00,
      originalPrice: 999.00,
      category: "Jap Malas",
      slug: "jap-mala-108-beads-5mm"
    },
  ];

  const defaultCategories = [
    { title: "All", slug: "all" },
    { title: "Jap Malas", slug: "jap-malas" },
    { title: "Ganesh", slug: "ganesh" },
    { title: "Siddhi Mala", slug: "siddhi-mala" },
    { title: "1 Mukhi", slug: "1-mukhi" },
    { title: "2 Mukhi", slug: "2-mukhi" },
    { title: "Rudraksha", slug: "rudraksha" }
  ];

  const productList = products.length > 0 ? products : defaultProducts;
  
  // Create category list with proper slugs
  const categoryList = [
    { title: "All", slug: "all" },
    ...brandCategories.map(cat => ({ 
      title: cat.title, 
      slug: cat.slug || cat.title.toLowerCase().replace(/\s+/g, '-') 
    })),
    { title: "Rudraksha", slug: "rudraksha" }
  ];

  const fallbackCategoryList = 
    categories.length > 0
      ? [
          { title: "All", slug: "all" }, 
          ...categories.map(cat => ({ 
            title: cat.title, 
            slug: cat.slug || cat.title.toLowerCase().replace(/\s+/g, '-') 
          })), 
          { title: "Rudraksha", slug: "rudraksha" }
        ]
      : defaultCategories;

  const finalCategoryList = categoryList.length > 1 ? categoryList : fallbackCategoryList;

  // Function to format price with Indian Rupee symbol
  const formatPrice = (price: number): string => {
    return `₹${price.toFixed(2)}`;
  };

  // Function to get image URL with proper fallback
  const getImageUrl = (image: string | undefined): string => {
    if (!image) return "/placeholder-category.jpg";
    
    if (image.startsWith("http")) {
      return image;
    }
    
    return `https://www.pashupatinathrudraksh.com${image.startsWith("/") ? "" : "/"}${image}`;
  };

  // Format product data with proper pricing
  const formattedProducts = productList.map((product: any) => {
    let productImage = "";

    if (Array.isArray(product.images) && product.images.length > 0) {
      productImage = product.images[0];
    } else if (Array.isArray(product.photos) && product.photos.length > 0) {
      productImage = product.photos[0];
    } else if (typeof product.photo === "string") {
      productImage = product.photo.split(",")[0].trim();
    } else if (typeof product.image === "string") {
      productImage = product.image.split(",")[0].trim();
    }

    if (productImage && !productImage.startsWith("http") && !productImage.startsWith("//")) {
      productImage = `https://www.pashupatinathrudraksh.com${productImage.startsWith("/") ? "" : "/"}${productImage}`;
    }

    // Generate slug from title/name if not provided
    const productSlug = product.slug || 
                       (product.title || product.name || "")
                         .toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/(^-|-$)+/g, '');

    // Parse prices from API (string or number safe)
    const apiPrice = typeof product.price === "string"
      ? parseFloat(product.price.replace(/[^\d.]/g, ""))
      : Number(product.price) || 0;

    // If backend already sends final price (sometimes called selling_price / discounted_price),
    // prefer it, otherwise calculate from discount
    let discountedPrice = apiPrice;
    if (product.finalPrice) {
      discountedPrice = typeof product.finalPrice === "string"
        ? parseFloat(product.finalPrice.replace(/[^\d.]/g, ""))
        : Number(product.finalPrice) || apiPrice;
    } else if (product.discount && product.discount > 0) {
      discountedPrice = apiPrice - (apiPrice * product.discount) / 100;
    }

    // Calculate discount % only if discount actually exists
    const discountPercentage =
      apiPrice > 0 && discountedPrice < apiPrice
        ? Math.round(((apiPrice - discountedPrice) / apiPrice) * 100)
        : 0;

    return {
      id: product.id,
      name: (product.title || product.name || "").length > 20
        ? (product.title || product.name || "").substring(0, 18) + "..."
        : (product.title || product.name || ""),
      image: productImage,
      price: discountedPrice,          
      originalPrice: apiPrice,   
      discountPercentage,
      category: product.cat_title || product.category,
      slug: productSlug,
    };
  });

  const filteredProducts = selectedCategory === "All"
    ? formattedProducts
    : formattedProducts.filter((product) => product.category === selectedCategory);

  const addToCart = async (product: any) => {
    // Optimistic UI update
    setCart(prev => [...prev, product]);
    try {
      const resp = await singleAddToCart({ slug: product.slug, quantity: 1, total_price: product.price });
        if (!resp.success) {
          // Optionally revert UI or notify
          // For now, just alert
          // alert(resp.message || 'Failed to add to cart');
        } else {
          try { window.dispatchEvent(new CustomEvent('countsUpdated')); } catch {}
        }
    } catch {
      // ignore
    }
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        // fire backend call and notify
        (async () => {
          try {
            await addToWishlistApiWithNotify({ product_id: productId });
          } catch {
            // ignore
          }
        })();
        return [...prev, productId];
      }
    });
  };

  // Updated function to handle category click with slug
  const handleCategoryClick = (categoryTitle: string) => {
    // Find the category in finalCategoryList to get the slug
    const category = finalCategoryList.find(cat => cat.title === categoryTitle);
    const categorySlug = category?.slug || categoryTitle.toLowerCase().replace(/\s+/g, '-');
   if (categoryTitle === "Rudraksha") {
    router.push(`/products?main-category=${categorySlug}`);
   }else {
      router.push(`/products?category=${categorySlug}`);
   }
    // Navigate to products page with category slug
  
  };

  // Function to handle collection click
  const handleCollectionClick = (collectionSlug: string) => {
    
    
    router.push(`/products?category=${collectionSlug}`);
  };

  const handleProductClick = (productSlug: string) => {
    router.push(`/product-details/${productSlug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Divine Collections Section - Using Your Design */}
      <section className="relative py-16 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full mb-3">
              Collections
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#5F3623] mb-4">
              Explore Divine Collections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated spiritual collections designed to enhance your spiritual journey
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: '.premium-swiper-next',
                prevEl: '.premium-swiper-prev',
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              loop={true}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 15 },
                480: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 25 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
                1280: { slidesPerView: 5, spaceBetween: 30 },
              }}
              className="premium-swiper"
            >
              {mockBrandCategories.map((cat) => (
                <SwiperSlide key={cat.id}>
                  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-amber-300 mx-2 my-4 p-2">
                    <div
                      className="relative h-52 rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => handleCollectionClick(cat.slug || cat.title.toLowerCase().replace(/\s+/g, '-'))}
                    >
                      <div className="relative w-full h-40 bg-gradient-to-br from-amber-50 to-orange-100">
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <Image
                            src={getImageUrl(cat.photo)}
                            alt={cat.title}
                            width={100}
                            height={100}
                            className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white flex items-center justify-center border-t border-amber-100">
                        <h3 className="font-bold text-md text-[#5F3623] text-center group-hover:text-amber-600 transition-colors">
                          {cat.title}
                        </h3>
                      </div>
                      <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-300"></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="premium-swiper-prev absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group">
              <span className="sr-only">Previous</span>
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600 group-hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </button>

            <button className="premium-swiper-next absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group">
              <span className="sr-only">Next</span>
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600 group-hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <div id="products-section" className="py-16">
        <div className="container mx-auto px-4 w-full lg:w-4/5">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#5F3623] mb-4">
              Sacred Collection
            </h1>
            <p className="text-gray-600 text-lg">Discover our handcrafted spiritual products</p>
          </div>

          <div className="mb-12 relative">
            <div
              ref={scrollContainerRef}
              className="flex space-x-3 pb-4 overflow-x-auto scrollbar-hide scroll-smooth w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {finalCategoryList.map((category) => (
                <button
                  key={category.title}
                  onClick={() => handleCategoryClick(category.title)}
                  className={`
                    flex-shrink-0 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-300 transform hover:scale-105
                    ${selectedCategory === category.title
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200"
                      : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200 hover:border-amber-300"
                    }
                    relative overflow-hidden group min-w-max
                  `}
                >
                  {selectedCategory === category.title && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                  )}
                  <span className="relative z-10 font-medium flex items-center text-sm md:text-base">
                    {category.title}
                    {selectedCategory === category.title && (
                      <svg className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid with Links and Wishlist */}
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-100 group relative"
              >
                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
                  aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <svg
                    className={`w-4 h-4 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                    fill={wishlist.includes(product.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>

                {/* Product Image with Link */}
                <div 
                  className="relative h-40 sm:h-60 md:h-72 lg:h-80 overflow-hidden cursor-pointer"
                  onClick={() => handleProductClick(product.slug)}
                >
                  {product.image ? (
                    <Image
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 sm:w-16 sm:h-16 text-amber-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-sm font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-full shadow-lg">
                      {product.discountPercentage}% OFF
                    </div>
                  )}

                  {/* View Details Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white text-sm font-medium py-2 px-4 rounded-lg">
                      View Details
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                  {/* Product Name with Link */}
                  <h3 
                    className="font-semibold text-sm sm:text-base md:text-lg text-amber-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors cursor-pointer"
                    onClick={() => handleProductClick(product.slug)}
                  >
                    {product.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex flex-col mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      {product.discountPercentage > 0 && product.originalPrice > 0 && (
                        <span className="text-gray-500 line-through text-xs sm:text-base">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleProductClick(product.slug)}
                      className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group/btn text-xs sm:text-sm"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2 group-hover/btn:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Details
                    </button>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group/btn text-xs sm:text-sm"
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2 group-hover/btn:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg
                  className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">
                No products found
              </h3>
              <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">Try selecting a different category</p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-2 px-4 sm:py-2 sm:px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 text-sm sm:text-base"
              >
                Show All Products
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @media (max-inline-size: 475px) {
          .grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        .min-w-max {
          min-inline-size: max-content;
        }
      `}</style>
    </div>
  );
}