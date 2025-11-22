import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { 
  ChevronRight, 
  Truck,
  Package,
  Clock,
  MapPin,
  ShieldCheck,
  Globe
} from 'lucide-react';
import PolicyNavigation from '../returns/PolicyNavigation'; // Assuming navigation is shared

export const metadata: Metadata = {
  title: 'Shipping Policy | Pashupatinath Rudraksh',
  description: 'Learn about our shipping process, delivery timelines, and policies for domestic and international orders.',
};

const ShippingPolicyPage = () => {

  const shippingPartners = [
    { name: 'Delhivery', logo: '/images/delhivery-logo.png' },
    { name: 'Blue Dart', logo: '/images/bluedart-logo.png' },
    { name: 'FedEx', logo: '/images/fedex-logo.png' },
    { name: 'DHL', logo: '/images/dhl-logo.png' },
  ];

  return (
    <>
      {/* Breadcrumbs Section */}
      <div className="breadcrumbs-section bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <nav className="flex items-center space-x-2 text-sm mb-4">
              <Link href="/" className="text-amber-700 hover:text-amber-800 transition-colors duration-200">
                Home
              </Link>
              <ChevronRight size={16} className="text-amber-600" />
              <span className="text-amber-900 font-semibold">Shipping Policy</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Shipping Policy
            </h1>
            <p className="text-amber-700 text-lg md:text-xl max-w-3xl">
              Your sacred items, delivered with care and reverence.
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
              <Suspense fallback={<div className="bg-gray-100 p-4 rounded-lg animate-pulse h-48">Loading Navigation...</div>}>
                <PolicyNavigation />
              </Suspense>
            </div>

            {/* Policy Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-8 text-white">
                  <div className="flex items-center">
                    <Truck size={48} className="mr-6" />
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Shipping & Delivery</h2>
                      <p className="text-amber-100 text-lg">
                        Ensuring your spiritual items reach you safely and on time.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Policy Content */}
                <div className="p-8 space-y-12">

                  {/* Processing Time */}
                  <section id="processing-time" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <Clock size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Order Processing</h3>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <p className="text-gray-700 leading-relaxed">
                        All orders are processed within <strong>1-2 business days</strong> after receiving your order confirmation email. You will receive another notification when your order has shipped. Please note that we do not ship on weekends or holidays.
                      </p>
                    </div>
                  </section>

                  {/* Domestic Shipping */}
                  <section id="domestic-shipping" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-3 rounded-xl mr-4">
                        <MapPin size={24} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Domestic Shipping (Within India)</h3>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h4 className="font-semibold text-green-800 mb-3">Estimated Delivery Time</h4>
                      <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li><strong>Metro Cities:</strong> 3-5 business days</li>
                        <li><strong>Tier II & III Cities:</strong> 5-7 business days</li>
                        <li><strong>Remote Areas:</strong> 7-10 business days</li>
                      </ul>
                      <p className="text-gray-600 text-sm mt-4">
                        Shipping charges for your order will be calculated and displayed at checkout. We offer free shipping on all prepaid orders above ₹2000.
                      </p>
                    </div>
                  </section>

                  {/* International Shipping */}
                  <section id="international-shipping" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-3 rounded-xl mr-4">
                        <Globe size={24} className="text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">International Shipping</h3>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <p className="text-gray-700 mb-4">
                        We offer international shipping to most countries. Your order may be subject to import duties and taxes (including VAT), which are incurred once a shipment reaches your destination country. <strong>Pashupatinath Rudraksh is not responsible for these charges</strong> if they are applied and are your responsibility as the customer.
                      </p>
                      <h4 className="font-semibold text-purple-800 mb-3">Estimated Delivery Time</h4>
                      <p className="text-gray-700">
                        International delivery usually takes <strong>7-21 business days</strong>, depending on the destination and customs processing.
                      </p>
                    </div>
                  </section>

                  {/* Order Tracking */}
                  <section id="order-tracking" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="bg-orange-100 p-3 rounded-xl mr-4">
                        <Package size={24} className="text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">How to Track Your Order</h3>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                      <p className="text-gray-700 mb-4">
                        When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.
                      </p>
                      <Link href="/tracking" className="inline-block bg-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                        Track Your Order Here
                      </Link>
                    </div>
                  </section>

                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
                  <p className="text-gray-600 text-sm">
                    If you have any further questions, please don't hesitate to contact us at <a href="mailto:prudraksh108@gmail.com" className="text-amber-700 font-semibold">prudraksh108@gmail.com</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicyPage;