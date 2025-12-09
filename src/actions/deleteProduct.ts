"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  // Ensure only the owner (or admin) can delete
  const product = await db.product.findUnique({ where: { id: productId } });
  
  if (!product || (product.sellerId !== session.user.id && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  await db.product.delete({ where: { id: productId } });
  revalidatePath("/seller/dashboard");
}