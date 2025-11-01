"use client";

import Link from 'next/link';
import Image from 'next/image';
import { memo, useState, useEffect } from 'react';

// Social media icons as separate components for better performance
const SocialIcons = memo(() => {
  // Function to handle social media clicks
  const handleSocialClick = (platform: string, url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button 
        onClick={() => handleSocialClick('youtube', 'https://www.youtube.com/@PashupatinathRudraksh')}
        className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors"
        aria-label="YouTube"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
      </button>
      <button 
        onClick={() => handleSocialClick('instagram', 'https://www.instagram.com/pashupatinathrudraksh/?igsh=MWlkbXBicDM2YWY5dQ%3D%3D')}
        className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors"
        aria-label="Instagram"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </button>
      <button 
        onClick={() => handleSocialClick('facebook', '#')}
        className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors"
        aria-label="Facebook"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      </button>
      <button 
        onClick={() => handleSocialClick('linkedin', '#')}
        className="bg-[#f5821f] p-2 rounded-full hover:bg-[#e07515] transition-colors"
        aria-label="LinkedIn"
      >
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </button>
    </>
  );
});

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
const ContactInfo = memo(() => {
  // Function to handle phone call
  const handleCallClick = () => {
    window.open('tel:7377371008', '_self');
  };

  // Function to handle email
  const handleEmailClick = () => {
    window.open('mailto:prudraksh108@gmail.com', '_self');
  };

  // Function to handle location/map
  const handleLocationClick = () => {
    const address = "Farishta Complex, I-Block, 5th Floor, Rajbandha Maidan, Raipur, Chhattisgarh-492001";
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-3">
      <button 
        onClick={handleLocationClick}
        className="flex items-start w-full text-left hover:bg-white/5 rounded-lg p-2 transition-colors"
      >
        <svg className="w-5 h-5 text-[#f5821f] mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6  0 3 3 0 016 0z" />
        </svg>
        <span className="text-gray-200 text-sm">Farishta Complex, I-Block, 5th Floor, Rajbandha Maidan, Raipur, Chhattisgarh-492001</span>
      </button>
      
      <button 
        onClick={handleEmailClick}
        className="flex items-center w-full text-left hover:bg-white/5 rounded-lg p-2 transition-colors"
      >
        <svg className="w-5 h-5 text-[#f5821f] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="text-gray-200 text-sm">prudraksh108@gmail.com</span>
      </button>
      
      <button 
        onClick={handleCallClick}
        className="flex items-center w-full text-left hover:bg-white/5 rounded-lg p-2 transition-colors"
      >
        <svg className="w-5 h-5 text-[#f5821f] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1  0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="text-gray-200 text-sm">7377371008</span>
      </button>
    </div>
  );
});

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

const LogoSection = memo(() => {
  // Function to handle phone call from the main number
  const handleMainCallClick = () => {
    window.open('tel:7377371008', '_self');
  };

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-28 h-28">
        <Image
          src="https://www.pashupatinathrudraksh.com/storage/app/public/photos/2/PR_Logo.png"
          alt="Pashupatinath Rudraksh Logo"
          fill
          sizes="112px"
          className="object-contain"
          priority
        />
      </div>
      
      <p className="text-sm text-gray-200 mb-6 leading-relaxed">
        Authentic, high-quality Rudraksha beads and spiritual items for peace, health, and spiritual growth.
      </p>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-100">Got Question? Call us 24/7</h3>
        <button 
          onClick={handleMainCallClick}
          className="text-2xl font-bold text-[#f5821f] hover:text-[#f8a45f] transition-colors cursor-pointer"
        >
          7377371008
        </button>
      </div>
    </div>
  );
});

LogoSection.displayName = 'LogoSection';

// Mobile Bottom Menu Component - Fixed for Safari
const MobileBottomMenu = memo(() => {
  const [activeItem, setActiveItem] = useState('home');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [lastScrollY]);

  // Function to handle WhatsApp consultation
  const handleConsultationClick = () => {
    const phoneNumber = '7377371008';
    const message = 'Hello! I would like to get a consultation about Rudraksha beads.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Function to handle phone call
  const handleCallClick = () => {
    window.open('tel:7377371008', '_self');
  };

  const menuItems = [
    { 
      key: 'home', 
      label: 'Home', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ), 
      href: '/' 
    },
    { 
      key: 'consultation', 
      label: 'Consultation', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ), 
      onClick: handleConsultationClick,
      isExternal: true
    },
    { 
      key: 'rudraksha', 
      label: 'Rudraksha', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      ), 
      href: '/products?category=rudraksha'
    },
    { 
      key: 'accessories', 
      label: 'Accessories', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ), 
      href: '/products?category=accessories'
    },
    { 
      key: 'call', 
      label: 'Call Us', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ), 
      onClick: handleCallClick,
      isExternal: true
    }
  ];

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 py-3 px-2 flex justify-between items-center md:hidden z-50
      shadow-2xl transition-transform duration-300 ease-in-out
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      safe-area-inset-bottom
    `}
    style={{
      // Safari specific fixes
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))'
    }}>
      {menuItems.map((item) => (
        item.onClick ? (
          // Button for external links (WhatsApp, Call)
          <button
            key={item.key}
            onClick={() => {
              setActiveItem(item.key);
              item.onClick?.();
            }}
            className={`flex flex-col items-center justify-center flex-1 px-1 py-2 rounded-xl transition-all duration-200 min-w-0 ${
              activeItem === item.key 
                ? 'text-[#f5821f] bg-orange-50 transform scale-105' 
                : 'text-gray-600 hover:text-[#f5821f] hover:bg-gray-50'
            }`}
          >
            <div className={`transition-transform duration-200 ${activeItem === item.key ? 'scale-110' : 'scale-100'}`}>
              {item.icon}
            </div>
            <span className="text-xs font-medium mt-1 whitespace-nowrap">{item.label}</span>
          </button>
        ) : (
          // Link for internal navigation
          <Link
            key={item.key}
            href={item.href || '#'}
            className={`flex flex-col items-center justify-center flex-1 px-1 py-2 rounded-xl transition-all duration-200 min-w-0 ${
              activeItem === item.key 
                ? 'text-[#f5821f] bg-orange-50 transform scale-105' 
                : 'text-gray-600 hover:text-[#f5821f] hover:bg-gray-50'
            }`}
            onClick={() => setActiveItem(item.key)}
          >
            <div className={`transition-transform duration-200 ${activeItem === item.key ? 'scale-110' : 'scale-100'}`}>
              {item.icon}
            </div>
            <span className="text-xs font-medium mt-1 whitespace-nowrap">{item.label}</span>
          </Link>
        )
      ))}
    </div>
  );
});

MobileBottomMenu.displayName = 'MobileBottomMenu';

export default function Footer() {
  const informationLinks = [
    { href: "/history", label: "About Us" },
    { href: "/#faq", label: "FAQ" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/contactus", label: "Contact Us" }
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
    <>
      <footer className="bg-gradient-to-b from-[#5F3623] to-[#7a462c] text-white pb-20 md:pb-0 safe-area-inset-bottom">
        {/* Main footer content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company info and logo */}
            <div className="lg:col-span-1">
              <LogoSection />
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

        {/* Back to top button - Adjusted for mobile bottom menu */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 bg-[#f5821f] text-white p-3 rounded-full shadow-lg hover:bg-[#e07515] transition-all duration-300 z-50 md:bottom-6 md:right-6 safe-area-inset-bottom"
          aria-label="Back to top"
          style={{
            bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </footer>

      {/* Mobile Bottom Menu */}
      <MobileBottomMenu />
    </>
  );
}