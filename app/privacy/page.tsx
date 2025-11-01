"use client";

import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRight, Phone, Mail, MapPin, Shield, Lock, UserCheck, FileText, Eye, Download } from 'lucide-react';

const PrivacyPolicy: NextPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');

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
    { id: 'introduction', title: 'Introduction', icon: <FileText size={18} /> },
    { id: 'information-collected', title: 'Information We Collect', icon: <Download size={18} /> },
    { id: 'data-usage', title: 'How We Use Your Data', icon: <UserCheck size={18} /> },
    { id: 'data-security', title: 'Data Security', icon: <Lock size={18} /> },
    { id: 'legal-rights', title: 'Your Legal Rights', icon: <Shield size={18} /> },
    { id: 'contact', title: 'Contact Us', icon: <Phone size={18} /> },
    { id: 'changes', title: 'Changes to Policy', icon: <Eye size={18} /> }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadPolicy = () => {
    // In a real application, this would download the PDF version
    alert('Downloading Privacy Policy PDF...');
  };

  return (
    <>
      <Head>
        <title>Privacy Policy | Pashupatinath Rudraksh</title>
        <meta name="description" content="Read our comprehensive Privacy Policy to understand how we protect and handle your personal data at Pashupatinath Rudraksh." />
      </Head>

      {/* Enhanced Breadcrumbs */}
      <div className="breadcrumbs-section" style={{ backgroundColor: '#f8f1e9' }}>
        <div className="container mx-auto px-4">
          <div className="py-6">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-amber-700 hover:text-amber-800 transition-colors duration-200">
                Home
              </Link>
              <ChevronRight size={16} className="text-amber-600" />
              <span className="text-amber-900 font-semibold">Privacy Policy</span>
            </nav>
            <h1 className="text-4xl font-bold text-amber-900 mt-4">Privacy Policy</h1>
            <p className="text-amber-700 mt-2">Last updated: {currentDate}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
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
                
                {/* <button
                  onClick={downloadPolicy}
                  className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                >
                  <Download size={18} className="mr-2" />
                  Download PDF Version
                </button> */}
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
                      <Shield size={48} className="mb-4" />
                      <h2 className="text-3xl font-bold mb-2">Your Privacy Matters</h2>
                      <p className="text-amber-100 text-lg">
                        We are committed to protecting your personal information and being transparent about our data practices.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Policy Content */}
                <div className="p-8">
                  {/* Introduction */}
                  <section id="introduction" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-amber-100 p-3 rounded-xl mr-4">
                        <FileText size={24} className="text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">1. Introduction</h3>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Welcome to <strong className="text-amber-700">Pashupatinath Rudraksh</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                    </p>
                  </section>

                  {/* Information Collected */}
                  <section id="information-collected" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-amber-100 p-3 rounded-xl mr-4">
                        <Download size={24} className="text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">2. Information We Collect</h3>
                    </div>
                    <p className="text-gray-600 mb-6 text-lg">
                      We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-2">Identity Data</h4>
                        <p className="text-gray-600">First name, last name, username or similar identifier</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-2">Contact Data</h4>
                        <p className="text-gray-600">Billing address, delivery address, email address and telephone numbers</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-2">Transaction Data</h4>
                        <p className="text-gray-600">Details about payments and products you&apos;ve purchased</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-2">Technical Data</h4>
                        <p className="text-gray-600">IP address, browser type, location, and device information</p>
                      </div>
                    </div>
                  </section>

                  {/* Data Usage */}
                  <section id="data-usage" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-amber-100 p-3 rounded-xl mr-4">
                        <UserCheck size={24} className="text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">3. How We Use Your Data</h3>
                    </div>
                    <p className="text-gray-600 mb-6 text-lg">
                      We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <div className="space-y-3">
                      {[
                        "To process and deliver your order including managing payments, fees and charges",
                        "To manage our relationship with you",
                        "To administer and protect our business and this website",
                        "To deliver relevant website content and advertisements to you",
                        "To use data analytics to improve our website, products/services, marketing, customer relationships and experiences"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-amber-100 text-amber-700 rounded-full p-1 mr-3 mt-1">
                            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                          </div>
                          <p className="text-gray-600 flex-1">{item}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Data Security */}
                  <section id="data-security" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-amber-100 p-3 rounded-xl mr-4">
                        <Lock size={24} className="text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">4. Data Security</h3>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <p className="text-gray-600 text-lg leading-relaxed">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                      </p>
                    </div>
                  </section>

                  {/* Legal Rights */}
                  <section id="legal-rights" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-amber-100 p-3 rounded-xl mr-4">
                        <Shield size={24} className="text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">5. Your Legal Rights</h3>
                    </div>
                    <p className="text-gray-600 mb-6 text-lg">
                      Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        "Request access to your personal data",
                        "Request correction of your personal data",
                        "Request erasure of your personal data",
                        "Object to processing of your personal data",
                        "Request restriction of processing your personal data",
                        "Request transfer of your personal data",
                        "Right to withdraw consent"
                      ].map((right, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-amber-300 transition-colors">
                          <p className="text-gray-700 font-medium">{right}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Contact */}
                  <section id="contact" className="policy-section mb-12 scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-amber-100 p-3 rounded-xl mr-4">
                        <Phone size={24} className="text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">6. Contact Us</h3>
                    </div>
                    <p className="text-gray-600 mb-6 text-lg">
                      If you have any questions about this privacy policy or our privacy practices, please contact us:
                    </p>
                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Phone size={20} className="text-amber-600 mr-4" />
                          <div>
                            <p className="font-semibold text-gray-800">Mobile No.</p>
                            <a href="tel:7377371008" className="text-amber-700 hover:text-amber-800 transition-colors">
                              7377371008
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mail size={20} className="text-amber-600 mr-4" />
                          <div>
                            <p className="font-semibold text-gray-800">Email ID</p>
                            <a href="mailto:prudraksh108@gmail.com" className="text-amber-700 hover:text-amber-800 transition-colors">
                              prudraksh108@gmail.com
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin size={20} className="text-amber-600 mr-4 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-800">Address</p>
                            <p className="text-gray-600">
                              Farishta Complex, I-Block, 5th Floor,<br />
                              Rajbandha Maidan, Raipur,<br />
                              Chhattisgarh-492001
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Changes */}
                  <section id="changes" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-6">
                      <div className="bg-amber-100 p-3 rounded-xl mr-4">
                        <Eye size={24} className="text-amber-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">7. Changes to This Policy</h3>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <p className="text-gray-600 text-lg leading-relaxed">
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date at the top of this Privacy Policy.
                      </p>
                    </div>
                  </section>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
                  <p className="text-gray-600">
                    Thank you for trusting Pashupatinath Rudraksh with your personal information.
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

export default PrivacyPolicy;