"use client";

import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ChevronRight, 
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  // MapPin,
  User,
  Phone,
  Mail,
  RefreshCw,
  AlertCircle,
  // ArrowRight,
  Copy,
  Download,
  Printer,
  Shield
} from 'lucide-react';

const OrderTracking: NextPage = () => {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const trackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      if (orderId && phone) {
        // Mock tracking data
        setTrackingData({
          orderId: orderId,
          status: 'in_transit',
          customer: {
            name: 'Rajesh Kumar',
            phone: phone,
            email: 'rajesh@example.com'
          },
          items: [
            { name: '5 Mukhi Rudraksh Mala', quantity: 1, price: '₹1,499' },
            { name: 'Gauri Shankar Rudraksh', quantity: 1, price: '₹2,299' }
          ],
          shipping: {
            address: '123 Main Street, Mumbai, Maharashtra - 400001',
            carrier: 'ShipRocket',
            trackingNumber: 'SRT' + orderId
          },
          timeline: [
            {
              status: 'ordered',
              title: 'Order Placed',
              description: 'We have received your order',
              date: '2024-01-15 10:30 AM',
              completed: true
            },
            {
              status: 'confirmed',
              title: 'Order Confirmed',
              description: 'Your order has been confirmed',
              date: '2024-01-15 11:45 AM',
              completed: true
            },
            {
              status: 'processed',
              title: 'Order Processed',
              description: 'Items are being prepared for shipment',
              date: '2024-01-15 02:15 PM',
              completed: true
            },
            {
              status: 'shipped',
              title: 'Shipped',
              description: 'Your order has been shipped',
              date: '2024-01-16 09:30 AM',
              completed: true
            },
            {
              status: 'in_transit',
              title: 'In Transit',
              description: 'Your order is on the way',
              date: '2024-01-16 02:45 PM',
              completed: true,
              current: true
            },
            {
              status: 'out_for_delivery',
              title: 'Out for Delivery',
              description: 'Your order is out for delivery',
              date: 'Expected 2024-01-18',
              completed: false
            },
            {
              status: 'delivered',
              title: 'Delivered',
              description: 'Your order has been delivered',
              date: 'Expected 2024-01-18',
              completed: false
            }
          ],
          estimatedDelivery: '2024-01-18',
          totalAmount: '₹3,798'
        });
      } else {
        setError('Please enter both Order ID and Phone Number');
      }
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  const printTracking = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ordered': return 'bg-blue-500';
      case 'confirmed': return 'bg-purple-500';
      case 'processed': return 'bg-indigo-500';
      case 'shipped': return 'bg-yellow-500';
      case 'in_transit': return 'bg-orange-500';
      case 'out_for_delivery': return 'bg-green-500';
      case 'delivered': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ordered': return 'Order Placed';
      case 'confirmed': return 'Confirmed';
      case 'processed': return 'Processed';
      case 'shipped': return 'Shipped';
      case 'in_transit': return 'In Transit';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  return (
    <>
      <Head>
        <title>Track Your Order | Pashupatinath Rudraksh</title>
        <meta name="description" content="Track your Rudraksh order in real-time. Get live updates on your shipment status and estimated delivery date." />
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
              <span className="text-blue-900 font-semibold">Track Order</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Track Your Order
            </h1>
            <p className="text-blue-700 text-lg md:text-xl max-w-3xl">
              Real-time tracking for your Rudraksh order. Stay updated every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className={`max-w-6xl mx-auto transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

            {/* Tracking Form */}
            <section className="mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <Package size={16} className="mr-2" />
                    Enter Tracking Details
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Track Your Shipment
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Enter your Order ID and registered phone number to track your order
                  </p>
                </div>

                <form onSubmit={trackOrder} className="max-w-2xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order ID *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          placeholder="e.g., ORD12345678"
                          className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Registered phone number"
                          className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                      <AlertCircle size={20} className="text-red-500 mr-3" />
                      <p className="text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw size={20} className="mr-2 animate-spin" />
                        Tracking Order...
                      </>
                    ) : (
                      <>
                        <Search size={20} className="mr-2" />
                        Track Order
                      </>
                    )}
                  </button>
                </form>

                {/* Help Text */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 text-sm">
                    Can't find your Order ID? Check your email confirmation or{' '}
                    <a href="mailto:prudraksh108@gmail.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                      contact support
                    </a>
                  </p>
                </div>
              </div>
            </section>

            {/* Tracking Results */}
            {trackingData && (
              <section className="mb-12">
                <div className="bg-white rounded-2xl shadow-lg border border-blue-200 overflow-hidden">
                  
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">Order #{trackingData.orderId}</h3>
                        <p className="text-blue-100">Estimated Delivery: {trackingData.estimatedDelivery}</p>
                      </div>
                      <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <button
                          onClick={printTracking}
                          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
                        >
                          <Printer size={16} className="mr-2" />
                          Print
                        </button>
                        <button
                          // onClick={}
                          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center"
                        >
                          <Download size={16} className="mr-2" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Current Status */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(trackingData.status)} mr-3`}></div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-lg">
                              Current Status: {getStatusText(trackingData.status)}
                            </h4>
                            <p className="text-gray-600">
                              Your order is on the way to your delivery address
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-xl font-bold text-gray-800">{trackingData.totalAmount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                      
                      {/* Tracking Timeline */}
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold text-gray-800 text-lg mb-6 flex items-center">
                          <Clock size={20} className="mr-2 text-blue-600" />
                          Order Journey
                        </h4>
                        
                        <div className="space-y-6">
                          {trackingData.timeline.map((step: any, index: number) => (
                            <div key={step.status} className="flex">
                              {/* Timeline Line */}
                              <div className="flex flex-col items-center mr-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  step.completed 
                                    ? step.current ? 'bg-orange-500' : 'bg-green-500'
                                    : 'bg-gray-300'
                                } text-white`}>
                                  {step.completed ? (
                                    step.current ? <Truck size={16} /> : <CheckCircle size={16} />
                                  ) : (
                                    <Clock size={16} />
                                  )}
                                </div>
                                {index < trackingData.timeline.length - 1 && (
                                  <div className={`w-0.5 h-12 ${
                                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                                  }`}></div>
                                )}
                              </div>

                              {/* Step Content */}
                              <div className={`flex-1 pb-6 ${index === trackingData.timeline.length - 1 ? '' : 'border-b border-gray-200'}`}>
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className={`font-semibold ${
                                    step.current ? 'text-orange-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                                  }`}>
                                    {step.title}
                                  </h5>
                                  <span className="text-sm text-gray-500">{step.date}</span>
                                </div>
                                <p className="text-gray-600">{step.description}</p>
                                {step.current && (
                                  <div className="mt-2 flex items-center text-orange-600 text-sm">
                                    <RefreshCw size={14} className="mr-1 animate-spin" />
                                    Live Tracking Active
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details Sidebar */}
                      <div className="space-y-6">
                        
                        {/* Customer Information */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <User size={18} className="mr-2 text-blue-600" />
                            Customer Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-gray-600">Name</p>
                              <p className="font-medium text-gray-800">{trackingData.customer.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Phone</p>
                              <p className="font-medium text-gray-800">{trackingData.customer.phone}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Email</p>
                              <p className="font-medium text-gray-800">{trackingData.customer.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <Truck size={18} className="mr-2 text-blue-600" />
                            Shipping Details
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="text-gray-600">Carrier</p>
                              <p className="font-medium text-gray-800">{trackingData.shipping.carrier}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Tracking Number</p>
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-800">{trackingData.shipping.trackingNumber}</p>
                                <button
                                  onClick={() => copyToClipboard(trackingData.shipping.trackingNumber)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </div>
                            <div>
                              <p className="text-gray-600">Delivery Address</p>
                              <p className="font-medium text-gray-800 mt-1">{trackingData.shipping.address}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                            <Package size={18} className="mr-2 text-blue-600" />
                            Order Items
                          </h4>
                          <div className="space-y-3">
                            {trackingData.items.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <div>
                                  <p className="font-medium text-gray-800">{item.name}</p>
                                  <p className="text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-800">{item.price}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Support CTA */}
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                            <Shield size={18} className="mr-2" />
                            Need Help?
                          </h4>
                          <p className="text-blue-700 text-sm mb-4">
                            Our support team is here to help with any delivery questions.
                          </p>
                          <div className="space-y-2">
                            <a
                              href="tel:7377371008"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center"
                            >
                              <Phone size={14} className="mr-2" />
                              Call Support
                            </a>
                            <a
                              href="https://wa.me/917377371008"
                              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center"
                            >
                              <Mail size={14} className="mr-2" />
                              WhatsApp Support
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Additional Information */}
            <section className="bg-white rounded-2xl shadow-lg p-8 border border-blue-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Tracking FAQs
                </h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    question: "How often is tracking updated?",
                    answer: "Tracking updates every 2-4 hours when your package is in transit."
                  },
                  {
                    question: "What if my tracking hasn't updated?",
                    answer: "Allow 24 hours for initial tracking updates. Contact us if no update after 48 hours."
                  },
                  {
                    question: "Can I change my delivery address?",
                    answer: "Address changes are possible before shipment. Contact us immediately."
                  },
                  {
                    question: "What does 'In Transit' mean?",
                    answer: "Your package is moving between shipping facilities on its way to you."
                  },
                  {
                    question: "Do you deliver on weekends?",
                    answer: "Yes, we deliver 7 days a week in most locations."
                  },
                  {
                    question: "What if I miss the delivery?",
                    answer: "The courier will attempt delivery 2 more times or hold at nearest facility."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                      {faq.question}
                    </h4>
                    <p className="text-gray-600 text-xs">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .breadcrumbs-section,
          button,
          form {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default OrderTracking;