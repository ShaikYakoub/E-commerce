// src/app/orders/page.tsx
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/api/auth/signin");

  const orders = await db.order.findMany({
    where: { buyerId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      
      {orders.length === 0 ? (
<p className="text-gray-500">You haven&apos;t placed any orders yet.</p>      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 flex flex-wrap justify-between gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Order Placed</p>
                  <p className="font-medium">{order.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium">₹{Number(order.total).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Order ID</p>
                  <p className="font-mono">{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                     order.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                     order.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                     "bg-green-100 text-green-700"
                   }`}>
                     {order.status}
                   </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 mb-4 last:mb-0">
                    <div className="relative w-16 h-16 bg-gray-100 rounded">
                      <Image 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-600 hover:underline">
                        <a href={`/products/${item.productId}`}>{item.product.name}</a>
                      </h4>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">₹{Number(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}