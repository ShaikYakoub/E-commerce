"use server";

import Razorpay from "razorpay";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createPayment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // 1. Get Cart Total
  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) redirect("/");

  const amount = cart.items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  // 2. Initialize Razorpay with the Correct Environment Variable
  // We use NEXT_PUBLIC_RAZORPAY_KEY_ID because that is what is in your .env
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!, 
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  // 3. Create Order
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Convert to paise (integers only)
    currency: "INR",
    receipt: `order_${Date.now()}`,
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Send key to frontend
  };
}