"use client";

import { useState } from 'react';

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I choose the right Rudraksh for me?",
      answer: "Choosing the right Rudraksh depends on your spiritual goals, astrological chart, and personal intentions. Our experts can analyze your birth chart and recommend the most suitable Rudraksh based on your planetary positions and life objectives."
    },
    {
      question: "How can I verify the authenticity of my Rudraksh?",
      answer: "Authentic Rudraksh beads have natural contours, pores (known as 'mouths'), and a unique texture. They will float in water or sink very slowly due to their natural density. All our Rudraksh beads come with a certificate of authenticity."
    },
    {
      question: "What's the proper way to wear and care for Rudraksh?",
      answer: "Rudraksh should be worn after purification through chanting and incense. It's best to wear them on Monday or during auspicious times. Clean them regularly with Gangajal or pure water, and avoid exposing them to chemicals or perfumes."
    },
    {
      question: "How long does it take to experience benefits?",
      answer: "The effects of Rudraksh can vary based on individual receptivity and consistency of wear. Some people report feeling calmness immediately, while more profound spiritual benefits may take 40-90 days of regular wear."
    },
    {
      question: "Can I wear multiple Rudraksh together?",
      answer: "Yes, you can wear multiple Rudraksh together, but they should be compatible based on their energies. Some combinations enhance each other's effects, while others might conflict. Our experts can guide you on compatible combinations."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we offer secure international shipping to most countries. All international orders are carefully packaged with proper documentation and tracking. Shipping times vary by destination but typically range from 7-15 business days."
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8" id="faq">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-[#5F3623] to-[#8B4513] bg-clip-text">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent mb-4">
              Frequently Asked Questions
            </h1>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#f5821f] to-[#5F3623] mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Have questions about which Rudraksh is right for you? We're here to guide you on your spiritual journey with expert advice and personalized recommendations.
          </p>
        </div>

        {/* Enhanced FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20"
            >
              <button
                className="w-full flex justify-between items-center p-8 text-left hover:bg-white/50 transition-colors duration-300 rounded-2xl"
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <h3 className="text-xl font-semibold text-[#5F3623] pr-6 leading-tight">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-[#f5821f] to-[#5F3623] flex items-center justify-center transition-all duration-500 transform ${activeIndex === index ? 'rotate-180 bg-gradient-to-r from-[#5F3623] to-[#f5821f]' : ''}`}>
                    <svg 
                      className="w-6 h-6 text-white transition-transform duration-300"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>
              
              {/* Enhanced Animated Content */}
              <div 
                className={`transition-all duration-500 ease-out overflow-hidden ${
                  activeIndex === index 
                    ? 'max-h-96 opacity-100 translate-y-0' 
                    : 'max-h-0 opacity-0 -translate-y-4'
                }`}
              >
                <div className="px-8 pb-8">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#f5821f] to-transparent mb-6"></div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="relative bg-gradient-to-br from-[#5F3623] via-[#7a3d1f] to-[#8B4513] rounded-3xl p-12 text-center text-white overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Still have questions?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              We're just a message away. Connect with our Rudraksh experts on WhatsApp for personalized guidance tailored to your spiritual needs.
            </p>
            <a
              href="https://wa.me/917377371008"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 transform hover:scale-105 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="currentColor"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.932 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
              <span className="text-lg">Chat with Our Experts</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}