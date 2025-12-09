// src/app/products/[id]/page.tsx
import { db } from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartForm } from "@/components/Cart/AddToCartForm";
import { getInventoryStatus } from "@/lib/helpers";
import { ReviewForm } from "@/components/Reviews/ReviewForm"; // We will create this next
import { ReviewList } from "@/components/Reviews/ReviewList"; // We will create this next
import { getProductReviews } from "@/actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Fetch Product Data
  const product = await db.product.findUnique({
    where: { id },
    include: {
      seller: { select: { name: true, id: true } },
      _count: { select: { reviews: true } },
    },
  });

  if (!product) return notFound();

  const inventoryStatus = getInventoryStatus(product.stock);
  const { reviews } = await getProductReviews(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-semibold text-blue-600">
              ₹{Number(product.price).toFixed(2)}
            </span>
            <div className="flex items-center text-yellow-500">
              <span className="text-lg font-bold">★ {product.rating}</span>
              <span className="text-gray-400 text-sm ml-1">
                ({product._count.reviews} reviews)
              </span>
            </div>
          </div>

          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
            product.stock === 0 ? "bg-red-100 text-red-600" :
            product.stock < 5 ? "bg-yellow-100 text-yellow-700" :
            "bg-green-100 text-green-700"
          }`}>
            {inventoryStatus}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="border-t border-b py-4 mb-8">
            <p className="text-sm text-gray-500">Sold by: <span className="font-semibold text-gray-900">{product.seller.name}</span></p>
          </div>

          {/* Add to Cart Section */}
          {product.stock > 0 ? (
            <AddToCartForm productId={product.id} maxStock={product.stock} />
          ) : (
             <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed">
               Out of Stock
             </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="md:col-span-1">
             <ReviewForm productId={product.id} />
           </div>
           <div className="md:col-span-2">
             <ReviewList reviews={reviews} />
           </div>
        </div>
      </div>
    </div>
  );
}