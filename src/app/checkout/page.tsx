// src/app/checkout/page.tsx
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { CheckoutForm } from "@/components/Checkout/CheckoutForm";
import { calculateCartTotal } from "@/lib/helpers";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/api/auth/signin");

  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
  });

  if (!cart?.items.length) {
    return (
      <div className="container mx-auto py-20 text-center">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const total = calculateCartTotal(cart.items);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="max-w-2xl mx-auto">
        <CheckoutForm 
          cartItems={cart.items} 
          total={total} 
          userEmail={session.user.email || ""}
        />
      </div>
    </div>
  );
}