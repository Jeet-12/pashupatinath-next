"use client";

import { useSearchParams } from 'next/navigation';

export default function TermsInfo() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source');

  if (!source) {
    return null; // Render nothing if no source is found
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
      <p>Reviewing our terms from the <strong>{source}</strong> page is a great step!</p>
    </div>
  );
}