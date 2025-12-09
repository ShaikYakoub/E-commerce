// src/actions/updateProduct.ts
'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProduct(productId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const product = await db.product.findUnique({ where: { id: productId } });
  
  if (!product || product.sellerId !== session.user.id) {
    throw new Error("Unauthorized operation");
  }

  const data = productSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
  });

  await db.product.update({
    where: { id: productId },
    data,
  });

  revalidatePath("/seller/products");
  revalidatePath(`/products/${productId}`);
  redirect("/seller/products");
}