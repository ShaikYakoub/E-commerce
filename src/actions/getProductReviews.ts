// src/actions/getProductReviews.ts
'use server'

import { db } from "@/lib/db";

export async function getProductReviews(productId: string, page = 1) {
  const pageSize = 5;
  
  const reviews = await db.review.findMany({
    where: { productId },
    include: { reviewer: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await db.review.count({ where: { productId } });

  return {
    reviews,
    total,
    pages: Math.ceil(total / pageSize),
  };
}