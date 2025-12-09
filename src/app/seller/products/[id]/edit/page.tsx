import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { ProductForm } from "@/components/ProductForm"; // Reusing your form!

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const session = await auth();
  
  if (!session?.user?.id) return redirect("/login");

  // 1. Fetch Product
  const product = await db.product.findUnique({
    where: { id: params.id },
  });

  if (!product) return notFound();

  // 2. Check Ownership (Security)
  if (product.sellerId !== session.user.id && session.user.role !== "ADMIN") {
    return redirect("/");
  }

  // 3. Convert Decimal to Number for the form
  const formattedProduct = {
    ...product,
    price: Number(product.price),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm initialData={formattedProduct} />
    </div>
  );
}