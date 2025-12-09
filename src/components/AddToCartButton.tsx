"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/actions/addToCart";
import { Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCart(productId);
        setIsSuccess(true);
        router.refresh(); 
        
        setTimeout(() => setIsSuccess(false), 2000);
      } catch (error) {
        // 1. Check if it's a Redirect (e.g. sending you to login)
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
          throw error; // Let Next.js handle the redirect
        }
        
        // 2. Log the REAL error so we can see it in the console
        console.error("Failed to add to cart:", error);
        alert("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending || isSuccess}
      className={`w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
        isSuccess
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {isPending ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Adding...
        </>
      ) : isSuccess ? (
        <>
          <ShoppingCart className="w-5 h-5" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </>
      )}
    </button>
  );
}