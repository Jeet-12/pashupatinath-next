"use client";

import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ChevronRight, 
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  ShoppingCart,
  CreditCard,
  Truck,
  RefreshCw,
  Mail,
  Phone,
  Download,
  Printer,
  Eye
} from 'lucide-react';

const TermsConditions: NextPage = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [lastUpdated] = useState(new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const sections = document.querySelectorAll('.terms-section');
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const printTerms = () => {
    window.print();
  };

  const downloadTerms = () => {
    // In real implementation, this would download a PDF
    alert('Downloading Terms & Conditions PDF...');
  };

  const termsSections = [
    { id: 'introduction', title: 'Introduction', icon: <FileText size={18} /> },
    { id: 'definitions', title: 'Definitions', icon: <Shield size={18} /> },
    { id: 'account-terms', title: 'Account Terms', icon: <User size={18} /> },
    { id: 'product-info', title: 'Product Information', icon: <ShoppingCart size={18} /> },
    { id: 'pricing-payments', title: 'Pricing & Payments', icon: <CreditCard size={18} /> },
    { id: 'shipping-delivery', title: 'Shipping & Delivery', icon: <Truck size={18} /> },
    { id: 'returns-refunds', title: 'Returns & Refunds', icon: <RefreshCw size={18} /> },
    { id: 'intellectual-property', title: 'Intellectual Property', icon: <Eye size={18} /> },
    { id: 'limitation-liability', title: 'Limitation of Liability', icon: <AlertTriangle size={18} /> },
    { id: 'governing-law', title: 'Governing Law', icon: <Shield size={18} /> },
    { id: 'contact', title: 'Contact Information', icon: <Phone size={18} /> }
  ];

  const importantPoints = [
    {
      icon: <CheckCircle className="text-green-600" size={20} />,
      title: "Account Responsibility",
      description: "You are responsible for maintaining your account security"
    },
    {
      icon: <Clock className="text-blue-600" size={20} />,
      title: "Order Processing",
      description: "Orders are processed within 24-48 hours"
    },
    {
      icon: <AlertTriangle className="text-orange-600" size={20} />,
      title: "Product Authenticity",
      description: "All Rudraksh come with authenticity certificates"
    },
    {
      icon: <XCircle className="text-red-600" size={20} />,
      title: "Non-Returnable Items",
      description: "Personalized items cannot be returned"
    }
  ];

  return (
    <>
      <Head>
        <title>Terms & Conditions | Pashupatinath Rudraksh</title>
        <meta name="description" content="Read our comprehensive Terms and Conditions for using Pashupatinath Rudraksh services and purchasing spiritual products." />
      </Head>

      {/* Enhanced Breadcrumbs */}
      <div className="breadcrumbs-section bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <nav className="flex items-center space-x-2 text-sm mb-4">
              <Link href="/" className="text-blue-700 hover:text-blue-800 transition-colors duration-200">
                Home
              </Link>
              <ChevronRight size={16} className="text-blue-600" />
              <span className="text-blue-900 font-semibold">Terms & Conditions</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-blue-700 text-lg md:text-xl max-w-3xl">
              Please read these terms carefully before using our website or purchasing our spiritual products.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            
            {/* Sidebar Navigation */}
            <div className="lg:w-1/4">
              <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <FileText className="mr-2" size={20} />
                  Quick Navigation
                </h3>
                <nav className="space-y-2">
                  {termsSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-800'
                      }`}
                    >
                      <span className="mr-3 opacity-70">{section.icon}</span>
                      {section.title}
                    </button>
                  ))}
                </nav>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={downloadTerms}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center"
                  >
                    <Download size={14} className="mr-2" />
                    Download PDF
                  </button>
                  <button
                    onClick={printTerms}
                    className="w-full bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center"
                  >
                    <Printer size={14} className="mr-2" />
                    Print Terms
                  </button>
                </div>

                {/* Last Updated */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">
                    <strong>Last Updated:</strong><br />
                    {lastUpdated}
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Content */}
            <div className="lg:w-3/4">
              <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <Shield size={48} className="mb-4" />
                      <h2 className="text-3xl font-bold mb-2">Terms of Service</h2>
                      <p className="text-blue-100 text-lg">
                        Governing your use of Pashupatinath Rudraksh website and services
                      </p>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 p-6">
                  <div className="flex items-start">
                    <AlertTriangle className="text-yellow-600 mr-4 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        Important Legal Notice
                      </h3>
                      <p className="text-yellow-700">
                        By accessing our website and purchasing our products, you agree to be bound by these Terms and Conditions. 
                        Please read them carefully. If you disagree with any part, you may not access our website or use our services.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Important Points */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
                  {importantPoints.map((point, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <div className="flex justify-center mb-2">
                        {point.icon}
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">
                        {point.title}
                      </h4>
                      <p className="text-gray-600 text-xs">
                        {point.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Terms Content */}
                <div className="p-8">
                  
                  {/* Introduction */}
                  <section id="introduction" className="terms-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <FileText size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">1. Introduction</h3>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p className="mb-4">
                        Welcome to <strong>Pashupatinath Rudraksh</strong> ("we," "our," "us"). These Terms and Conditions govern your use of our website located at <strong>www.pashupatinathrudraksh.com</strong> and our services related to the sale of authentic Rudraksh beads, malas, and spiritual products.
                      </p>
                      <p className="mb-4">
                        By accessing our website and purchasing our products, you accept these Terms and Conditions in full. If you disagree with these Terms and Conditions or any part of them, you must not use our website or purchase our products.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                        <p className="text-blue-800 text-sm">
                          <strong>Note:</strong> These terms constitute a legally binding agreement between you and Pashupatinath Rudraksh regarding your use of the website and services.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Definitions */}
                  <section id="definitions" className="terms-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <Shield size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">2. Definitions</h3>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p className="mb-4">In these Terms and Conditions:</p>
                      <ul className="list-disc pl-6 mb-4 space-y-2">
                        <li><strong>"Website"</strong> refers to www.pashupatinathrudraksh.com and all associated subdomains</li>
                        <li><strong>"Services"</strong> refers to all services provided through our website including product sales, consultations, and customer support</li>
                        <li><strong>"Products"</strong> refers to Rudraksh beads, malas, spiritual products, and related items offered for sale</li>
                        <li><strong>"User," "You," "Your"</strong> refers to the person accessing or using our website and services</li>
                        <li><strong>"Content"</strong> includes text, images, videos, product descriptions, and other materials on our website</li>
                        <li><strong>"Order"</strong> refers to your request to purchase products from us</li>
                      </ul>
                    </div>
                  </section>

                  {/* Account Terms */}
                  <section id="account-terms" className="terms-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <User size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">3. Account Terms</h3>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                            <CheckCircle size={18} className="mr-2" />
                            Your Responsibilities
                          </h4>
                          <ul className="text-green-700 text-sm space-y-2">
                            <li>• Provide accurate and complete information</li>
                            <li>• Maintain account security</li>
                            <li>• Update information promptly</li>
                            <li>• Notify us of unauthorized access</li>
                          </ul>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                            <XCircle size={18} className="mr-2" />
                            Prohibited Activities
                          </h4>
                          <ul className="text-red-700 text-sm space-y-2">
                            <li>• Creating fake accounts</li>
                            <li>• Sharing account credentials</li>
                            <li>• Impersonating others</li>
                            <li>• Automated account creation</li>
                          </ul>
                        </div>
                      </div>
                      <p className="mb-4">
                        You must be at least 18 years old to create an account and purchase our products. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device.
                      </p>
                    </div>
                  </section>

                  {/* Product Information */}
                  <section id="product-info" className="terms-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <ShoppingCart size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">4. Product Information</h3>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-blue-800 mb-3">Authenticity Guarantee</h4>
                        <p className="text-blue-700">
                          All our Rudraksh beads are sourced directly from Nepal and come with authenticity certificates. We guarantee the genuineness of all our products.
                        </p>
                      </div>
                      
                      <h4 className="font-semibold text-gray-800 mb-3">Product Descriptions</h4>
                      <p className="mb-4">
                        We strive to provide accurate product descriptions, images, and specifications. However, natural products like Rudraksh may have slight variations in color, texture, and size. These natural variations are not considered defects.
                      </p>

                      <h4 className="font-semibold text-gray-800 mb-3">Spiritual Benefits</h4>
                      <p className="mb-4">
                        While we provide information about traditional spiritual benefits associated with Rudraksh, individual experiences may vary. We make no medical or therapeutic claims about our products.
                      </p>
                    </div>
                  </section>

                  {/* Pricing & Payments */}
                  <section id="pricing-payments" className="terms-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <CreditCard size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">5. Pricing & Payments</h3>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Pricing</h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>• All prices are in Indian Rupees (₹)</li>
                            <li>• Prices include applicable taxes</li>
                            <li>• Shipping charges are calculated at checkout</li>
                            <li>• We reserve the right to change prices</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Payment Methods</h4>
                          <ul className="space-y-2 text-gray-700">
                            <li>• Credit/Debit Cards</li>
                            <li>• Net Banking</li>
                            <li>• UPI Payments</li>
                            <li>• Wallet Payments</li>
                            <li>• Cash on Delivery (limited areas)</li>
                          </ul>
                        </div>
                      </div>
                      <p className="mb-4">
                        Payment must be received in full before we process your order. For Cash on Delivery orders, payment is collected at the time of delivery.
                      </p>
                    </div>
                  </section>

                  {/* Shipping & Delivery */}
                  <section id="shipping-delivery" className="terms-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <Truck size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">6. Shipping & Delivery</h3>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-green-800 mb-2">Delivery Timeline</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-green-700">
                          <div>
                            <strong>Within India:</strong> 4-7 business days
                          </div>
                          <div>
                            <strong>International:</strong> 10-15 business days
                          </div>
                        </div>
                      </div>
                      <p className="mb-4">
                        We ship through reliable partners like ShipRocket. Delivery times are estimates and may vary due to factors beyond our control including weather, customs, and logistics delays.
                      </p>
                      <p className="mb-4">
                        You are responsible for providing accurate shipping information. We are not liable for delays or non-delivery due to incorrect addresses provided by you.
                      </p>
                    </div>
                  </section>

                  {/* Returns & Refunds */}
                  <section id="returns-refunds" className="terms-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <RefreshCw size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">7. Returns & Refunds</h3>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-3">Return Policy</h4>
                          <ul className="text-green-700 text-sm space-y-2">
                            <li>• 7-day return window from delivery</li>
                            <li>• Product must be unused and in original condition</li>
                            <li>• Original packaging and tags required</li>
                            <li>• Return shipping may apply</li>
                          </ul>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-3">Non-Returnable Items</h4>
                          <ul className="text-red-700 text-sm space-y-2">
                            <li>• Personalized or custom items</li>
                            <li>• Products without original packaging</li>
                            <li>• Used or worn items</li>
                            <li>• Sale or clearance items</li>
                          </ul>
                        </div>
                      </div>
                      <p className="mb-4">
                        Refunds are processed within 5-7 business days after we receive and verify the returned product. The refund will be issued to the original payment method.
                      </p>
                    </div>
                  </section>

                  {/* Intellectual Property */}
                  <section id="intellectual-property" className="terms-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <Eye size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">8. Intellectual Property</h3>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p className="mb-4">
                        All content on this website, including text, graphics, logos, images, product descriptions, and software, is the property of Pashupatinath Rudraksh and is protected by copyright and intellectual property laws.
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
                        <p className="text-yellow-800 text-sm">
                          <strong>Restriction:</strong> You may not reproduce, distribute, modify, or create derivative works of any content from our website without our express written permission.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Limitation of Liability */}
                  <section id="limitation-liability" className="terms-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <AlertTriangle size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">9. Limitation of Liability</h3>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p className="mb-4">
                        To the fullest extent permitted by law, Pashupatinath Rudraksh shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our website or products.
                      </p>
                      <p className="mb-4">
                        Our total liability to you for all claims arising from these Terms and Conditions or your use of our services shall not exceed the amount you paid to us for the products in question.
                      </p>
                    </div>
                  </section>

                  {/* Governing Law */}
                  <section id="governing-law" className="terms-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <Shield size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">10. Governing Law</h3>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p className="mb-4">
                        These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes relating to these Terms and Conditions shall be subject to the exclusive jurisdiction of the courts of Raipur, Chhattisgarh.
                      </p>
                    </div>
                  </section>

                  {/* Contact Information */}
                  <section id="contact" className="terms-section scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <Phone size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">11. Contact Information</h3>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <p className="text-gray-700 mb-4">
                        If you have any questions about these Terms and Conditions, please contact us:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Phone size={20} className="text-blue-600 mr-4" />
                          <div>
                            <p className="font-semibold text-gray-800">Phone</p>
                            <a href="tel:7377371008" className="text-blue-700 hover:text-blue-800">
                              7377371008
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mail size={20} className="text-blue-600 mr-4" />
                          <div>
                            <p className="font-semibold text-gray-800">Email</p>
                            <a href="mailto:prudraksh108@gmail.com" className="text-blue-700 hover:text-blue-800">
                              prudraksh108@gmail.com
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Eye size={20} className="text-blue-600 mr-4 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800">Address</p>
                            <p className="text-gray-700">
                              Farishta Complex, I-Block, 5th Floor,<br />
                              Rajbandha Maidan, Raipur,<br />
                              Chhattisgarh-492001
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Final Notice */}
                  <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <AlertTriangle className="text-orange-600 mr-2" size={20} />
                      Acceptance of Terms
                    </h4>
                    <p className="text-gray-700">
                      By using our website and purchasing our products, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. We reserve the right to update or modify these terms at any time without prior notice.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Last updated: {lastUpdated} • These terms may be updated without prior notice.
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
        
        @media print {
          .breadcrumbs-section,
          button,
          .lg\\:w-1\\/4 {
            display: none !important;
          }
          .lg\\:w-3\\/4 {
            width: 100% !important;
          }
        }
        
        .prose ul {
          list-style-type: disc;
          margin-left: 1.5rem;
        }
        
        .prose li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default TermsConditions;