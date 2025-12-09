// src/actions/addToCart.ts
'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { cartItemSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addToCart(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { productId, quantity } = cartItemSchema.parse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
  });

  // 1. Verify product exists and has stock
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("Product not found");
  if (product.stock < quantity) throw new Error("Insufficient stock");

  // 2. Get or create cart
  let cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: true },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: { userId: session.user.id },
      include: { items: true } // Return items structure
    });
  }

  // 3. Add or update cart item
  const existingItem = cart.items.find(item => item.productId === productId);

  if (existingItem) {
    // Check if adding more exceeds stock
    if (product.stock < existingItem.quantity + quantity) {
      throw new Error("Not enough stock available");
    }
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  revalidatePath("/cart");
  redirect("/cart");
}