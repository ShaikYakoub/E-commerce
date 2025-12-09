// src/components/Cart/CartItem.tsx
'use client'

import { removeFromCart, updateCartQuantity } from "@/actions";
import { ICartItem } from "@/types";
import Image from "next/image";
import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";

export function CartItem({ item }: { item: ICartItem }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-4 p-4 border rounded-lg mb-4 bg-white shadow-sm">
      <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{item.product.name}</h3>
            <p className="text-gray-500 text-sm">{item.product.category}</p>
          </div>
          <p className="font-bold text-lg">₹{Number(item.product.price).toFixed(2)}</p>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Qty:</label>
            <select
              value={item.quantity}
              onChange={(e) => startTransition(() => updateCartQuantity(item.id, Number(e.target.value)))}
              disabled={isPending}
              className="border rounded p-1 text-sm w-16"
            >
              {[...Array(Math.min(10, item.product.stock))].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            {isPending && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          </div>

          <button
            onClick={() => startTransition(() => removeFromCart(item.id))}
            disabled={isPending}
            className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}