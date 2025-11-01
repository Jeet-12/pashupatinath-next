// /app/blog/page.tsx

import { Suspense } from 'react';
import BlogPageContent from './BlogPageContent';


export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <p className="ml-4 text-amber-700">Loading Blog Content...</p>
      </div>
    }>
      <BlogPageContent />
    </Suspense>
  );
}