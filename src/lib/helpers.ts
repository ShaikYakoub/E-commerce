import { CartItem, Product, Review } from "@prisma/client";

export function calculateCartTotal(items: (CartItem & { product: Product })[]): number {
  return items.reduce((sum, item) => {
    return sum + (Number(item.product.price) * item.quantity);
  }, 0);
}

export function updateProductRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getInventoryStatus(stock: number): "In Stock" | "Low Stock" | "Out of Stock" {
  if (stock === 0) return "Out of Stock";
  if (stock < 5) return "Low Stock";
  return "In Stock";
}