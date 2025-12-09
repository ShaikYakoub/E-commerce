import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/Checkout/CheckoutForm"; // Adjust import if needed

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  // 🛠️ THE FIX: Convert Decimal to Number again
  const formattedItems = cart.items.map((item) => ({
    ...item,
    product: {
      ...item.product,
      price: Number(item.product.price),
      rating: Number(item.product.rating),
    },
  }));

  // Calculate total safely
  const total = formattedItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="max-w-2xl mx-auto">
          <CheckoutForm 
            cartItems={formattedItems} 
            total={total} 
            userEmail={session.user.email || ""} 
          />
        </div>
      </div>
    </div>
  );
}