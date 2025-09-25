"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function SacredCollections() {
  const collections = [
    {
      id: 1,
      title: "Rudraksha Collection",
      description: "100% Authentic Rudraksha sourced directly from Nepal.",
      image: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/Verified sourcing from Nepal.png",
      cta: "Explore",
      link: "/rudraksha-collection"
    },
    {
      id: 2,
      title: "Rudraksha Collection",
      description: "Energized and ready-to-wear with Vedic rituals",
      image: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/Energized.png",
      cta: "Explore",
      link: "/energized-rudraksha"
    },
    {
      id: 3,
      title: "Spiritual Bracelets",
      description: "Ethical Lab Tested Rudraksha Malas",
      image: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/3000+ lab-tested Rudraksh.png",
      cta: "Explore",
      link: "/spiritual-bracelets"
    },
    {
      id: 4,
      title: "Spiritual Bracelets",
      description: "Ethical & Spiritual Bracelets",
      image: "https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/Ethical & spiritual certification.png",
      cta: "Explore",
      link: "/ethical-bracelets"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
  {/* Hero Section */}
  <section className="relative py-16 md:py-24 overflow-hidden">
    <div className="container mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row items-center gap-12">
        {/* Left Side - Text Content */}
        <div className="md:w-2/5">
          <h1 className="text-4xl md:text-5xl font-bold text-[#5F3623] mb-6">
            Discover Our Sacred Collections
          </h1>
          <p className="text-xl text-gray-700 mb-10">
            Explore our handcrafted Rudraksha beads and spiritual bracelets, carefully selected for their purity and energy.
          </p>
          <button className="bg-[#f5821f] hover:bg-[#e07a1d] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-lg">
            Shop Collection
          </button>
        </div>
        
        {/* Right Side - Images Grid */}
        <div className="md:w-3/5 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {collections.map((collection) => (
              <div key={collection.id} className="group relative">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-amber-100 h-full flex flex-col">
                  {/* Image container */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/5 to-amber-600/5 z-10"></div>
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 z-20"></div>
                  </div>
                  
                  {/* Content section */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-amber-900 mb-2">{collection.title}</h3>
                    <p className="text-sm text-gray-700 mb-4 flex-grow">{collection.description}</p>
                    
                    <Link 
                      href={collection.link}
                      className="inline-flex items-center text-[#f5821f] font-semibold text-sm hover:text-[#e07a1d] transition-colors group/cta"
                    >
                      {collection.cta}
                      <svg className="w-4 h-4 ml-1 group-hover/cta:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>


      {/* Features Section */}
      {/* <section className="py-16 bg-amber-100/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5F3623] mb-6">
              Why Choose Our Sacred Collections?
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-amber-900 mb-2">Authentic & Blessed</h3>
              <p className="text-gray-600">All our Rudraksha are sourced directly from Nepal and blessed with Vedic rituals</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-amber-900 mb-2">Ethical Certification</h3>
              <p className="text-gray-600">Each piece comes with lab certification ensuring authenticity and ethical sourcing</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg text-amber-900 mb-2">Expert Guidance</h3>
              <p className="text-gray-600">Our spiritual experts help you choose the right Rudraksha for your needs</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      {/* <section className="py-16 bg-amber-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Spiritual Journey Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore our collections and find the perfect Rudraksha to enhance your spiritual practice
          </p>
          <button className="bg-white text-amber-900 font-semibold py-3 px-8 rounded-full hover:bg-amber-100 transition-colors duration-300 shadow-lg">
            Shop All Collections
          </button>
        </div>
      </section> */}
    </div>
  );
}