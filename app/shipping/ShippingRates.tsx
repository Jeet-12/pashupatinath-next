"use client";

import { useState } from 'react';
import { MapPin, Globe, Package, Clock, Zap, CheckCircle } from 'lucide-react';

type Rate = {
  weight: string;
  regular: string;
  express: string;
  time: string;
  expressTime: string;
};

type ShippingRatesData = {
  domestic: Rate[];
  international: Rate[];
};

interface ShippingRatesProps {
  shippingRates: ShippingRatesData;
}

export default function ShippingRates({ shippingRates }: ShippingRatesProps) {
  const [activeTab, setActiveTab] = useState('domestic');

  return (
    <>
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 inline-flex">
          <button
            onClick={() => setActiveTab('domestic')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center ${
              activeTab === 'domestic'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <MapPin size={18} className="mr-2" />
            Domestic Shipping
          </button>
          <button
            onClick={() => setActiveTab('international')}
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center ${
              activeTab === 'international'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Globe size={18} className="mr-2" />
            International Shipping
          </button>
        </div>
      </div>

      {/* Rates Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Weight Category</th>
                <th className="px-6 py-4 text-center font-semibold">Regular Shipping</th>
                <th className="px-6 py-4 text-center font-semibold">Express Shipping</th>
                <th className="px-6 py-4 text-center font-semibold">Service</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {shippingRates[activeTab as keyof typeof shippingRates].map((rate, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Package size={18} className="text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">{rate.weight}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-lg font-bold ${rate.regular === 'FREE' ? 'text-green-600' : 'text-blue-700'}`}>
                        {rate.regular}
                      </span>
                      <div className="flex items-center justify-center mt-1">
                        <Clock size={14} className="text-gray-400 mr-1" />
                        <span className="text-gray-600 text-sm">{rate.time}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold text-orange-600">{rate.express}</span>
                      <div className="flex items-center justify-center mt-1">
                        <Zap size={14} className="text-orange-400 mr-1" />
                        <span className="text-gray-600 text-sm">{rate.expressTime}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle size={12} className="mr-1" />
                      ShipRocket
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-orange-50 border-t border-orange-200 p-4">
          <div className="flex items-center justify-center">
            <Zap size={18} className="text-orange-600 mr-2" />
            <p className="text-orange-800 text-sm font-medium">For express shipping options and pricing, please contact our customer support team.</p>
          </div>
        </div>
      </div>
    </>
  );
}