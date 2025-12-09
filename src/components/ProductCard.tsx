// src/components/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";
import { IProduct } from "@/types";

export function ProductCard({ product }: { product: IProduct }) {
  return (
    <Link href={`/products/${product.id}`} className="group block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-64 w-full bg-gray-100">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2 capitalize">{product.category}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-600">
            ₹{Number(product.price).toFixed(2)}
          </span>
          <span className="text-sm text-yellow-500 font-medium">
            ★ {product.rating > 0 ? product.rating : "New"}
          </span>
        </div>
      </div>
    </Link>
  );
}