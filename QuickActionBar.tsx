"use client";

import { Download, Printer, Share2 } from "lucide-react";

const QuickActionBar = () => {
  return (
    <div className="no-print flex flex-wrap gap-4 justify-between items-center mb-8 p-6 bg-purple-50 rounded-2xl">
      <div>
        <h2 className="text-xl font-semibold text-purple-900 mb-2">
          Need Help Choosing?
        </h2>
        <p className="text-purple-700">
          Contact our experts for personalized size recommendations
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a
          href="/path-to-your-guide.pdf" // Link to a static PDF
          download
          className="bg-white text-purple-700 border border-purple-300 hover:bg-purple-50 px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center"
        >
          <Download size={16} className="mr-2" />
          Download PDF
        </a>
        <button
          onClick={() => window.print()}
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
  );
};

export default QuickActionBar;