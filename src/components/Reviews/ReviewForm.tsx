// src/components/Reviews/ReviewForm.tsx
'use client'

import { createReview } from "@/actions";
import { useTransition } from "react";

export function ReviewForm({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="font-bold text-lg mb-4">Write a Review</h3>
      <form action={(formData) => startTransition(() => createReview(formData))}>
        <input type="hidden" name="productId" value={productId} />
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Rating</label>
          <select name="rating" className="w-full border p-2 rounded">
            <option value="5">5 Stars - Excellent</option>
            <option value="4">4 Stars - Good</option>
            <option value="3">3 Stars - Average</option>
            <option value="2">2 Stars - Poor</option>
            <option value="1">1 Star - Terrible</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea 
            name="text" 
            rows={4} 
            className="w-full border p-2 rounded"
            required
            minLength={10}
            placeholder="What did you like or dislike?"
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}