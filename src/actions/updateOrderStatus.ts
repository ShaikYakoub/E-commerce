// src/actions/updateOrderStatus.ts
'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const userId = session.user.id; // 👈 Capture the ID here

  // Verify the user is the seller of at least one item in the order
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) throw new Error("Order not found");

    const isSeller = order.items.some(item => item.product.sellerId === userId);

  // Note: In a real app, admins would also have permission here
  if (!isSeller) throw new Error("Unauthorized");

  await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/seller/orders");
}