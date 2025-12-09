import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CartItem } from "@/components/Cart/CartItem";
import { CartSummary } from "@/components/Cart/CartSummary";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const cart = await db.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: "asc" }, // Keeps list stable
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <a href="/products" className="text-blue-600 hover:underline">Continue Shopping</a>
      </div>
    );
  }

  // 🛠️ THE FIX: Convert 'Decimal' types to plain 'numbers'
  const formattedItems = cart.items.map((item) => ({
    ...item,
    product: {
      ...item.product,
      // Convert Decimal to number using .toNumber() or Number()
      price: Number(item.product.price), 
      // Do the same for rating if it's a Decimal in your schema, otherwise keep as is
      rating: Number(item.product.rating),
    },
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {formattedItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="md:col-span-1">
          <CartSummary items={formattedItems} />
        </div>
      </div>
    </div>
  );
}