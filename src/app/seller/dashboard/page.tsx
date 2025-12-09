export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image"; // 👈 Fixed Import
import { Plus, Package, ShoppingCart, IndianRupee, Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/actions/deleteProduct";

export default async function SellerDashboard() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
    return redirect("/"); 
  }

  const userId = session.user.id;

  // 1. Fetch Seller Data
  const products = await db.product.findMany({
    where: { sellerId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
        _count: { select: { orderItems: true } } // Fetch sold count
    }
  });

  const orders = await db.order.findMany({
    where: {
      items: { some: { product: { sellerId: userId } } }
    },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Calculate Revenue
  const totalRevenue = orders
    .filter(o => o.status === "PROCESSING" || o.status === "DELIVERED") 
    .reduce((sum, order) => {
       const sellerItemsTotal = order.items
         .filter(item => item.product.sellerId === userId)
         .reduce((itemSum, item) => itemSum + Number(item.price) * item.quantity, 0);
       return sum + sellerItemsTotal;
    }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Link href="/products/new" className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <h2 className="text-xl font-bold mb-4">Your Products</h2>
      <div className="bg-white border rounded-lg overflow-hidden mb-12">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">Name</th>
              <th className="p-4 font-medium text-gray-500">Price</th>
              <th className="p-4 font-medium text-gray-500">Stock</th>
              <th className="p-4 font-medium text-gray-500">Sold</th>
              <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 group">
                <td className="p-4 font-medium flex items-center gap-3">
                  <div className="w-10 h-10 relative bg-gray-100 rounded overflow-hidden border">
                     <Image src={p.imageUrl} alt={p.name} fill className="object-cover"/>
                  </div>
                  {p.name}
                </td>
                <td className="p-4">₹{Number(p.price).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{p._count.orderItems}</td> 
                
                {/* Actions: Edit & Delete */}
                <td className="p-4 flex gap-2 justify-end">
                  {/* EDIT BUTTON */}
                  <Link href={`/seller/products/${p.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                    <Pencil className="w-4 h-4" />
                  </Link>

                  {/* DELETE BUTTON */}
                  <form action={async () => {
                    "use server";
                    await deleteProduct(p.id);
                  }}>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
            <div className="p-8 text-center text-gray-500">
                You haven't added any products yet.
            </div>
        )}
      </div>
    </div>
  );
}