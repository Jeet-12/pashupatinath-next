// /app/products/page.tsx

import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center ">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <p className="ml-4 text-amber-700">Loading Product Filters...</p>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}