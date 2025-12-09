// src/actions/createOrder.ts
'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { calculateCartTotal } from "@/lib/helpers";
import { Decimal } from "@prisma/client/runtime/library";

export async function createOrder(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const shippingAddr = formData.get("shippingAddr") as string;

  // 1. Fetch Cart
  const cartData = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cartData || cartData.items.length === 0) throw new Error("Cart is empty");

  // 2. Validate Inventory (One last check)
  for (const item of cartData.items) {
    if (item.product.stock < item.quantity) {
      throw new Error(`${item.product.name} is out of stock`);
    }
  }

  // 3. Calculate Total
  const total = calculateCartTotal(cartData.items);

  // 4. Create Order
  const order = await db.order.create({
    data: {
      buyerId: session.user.id,
      shippingAddr,
      total: new Decimal(total),
      items: {
        create: cartData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  return { orderId: order.id };
}