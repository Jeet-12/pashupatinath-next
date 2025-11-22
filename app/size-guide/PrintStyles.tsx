"use client";

import React from 'react';

const PrintStyles = () => {
  return (
    <style jsx global>{`
      @media print {
        .breadcrumbs-section,
        button,
        a,
        .no-print {
          display: none !important;
        }
      }
    `}</style>
  );
};

export default PrintStyles;