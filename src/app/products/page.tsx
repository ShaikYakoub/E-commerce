// src/app/products/page.tsx
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.query || "";
  const category = params.category || "";
  const minPrice = params.minPrice ? Number(params.minPrice) : 0;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : 1000000;
  const page = params.page ? Number(params.page) : 1;
  const pageSize = 12;

  // 1. Fetch Products with Filters
  const whereClause = {
    AND: [
      {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { description: { contains: query, mode: "insensitive" as const } },
        ],
      },
      category ? { category: { equals: category } } : {},
      { price: { gte: minPrice, lte: maxPrice } },
      { stock: { gt: 0 } }, // Only show in-stock items
    ],
  };

  const products = await db.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const total = await db.product.count({ where: whereClause });
  const totalPages = Math.ceil(total / pageSize);

  // 2. Fetch Categories for Filter UI
  const categories = await db.product.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Products</h1>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-8 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <form className="flex gap-2 flex-1">
          <input
            name="query"
            defaultValue={query}
            placeholder="Search products..."
            className="border p-2 rounded w-full"
          />
          <button type="submit" className="bg-gray-800 text-white px-4 rounded">Search</button>
        </form>

        {/* Categories */}
        <div className="flex gap-2">
          {categories.map((c) => (
            <Link
              key={c.category}
              href={`/products?category=${c.category}`}
              className={`px-3 py-1 rounded-full text-sm border ${
                category === c.category ? "bg-blue-100 border-blue-500" : "bg-gray-50"
              }`}
            >
              {c.category}
            </Link>
          ))}
          {category && (
            <Link href="/products" className="px-3 py-1 rounded-full text-sm border text-red-500 border-red-200 bg-red-50">
              Clear
            </Link>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">No products found.</div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/products?page=${i + 1}${query ? `&query=${query}` : ""}`}
              className={`px-4 py-2 border rounded ${
                page === i + 1 ? "bg-black text-white" : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}