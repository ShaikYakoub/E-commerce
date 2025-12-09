"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addToCart(productId: string) {
  const session = await auth();
  
  // 1. Basic Session Check
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 2. 🛡️ ROBUSTNESS CHECK: Ensure user actually exists in DB
  // (This handles the case where the DB was wiped but the browser cookie remains)
  const userExists = await db.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    // If the user is missing from DB, force them to login again
    redirect("/login");
  }

  // 3. Get or Create Cart
  let cart = await db.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: { userId },
    });
  }

  // 4. Check if item already exists in cart
  const existingItem = await db.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    // Update quantity
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + 1 },
    });
  } else {
    // Create new item
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity: 1,
      },
    });
  }

  revalidatePath("/cart");
  return { success: true };
}