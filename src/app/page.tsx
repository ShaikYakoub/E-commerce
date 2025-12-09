import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function Home() {
  const session = await auth();
  
  // 1. Fetch User Role (if logged in)
  let userRole = "USER";
  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    if (user) userRole = user.role;
  }

  // 2. Fetch Products
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { seller: { select: { name: true } } }, // Fetch seller name
  });

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero / Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Latest Products</h1>

        {/* 👇 FIX: Only show this button if user is SELLER or ADMIN */}
        {(userRole === "SELLER" || userRole === "ADMIN") && (
          <Link
            href="/seller/dashboard"
            className="bg-black text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition"
          >
            <Plus className="w-4 h-4" /> Sell Product
          </Link>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {products.length === 0 && (
        <p className="text-center text-gray-500 py-12">No products found.</p>
      )}
    </main>
  );
}