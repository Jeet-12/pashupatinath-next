"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SevenMukhiLandingPage() {
  const [selectedVariant, setSelectedVariant] = useState('normal');
  const [isStickyVisible, setIsStickyVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsStickyVisible(scrollPosition > 500);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Sticky CTA Bar */}
      <motion.div
        className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black text-white py-3 px-4 z-50 shadow-2xl ${
          isStickyVisible ? 'block' : 'hidden'
        }`}
        initial={{ y: 100 }}
        animate={{ y: isStickyVisible ? 0 : 100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold truncate">Your Wealth. Your Stability. Your Peace.</h3>
              <p className="text-amber-200 text-sm sm:text-base truncate">7 Mukhi Nepali Rudraksha • Today: ₹1680 (20% OFF)</p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-center">
              <motion.button
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg text-sm sm:text-base flex-1 sm:flex-none min-w-[140px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('pricing')}
              >
                Buy Now
              </motion.button>
              <motion.button
                className="border-2 border-green-500 text-green-500 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold hover:bg-green-500 hover:text-white transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none min-w-[140px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                WhatsApp Expert
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left - Product Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl sm:rounded-2xl overflow-hidden bg-white">
                  <Image
                    src="/7-mukhi-rudraksha.jpg"
                    alt="7 Mukhi Nepali Rudraksha - Authentic Natural Bead"
                    fill
                    className="object-contain"
                    priority
                  />
                  {/* Badges */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1 sm:gap-2">
                    <span className="bg-gradient-to-r from-red-500 to-orange-600 text-white text-xs sm:text-sm font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-full shadow-lg">
                      🔥 20% OFF
                    </span>
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs sm:text-sm font-bold py-1 sm:py-2 px-2 sm:px-4 rounded-full shadow-lg">
                      ✨ LIMITED OFFER
                    </span>
                  </div>
                </div>
                
                {/* Variant Preview */}
                <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6 justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl border-2 border-amber-500 bg-amber-50 mx-auto"></div>
                    <span className="text-xs mt-1 block">Normal</span>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl border-2 border-gray-300 bg-gray-100 mx-auto flex items-center justify-center">
                      <span className="text-gray-400 text-sm sm:text-lg">⚪</span>
                    </div>
                    <span className="text-xs mt-1 block">Silver</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-amber-900 leading-tight">
                  7 Mukhi Nepali Rudraksha
                  <span className="block text-lg sm:text-xl lg:text-2xl xl:text-3xl text-amber-700 mt-1 sm:mt-2">
                    For Wealth, Stability & Emotional Strength
                  </span>
                </h1>
                
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 rounded-xl sm:rounded-2xl border-l-4 border-amber-500">
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg font-semibold">
                    Struggling with financial setbacks, stress, or stuck progress?
                  </p>
                  <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                    This Mahalakshmi-blessed bead attracts prosperity, removes money blockages, and builds emotional strength.
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <motion.div 
                id="pricing"
                className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-2xl"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-baseline gap-2 sm:gap-4 mb-1 sm:mb-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold">₹1680.00</span>
                  <span className="text-lg sm:text-xl line-through opacity-80">₹2100.00</span>
                  <span className="bg-white text-amber-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                    20% OFF
                  </span>
                </div>
                <p className="text-amber-100 font-semibold text-sm sm:text-base">🎁 Limited Festival Offer – Ends Soon</p>
              </motion.div>

              {/* Variant Picker */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">Choose Your Preference:</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <motion.button
                    onClick={() => setSelectedVariant('normal')}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                      selectedVariant === 'normal' 
                        ? 'border-amber-500 bg-amber-50 shadow-lg' 
                        : 'border-gray-300 hover:border-amber-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold text-gray-800 text-sm sm:text-base">Normal Capping</div>
                    <div className="text-xs sm:text-sm text-gray-600">Classic & Pure</div>
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedVariant('silver')}
                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 ${
                      selectedVariant === 'silver' 
                        ? 'border-amber-500 bg-amber-50 shadow-lg' 
                        : 'border-gray-300 hover:border-amber-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-semibold text-gray-800 text-sm sm:text-base">Silver Capping</div>
                    <div className="text-xs sm:text-sm text-gray-600">+₹200 • Enhanced</div>
                  </motion.button>
                </div>
                <motion.button
                  className="w-full p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl hover:border-amber-400 transition-colors duration-300"
                  whileHover={{ scale: 1.01 }}
                >
                  <span className="text-gray-600 text-sm sm:text-base">🎨 Choose Thread Colour</span>
                </motion.button>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <motion.button
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💫 Buy Now – Get Yours
                </motion.button>
                <motion.button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💬 WhatsApp Guidance
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4">
                {[
                  '✔ 100% Authentic Nepali Bead',
                  '✔ Ethical Lab Certification',
                  '✔ Free Shipping Across India',
                  '✔ Secure Payment',
                  '✔ Expert Guidance'
                ].map((badge, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center text-xs sm:text-sm text-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    {badge}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-3 sm:mb-4">How 7 Mukhi Helps You</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              This sacred bead is linked to Goddess Mahalakshmi and ruled by Planet Saturn (Shani). 
              It's traditionally worn to bring wealth, stability, and long-term emotional balance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: '💰',
                title: 'Attracts Wealth & Business Growth',
                description: 'Believed to support abundance, income flow, and better money opportunities – especially for business owners or professionals facing financial blocks.'
              },
              {
                icon: '🪐',
                title: 'Removes Saturn-Related Obstacles',
                description: 'Associated with easing Shani challenges like delays, debt, and repeated setbacks, helping you move forward with stability.'
              },
              {
                icon: '🧘',
                title: 'Calms Stress & Emotional Overload',
                description: 'Supports emotional resilience in tough phases of life, helps reduce fear, insecurity, and constant worry.'
              },
              {
                icon: '🎯',
                title: 'Grounded Mind for Better Decisions',
                description: 'Encourages clear thinking in money matters and career moves instead of panic-based decisions.'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{benefit.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 sm:mb-3">{benefit.title}</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Wear Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-amber-100 to-orange-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4 sm:mb-6">Is 7 Mukhi Right For You?</h2>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  "You're facing financial instability, slow cash flow, or debt pressure",
                  "You're in business / entrepreneurship and want growth and stability",
                  "You feel mentally exhausted, anxious, or emotionally heavy",
                  "You're going through a tough Saturn (Shani) period or Sade Sati type struggle",
                  "You're praying for abundance, support, and blessings from Goddess Mahalakshmi",
                  "You want long-term stability – not just 'quick luck'"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-2 sm:space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                      <span className="text-white text-xs sm:text-sm">✓</span>
                    </div>
                    <span className="text-gray-800 text-sm sm:text-base lg:text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="mt-6 sm:mt-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-2xl w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✅ Yes, I Need This – Buy My 7 Mukhi Now
              </motion.button>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="aspect-square rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                  <span className="text-4xl sm:text-6xl">🛡️</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What You Get With Your Purchase
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: '📿',
                title: 'Your 7 Mukhi Nepali Rudraksha',
                description: 'Ethically sourced from the high-altitude regions of Nepal. Each bead is individually checked for natural mukhs (faces) and quality.',
                button: null
              },
              {
                icon: '📜',
                title: 'Authenticity Certificate (Lab-Tested)',
                description: 'Every bead comes with lab certification so you know you\'re wearing the real thing – not a market duplicate.',
                button: null
              },
              {
                icon: '💬',
                title: 'Personalized Wearing Guidance',
                description: 'Our experts tell you how to energize and wear it based on your situation (finance, career stress, emotional healing, etc.).',
                button: 'Get Free Guidance on WhatsApp'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{item.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{item.description}</p>
                
                <div className="h-32 sm:h-40 bg-gradient-to-br from-amber-200 to-orange-200 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl">{item.icon}</span>
                </div>
                
                {item.button && (
                  <motion.button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-sm sm:text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.button}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Wear & Expectations */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-amber-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Left - How to Wear */}
            <motion.div
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900 mb-4 sm:mb-6">How to Wear</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs sm:text-sm">1</span>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg flex-1">
                    Wear it in a thread or silver capping close to the skin so its energy stays with you throughout the day.
                  </p>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs sm:text-sm">2</span>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg flex-1">
                    You can wear it around the neck or keep it as a bracelet as advised by our expert.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right - What to Expect */}
            <motion.div
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900 mb-4 sm:mb-6">What to Expect</h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="p-3 sm:p-4 bg-amber-50 rounded-xl sm:rounded-2xl border-l-4 border-amber-500">
                  <p className="text-gray-700 font-semibold text-sm sm:text-base">
                    Most people come to 7 Mukhi for two core reasons:
                  </p>
                  <ul className="mt-2 space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-base">
                    <li>• Financial blockages and career uncertainty</li>
                    <li>• Emotional heaviness / overthinking / instability</li>
                  </ul>
                </div>
                <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                  This bead is traditionally worn to build patience, grounded thinking, and long-term stability in both money and mind – not "overnight magic."
                </p>
                <motion.button
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 text-sm sm:text-base w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  💬 Talk to an Expert Before You Buy →
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-3 sm:mb-4">Real People. Real Experiences.</h2>
            <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
              <div className="flex text-xl sm:text-2xl text-yellow-400">
                {'⭐'.repeat(5)}
              </div>
              <span className="text-lg sm:text-xl text-gray-700 font-semibold">5/5 Based on Verified Buyers</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            {[
              {
                review: "Thank you for great quality, they even gave me an adjustable thread and best product.",
                author: "Sarvesh Fuke",
                date: "Aug 16, 2025",
                verified: true
              },
              {
                review: "Authentic product with certificate. Amazing service.",
                author: "Arambh Choukse",
                date: "Aug 16, 2025",
                verified: true
              },
              {
                review: "Genuine Nepali rudraksha with proper certification. Feeling positive changes already.",
                author: "Priya Sharma",
                date: "Aug 15, 2025",
                verified: true
              },
              {
                review: "Excellent guidance provided. The bead quality is superb and packaging was very respectful.",
                author: "Rahul Verma",
                date: "Aug 14, 2025",
                verified: true
              }
            ].map((review, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex text-yellow-400 text-lg sm:text-xl mb-3 sm:mb-4">
                  {'⭐'.repeat(5)}
                </div>
                <p className="text-gray-700 text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 italic">"{review.review}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">{review.author}</div>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      {review.verified && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Verified</span>
                      )}
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {['✔ Verified Buyer', '✔ Certificate Included', '✔ Fast Shipping', '✔ Expert Support'].map((badge, index) => (
              <div key={index} className="bg-white px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-amber-200 shadow-sm">
                <span className="text-gray-700 font-semibold text-xs sm:text-sm">{badge}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-6 sm:mt-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-2xl w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🛍️ I Want My Certified 7 Mukhi → Buy Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Brand Credibility */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-amber-100 to-orange-100">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Pashupatinath Rudraksha?
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {[
              {
                icon: '🇳🇵',
                title: '100% Authentic Nepali Rudraksha',
                description: 'Directly sourced from high-altitude regions of Nepal, not mass-market imitation.'
              },
              {
                icon: '🔬',
                title: 'Ethical Lab Certification',
                description: 'Every bead is individually lab-checked and certified for authenticity.'
              },
              {
                icon: '📦',
                title: 'Spiritual Packaging',
                description: 'You receive it in sacred, respectful packaging prepared for spiritual wear.'
              },
              {
                icon: '👨‍💼',
                title: 'Expert Guidance, Lifetime Support',
                description: 'Correct wearing instructions, energizing process, and ongoing support from our experts.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-gray-700 text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mission Statement */}
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-200">
              <h3 className="text-xl sm:text-2xl font-bold text-amber-900 mb-3 sm:mb-4">Our Mission</h3>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                We believe Rudraksha is not "just a product."<br />
                It's a personal shield for peace, clarity, and prosperity.
              </p>
              <p className="text-gray-600 text-sm sm:text-base">
                Our goal is to help you wear it properly – so you actually feel the difference in your life.
              </p>
            </div>

            <motion.button
              className="mt-6 sm:mt-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-2xl w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🛍️ Get My Authentic 7 Mukhi Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-4 sm:space-y-6">
            {[
              {
                question: "How do I choose if 7 Mukhi is right for me?",
                answer: "If you're facing financial instability, repeated setbacks, debt pressure, stress from responsibility, or feel emotionally drained, 7 Mukhi is traditionally worn for stability, wealth support, and emotional strength. You can also message our expert for a quick personal check."
              },
              {
                question: "Is this real Nepali Rudraksha or Indonesian/duplicate?",
                answer: "Our beads are sourced from the high-altitude regions of Nepal and individually lab-certified so you only receive a genuine, natural 7-face bead."
              },
              {
                question: "Can women wear Rudraksha?",
                answer: "Yes. There is no restriction. Anyone seeking stability, prosperity and inner balance can wear it with the right guidance."
              },
              {
                question: "How fast will I get it?",
                answer: "We offer free shipping across India. Orders are typically dispatched quickly and delivered to your doorstep with safe packaging."
              },
              {
                question: "Do I have to follow complicated rituals?",
                answer: "No complicated puja needed. We'll tell you how to energize and wear it in a simple, respectful way. You can start with faith and consistency."
              },
              {
                question: "What if I have questions after delivery?",
                answer: "You'll have direct access to our Rudraksha expert on WhatsApp for after-sales guidance."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <h3 className="text-lg sm:text-xl font-bold text-amber-900 mb-2 sm:mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Your Wealth. Your Stability. Your Peace.</h2>
            <p className="text-lg sm:text-xl text-amber-200 mb-4 sm:mb-6">
              7 Mukhi Nepali Rudraksha<br />
              • For prosperity & growth<br />
              • For relief from financial stress<br />
              • For emotional grounding in tough times
            </p>

            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md mx-auto mb-6 sm:mb-8">
              <div className="text-2xl sm:text-3xl font-bold">Today's Price: ₹1680</div>
              <div className="text-amber-100 text-sm sm:text-base">(20% OFF) • Free Shipping Across India • Lab Certificate Included</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4 sm:mb-6">
              <motion.button
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-2xl w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🛍️ Buy My 7 Mukhi Now
              </motion.button>
              <motion.button
                className="border-2 border-green-500 text-green-500 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-green-500 hover:text-white transition-all duration-300 w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💬 Ask an Expert on WhatsApp
              </motion.button>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-300">
              <span>🔒 Secure Payment</span>
              <span>✅ Authenticity Guaranteed</span>
              <span>🚚 Free Shipping</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}