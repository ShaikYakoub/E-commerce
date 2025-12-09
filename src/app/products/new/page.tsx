import { ProductForm } from "@/components/ProductForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AddProductPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductForm />
    </div>
  );
}