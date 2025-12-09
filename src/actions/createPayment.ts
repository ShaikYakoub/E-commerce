// src/actions/createPayment.ts
'use server'

import { auth } from "@/auth";
import Razorpay from "razorpay";

export async function createPayment({ orderId, amount }: { orderId: string, amount: number }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  // Create Razorpay Order
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Amount in paise
    currency: "INR",
    receipt: orderId,
    notes: {
      userId: session.user.id,
      systemOrderId: orderId
    }
  });

  return { orderId: order.id };
}