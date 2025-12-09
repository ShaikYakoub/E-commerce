// src/components/Cart/CartSummary.tsx
'use client'

import { calculateCartTotal } from "@/lib/helpers";
import { ICartItem } from "@/types";
import Link from "next/link";

export function CartSummary({ items }: { items: ICartItem[] }) {
  const total = calculateCartTotal(items);

  return (
    <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-20">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="border-t pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-black text-white text-center py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-md"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}