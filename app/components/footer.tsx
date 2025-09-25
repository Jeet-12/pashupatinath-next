"use client";

import Link from 'next/link';
import { memo } from 'react';

// Social media icons as separate components for better performance
const SocialIcons = memo(() => (
  <>
    <a href="#" className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors" aria-label="Twitter">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
      </svg>
    </a>
    <a href="#" className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors" aria-label="Facebook">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
      </svg>
    </a>
    <a href="#" className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors" aria-label="Instagram">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    </a>
    <a href="#" className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors" aria-label="LinkedIn">
      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0  0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    </a>
  </>
));

SocialIcons.displayName = 'SocialIcons';

// Payment icons component
const PaymentIcons = memo(() => (
  <div className="flex space-x-4 mt-4 md:mt-0">
    <div className="bg-white p-1 rounded h-6 flex items-center justify-center">
      <span className="text-xs font-bold text-blue-800">VISA</span>
    </div>
    <div className="bg-white p-1 rounded h-6 flex items-center justify-center">
      <span className="text-xs font-bold text-red-600">MC</span>
    </div>
    <div className="bg-white p-1 rounded h-6 flex items-center justify-center">
      <span className="text-xs font-bold text-blue-500">PP</span>
    </div>
    <div className="bg-white p-1 rounded h-6 flex items-center justify-center">
      <span className="text-xs font-bold text-blue-900">AMEX</span>
    </div>
  </div>
));

PaymentIcons.displayName = 'PaymentIcons';

// Contact information component
const ContactInfo = memo(() => (
  <div className="space-y-3">
    <div className="flex items-start">
      <svg className="w-5 h-5 text-[#f5821f] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6  0 3 3 0 016 0z" />
      </svg>
      <span className="text-gray-200 text-sm">Farishta Complex, I-Block, 5th Floor, Rajbandha Maidan, Raipur, Chhattisgarh-492001</span>
    </div>
    
    <div className="flex items-center">
      <svg className="w-5 h-5 text-[#f5821f] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      <span className="text-gray-200 text-sm">prudraksh108@gmail.com</span>
    </div>
    
    <div className="flex items-center">
      <svg className="w-5 h-5 text-[#f5821f] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1  0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      <span className="text-gray-200 text-sm">7377371008</span>
    </div>
  </div>
));

ContactInfo.displayName = 'ContactInfo';

// Link lists component
const LinkList = memo(({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4 border-b border-[#f5821f] pb-2">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link 
            href={link.href} 
            className="text-gray-200 hover:text-[#f5821f] transition-colors text-sm"
            prefetch={false}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
));

LinkList.displayName = 'LinkList';

export default function Footer() {
  const informationLinks = [
    { href: "/about", label: "About Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/contact", label: "Contact Us" }
  ];

  const helpLinks = [
    { href: "/customer-service", label: "Customer Service" },
    { href: "/returns", label: "Returns Policy" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/shipping", label: "Shipping Info" },
    { href: "/tracking", label: "Order Tracking" },
    { href: "/size-guide", label: "Size Guide" }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#5F3623] to-[#7a462c] text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info and logo */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#f5821f] to-[#f8a45f] bg-clip-text text-transparent">
                PASHUPATINATH RUDRAKSH
              </div>
              <p className="text-sm text-gray-200 mt-2 leading-relaxed">
                Authentic, high-quality Rudraksha beads and spiritual items for peace, health, and spiritual growth.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-100">Got Question? Call us 24/7</h3>
              <p className="text-2xl font-bold text-[#f5821f] hover:text-[#f8a45f] transition-colors">
                7377371008
              </p>
            </div>
          </div>

          {/* Information links */}
          <LinkList title="Information" links={informationLinks} />

          {/* Help links */}
          <LinkList title="Help" links={helpLinks} />

          {/* Contact information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-[#f5821f] pb-2">Get In Touch</h3>
            <ContactInfo />
            
            {/* Social media links */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-100">Follow Us</h3>
              <div className="flex space-x-3">
                <SocialIcons />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright section */}
      <div className="border-t border-[#7a462c] py-6 bg-[#5F3623]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-200 text-sm text-center md:text-left">
              © {new Date().getFullYear()} PashupatinathRudraksh. All rights reserved.
            </p>
            <PaymentIcons />
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-[#f5821f] text-white p-3 rounded-full shadow-lg hover:bg-[#e07515] transition-colors z-50"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}