// src/actions/verifyPayment.ts
'use server'

import { createHmac } from "crypto";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  orderId: string
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // 1. Verify Signature
  const expectedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new Error("Payment verification failed");
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order || order.buyerId !== session.user.id) {
    throw new Error("Order not found");
  }

  // 2. Deduct Inventory & Update Order
  // We use a transaction to ensure both happen or neither happens
  await db.$transaction(async (tx) => {
    // Update Order Status
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "PROCESSING",
        paymentId: razorpayPaymentId,
      },
    });

    // Deduct Stock
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear Cart
    await tx.cartItem.deleteMany({
      where: { cart: { userId: session.user.id } },
    });
  });

  revalidatePath("/orders");
  redirect("/orders");
}