// src/actions/deleteProduct.ts
'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const product = await db.product.findUnique({ where: { id: productId } });
  if (product?.sellerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  // Prevent deletion if the product has ever been ordered
  // (In a real app, you might "archive" it instead)
  const hasOrders = await db.orderItem.findFirst({
    where: { productId },
  });

  if (hasOrders) {
    throw new Error("Cannot delete product with existing orders");
  }

  await db.product.delete({ where: { id: productId } });
  revalidatePath("/seller/products");
}