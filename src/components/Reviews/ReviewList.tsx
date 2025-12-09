// src/components/Reviews/ReviewList.tsx
import { Review } from "@prisma/client";

interface ReviewWithUser extends Review {
  reviewer: { name: string | null };
}

export function ReviewList({ reviews }: { reviews: ReviewWithUser[] }) {
  if (reviews.length === 0) {
    return <div className="text-gray-500 italic">No reviews yet. Be the first!</div>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-6">
          <div className="flex justify-between items-start mb-2">
             <div>
               <span className="font-bold mr-2">{review.reviewer.name || "Anonymous"}</span>
               <span className="text-yellow-500 text-sm">{"★".repeat(review.rating)}</span>
             </div>
             <span className="text-gray-400 text-xs">
               {new Date(review.createdAt).toLocaleDateString()}
             </span>
          </div>
          <p className="text-gray-700">{review.text}</p>
        </div>
      ))}
    </div>
  );
}