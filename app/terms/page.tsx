import Link from 'next/link';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { 
  ChevronRight, 
  FileText,
  User,
  Shield,
  Copyright,
  AlertOctagon,
  Scale,
  Globe
} from 'lucide-react';
import PolicyNavigation from '../returns/PolicyNavigation'; 

export const metadata: Metadata = {
  title: 'Terms and Conditions | Pashupatinath Rudraksh',
  description: 'Please read our terms and conditions carefully before using our website and purchasing our products.',
};

const TermsAndConditionsPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
              <span className="text-amber-900 font-semibold">Terms & Conditions</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-amber-700 text-lg md:text-xl max-w-3xl">
              Your agreement for using our services and purchasing our sacred products.
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
                    <FileText size={48} className="mr-6" />
                    <div>
                      <h2 className="text-3xl font-bold mb-2">User Agreement</h2>
                      <p className="text-amber-100 text-lg">
                        Last Updated: {currentDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Policy Content */}
                <div className="p-8 space-y-12">

                  <section id="introduction" className="policy-section scroll-mt-24">
                    <p className="text-gray-700 leading-relaxed">
                      Welcome to Pashupatinath Rudraksh. These terms and conditions outline the rules and regulations for the use of our website and the purchase of our products. By accessing this website, we assume you accept these terms and conditions. Do not continue to use Pashupatinath Rudraksh if you do not agree to all of the terms and conditions stated on this page.
                    </p>
                  </section>

                  <section id="user-accounts" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-3 rounded-xl mr-4">
                        <User size={24} className="text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">User Accounts</h3>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <p className="text-gray-700 leading-relaxed">
                        When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                      </p>
                    </div>
                  </section>

                  <section id="intellectual-property" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-3 rounded-xl mr-4">
                        <Copyright size={24} className="text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Intellectual Property</h3>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <p className="text-gray-700 leading-relaxed">
                        The service and its original content, features, and functionality are and will remain the exclusive property of Pashupatinath Rudraksh and its licensors. The content is protected by copyright, trademark, and other laws of both India and foreign countries.
                      </p>
                    </div>
                  </section>

                  <section id="limitation-of-liability" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 p-3 rounded-xl mr-4">
                        <AlertOctagon size={24} className="text-red-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Limitation of Liability</h3>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <p className="text-gray-700 leading-relaxed">
                        In no event shall Pashupatinath Rudraksh, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                      </p>
                    </div>
                  </section>

                  <section id="governing-law" className="policy-section scroll-mt-24">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-3 rounded-xl mr-4">
                        <Scale size={24} className="text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Governing Law</h3>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <p className="text-gray-700 leading-relaxed">
                        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                      </p>
                    </div>
                  </section>

                </div>

                <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
                  <p className="text-gray-600 text-sm">
                    By using our site, you signify your acceptance of these terms. If you have any questions, please contact us.
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

export default TermsAndConditionsPage;