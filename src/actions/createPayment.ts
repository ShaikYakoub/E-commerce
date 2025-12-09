"use server";

import Razorpay from "razorpay";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

// 👇 CHANGE: We accept the 'orderId' string, not FormData
export async function createPayment(internalOrderId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // 1. Fetch the Order from Database (Ensures price consistency)
  const order = await db.order.findUnique({
    where: { id: internalOrderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // 2. Initialize Razorpay
  const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  // 3. Create Razorpay Order
  // We use the total directly from the DB order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(Number(order.total) * 100), // Convert Decimal to paise
    currency: "INR",
    receipt: order.id, // Bind it to our internal Order ID
  });

  return {
    orderId: razorpayOrder.id, // This is the 'order_...' string from Razorpay
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  };
}