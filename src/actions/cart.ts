"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateCartItemQuantity(itemId: string, newQuantity: number) {
  const session = await auth();
  if (!session?.user?.id) return;

  if (newQuantity < 1) {
    // If quantity is 0 or less, remove the item
    await db.cartItem.delete({
      where: { id: itemId },
    });
  } else {
    await db.cartItem.update({
      where: { id: itemId },
      data: { quantity: newQuantity },
    });
  }

  revalidatePath("/cart");
}

export async function removeCartItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  await db.cartItem.delete({
    where: { id: itemId },
  });

  revalidatePath("/cart");
}
