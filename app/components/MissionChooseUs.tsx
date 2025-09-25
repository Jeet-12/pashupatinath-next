"use client";

import Image from 'next/image';

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#5F3623] mb-6">
              Our Spiritual Mission
            </h1>
            <p className="text-xl text-gray-700">
              Connecting you with the divine energy of authentic Rudraksha beads
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#5F3623] mb-6">
                Our Mission
              </h2>
              <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
              <p className="text-xl text-gray-700 italic">
                "We at Pashupatinath Rudraksh are not just sellers — we are spiritual companions."
              </p>
            </div>
            
            <div className="bg-amber-50 rounded-2xl p-8 md:p-12 shadow-lg border border-amber-100">
              <p className="text-lg text-gray-700 mb-6">
                Our mission is to guide you towards the Rudraksh that aligns with your goals: peace, prosperity, health, or spiritual awakening.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-10">
                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-amber-900 mb-2">Authentic Spiritual Guidance</h3>
                    <p className="text-gray-600">From experienced practitioners who understand the spiritual significance of Rudraksha</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-amber-900 mb-2">Personalized Recommendations</h3>
                    <p className="text-gray-600">Based on your unique needs, goals, and spiritual journey</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-amber-900 mb-2">Ethical Sourcing & Fair Trade</h3>
                    <p className="text-gray-600">Ensuring that our practices honor both people and the planet</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-amber-900 mb-2">Ongoing Spiritual Support</h3>
                    <p className="text-gray-600">We're here for you throughout your spiritual journey with guidance and care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5F3623] mb-4">
              Why Choose Us?
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
            <p className="text-gray-600 max-w-2xl mx-auto mt-6">
              We are committed to providing the most authentic and spiritually potent Rudraksha beads
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-100 flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-6">
                <svg className="w-10 h-10 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-amber-900 mb-3">100% Authentic Sourcing</h3>
              <p className="text-gray-600">
                We directly source from certified farms and suppliers in Nepal — where the most powerful Rudraksh grow naturally at high altitudes.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-100 flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-6">
                <svg className="w-10 h-10 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-amber-900 mb-3">Ethical Lab Certification</h3>
              <p className="text-gray-600">
                Every Rudraksh comes with a third-party authenticity ethical lab certificate, tested by ethical labs.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-100 flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-6">
                <svg className="w-10 h-10 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-amber-900 mb-3">Premium Spiritual Packaging</h3>
              <p className="text-gray-600">
                Premium spiritual Rudraksha packaging blends elegance, tradition, and divine energy for sacred protection and blessings.
              </p>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-amber-100 flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-6">
                <svg className="w-10 h-10 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-xl text-amber-900 mb-3">Expert Guidance</h3>
              <p className="text-gray-600">
                Expert guidance provides deep wisdom, personalized support, and trusted insights for meaningful spiritual growth and transformation.
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Call to Action */}
      {/* <section className="py-16 bg-amber-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Spiritual Journey</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with the divine energy of authentic Rudraksha beads and transform your spiritual practice
          </p>
          <button className="bg-white text-amber-900 font-semibold py-3 px-8 rounded-full hover:bg-amber-100 transition-colors duration-300 shadow-lg">
            Explore Our Collection
          </button>
        </div>
      </section> */}
    </div>
  );
}