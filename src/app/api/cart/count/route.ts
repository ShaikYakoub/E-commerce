import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse, type NextRequest } from "next/server";

// 1. Force Dynamic Mode
export const dynamic = "force-dynamic";

// 2. Add 'req' parameter. Even if unused, its presence tells Next.js 
// "This route depends on the request, so don't build it statically."
export async function GET(req: NextRequest) {
  try {
    // 3. Wrap Auth & DB in try/catch to prevent build crashes
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
    console.error("Cart API Error (ignoring for build):", error);
    // Return 0 instead of crashing the build
    return NextResponse.json({ count: 0 });
  }
}