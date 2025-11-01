"use client";

import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ChevronRight, 
  Truck, 
  Clock, 
  MapPin, 
  Package, 
  Shield, 
  RefreshCw, 
  Phone, 
  Mail, 
  Globe,
  CheckCircle,
  AlertCircle,
  Info,
  CreditCard,
  ArrowRight
} from 'lucide-react';

const ShippingInfo: NextPage = () => {
  const [activeTab, setActiveTab] = useState('domestic');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const shippingRates = {
    domestic: [
      { weight: '0-0.5 kg', rate: '₹45', time: '4-7 days' },
      { weight: '0.5-1 kg', rate: '₹65', time: '4-7 days' },
      { weight: '1-2 kg', rate: '₹90', time: '4-7 days' },
      { weight: '2-3 kg', rate: '₹120', time: '4-7 days' },
      { weight: '3-5 kg', rate: '₹160', time: '4-7 days' },
    ],
    international: [
      { weight: '0-0.5 kg', rate: '₹850', time: '10-15 days' },
      { weight: '0.5-1 kg', rate: '₹1200', time: '10-15 days' },
      { weight: '1-2 kg', rate: '₹1800', time: '10-15 days' },
    ]
  };

  const serviceFeatures = [
    {
      icon: <Truck className="text-blue-600" size={24} />,
      title: "Nationwide Coverage",
      description: "We deliver to 29,000+ pin codes across India"
    },
    {
      icon: <Shield className="text-green-600" size={24} />,
      title: "Secure Packaging",
      description: "Your Rudraksh items are packed with extra care"
    },
    {
      icon: <Clock className="text-orange-600" size={24} />,
      title: "Quick Dispatch",
      description: "Orders shipped within 24-48 hours"
    },
    {
      icon: <RefreshCw className="text-purple-600" size={24} />,
      title: "Easy Returns",
      description: "7-day return policy for eligible items"
    }
  ];

  const trackingSteps = [
    { step: 1, title: "Order Placed", description: "We receive your order" },
    { step: 2, title: "Processing", description: "Order verification & packaging" },
    { step: 3, title: "Shipped", description: "Handed to ShipRocket" },
    { step: 4, title: "In Transit", description: "On the way to you" },
    { step: 5, title: "Delivered", description: "Successfully delivered" }
  ];

  return (
    <>
      <Head>
        <title>Shipping Information | Pashupatinath Rudraksh</title>
        <meta name="description" content="Learn about our shipping policies, delivery timelines, and tracking information powered by ShipRocket." />
      </Head>

      {/* Enhanced Breadcrumbs */}
      <div className="breadcrumbs-section bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <nav className="flex items-center space-x-2 text-sm mb-4">
              <Link href="/" className="text-blue-700 hover:text-blue-800 transition-colors duration-200">
                Home
              </Link>
              <ChevronRight size={16} className="text-blue-600" />
              <span className="text-blue-900 font-semibold">Shipping Information</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Shipping Information
            </h1>
            <p className="text-blue-700 text-lg md:text-xl max-w-3xl">
              Fast, reliable, and secure delivery powered by ShipRocket to bring spiritual wellness to your doorstep
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className={`max-w-6xl mx-auto transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {serviceFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gray-50 p-3 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Rates Section */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Package size={16} className="mr-2" />
                  Competitive Shipping Rates
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Shipping Rates & Delivery Time
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Transparent pricing with no hidden charges. All prices include packaging and handling.
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                  <button
                    onClick={() => setActiveTab('domestic')}
                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center ${
                      activeTab === 'domestic'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <MapPin size={18} className="mr-2" />
                    Domestic Shipping
                  </button>
                  <button
                    onClick={() => setActiveTab('international')}
                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center ${
                      activeTab === 'international'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Globe size={18} className="mr-2" />
                    International Shipping
                  </button>
                </div>
              </div>

              {/* Rates Table */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Weight Category</th>
                        <th className="px-6 py-4 text-center font-semibold">Shipping Rate</th>
                        <th className="px-6 py-4 text-center font-semibold">Estimated Delivery</th>
                        <th className="px-6 py-4 text-center font-semibold">Service</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {shippingRates[activeTab as keyof typeof shippingRates].map((rate, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Package size={18} className="text-gray-400 mr-3" />
                              <span className="font-medium text-gray-900">{rate.weight}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-lg font-bold text-blue-700">{rate.rate}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center">
                              <Clock size={16} className="text-gray-400 mr-2" />
                              <span className="text-gray-700">{rate.time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle size={12} className="mr-1" />
                              ShipRocket
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Tracking Process */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Order Tracking Process
                </h2>
                <p className="text-gray-600 text-lg">
                  Follow your order every step of the way with real-time tracking
                </p>
              </div>

              <div className="grid md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {trackingSteps.map((step, index) => (
                  <div key={step.step} className="text-center relative">
                    {/* Connector Line */}
                    {index < trackingSteps.length - 1 && (
                      <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-blue-200 -z-10" />
                    )}
                    
                    <div className="bg-white border-2 border-blue-200 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 relative">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-xs">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Important Information */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* Shipping Policies */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Info className="text-blue-600 mr-3" size={24} />
                  Shipping Policies
                </h3>
                <div className="space-y-4">
                  {[
                    "Orders are processed within 24-48 hours of payment confirmation",
                    "Free shipping on orders above ₹999 within India",
                    "International orders may be subject to customs duties",
                    "Signature required for delivery of high-value items",
                    "Contact us within 24 hours for address changes"
                  ].map((policy, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle size={18} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{policy}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Need Help Section */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Need Help with Shipping?</h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Our customer support team is here to assist you with any shipping-related queries.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Phone size={20} className="mr-3 text-blue-200" />
                    <div>
                      <p className="text-blue-200 text-sm">Call Us</p>
                      <a href="tel:7377371008" className="font-semibold hover:text-white transition-colors">
                        7377371008
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail size={20} className="mr-3 text-blue-200" />
                    <div>
                      <p className="text-blue-200 text-sm">Email Us</p>
                      <a href="mailto:prudraksh108@gmail.com" className="font-semibold hover:text-white transition-colors">
                        prudraksh108@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-white text-blue-700 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center">
                  Track Your Order
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            <section className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Frequently Asked Questions
              </h3>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    q: "How can I track my order?",
                    a: "You'll receive a tracking link via email and SMS once your order is shipped. You can also track it from your account dashboard."
                  },
                  {
                    q: "Do you ship internationally?",
                    a: "Yes, we ship to 220+ countries worldwide through ShipRocket's international network."
                  },
                  {
                    q: "What if I'm not available during delivery?",
                    a: "The delivery executive will attempt 2 more times. You can also reschedule or pick up from the nearest service point."
                  },
                  {
                    q: "Are there any shipping restrictions?",
                    a: "Some remote locations might have limited service. We'll notify you if your location has any delivery constraints."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <AlertCircle size={18} className="text-blue-600 mr-2" />
                      {faq.q}
                    </h4>
                    <p className="text-gray-600 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingInfo;