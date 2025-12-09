// src/actions/createReview.ts
'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { reviewSchema } from "@/lib/validations";
import { updateProductRating } from "@/lib/helpers";
import { revalidatePath } from "next/cache";

export async function createReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = reviewSchema.parse({
    productId: formData.get("productId"),
    rating: formData.get("rating"),
    text: formData.get("text"),
  });

  // 1. Verify Verified Purchase
  const hasPurchased = await db.orderItem.findFirst({
    where: {
      product: { id: data.productId },
      order: { buyerId: session.user.id },
    },
  });

  if (!hasPurchased) {
    throw new Error("You can only review products you have purchased.");
  }

  // 2. Upsert Review (Update if exists, Create if not)
  // This prevents spamming multiple reviews
  const existingReview = await db.review.findUnique({
    where: {
      productId_reviewerId: {
        productId: data.productId,
        reviewerId: session.user.id,
      },
    },
  });

  if (existingReview) {
    await db.review.update({
      where: { id: existingReview.id },
      data: { rating: data.rating, text: data.text },
    });
  } else {
    await db.review.create({
      data: { ...data, reviewerId: session.user.id },
    });
  }

  // 3. Recalculate Average Rating
  const reviews = await db.review.findMany({
    where: { productId: data.productId },
  });
  const newRating = updateProductRating(reviews);

  await db.product.update({
    where: { id: data.productId },
    data: { rating: newRating },
  });

  revalidatePath(`/products/${data.productId}`);
}