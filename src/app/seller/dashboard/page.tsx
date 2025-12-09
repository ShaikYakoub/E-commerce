// src/app/seller/dashboard/page.tsx
import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Package, ShoppingCart, IndianRupee } from "lucide-react";

export default async function SellerDashboard() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/api/auth/signin");

  const userId = session.user.id; // 👈 Capture ID here

  // 1. Fetch Seller Data
  const products = await db.product.findMany({
    where: { sellerId: userId }, // ✅ Update here
    orderBy: { createdAt: 'desc' }
  });

  const orders = await db.order.findMany({
    where: {
      items: { some: { product: { sellerId: userId } } }
    },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Calculate Stats
  const totalRevenue = orders
    .filter(o => o.status === "PROCESSING" || o.status === "DELIVERED") // Only count paid orders
    .reduce((sum, order) => {
       // Only count the items that belong to THIS seller
       const sellerItemsTotal = order.items
         .filter(item => item.product.sellerId === userId)
         .reduce((itemSum, item) => itemSum + Number(item.price) * item.quantity, 0);
       return sum + sellerItemsTotal;
    }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Seller Dashboard</h1>
        <Link href="/seller/products/new" className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
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

      {/* Recent Products Table */}
      <h2 className="text-xl font-bold mb-4">Your Products</h2>
      <div className="bg-white border rounded-lg overflow-hidden mb-12">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-medium text-gray-500">Name</th>
              <th className="p-4 font-medium text-gray-500">Price</th>
              <th className="p-4 font-medium text-gray-500">Stock</th>
              <th className="p-4 font-medium text-gray-500">Sold</th>
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 5).map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">₹{Number(p.price).toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-4 text-gray-500">-</td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}