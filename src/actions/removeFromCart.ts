// src/actions/removeFromCart.ts
'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function removeFromCart(cartItemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const cartItem = await db.cartItem.findUnique({
    where: { id: cartItemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await db.cartItem.delete({ where: { id: cartItemId } });
  revalidatePath("/cart");
}