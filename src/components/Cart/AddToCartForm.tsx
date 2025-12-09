// src/components/Cart/AddToCartForm.tsx
'use client'

import { addToCart } from "@/actions";
import { useTransition } from "react";

export function AddToCartForm({ productId, maxStock }: { productId: string, maxStock: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form action={(formData) => startTransition(() => addToCart(formData))}>
      <input type="hidden" name="productId" value={productId} />
      <div className="flex gap-4 items-center mb-4">
        <select name="quantity" className="border p-2 rounded w-20">
          {[1, 2, 3, 4, 5].map(num => (
             num <= maxStock && <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">{maxStock} available</span>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add to Cart"}
      </button>
    </form>
  );
}