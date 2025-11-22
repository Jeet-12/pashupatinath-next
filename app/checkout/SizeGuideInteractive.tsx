"use client";

import { useState } from 'react';
import { RulerIcon, CheckCircle } from 'lucide-react';

type SizeCategory = {
  size: string;
  description: string;
  usage: string;
  recommended: string;
};

type SizeCategories = {
  mukhi: SizeCategory[];
  beads: SizeCategory[];
  malas: SizeCategory[];
};

interface SizeGuideInteractiveProps {
  sizeCategories: SizeCategories;
}

export default function SizeGuideInteractive({ sizeCategories }: SizeGuideInteractiveProps) {
  const [activeTab, setActiveTab] = useState('mukhi');
  const [selectedSize, setSelectedSize] = useState('');

  return (
    <>
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
    </>
  );
}