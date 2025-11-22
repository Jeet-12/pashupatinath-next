"use client";

import { useState, useEffect } from 'react';
import { 
  Ban, 
  CreditCard, 
  AlertTriangle, 
  Package, 
  Phone, 
  FileText 
} from 'lucide-react';

const policySections = [
  { id: 'no-return-policy', title: 'No Return Policy', icon: <Ban size={18} /> },
  { id: 'refund-policy', title: 'Refund Policy', icon: <CreditCard size={18} /> },
  { id: 'damaged-items', title: 'Damaged Items', icon: <AlertTriangle size={18} /> },
  { id: 'wrong-items', title: 'Wrong Items', icon: <Package size={18} /> },
  { id: 'contact', title: 'Contact Support', icon: <Phone size={18} /> }
];

export default function PolicyNavigation() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.policy-section');
      let currentSection = '';
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < 150) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial active section
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
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
      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <h4 className="font-semibold text-red-800 mb-2 flex items-center"><Ban size={16} className="mr-2" />Important Notice</h4>
        <p className="text-red-700 text-sm">No returns accepted for change of mind or personal reasons.</p>
      </div>
    </div>
  );
}