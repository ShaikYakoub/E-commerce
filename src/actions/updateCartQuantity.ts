// src/actions/updateCartQuantity.ts
'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { removeFromCart } from "./removeFromCart";

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (quantity < 1) {
    return removeFromCart(cartItemId);
  }

  const cartItem = await db.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true, product: true },
  });

  if (!cartItem || cartItem.cart.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (cartItem.product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  await db.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  revalidatePath("/cart");
}