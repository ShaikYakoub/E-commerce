"use client";

import Link from "next/link";

interface CartSummaryProps {
  items: {
    quantity: number;
    product: {
      price: number;
    };
  }[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const tax = subtotal * 0.18; // 18% GST example
  const total = subtotal + tax;

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-fit sticky top-24">
      <h2 className="text-lg font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-3 text-sm border-b pb-4 mb-4">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (18% GST)</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg mb-6">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-black text-white text-center py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
      >
        Proceed to Checkout
      </Link>
      
      <p className="text-xs text-center text-gray-500 mt-4">
        Secure Checkout powered by Razorpay
      </p>
    </div>
  );
}