// src/lib/validations.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Name must be 3+ chars"),
  description: z.string().min(20, "Description must be at least 20 chars"),
  category: z.enum(["electronics", "clothing", "books", "furniture", "other"]),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  imageUrl: z.string().url("Invalid Image URL"),
});

export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z.coerce.number().min(1).max(100),
});

export const orderSchema = z.object({
  shippingAddr: z.string().min(10, "Address is too short"),
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.coerce.number().min(1).max(5),
  text: z.string().min(10).max(500),
});