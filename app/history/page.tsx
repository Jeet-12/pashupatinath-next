"use client";

import Image from 'next/image';
import FeaturesSection from '../components/FeaturesSection';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Enhanced Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-[#5F3623] via-[#7a3d1f] to-[#8B4513] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/550x270.png"
            alt="Rudraksha beads close up"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#5F3623]/90 to-[#8B4513]/80 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  Our Sacred 
                  <span className="block bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">
                    Mission
                  </span>
                </h1>
                <p className="text-xl md:text-2xl opacity-95 mb-8 leading-relaxed">
                  Bringing Authentic Spiritual Power Back to the People Through Generations of Tradition
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Explore Collection
                  </button>
                  <button className="border-2 border-amber-300 hover:bg-amber-300/10 text-amber-300 font-semibold py-3 px-8 rounded-xl transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
              
              <div className="relative h-80 lg:h-96 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/450x560.png"
                  alt="Traditional rudraksha beads"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5F3623]/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-amber-50 to-transparent z-10"></div>
      </section>

      {/* Enhanced Introduction Section */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/aboutUs_3rd.png"
                  alt="Traditional rudraksha beads"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#5F3623]/20 to-transparent"></div>
              </div>
              
              <div>
                <div className="inline-block bg-gradient-to-r from-[#5F3623] to-[#f5821f] text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
                  Our Heritage
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#5F3623] mb-6">
                  More Than Just Beads - A Divine Connection
                </h2>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                  Rudraksha is not just a bead. It is our inheritance, our protection, and our connection to Lord Shiva — a sacred energy passed down through generations in our family and across India.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  For centuries, our ancestors adorned themselves with Rudraksha, trusting in its divine power to bring peace, health, and spiritual growth.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-l-4 border-[#f5821f]">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Even Lord Shiva himself, the embodiment of meditation and destruction of ignorance, wears Rudraksha — a symbol of purity and transcendence that guides us toward spiritual enlightenment.
                  </p>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 relative h-64 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/550x270.png"
                  alt="Lord Shiva with rudraksha"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5F3623]/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white font-semibold">
                  Divine Inspiration
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Problem Section */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-100 rounded-full opacity-50"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block bg-red-100 text-red-800 px-6 py-2 rounded-full text-sm font-semibold mb-4">
              Urgent Alert
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#5F3623] mb-4">
              The Sacred Crisis We Address
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Protecting spiritual seekers from fraud and preserving the sanctity of authentic Rudraksha
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <p className="text-lg text-gray-700">
                  Today, more awareness around Rudraksha has spread, which is beautiful. But with it has come a flood of fraudulent products and misinformation.
                </p>
              </div>
              
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg">
                <p className="text-lg text-gray-700">
                  At the recent Kumbh Mela, over <span className="font-bold text-red-600">₹100 crores</span> worth of fake Rudraksha was sold — misguiding seekers and dishonoring the sacred.
                </p>
              </div>
              
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                <p className="text-lg text-gray-700">
                  Sadly, many people can't tell the difference between real and fake. Authentic Nepalese Rudraksha holds far more spiritual potency than imitations.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/450x560.png"
                  alt="Comparison of real and fake rudraksha beads"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Authenticity Matters</h3>
                  <p className="text-amber-200">Protecting spiritual seekers from fraud</p>
                </div>
              </div>
              
              {/* Floating certification badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-2xl p-4 border-2 border-amber-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Certified</span>
                  <span className="block text-xs text-gray-500">Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Divine Purpose Section */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#5F3623] mb-4">
              Our Divine Purpose
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A mission rooted in spirituality, authenticity, and service
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#5F3623] to-[#8B4513] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full"></div>
            
            <div className="relative z-10">
              <p className="text-2xl md:text-3xl font-semibold text-center mb-8 text-amber-100">
                At Pashupatinath Rudraksh Private Limited, our mission is crystal clear:
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
                <p className="text-xl md:text-2xl text-center font-medium">
                  To bring pure, powerful, and authentic Rudraksha from Nepal into the hands of genuine seekers, backed by science, certified by top gem labs, and guided by tradition.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {[
                  "We personally source every bead from trusted growers in Nepal",
                  "Each Rudraksha is tested and certified in recognized Indian gemological labs",
                  "Ensuring quality, size, and energy in every bead",
                  "Giving our customers peace of mind and spiritual assurance"
                ].map((item, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="bg-amber-500 rounded-full p-3 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-lg group-hover:text-amber-200 transition-colors duration-300">{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="relative h-80 rounded-2xl overflow-hidden">
                <Image
                  src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/41/aboutUs_3rd.png"
                  alt="Sourcing rudraksha from Nepal"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5F3623]/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">Direct from Nepal's Sacred Forests</h3>
                  <p className="text-amber-200">Pure, potent, and authentic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#5F3623] via-[#7a3d1f] to-[#8B4513] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Begin Your Spiritual Journey
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 leading-relaxed">
            Discover authentic, certified Rudraksha beads sourced directly from Nepal's sacred forests
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg">
              Explore Sacred Collection
            </button>
            <button className="border-2 border-amber-300 hover:bg-amber-300/20 text-amber-300 font-semibold py-4 px-12 rounded-xl transition-all duration-300 text-lg">
              Consult Our Experts
            </button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🔍", text: "100% Certified Authentic" },
              { icon: "🌿", text: "Direct from Nepal" },
              { icon: "🙏", text: "Spiritual Guidance" }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-semibold">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection/>
    </div>
  );
}