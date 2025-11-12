"use client";

import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ChevronRight, 
  RefreshCw, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Truck,
  Heart,
  Ban
} from 'lucide-react';

const RefundReturnPolicy: NextPage = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('.policy-section');
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < 150 && sectionTop > -100) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const policySections = [
    { id: 'no-return-policy', title: 'No Return Policy', icon: <Ban size={18} /> },
    { id: 'refund-policy', title: 'Refund Policy', icon: <CreditCard size={18} /> },
    { id: 'damaged-items', title: 'Damaged Items', icon: <AlertTriangle size={18} /> },
    { id: 'wrong-items', title: 'Wrong Items', icon: <Package size={18} /> },
    { id: 'contact', title: 'Contact Support', icon: <Phone size={18} /> }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const refundScenarios = [
    {
      icon: <AlertTriangle className="text-orange-600" size={20} />,
      scenario: "Damaged during shipping",
      action: "Full refund or replacement",
      timeline: "Report within 48 hours"
    },
    {
      icon: <Package className="text-red-600" size={20} />,
      scenario: "Wrong item received",
      action: "Full refund or replacement",
      timeline: "Report within 24 hours"
    },
    {
      icon: <Shield className="text-blue-600" size={20} />,
      scenario: "Defective product",
      action: "Full refund or replacement",
      timeline: "Report within 7 days"
    },
    {
      icon: <Ban className="text-gray-600" size={20} />,
      scenario: "Change of mind / No longer want",
      action: "Not eligible for return/refund",
      timeline: "No returns accepted"
    }
  ];

  const nonRefundableReasons = [
    "Change of mind or personal preference",
    "Ordered wrong size or color",
    "Found better price elsewhere",
    "No longer need the product",
    "Received as a gift but don't like it",
    "Product doesn't match expectations"
  ];

  return (
    <>
      <Head>
        <title>No Return Policy | Pashupatinath Rudraksh</title>
        <meta name="description" content="Important: We do not accept returns after purchase. Learn about our refund policy for damaged or wrong items only." />
      </Head>

      {/* Enhanced Breadcrumbs */}
      <div className="breadcrumbs-section bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <nav className="flex items-center space-x-2 text-sm mb-4">
              <Link href="/" className="text-amber-700 hover:text-amber-800 transition-colors duration-200">
                Home
              </Link>
              <ChevronRight size={16} className="text-amber-600" />
              <span className="text-amber-900 font-semibold">No Return Policy</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              No Return Policy
            </h1>
            <p className="text-amber-700 text-lg md:text-xl max-w-3xl">
              Important: We do not accept returns after purchase. Read below for limited refund scenarios.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                  <FileText className="mr-2" size={20} />
                  Quick Navigation
                </h3>
                <nav className="space-y-2">
                  {policySections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center ${
                        activeSection === section.id
                          ? 'bg-amber-100 text-amber-900 border-l-4 border-amber-500'
                          : 'text-gray-600 hover:bg-amber-50 hover:text-amber-800'
                      }`}
                    >
                      <span className="mr-3 opacity-70">{section.icon}</span>
                      {section.title}
                    </button>
                  ))}
                </nav>

                {/* Important Notice */}
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                    <Ban size={16} className="mr-2" />
                    Important Notice
                  </h4>
                  <p className="text-red-700 text-sm">
                    No returns accepted for change of mind or personal reasons.
                  </p>
                </div>
              </div>
            </div>

            {/* Policy Content */}
            <div className="lg:w-3/4">
              <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <Ban size={48} className="mb-4" />
                      <h2 className="text-3xl font-bold mb-2">No Return Policy</h2>
                      <p className="text-amber-100 text-lg">
                        We do not accept returns after purchase. Limited refunds only for specific scenarios.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Policy Content */}
                <div className="p-8">
                  
                  {/* Important Notice Banner */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                    <div className="flex items-start">
                      <Ban className="text-red-600 mr-4 mt-1 flex-shrink-0" size={24} />
                      <div>
                        <h3 className="text-xl font-bold text-red-800 mb-2">Important: No Returns Accepted</h3>
                        <p className="text-red-700">
                          Due to the spiritual and personal nature of Rudraksh products, we <strong>do not accept returns</strong> 
                          for change of mind, wrong size selection, or any other personal reasons after purchase.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
                      <div className="text-2xl font-bold text-red-700 mb-2">No Returns</div>
                      <p className="text-red-600 text-sm">For Personal Reasons</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-700 mb-2">48 Hours</div>
                      <p className="text-green-600 text-sm">Report Damaged Items</p>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700 mb-2">24 Hours</div>
                      <p className="text-blue-600 text-sm">Report Wrong Items</p>
                    </div>
                  </div>

                  {/* No Return Policy */}
                  <section id="no-return-policy" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-red-100 p-3 rounded-xl mr-4">
                        <Ban size={24} className="text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">No Return Policy</h3>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                      <p className="text-gray-700 text-lg leading-relaxed mb-4">
                        <strong className="text-red-700">We do not accept returns after purchase.</strong> This policy is in place due to the 
                        spiritual and personal nature of Rudraksh products, which are considered sacred and personalized items.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                            <XCircle size={18} className="mr-2" />
                            Non-Returnable Reasons
                          </h4>
                          <ul className="text-gray-700 space-y-2">
                            {nonRefundableReasons.map((reason, index) => (
                              <li key={index} className="flex items-start">
                                <Ban size={16} className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-2">Why No Returns?</h4>
                          <ul className="text-gray-700 text-sm space-y-2">
                            <li>• Rudraksh are spiritual products</li>
                            <li>• Personal energy connection</li>
                            <li>• Hygiene and sanctity reasons</li>
                            <li>• Customized spiritual items</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Refund Policy */}
                  <section id="refund-policy" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-green-100 p-3 rounded-xl mr-4">
                        <CreditCard size={24} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Limited Refund Policy</h3>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                      <p className="text-gray-700 mb-4">
                        Refunds are only provided in the following specific scenarios:
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {refundScenarios.map((item, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center">
                                {item.icon}
                                <span className="font-semibold text-gray-800 ml-3">{item.scenario}</span>
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Clock size={14} className="mr-1" />
                              {item.timeline}
                            </div>
                            <div className={`text-sm font-medium ${
                              item.scenario.includes('Not eligible') 
                                ? 'text-red-600' 
                                : 'text-green-600'
                            }`}>
                              {item.action}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-800 mb-3">Refund Process Timeline</h4>
                      <div className="space-y-4">
                        {[
                          { stage: "Issue Reported", duration: "Within 48 hours", icon: <AlertTriangle size={16} /> },
                          { stage: "Verification", duration: "24-48 hours", icon: <Shield size={16} /> },
                          { stage: "Approval", duration: "24 hours", icon: <CheckCircle size={16} /> },
                          { stage: "Refund Processed", duration: "3-5 business days", icon: <CreditCard size={16} /> }
                        ].map((stage, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-blue-600 mr-3">{stage.icon}</span>
                              <span className="text-gray-700">{stage.stage}</span>
                            </div>
                            <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                              {stage.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Damaged Items */}
                  <section id="damaged-items" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-orange-100 p-3 rounded-xl mr-4">
                        <AlertTriangle size={24} className="text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Damaged Items Policy</h3>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
                      <h4 className="font-semibold text-orange-800 mb-3">For Damaged Items Received</h4>
                      <p className="text-gray-700 mb-4">
                        If you receive a damaged product, you must:
                      </p>
                      <div className="space-y-3">
                        {[
                          "Contact us within 48 hours of delivery",
                          "Provide clear photos/videos showing the damage",
                          "Do not use or wear the product",
                          "Keep all original packaging and tags",
                          "Our team will verify and process refund/replacement"
                        ].map((step, index) => (
                          <div key={index} className="flex items-center">
                            <div className="bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Wrong Items */}
                  <section id="wrong-items" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <Package size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Wrong Items Received</h3>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-800 mb-3">If You Receive Wrong Item</h4>
                      <p className="text-gray-700 mb-4">
                        In case you receive a different item than what you ordered:
                      </p>
                      <div className="space-y-3">
                        {[
                          "Contact us immediately (within 24 hours)",
                          "Provide photos of the received item",
                          "Keep the product in original condition",
                          "We will arrange pickup for the wrong item",
                          "Receive correct item or full refund"
                        ].map((step, index) => (
                          <div key={index} className="flex items-center">
                            <div className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 flex-shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Contact Support */}
                  <section id="contact" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-amber-100 p-3 rounded-xl mr-4">
                        <Phone size={24} className="text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Contact Support</h3>
                    </div>

                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white">
                      <h4 className="text-xl font-bold mb-4">Need Help?</h4>
                      <p className="text-amber-100 mb-6">
                        Contact us only for damaged items, wrong items received, or defective products.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-center">
                          <Phone size={20} className="text-amber-200 mr-3" />
                          <div>
                            <p className="text-amber-200 text-sm">Call Us</p>
                            <a href="tel:7377371008" className="font-semibold hover:text-white transition-colors">
                              7377371008
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mail size={20} className="text-amber-200 mr-3" />
                          <div>
                            <p className="text-amber-200 text-sm">Email Us</p>
                            <a href="mailto:prudraksh108@gmail.com" className="font-semibold hover:text-white transition-colors">
                              prudraksh108@gmail.com
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-700 rounded-lg p-4 mb-4">
                        <p className="text-amber-100 text-sm text-center">
                          <strong>Note:</strong> Please have your order details and photos ready when contacting about damaged or wrong items.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Last updated: {currentDate} • Due to the spiritual nature of our products, we maintain a strict no-return policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

export default RefundReturnPolicy;