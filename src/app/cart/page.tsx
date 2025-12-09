export const dynamic = "force-dynamic"; // 👈 ADD THIS
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CartItem } from "@/components/Cart/CartItem";
import { CartSummary } from "@/components/Cart/CartSummary";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default async function CartPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Please log in</h2>
        <p className="mb-4 text-gray-600">You need to be logged in to view your cart.</p>
        <Link href="/api/auth/signin" className="bg-blue-600 text-white px-6 py-2 rounded">
          Log In
        </Link>
      </div>
    );
  }

  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart?.items.length) {
    return (
      <div className="container mx-auto py-20 text-center flex flex-col items-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>        <Link href="/products" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <CartSummary items={cart.items} />
      </div>
    </div>
  );
}