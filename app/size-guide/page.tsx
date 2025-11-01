"use client";

import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { 
  ChevronRight, 
  Ruler,
  Circle,
  AlertCircle,
  Info,
  Download,
  Printer,
  Share2,
  Heart,
  Sparkles,
  Eye,
  Hand,
  ArrowRight,
  CheckCircle,
  RulerIcon
} from 'lucide-react';

const SizeGuide: NextPage = () => {
  const [activeTab, setActiveTab] = useState('mukhi');
  const [selectedSize, setSelectedSize] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sizeCategories = {
    mukhi: [
      { size: '6-7mm', description: 'Extra Small', usage: 'Delicate jewelry, children', recommended: 'Kids, subtle wear' },
      { size: '8-9mm', description: 'Small', usage: 'Elegant pendants, subtle mala', recommended: 'Daily wear, office' },
      { size: '10-12mm', description: 'Medium', usage: 'Standard malas, prayer beads', recommended: 'Most popular choice' },
      { size: '13-15mm', description: 'Large', usage: 'Bold statement pieces', recommended: 'Meditation, spiritual practice' },
      { size: '16-18mm', description: 'Extra Large', usage: 'Powerful spiritual pieces', recommended: 'Experienced practitioners' }
    ],
    beads: [
      { size: '4mm', description: 'Tiny Beads', usage: 'Bracelets, delicate designs', recommended: 'Women, subtle energy' },
      { size: '6mm', description: 'Small Beads', usage: 'Standard bracelets, kids mala', recommended: 'Teens, daily wear' },
      { size: '8mm', description: 'Medium Beads', usage: 'Classic mala, prayer beads', recommended: 'Universal fit' },
      { size: '10mm', description: 'Large Beads', usage: 'Powerful mala, meditation', recommended: 'Spiritual practice' },
      { size: '12mm', description: 'Extra Large', usage: 'Statement pieces, gifts', recommended: 'Special occasions' }
    ],
    malas: [
      { size: '27"', description: 'Standard Mala', usage: '108+1 beads, neck wear', recommended: 'Prayer, meditation' },
      { size: '32"', description: 'Long Mala', usage: '108 beads, wrapping style', recommended: 'Multiple wraps' },
      { size: '36"', description: 'Extra Long', usage: '108 beads, body length', recommended: 'Tall individuals' },
      { size: '18"', description: 'Short Mala', usage: '54 beads, choker style', recommended: 'Women, fashion wear' },
      { size: '22"', description: 'Medium Mala', usage: '72 beads, princess length', recommended: 'Versatile wear' }
    ]
  };

  const mukhiTypes = [
    { faces: 1, name: 'Ek Mukhi', sizes: ['10-12mm', '13-15mm', '16-18mm'], rarity: 'Rare' },
    { faces: 2, name: 'Do Mukhi', sizes: ['8-9mm', '10-12mm', '13-15mm'], rarity: 'Common' },
    { faces: 3, name: 'Teen Mukhi', sizes: ['8-9mm', '10-12mm', '13-15mm'], rarity: 'Common' },
    { faces: 4, name: 'Char Mukhi', sizes: ['8-9mm', '10-12mm'], rarity: 'Common' },
    { faces: 5, name: 'Panch Mukhi', sizes: ['6-7mm', '8-9mm', '10-12mm', '13-15mm'], rarity: 'Most Common' },
    { faces: 6, name: 'Che Mukhi', sizes: ['8-9mm', '10-12mm'], rarity: 'Common' },
    { faces: 7, name: 'Saat Mukhi', sizes: ['10-12mm', '13-15mm'], rarity: 'Uncommon' },
    { faces: 8, name: 'Aath Mukhi', sizes: ['10-12mm', '13-15mm'], rarity: 'Uncommon' },
    { faces: 9, name: 'Nau Mukhi', sizes: ['13-15mm', '16-18mm'], rarity: 'Rare' },
    { faces: 10, name: 'Das Mukhi', sizes: ['10-12mm', '13-15mm'], rarity: 'Common' },
    { faces: 11, name: 'Gyarah Mukhi', sizes: ['13-15mm', '16-18mm'], rarity: 'Rare' },
    { faces: 12, name: 'Barah Mukhi', sizes: ['13-15mm', '16-18mm'], rarity: 'Rare' },
    { faces: 13, name: 'Terah Mukhi', sizes: ['13-15mm', '16-18mm'], rarity: 'Very Rare' },
    { faces: 14, name: 'Chaudah Mukhi', sizes: ['16-18mm'], rarity: 'Extremely Rare' }
  ];

  const measurementTips = [
    {
      icon: <Hand size={20} />,
      title: "Wrist Measurement",
      steps: [
        "Use a flexible measuring tape",
        "Measure around the widest part of your wrist",
        "Add 1-2 cm for comfortable fit",
        "Note the measurement in inches or cm"
      ]
    },
    {
      icon: <Ruler size={20} />,
      title: "Neck Measurement",
      steps: [
        "Measure around your neck where you'd wear the mala",
        "For loose fit, add 2-4 inches",
        "For choker style, add 0.5-1 inch",
        "Consider multiple wrap styles"
      ]
    },
    {
      icon: <Circle size={20} />,
      title: "Bead Size Reference",
      steps: [
        "4mm - Grain of rice",
        "8mm - Pea size",
        "12mm - Large grape",
        "16mm - Small cherry",
        "Compare with everyday objects"
      ]
    }
  ];

  const printGuide = () => {
    window.print();
  };

  const downloadGuide = () => {
    // In real implementation, this would download a PDF
    alert('Downloading Size Guide PDF...');
  };

  return (
    <>
      <Head>
        <title>Rudraksh Size Guide | Pashupatinath Rudraksh</title>
        <meta name="description" content="Comprehensive size guide for Rudraksh beads and malas. Choose the perfect size for your spiritual journey." />
      </Head>

      {/* Enhanced Breadcrumbs */}
      <div className="breadcrumbs-section bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <nav className="flex items-center space-x-2 text-sm mb-4">
              <Link href="/" className="text-purple-700 hover:text-purple-800 transition-colors duration-200">
                Home
              </Link>
              <ChevronRight size={16} className="text-purple-600" />
              <span className="text-purple-900 font-semibold">Size Guide</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
              Rudraksh Size Guide
            </h1>
            <p className="text-purple-700 text-lg md:text-xl max-w-3xl">
              Find the perfect Rudraksh size for your spiritual practice and personal style
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className={`max-w-7xl mx-auto transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

            {/* Quick Action Bar */}
            <div className="flex flex-wrap gap-4 justify-between items-center mb-8 p-6 bg-purple-50 rounded-2xl">
              <div>
                <h2 className="text-xl font-semibold text-purple-900 mb-2">
                  Need Help Choosing?
                </h2>
                <p className="text-purple-700">
                  Contact our experts for personalized size recommendations
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={downloadGuide}
                  className="bg-white text-purple-700 border border-purple-300 hover:bg-purple-50 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={printGuide}
                  className="bg-white text-purple-700 border border-purple-300 hover:bg-purple-50 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center"
                >
                  <Printer size={16} className="mr-2" />
                  Print Guide
                </button>
                <a
                  href="https://wa.me/917377371008?text=Hi,%20I%20need%20help%20choosing%20the%20right%20Rudraksh%20size"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center"
                >
                  <Share2 size={16} className="mr-2" />
                  Consult Expert
                </a>
              </div>
            </div>

            {/* Size Categories */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Ruler size={16} className="mr-2" />
                  Comprehensive Size Chart
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Rudraksh Size Categories
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Understand different size measurements for various Rudraksh types and purposes
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {Object.keys(sizeCategories).map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center capitalize ${
                      activeTab === category
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:text-gray-800 border border-gray-200'
                    }`}
                  >
                    <RulerIcon size={16} className="mr-2" />
                    {category === 'mukhi' ? 'Mukhi Sizes' : 
                     category === 'beads' ? 'Bead Sizes' : 'Mala Lengths'}
                  </button>
                ))}
              </div>

              {/* Size Table */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Size</th>
                        <th className="px-6 py-4 text-left font-semibold">Description</th>
                        <th className="px-6 py-4 text-left font-semibold">Common Usage</th>
                        <th className="px-6 py-4 text-left font-semibold">Recommended For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sizeCategories[activeTab as keyof typeof sizeCategories].map((item, index) => (
                        <tr 
                          key={index} 
                          className={`hover:bg-purple-50 transition-colors cursor-pointer ${
                            selectedSize === item.size ? 'bg-purple-100' : ''
                          }`}
                          onClick={() => setSelectedSize(item.size)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                              <span className="font-semibold text-gray-900">{item.size}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-700">{item.description}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-600">{item.usage}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <CheckCircle size={16} className="text-green-500 mr-2" />
                              <span className="text-gray-600">{item.recommended}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Mukhi Types Size Reference */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Mukhi-wise Size Availability
                </h2>
                <p className="text-gray-600 text-lg">
                  Different Mukhi Rudraksh have typical size ranges based on their natural formation
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mukhiTypes.map((mukhi) => (
                  <div key={mukhi.faces} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                    <div className="text-center mb-4">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                        {mukhi.faces}
                      </div>
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {mukhi.name}
                      </h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        mukhi.rarity === 'Rare' ? 'bg-red-100 text-red-800' :
                        mukhi.rarity === 'Very Rare' ? 'bg-purple-100 text-purple-800' :
                        mukhi.rarity === 'Extremely Rare' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {mukhi.rarity}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700 text-sm">Available Sizes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {mukhi.sizes.map((size, index) => (
                          <span 
                            key={index}
                            className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-medium border border-purple-200"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Visual Size Comparison */}
            <section className="mb-16">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Visual Size Comparison
                  </h2>
                  <p className="text-purple-100 text-lg">
                    See how different Rudraksh sizes compare visually
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-4 md:space-x-8 overflow-x-auto py-4">
                  {[
                    { size: '6mm', circle: 'w-8 h-8', label: 'Extra Small' },
                    { size: '8mm', circle: 'w-12 h-12', label: 'Small' },
                    { size: '10mm', circle: 'w-16 h-16', label: 'Medium' },
                    { size: '12mm', circle: 'w-20 h-20', label: 'Large' },
                    { size: '14mm', circle: 'w-24 h-24', label: 'Extra Large' },
                    { size: '16mm', circle: 'w-28 h-28', label: 'Jumbo' }
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`${item.circle} bg-white bg-opacity-20 rounded-full border-2 border-white border-opacity-30 flex items-center justify-center mb-2`}>
                        <div className="w-1/2 h-1/2 bg-white bg-opacity-40 rounded-full"></div>
                      </div>
                      <span className="text-sm font-semibold">{item.size}</span>
                      <span className="text-xs text-purple-200">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Measurement Guide */}
            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  How to Measure
                </h2>
                <p className="text-gray-600 text-lg">
                  Follow these simple steps to find your perfect fit
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {measurementTips.map((tip, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-100 p-3 rounded-xl mr-4">
                        <div className="text-purple-600">
                          {tip.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {tip.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {tip.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start text-gray-600">
                          <div className="bg-purple-100 text-purple-600 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                            {stepIndex + 1}
                          </div>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Pro Tips */}
            <section className="mb-16">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
                <div className="flex items-start">
                  <Sparkles className="text-amber-600 mr-4 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-4">
                      Professional Tips for Choosing Rudraksh Size
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        {[
                          "Consider your wrist/neck size for comfortable wear",
                          "Larger beads are better for meditation practices",
                          "Smaller beads work well for daily office wear",
                          "Multiple wraps need longer mala lengths"
                        ].map((tip, index) => (
                          <div key={index} className="flex items-start">
                            <Heart size={16} className="text-amber-600 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-amber-800">{tip}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {[
                          "Energy intensity varies with bead size",
                          "Children should wear smaller, lighter beads",
                          "Consider the purpose: prayer vs fashion",
                          "Consult experts for spiritual guidance"
                        ].map((tip, index) => (
                          <div key={index} className="flex items-start">
                            <Eye size={16} className="text-amber-600 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-amber-800">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-12 text-white">
                <h3 className="text-3xl font-bold mb-4">
                  Still Unsure About Size?
                </h3>
                <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
                  Our Rudraksh experts are here to help you choose the perfect size for your needs and spiritual journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://wa.me/917377371008?text=Hi,%20I%20need%20help%20choosing%20the%20right%20Rudraksh%20size"
                    className="bg-white text-purple-600 hover:bg-purple-50 py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <Share2 size={20} className="mr-2" />
                    WhatsApp Expert
                  </a>
                  <a
                    href="tel:7377371008"
                    className="border-2 border-white text-white hover:bg-white hover:text-purple-600 py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <ArrowRight size={20} className="mr-2" />
                    Call for Guidance
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .breadcrumbs-section,
          button,
          a {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default SizeGuide;