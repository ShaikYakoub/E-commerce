"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name || !price || !stock || !category || !imageUrl) {
    throw new Error("Missing required fields");
  }

  await db.product.create({
    data: {
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
      sellerId: session.user.id,
    },
  });

  revalidatePath("/products");
  revalidatePath("/seller/dashboard");
  redirect("/seller/dashboard");
}