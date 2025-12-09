"use client";

import Image from "next/image";
import { Trash2, Minus, Plus, Loader2 } from "lucide-react";
import { updateCartItemQuantity, removeCartItem } from "@/actions/cart";
import { useTransition } from "react";

interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product: {
      name: string;
      price: number; // Expect number, not Decimal
      imageUrl: string;
      category: string;
    };
  };
}

export function CartItem({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (newQty: number) => {
    startTransition(async () => {
      await updateCartItemQuantity(item.id, newQty);
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await removeCartItem(item.id);
    });
  };

  return (
    <div className="flex gap-4 p-4 bg-white border rounded-lg shadow-sm">
      {/* Image */}
      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">{item.product.name}</h3>
          <p className="text-gray-500 text-sm capitalize">{item.product.category}</p>
        </div>
        <div className="font-bold text-blue-600">
          ₹{item.product.price.toFixed(2)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={handleRemove}
          disabled={isPending}
          className="text-red-500 hover:text-red-700 p-1"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-3 border rounded-lg px-2 py-1">
          <button
            onClick={() => handleUpdate(item.quantity - 1)}
            disabled={isPending || item.quantity <= 1}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
          <button
            onClick={() => handleUpdate(item.quantity + 1)}
            disabled={isPending}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}