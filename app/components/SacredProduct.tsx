"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { useRouter } from 'next/navigation';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

export default function SacredCollection({ products = [], categories = [] }) {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  console.log(products);

  

  // Filter categories to show only those with main_category "rudraksha_accessories"
  const filteredCategories = categories.filter(cat => 
    cat.main_category === "rudraksha_accessories"
  );

  // Mock category data for the brand slider (only if no filtered categories exist)
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
  // {
  //   id: 8,
  //   title: "8 Mukhi",
  //   slug: "8-mukhi",
  //   photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/8_mukhi.png",
  // },
  // {
  //   id: 9,
  //   title: "9 Mukhi",
  //   slug: "9-mukhi",
  //   photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/9_mukhi.png",
  // },
  // {
  //   id: 10,
  //   title: "10 Mukhi",
  //   slug: "10-mukhi",
  //   photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/10_mukhi.png",
  // },
  // {
  //   id: 11,
  //   title: "11 Mukhi",
  //   slug: "11-mukhi",
  //   photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/11_mukhi.png",
  // },
  // {
  //   id: 12,
  //   title: "12 Mukhi",
  //   slug: "12-mukhi",
  //   photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/12_mukhi.png",
  // },
  // {
  //   id: 13,
  //   title: "13 Mukhi",
  //   slug: "13-mukhi",
  //   photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/13_mukhi.png",
  // },
  // {
  //   id: 14,
  //   title: "14 Mukhi",
  //   slug: "14-mukhi",
  //   photo: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/14_mukhi.png",
  // }
];


  // Use filtered categories or mock data
  const brandCategories = filteredCategories.length > 0 ? filteredCategories : mockBrandCategories;

  const defaultProducts = [
    {
      id: 1,
      name: "Jap Mala 108 beads (5mm)",
      image: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/5%20mm%20mala.jpeg",
      discount: "50% Off",
      price: "₹499.00",
      originalPrice: "₹999.00",
      category: "Jap Malas",
    },
  ];

  const defaultCategories = [
    "All",
    "Jap Malas",
    "Ganesh",
    "Siddhi Mala",
    "1 Mukhi",
    "2 Mukhi",
    "Rudraksha"
  ];

  // Use provided or fallback
  const productList = products.length > 0 ? products : defaultProducts;
  
  // Create category list from brandCategories for the filter buttons
  const categoryList = [
    { title: "All" },
    ...brandCategories.map(cat => ({ title: cat.title })),{ title: "Rudraksha" }
  ];

  // Also create a fallback category list if brandCategories is empty
  const fallbackCategoryList = 
    categories.length > 0
      ? [{ title: "All" }, ...categories.map(cat => ({ title: cat.title })),{ title: "Rudraksha" }]
      : defaultCategories.map((cat) => ({ title: cat }));

  // Use brandCategories-based list or fallback
  const finalCategoryList = categoryList.length > 1 ? categoryList : fallbackCategoryList;

  // Format product data
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

    if (
      productImage &&
      !productImage.startsWith("http") &&
      !productImage.startsWith("//")
    ) {
      productImage = `https://www.pashupatinathrudraksh.com${productImage.startsWith("/") ? "" : "/"
        }${productImage}`;
    }

    return {
      id: product.id,
      name: (product.title || product.name || "").length > 20
        ? (product.title || product.name || "").substring(0, 18) + "..."
        : (product.title || product.name || ""),
      image: productImage,
      discount: product.discount ? `${product.discount}% Off` : product.discount,
      price: product.price
        ? `₹${Number(product.price).toFixed(2)}`
        : product.price,
      originalPrice:
        product.originalPrice ||
        (product.price ? `₹${Number(product.price).toFixed(2)}` : ""),
      category: product.cat_title || product.category,
    };
  });

  const filteredProducts =
    selectedCategory === "All"
      ? formattedProducts
      : formattedProducts.filter(
        (product) => product.category === selectedCategory
      );

  const addToCart = (product: any) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const handleCategoryClick = (categoryTitle: string) => {
    // setSelectedCategory(categoryTitle);
    // // Scroll to products section
    // setTimeout(() => {
    //   const productsSection = document.getElementById('products-section');
    //   if (productsSection) {
    //     productsSection.scrollIntoView({ behavior: 'smooth' });
    //   }
    // }, 100);
     router.push(`/products?title=${categoryTitle}`);
  };

  

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      setIsScrolling(true);
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      setIsScrolling(true);
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(() => setIsScrolling(false), 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Premium Brand Slider Section */}
      <section className="relative py-16 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/400')] bg-cover bg-center opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full mb-3">
              Rudraksha
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#5F3623] mb-4">
              Explore Divine Collections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover handcrafted spiritual products that bring peace, positivity and divine energy to your life
            </p>
          </div>

          {/* Enhanced Swiper Container */}
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
                320: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                480: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                },
              }}
              className="premium-swiper"
            >
              {mockBrandCategories.map((cat, index) => (
                <SwiperSlide key={cat.id || index}>
                  {/* Compact design with title integrated in image */}
                  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-amber-300 mx-2 my-4 p-2">

                    {/* Combined image and title container */}
                    <div
                      className="relative h-52 rounded-xl overflow-hidden cursor-pointer"
                      onClick={() => handleCategoryClick(cat.title)}
                    >
                      {/* Background image container */}
                      <div className="relative w-full h-40 bg-gradient-to-br from-amber-50 to-orange-100">
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <Image
                            src={cat.photo || "/placeholder-category.jpg"}
                            alt={cat.title}
                            width={100}
                            height={100}
                            className="object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLElement;
                              (target as any).style.display = "none";
                            }}
                          />
                        </div>
                      </div>

                      {/* Title section below image */}
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-white flex items-center justify-center border-t border-amber-100">
                        <h3 className="font-bold text-md text-[#5F3623] text-center group-hover:text-amber-600 transition-colors">
                          {cat.title}
                        </h3>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors duration-300"></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Premium Navigation Buttons */}
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

          {/* Enhanced Category Filter - Always scrollable */}
          <div className="mb-12 relative">
           

            <div
              ref={scrollContainerRef}
              className="flex space-x-3 pb-4 overflow-x-auto scrollbar-hide scroll-smooth w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {finalCategoryList.map((category, index) => (
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
                  {/* Active indicator */}
                  {selectedCategory === category.title && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                  )}

                  {/* Content */}
                  <span className="relative z-10 font-medium flex items-center text-sm md:text-base">
                    {category.title}
                    {selectedCategory === category.title && (
                      <svg className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
            
          </div>

          {/* Product Grid - Always 2 columns on mobile and smaller screens */}
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-amber-100 group"
              >
                {/* Product Image */}
                <div className="relative h-40 sm:h-60 md:h-72 lg:h-80 overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLElement;
                        (target as any).style.display = "none";
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
                  {product.discount && (
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-sm font-bold py-1 px-2 sm:py-2 sm:px-3 rounded-full shadow-lg">
                      {product.discount}
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg text-amber-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
                    {product.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-center mb-3 sm:mb-4">
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                      {product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-gray-500 line-through text-xs sm:text-base">
                        {product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group/btn text-xs sm:text-sm"
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
                    Add to cart
                  </button>
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
        @media (max-width: 475px) {
          .grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        .min-w-max {
          min-width: max-content;
        }
      `}</style>
    </div>
  );
}