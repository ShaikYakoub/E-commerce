// src/actions/createProduct.ts
'use server'

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Validate form data
  const data = productSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
  });

  await db.product.create({
    data: {
      ...data,
      sellerId: session.user.id,
    },
  });

  revalidatePath("/seller/products");
  redirect("/seller/products");
}