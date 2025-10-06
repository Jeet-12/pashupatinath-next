"use client";

import { useState } from 'react';

export default function RudrakshaConsultation() {
  const [activeTab, setActiveTab] = useState('free');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    birthPlace: '',
    dob: '',
    birthTime: '',
    astroName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Consultation booked successfully! We will contact you soon.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#5F3623] mb-6">
            Personalized Rudraksha Consultation
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Connect with our experts to find the perfect Rudraksha for your spiritual journey
          </p>
          
          {/* Toggle Button */}
          <div className="inline-flex rounded-md shadow-sm border border-amber-200 bg-white overflow-hidden">
            <button
              onClick={() => setActiveTab('free')}
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'free' ? 'bg-[#f5821f] text-white' : 'text-gray-700 hover:bg-amber-50'}`}
            >
              Free Consultation
            </button>
            <button
              onClick={() => setActiveTab('personalized')}
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'personalized' ? 'bg-[#f5821f] text-white' : 'text-gray-700 hover:bg-amber-50'}`}
            >
              Personalized Recommendation
            </button>
          </div>
        </div>

        {activeTab === 'free' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-100 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#5F3623] mb-2">Free Consultation</h2>
              <p className="text-gray-600">Consultation with Rudraksha Expert</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-[#5F3623] mb-4">Benefits of Consultation</h3>
              <p className="text-gray-700 mb-6">
                Get a quick and personalized Rudraksha recommendation through chats. Ideal for those seeking basic guidance, without astrological insights.
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#f5821f] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Connect us on whatsapp</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#f5821f] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Understand rudraksh better</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#f5821f] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Get benefits PDF on whatsapp</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#f5821f] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">See which rudraksh is better for you as per your career</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[#f5821f] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Understanding myths and facts</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 p-6 rounded-xl">
              <h4 className="font-semibold text-[#5F3623] mb-3">Chat with us on WhatsApp</h4>
              <p className="text-gray-700 mb-4">
                Connect with us on WhatsApp for immediate support. Our team is prepared to provide you with professional service.
              </p>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.932 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                Chat for Free Consultation
              </button>
            </div>
          </div>
        )}

        {activeTab === 'personalized' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Benefits Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100 h-fit">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-[#5F3623]">₹1</span>
                  <span className="text-xl text-gray-500 line-through ml-2">₹200</span>
                </div>
                <h2 className="text-2xl font-bold text-[#5F3623] mb-2">Personalized Recommendation</h2>
                <p className="text-gray-600">A deeper consultation with a Rudraksha expert</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#5F3623] mb-4">Benefits of Consultation</h3>
                <p className="text-gray-700 mb-6">
                  Perfect for those looking for more clarity in their selection with astrological insights.
                </p>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#f5821f] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Guidance as per Astrology</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#f5821f] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">Send your Birth details to our expert astrologer</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#f5821f] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">He will evaluate your kundli and suggest rudraksh</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#f5821f] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">You will receive detailed pdf with reasons on whatsapp</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl">
                <h4 className="font-semibold text-[#5F3623] mb-2">Chat with us on WhatsApp</h4>
                <p className="text-gray-700 text-sm">
                  Connect with us on WhatsApp for immediate support. Our team is prepared to provide you with professional service.
                </p>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-semibold text-[#5F3623] mb-2">Let's Get Started</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What should we call you?</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5821f] focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Full Name"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5821f] focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Email Address"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5821f] focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Mobile Number"
                    required
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5821f] focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Birth Place"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5821f] focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birth Time</label>
                  <input
                    type="time"
                    name="birthTime"
                    value={formData.birthTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5821f] focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                
                {/* <div>
                  <input
                    type="text"
                    name="astroName"
                    value={formData.astroName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5821f] focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Astro Name"
                  />
                </div> */}
                
                <p className="text-sm text-gray-600 mt-4">
                  We will provide you the appointment date and necessary information via your provided email address after your appointment date has been updated.
                </p>
                
                <button
                  type="submit"
                  className="w-full bg-[#f5821f] hover:bg-[#e07a1d] text-white font-semibold py-3 rounded-lg transition-colors mt-4"
                >
                  Book Now for expert consultation
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}