"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetails() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Reading from searchParams should be inside useEffect or an event handler
    const id = searchParams.get('order_id');
    setOrderId(id);
  }, [searchParams]);

  if (!orderId) {
    // You can return a loading state or null
    return (
        <div className="text-center">
            <p className="text-gray-600 text-lg leading-relaxed">Loading order details...</p>
        </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
        <p className="text-green-600 text-sm">#{orderId}</p>
    </div>
  );
}