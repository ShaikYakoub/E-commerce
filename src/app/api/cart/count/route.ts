// src/app/api/cart/count/route.ts
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    });

    const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}