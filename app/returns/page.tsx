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
  Heart
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
    { id: 'return-policy', title: 'Return Policy', icon: <RefreshCw size={18} /> },
    { id: 'refund-policy', title: 'Refund Policy', icon: <CreditCard size={18} /> },
    { id: 'eligibility', title: 'Eligibility Criteria', icon: <CheckCircle size={18} /> },
    { id: 'non-returnable', title: 'Non-Returnable Items', icon: <XCircle size={18} /> },
    { id: 'return-process', title: 'Return Process', icon: <Package size={18} /> },
    { id: 'damaged-items', title: 'Damaged Items', icon: <AlertTriangle size={18} /> },
    { id: 'contact', title: 'Contact Support', icon: <Phone size={18} /> }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const returnReasons = [
    {
      icon: <Package className="text-green-600" size={20} />,
      reason: "Wrong item received",
      timeline: "7 days from delivery",
      status: "Eligible"
    },
    {
      icon: <AlertTriangle className="text-orange-600" size={20} />,
      reason: "Damaged during shipping",
      timeline: "48 hours from delivery",
      status: "Eligible"
    },
    {
      icon: <Heart className="text-purple-600" size={20} />,
      reason: "Change of mind",
      timeline: "7 days from delivery",
      status: "Conditional"
    },
    {
      icon: <Shield className="text-blue-600" size={20} />,
      reason: "Defective product",
      timeline: "15 days from delivery",
      status: "Eligible"
    }
  ];

  const refundTimeline = [
    { stage: "Return Request Approved", duration: "24 hours", icon: <CheckCircle size={16} /> },
    { stage: "Pickup Completed", duration: "1-2 business days", icon: <Truck size={16} /> },
    { stage: "Quality Check", duration: "2-3 business days", icon: <Shield size={16} /> },
    { stage: "Refund Processed", duration: "24 hours", icon: <CreditCard size={16} /> },
    { stage: "Amount Credited", duration: "5-7 business days", icon: <Clock size={16} /> }
  ];

  return (
    <>
      <Head>
        <title>Refund & Return Policy | Pashupatinath Rudraksh</title>
        <meta name="description" content="Learn about our hassle-free return and refund policies. Your satisfaction is our priority at Pashupatinath Rudraksh." />
      </Head>

      {/* Enhanced Breadcrumbs */}
      <div className="breadcrumbs-section bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <nav className="flex items-center space-x-2 text-sm mb-4">
              <Link href="/" className="text-green-700 hover:text-green-800 transition-colors duration-200">
                Home
              </Link>
              <ChevronRight size={16} className="text-green-600" />
              <span className="text-green-900 font-semibold">Refund & Return Policy</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
              Refund & Return Policy
            </h1>
            <p className="text-green-700 text-lg md:text-xl max-w-3xl">
              Your satisfaction is our priority. Learn about our hassle-free return and refund process.
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
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
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
                          ? 'bg-green-100 text-green-900 border-l-4 border-green-500'
                          : 'text-gray-600 hover:bg-green-50 hover:text-green-800'
                      }`}
                    >
                      <span className="mr-3 opacity-70">{section.icon}</span>
                      {section.title}
                    </button>
                  ))}
                </nav>

                {/* Help Card */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Need Help?</h4>
                  <p className="text-green-700 text-sm mb-3">
                    Our support team is here to assist you.
                  </p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center">
                    <Mail size={14} className="mr-2" />
                    Contact Support
                  </button>
                </div>
              </div>
            </div>

            {/* Policy Content */}
            <div className="lg:w-3/4">
              <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <Shield size={48} className="mb-4" />
                      <h2 className="text-3xl font-bold mb-2">Hassle-Free Returns</h2>
                      <p className="text-green-100 text-lg">
                        We stand behind the quality of our Rudraksh products
                      </p>
                    </div>
                  </div>
                </div>

                {/* Policy Content */}
                <div className="p-8">
                  
                  {/* Quick Stats */}
                  <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-2xl font-bold text-green-700 mb-2">7 Days</div>
                      <p className="text-green-600 text-sm">Easy Return Window</p>
                    </div>
                    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="text-2xl font-bold text-blue-700 mb-2">100%</div>
                      <p className="text-blue-600 text-sm">Refund on Quality Issues</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="text-2xl font-bold text-purple-700 mb-2">24-48 Hrs</div>
                      <p className="text-purple-600 text-sm">Quick Refund Processing</p>
                    </div>
                  </div>

                  {/* Return Policy */}
                  <section id="return-policy" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-green-100 p-3 rounded-xl mr-4">
                        <RefreshCw size={24} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Return Policy</h3>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        We offer a <strong className="text-green-700">7-day return policy</strong> from the date of delivery. 
                        If you're not completely satisfied with your purchase, you can return the product in its original condition.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      {returnReasons.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              {item.icon}
                              <span className="font-semibold text-gray-800 ml-3">{item.reason}</span>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              item.status === 'Eligible' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock size={14} className="mr-1" />
                            Timeline: {item.timeline}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Refund Policy */}
                  <section id="refund-policy" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <CreditCard size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Refund Policy</h3>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                      <h4 className="font-semibold text-blue-800 mb-3">Refund Timeline</h4>
                      <div className="space-y-4">
                        {refundTimeline.map((stage, index) => (
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

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          <CheckCircle size={18} className="mr-2" />
                          Full Refund
                        </h4>
                        <ul className="text-gray-700 space-y-2">
                          <li>• Wrong item delivered</li>
                          <li>• Damaged during shipping</li>
                          <li>• Defective product</li>
                          <li>• Missing items</li>
                        </ul>
                      </div>
                      <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                          <AlertTriangle size={18} className="mr-2" />
                          Partial Refund
                        </h4>
                        <ul className="text-gray-700 space-y-2">
                          <li>• Return shipping charges</li>
                          <li>• Original condition not maintained</li>
                          <li>• Missing original packaging</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Eligibility Criteria */}
                  <section id="eligibility" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-purple-100 p-3 rounded-xl mr-4">
                        <CheckCircle size={24} className="text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Eligibility Criteria</h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                          <CheckCircle size={18} className="mr-2" />
                          Eligible for Return
                        </h4>
                        <ul className="text-gray-700 space-y-2">
                          <li>• Product in original condition</li>
                          <li>• All tags and packaging intact</li>
                          <li>• Return within 7 days of delivery</li>
                          <li>• Original invoice provided</li>
                          <li>• No signs of wear or use</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                          <XCircle size={18} className="mr-2" />
                          Not Eligible
                        </h4>
                        <ul className="text-gray-700 space-y-2">
                          <li>• Products used or worn</li>
                          <li>• Damaged due to misuse</li>
                          <li>• Return after 7 days</li>
                          <li>• Missing original packaging</li>
                          <li>• Personalized items</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  {/* Non-Returnable Items */}
                  <section id="non-returnable" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-red-100 p-3 rounded-xl mr-4">
                        <XCircle size={24} className="text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Non-Returnable Items</h3>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Personalized or custom Rudraksh malas",
                          "Items sold during clearance sales",
                          "Products without original packaging",
                          "Used or worn Rudraksh beads",
                          "Gift cards or vouchers",
                          "Items purchased from third-party sellers"
                        ].map((item, index) => (
                          <div key={index} className="flex items-center">
                            <XCircle size={16} className="text-red-500 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Return Process */}
                  <section id="return-process" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <Package size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Return Process</h3>
                    </div>

                    <div className="space-y-6">
                      {[
                        {
                          step: "1",
                          title: "Initiate Return Request",
                          description: "Contact our support team or use the return portal within 7 days of delivery"
                        },
                        {
                          step: "2",
                          title: "Get Return Approval",
                          description: "We'll verify eligibility and provide return instructions within 24 hours"
                        },
                        {
                          step: "3",
                          title: "Package Your Item",
                          description: "Include all original packaging, tags, and invoice with the product"
                        },
                        {
                          step: "4",
                          title: "Schedule Pickup",
                          description: "We'll arrange free pickup through our logistics partner"
                        },
                        {
                          step: "5",
                          title: "Quality Check",
                          description: "Our team verifies the product condition upon receipt"
                        },
                        {
                          step: "6",
                          title: "Refund Processing",
                          description: "Refund initiated within 3-5 business days after quality check"
                        }
                      ].map((step, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                            {step.step}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-1">{step.title}</h4>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Damaged Items */}
                  <section id="damaged-items" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-orange-100 p-3 rounded-xl mr-4">
                        <AlertTriangle size={24} className="text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Damaged or Defective Items</h3>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                      <p className="text-gray-700 mb-4">
                        If you receive a damaged or defective product, please follow these steps:
                      </p>
                      <div className="space-y-3">
                        {[
                          "Contact us within 48 hours of delivery",
                          "Provide clear photos/videos of the damage",
                          "Do not use or wear the product",
                          "Keep all original packaging",
                          "Our team will guide you through the replacement process"
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

                  {/* Contact Support */}
                  <section id="contact" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-green-100 p-3 rounded-xl mr-4">
                        <Phone size={24} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Contact Support</h3>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
                      <h4 className="text-xl font-bold mb-4">Need Help with Returns?</h4>
                      <p className="text-green-100 mb-6">
                        Our customer support team is here to assist you with any return or refund queries.
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="flex items-center">
                          <Phone size={20} className="text-green-200 mr-3" />
                          <div>
                            <p className="text-green-200 text-sm">Call Us</p>
                            <a href="tel:7377371008" className="font-semibold hover:text-white transition-colors">
                              7377371008
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mail size={20} className="text-green-200 mr-3" />
                          <div>
                            <p className="text-green-200 text-sm">Email Us</p>
                            <a href="mailto:prudraksh108@gmail.com" className="font-semibold hover:text-white transition-colors">
                              prudraksh108@gmail.com
                            </a>
                          </div>
                        </div>
                      </div>

                      <button className="w-full bg-white text-green-700 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200 flex items-center justify-center">
                        Start Return Process
                        <ArrowRight size={18} className="ml-2" />
                      </button>
                    </div>
                  </section>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Last updated: {currentDate} • We reserve the right to modify this policy at any time.
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