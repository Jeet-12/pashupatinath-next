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
  Zap,
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
      { 
        weight: '0-0.5 kg', 
        regular: 'FREE', 
        express: 'Contact Us',
        time: '4-7 days',
        expressTime: '2-3 days'
      },
      { 
        weight: '0.5-1 kg', 
        regular: 'FREE', 
        express: 'Contact Us',
        time: '4-7 days',
        expressTime: '2-3 days'
      },
      { 
        weight: '1-2 kg', 
        regular: 'FREE', 
        express: 'Contact Us',
        time: '4-7 days',
        expressTime: '2-3 days'
      },
      { 
        weight: '2-3 kg', 
        regular: 'FREE', 
        express: 'Contact Us',
        time: '4-7 days',
        expressTime: '2-3 days'
      },
      { 
        weight: '3-5 kg', 
        regular: 'FREE', 
        express: 'Contact Us',
        time: '4-7 days',
        expressTime: '2-3 days'
      },
    ],
    international: [
      { 
        weight: '0-0.5 kg', 
        regular: '₹850', 
        express: 'Contact Us',
        time: '10-15 days',
        expressTime: '5-7 days'
      },
      { 
        weight: '0.5-1 kg', 
        regular: '₹1200', 
        express: 'Contact Us',
        time: '10-15 days',
        expressTime: '5-7 days'
      },
      { 
        weight: '1-2 kg', 
        regular: '₹1800', 
        express: 'Contact Us',
        time: '10-15 days',
        expressTime: '5-7 days'
      },
    ]
  };

  const serviceFeatures = [
    {
      icon: <Truck className="text-blue-600" size={24} />,
      title: "Free Regular Shipping",
      description: "Enjoy free standard shipping on all domestic orders"
    },
    {
      icon: <Zap className="text-orange-600" size={24} />,
      title: "Express Shipping",
      description: "Need it faster? Contact us for express delivery options"
    },
    {
      icon: <Shield className="text-green-600" size={24} />,
      title: "Secure Packaging",
      description: "Your Rudraksh items are packed with extra care"
    },
    {
      icon: <Clock className="text-purple-600" size={24} />,
      title: "Quick Dispatch",
      description: "Orders shipped within 24-48 hours"
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
        <meta name="description" content="Free regular shipping on all orders. Contact us for express delivery options. Fast, reliable delivery powered by ShipRocket." />
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
              <strong>Free Regular Shipping</strong> on all orders. Contact us for express delivery options.
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
            
            {/* Free Shipping Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8 text-white text-center">
              <div className="flex items-center justify-center mb-2">
                <Truck size={32} className="mr-3" />
                <h2 className="text-2xl md:text-3xl font-bold">Free Regular Shipping!</h2>
              </div>
              <p className="text-green-100 text-lg">
                Enjoy free standard shipping on all domestic orders. No minimum purchase required!
              </p>
            </div>

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
                  Shipping Options
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Shipping Rates & Delivery Time
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  <strong>Free regular shipping</strong> on all orders. Contact us for express delivery options and pricing.
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
                        <th className="px-6 py-4 text-center font-semibold">Regular Shipping</th>
                        <th className="px-6 py-4 text-center font-semibold">Express Shipping</th>
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
                          
                          {/* Regular Shipping */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className={`text-lg font-bold ${
                                rate.regular === 'FREE' ? 'text-green-600' : 'text-blue-700'
                              }`}>
                                {rate.regular}
                              </span>
                              <div className="flex items-center justify-center mt-1">
                                <Clock size={14} className="text-gray-400 mr-1" />
                                <span className="text-gray-600 text-sm">{rate.time}</span>
                              </div>
                            </div>
                          </td>
                          
                          {/* Express Shipping */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-lg font-bold text-orange-600">{rate.express}</span>
                              <div className="flex items-center justify-center mt-1">
                                <Zap size={14} className="text-orange-400 mr-1" />
                                <span className="text-gray-600 text-sm">{rate.expressTime}</span>
                              </div>
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

                {/* Express Shipping Notice */}
                <div className="bg-orange-50 border-t border-orange-200 p-4">
                  <div className="flex items-center justify-center">
                    <Zap size={18} className="text-orange-600 mr-2" />
                    <p className="text-orange-800 text-sm font-medium">
                      For express shipping options and pricing, please contact our customer support team.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Express Shipping CTA */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white mb-16 text-center">
              <div className="flex items-center justify-center mb-4">
                <Zap size={32} className="mr-3" />
                <h3 className="text-2xl font-bold">Need Express Delivery?</h3>
              </div>
              <p className="text-orange-100 text-lg mb-6 max-w-2xl mx-auto">
                Get your Rudraksh items faster with our express shipping options. Contact us for pricing and availability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:7377371008"
                  className="bg-white text-orange-600 py-3 px-6 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-200 flex items-center justify-center"
                >
                  <Phone size={18} className="mr-2" />
                  Call: 7377371008
                </a>
                <a 
                  href="https://wa.me/7377371008"
                  className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.209-3.553-8.485"/>
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>

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
                    "Free regular shipping on all domestic orders",
                    "Express shipping available - contact us for pricing",
                    "Orders processed within 24-48 hours of payment confirmation",
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
                    q: "Is regular shipping really free?",
                    a: "Yes! We offer free regular shipping on all domestic orders with no minimum purchase required."
                  },
                  {
                    q: "How can I get express shipping?",
                    a: "Contact our customer support team via phone or WhatsApp for express shipping options and pricing."
                  },
                  {
                    q: "How can I track my order?",
                    a: "You'll receive a tracking link via email and SMS once your order is shipped. You can also track it from your account dashboard."
                  },
                  {
                    q: "Do you ship internationally?",
                    a: "Yes, we ship to 220+ countries worldwide through ShipRocket's international network."
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