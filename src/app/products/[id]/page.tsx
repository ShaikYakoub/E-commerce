import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ReviewForm } from "@/components/Reviews/ReviewForm"; // 👈 Ensure file exists here
import { ReviewList } from "@/components/Reviews/ReviewList"; // 👈 Ensure file exists here

function getInventoryStatus(stock: number) {
  if (stock === 0) return { label: "Out of Stock", color: "text-red-600", bg: "bg-red-100" };
  if (stock < 5) return { label: "Low Stock", color: "text-orange-600", bg: "bg-yellow-100" };
  return { label: "In Stock", color: "text-green-600", bg: "bg-green-100" };
}

export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  // 1. Fetch Product with Seller AND Reviews + Reviewer Details
  const product = await db.product.findUnique({
    where: { id: params.id },
    include: {
      seller: { 
        select: { name: true, email: true } 
      },
      reviews: {
        include: {
          reviewer: { select: { name: true, image: true } } // 👈 Fetch user name/image for the review card
        },
        orderBy: { createdAt: "desc" }
      },
    },
  });

  if (!product) return notFound();

  const inventory = getInventoryStatus(product.stock);

  // 2. Calculate average rating
  const rating = product.reviews.length > 0 
    ? (product.reviews.reduce((a, b) => a + b.rating, 0) / product.reviews.length).toFixed(1)
    : "New";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border">
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
              <span className="text-lg font-bold">★ {rating}</span>
              <span className="text-gray-400 text-sm ml-1">
                ({product.reviews.length} reviews)
              </span>
            </div>
          </div>

          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${inventory.bg} ${inventory.color}`}>
            {inventory.label}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="border-t border-b py-4 mb-8">
            <p className="text-sm text-gray-500">
              Sold by: <span className="font-semibold text-gray-900">{product.seller?.name || "Unknown Seller"}</span>
            </p>
          </div>

          {product.stock > 0 ? (
            <AddToCartButton productId={product.id} />
          ) : (
             <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg cursor-not-allowed font-medium">
               Out of Stock
             </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {/* Form Column */}
           <div className="md:col-span-1">
             <ReviewForm productId={product.id} />
           </div>
           
           {/* List Column */}
           <div className="md:col-span-2">
             <ReviewList reviews={product.reviews} />
           </div>
        </div>
      </div>
    </div>
  );
}