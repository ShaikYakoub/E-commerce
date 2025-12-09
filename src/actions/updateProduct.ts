"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;

  await db.product.update({
    where: { id },
    data: { name, description, price, stock, category, imageUrl },
  });

  // ⚡ KEY FIX: Refresh cache and Redirect from the server
  revalidatePath("/seller/dashboard");
  revalidatePath(`/products/${id}`);
  redirect("/seller/dashboard");
}