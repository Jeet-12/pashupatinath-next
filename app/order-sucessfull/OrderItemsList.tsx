"use client";

import Image from 'next/image';

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderItemsListProps {
  items: Item[];
}

export default function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="space-y-4">
      {items.map((item: Item) => (
        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
            <p className="text-gray-600">Quantity: {item.quantity}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-emerald-600">₹{item.price.toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}