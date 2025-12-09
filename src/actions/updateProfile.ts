"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  
  // 1. Security Check
  if (!session?.user?.id) {
    redirect("/login");
  }

  // 2. Get Data from Form
  const name = formData.get("name") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!name) {
    throw new Error("Name is required");
  }

  // 3. Update Database
  await db.user.update({
    where: { id: session.user.id },
    data: {
      name,
      // Only update image if a new URL is provided (not empty string)
      ...(imageUrl ? { image: imageUrl } : {}),
    },
  });

  // 4. Refresh UI
  revalidatePath("/");        // Update Navbar avatar immediately
  revalidatePath("/settings"); // Update Settings form
}