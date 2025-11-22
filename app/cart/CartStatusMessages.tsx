"use client";

import { useSearchParams } from 'next/navigation';

export default function CartStatusMessages() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  if (status === 'added') {
    return (
      <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-4">
        Item added to your cart successfully!
      </div>
    );
  }

  // You can add other status messages here, e.g., for 'removed'

  return null; // Render nothing if no relevant status is found
}