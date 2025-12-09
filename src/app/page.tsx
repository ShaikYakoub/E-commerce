export const dynamic = "force-dynamic"; // 👈 ADD THIS
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const latestProducts = await db.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
    where: { stock: { gt: 0 } }
  });

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Next Gen Commerce</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the future of online shopping with our blazing fast, secure, and seamless platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/products" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition">
              Shop Now
            </Link>
            <Link href="/seller/dashboard" className="border border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition">
              Sell Products
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/products" className="text-blue-600 font-bold hover:underline">
            View All Products &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}