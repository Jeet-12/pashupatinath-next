"use client";

import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ChevronRight, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Users,
  HelpCircle,
  Truck,
  RefreshCw,
  Shield,
  Star,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  FileText,
  Heart
} from 'lucide-react';

const CustomerService: NextPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: <Phone className="text-blue-600" size={24} />,
      title: "Call Us",
      description: "Speak directly with our support team",
      details: "7377371008",
      action: "tel:7377371008",
      buttonText: "Call Now",
      availability: "24/7 Available"
    },
    {
      icon: <Mail className="text-green-600" size={24} />,
      title: "Email Us",
      description: "Send us your queries and concerns",
      details: "prudraksh108@gmail.com",
      action: "mailto:prudraksh108@gmail.com",
      buttonText: "Send Email",
      availability: "Response within 4 hours"
    },
    {
      icon: <MessageCircle className="text-purple-600" size={24} />,
      title: "Live Chat",
      description: "Instant messaging with our team",
      details: "Click to start chat",
      action: "#chat",
      buttonText: "Start Chat",
      availability: "Mon-Sun: 8AM - 10PM"
    },
    {
      icon: <MapPin className="text-orange-600" size={24} />,
      title: "Visit Us",
      description: "Meet us in person",
      details: "Farishta Complex, I-Block, 5th Floor, Rajbandha Maidan, Raipur, Chhattisgarh-492001",
      action: "https://maps.google.com",
      buttonText: "Get Directions",
      availability: "Mon-Sat: 10AM - 6PM"
    }
  ];

  const serviceFeatures = [
    {
      icon: <Clock className="text-blue-500" size={20} />,
      title: "Quick Response",
      description: "Average response time: 2 hours"
    },
    {
      icon: <Users className="text-green-500" size={20} />,
      title: "Expert Team",
      description: "Knowledgeable Rudraksh specialists"
    },
    {
      icon: <Shield className="text-purple-500" size={20} />,
      title: "Secure Support",
      description: "Your data is always protected"
    },
    {
      icon: <Heart className="text-red-500" size={20} />,
      title: "Dedicated Care",
      description: "Personalized assistance for you"
    }
  ];

  const faqCategories = {
    general: [
      {
        question: "How do I choose the right Rudraksha?",
        answer: "Our experts can guide you based on your birth chart, requirements, and spiritual goals. Contact us for personalized consultation."
      },
      {
        question: "Do you provide authenticity certificates?",
        answer: "Yes, all our Rudraksh beads come with genuine authenticity certificates and proper energization documentation."
      },
      {
        question: "Can I get personalized recommendations?",
        answer: "Absolutely! Share your requirements with our experts for customized Rudraksh recommendations."
      }
    ],
    orders: [
      {
        question: "How can I track my order?",
        answer: "You'll receive a tracking link via SMS and email once your order is shipped. You can also track it from your account dashboard."
      },
      {
        question: "How long does delivery take?",
        answer: "Within India: 4-7 business days. International: 10-15 business days. Express delivery options available."
      },
      {
        question: "Can I modify my order after placement?",
        answer: "Contact us within 2 hours of order placement for modifications. We'll do our best to accommodate your request."
      }
    ],
    returns: [
      {
        question: "What is your return policy?",
        answer: "We offer 7-day return policy for unused products in original condition. Personalized items are non-returnable."
      },
      {
        question: "How do I initiate a return?",
        answer: "Contact our support team with your order details. We'll guide you through the simple return process."
      },
      {
        question: "When will I receive my refund?",
        answer: "Refunds are processed within 3-5 business days after we receive and verify the returned product."
      }
    ],
    products: [
      {
        question: "How do I care for my Rudraksha?",
        answer: "Avoid water contact, keep away from chemicals, store in clean dry place. We provide complete care instructions."
      },
      {
        question: "Do you offer Rudraksha energization?",
        answer: "Yes, all Rudraksh beads are properly energized with Vedic mantras before dispatch."
      },
      {
        question: "What makes your Rudraksh authentic?",
        answer: "We source directly from Nepal, provide authenticity certificates, and have 25+ years of expertise in Rudraksh."
      }
    ]
  };

  return (
    <>
      <Head>
        <title>Customer Service | Pashupatinath Rudraksh</title>
        <meta name="description" content="Get dedicated customer support for all your Rudraksh needs. We're here to help you 24/7." />
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
              <span className="text-blue-900 font-semibold">Customer Service</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Customer Service
            </h1>
            <p className="text-blue-700 text-lg md:text-xl max-w-3xl">
              Your satisfaction is our mission. We're here to help you with any questions about Rudraksh and your spiritual journey.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className={`max-w-7xl mx-auto transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

            {/* Contact Methods Grid */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Users size={16} className="mr-2" />
                  Multiple Ways to Connect
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Get in Touch With Us
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Choose your preferred method to connect with our Rudraksh experts
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-50 p-3 rounded-xl mr-4">
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg">
                            {method.title}
                          </h3>
                          <p className="text-blue-600 text-sm font-medium flex items-center">
                            <Clock size={12} className="mr-1" />
                            {method.availability}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 text-sm flex-grow">
                        {method.description}
                      </p>
                      
                      <div className="mb-4">
                        <p className="text-gray-800 font-medium text-sm">
                          {method.details}
                        </p>
                      </div>
                      
                      <a
                        href={method.action}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center text-sm"
                      >
                        {method.buttonText}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Service Features */}
            <section className="mb-16">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {serviceFeatures.map((feature, index) => (
                    <div key={index} className="text-center">
                      <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-600 text-lg">
                  Quick answers to common questions about Rudraksh and our services
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {Object.keys(faqCategories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center capitalize ${
                      activeTab === category
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:text-gray-800 border border-gray-200'
                    }`}
                  >
                    <HelpCircle size={16} className="mr-2" />
                    {category === 'general' ? 'General Help' : 
                     category === 'orders' ? 'Orders & Shipping' :
                     category === 'returns' ? 'Returns & Refunds' : 'Product Care'}
                  </button>
                ))}
              </div>

              {/* FAQ Content */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-8">
                  <div className="space-y-6">
                    {faqCategories[activeTab as keyof typeof faqCategories].map((faq, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        <h3 className="font-semibold text-gray-800 text-lg mb-3 flex items-center">
                          <HelpCircle size={18} className="text-blue-600 mr-3" />
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 pl-9">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Form */}
            <section className="mb-16">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Send className="text-blue-600 mr-3" size={24} />
                    Send us a Message
                  </h3>
                  
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">
                        Message Sent Successfully!
                      </h4>
                      <p className="text-gray-600">
                        Thank you for contacting us. We'll get back to you within 2 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Your phone number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                          </label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="">Select a subject</option>
                            <option value="product-inquiry">Product Inquiry</option>
                            <option value="order-support">Order Support</option>
                            <option value="return-request">Return Request</option>
                            <option value="rudraksh-consultation">Rudraksh Consultation</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Please describe your inquiry in detail..."
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                      >
                        <Send size={20} className="mr-2" />
                        Send Message
                      </button>
                    </form>
                  )}
                </div>

                {/* Support Info */}
                <div className="space-y-6">
                  {/* Support Hours */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Clock className="text-blue-600 mr-2" size={20} />
                      Support Hours
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Saturday</span>
                        <span className="font-semibold text-gray-800">8:00 AM - 10:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span className="font-semibold text-gray-800">9:00 AM - 8:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Emergency Support</span>
                        <span className="font-semibold text-green-600">24/7 Available</span>
                      </div>
                    </div>
                  </div>

                  {/* Why Choose Us */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-6 text-white">
                    <h4 className="font-semibold text-xl mb-4 flex items-center">
                      <Star className="mr-2" size={20} />
                      Why Choose Our Support?
                    </h4>
                    <ul className="space-y-3">
                      {[
                        "25+ years of Rudraksh expertise",
                        "Personalized spiritual guidance",
                        "Quick resolution guaranteed",
                        "Multilingual support available",
                        "Follow-up until satisfaction"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle size={16} className="mr-3 text-blue-200" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Emergency Support */}
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                      <AlertCircle className="mr-2" size={20} />
                      Urgent Support Needed?
                    </h4>
                    <p className="text-red-700 text-sm mb-4">
                      For order emergencies or immediate assistance, call us directly:
                    </p>
                    <a
                      href="tel:7377371008"
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
                    >
                      <Phone size={16} className="mr-2" />
                      Call Emergency Support
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-12 text-white">
                <h3 className="text-3xl font-bold mb-4">
                  Ready to Start Your Spiritual Journey?
                </h3>
                <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                  Let our Rudraksh experts guide you to the perfect beads for your spiritual growth and well-being.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:7377371008"
                    className="bg-white text-blue-600 hover:bg-blue-50 py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <Phone size={20} className="mr-2" />
                    Call Now for Consultation
                  </a>
                  <a
                    href="mailto:prudraksh108@gmail.com"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <Mail size={20} className="mr-2" />
                    Email for Guidance
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerService;