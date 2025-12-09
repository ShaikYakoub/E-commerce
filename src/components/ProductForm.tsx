"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing"; // 👈 Using Dropzone for auto-upload
import { createProduct } from "@/actions/createProduct";
import { updateProduct } from "@/actions/updateProduct"; // We will create this next
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, X } from "lucide-react";

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
  };
}

export function ProductForm({ initialData }: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    
    // Check if we are Editing or Creating
    if (initialData) {
      await updateProduct(initialData.id, formData); // Call Edit Action
    } else {
      await createProduct(formData); // Call Create Action
    }

    setIsPending(false);
    router.push("/seller/dashboard");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
      
      {/* 📸 IMAGE UPLOAD SECTION */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
        
        {imageUrl ? (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border">
            <Image src={imageUrl} alt="Preview" fill className="object-cover" />
            {/* Delete Image Button */}
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // 👇 AUTO-UPLOAD DROPZONE
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) {
                setImageUrl(res[0].url); // Auto-set image when done
              }
            }}
            onUploadError={(error: Error) => {
              alert(`Error uploading: ${error.message}`);
            }}
            appearance={{
              container: "border-2 border-dashed border-gray-300 rounded-lg p-8 hover:bg-gray-50 transition cursor-pointer",
              label: "text-gray-500",
              button: "bg-black text-white px-4 py-2 rounded-md mt-2" // Style the button inside dropzone
            }}
          />
        )}
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input name="name" defaultValue={initialData?.name} required className="w-full p-2 border rounded-md" placeholder="e.g. iPhone 15" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select name="category" defaultValue={initialData?.category || "electronics"} className="w-full p-2 border rounded-md">
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="books">Books</option>
            <option value="furniture">Furniture</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea name="description" defaultValue={initialData?.description} required rows={4} className="w-full p-2 border rounded-md" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Price (₹)</label>
          <input name="price" type="number" step="0.01" defaultValue={initialData?.price} required className="w-full p-2 border rounded-md" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Stock</label>
          <input name="stock" type="number" defaultValue={initialData?.stock || 1} required className="w-full p-2 border rounded-md" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> {initialData ? "Updating..." : "Creating..."}
          </span>
        ) : (
          initialData ? "Update Product" : "Create Product"
        )}
      </button>
    </form>
  );
}