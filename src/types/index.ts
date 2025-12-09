import { Product, CartItem, OrderItem } from "@prisma/client";

export type IProduct = Product;

// We extend the Prisma types to include relations we often fetch
export type ICartItem = CartItem & {
  product: Product;
};

export type IOrder = {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: Date;
};