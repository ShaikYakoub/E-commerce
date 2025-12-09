// src/components/Navbar.tsx
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { ShoppingCart, LogOut } from "lucide-react";

export async function Navbar() {
  const session = await auth();
  
  // Fetch cart count if logged in
  let cartCount = 0;
  if (session?.user?.id) {
    const cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true }
    });
    cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          STORE<span className="text-blue-600">.</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium hover:text-blue-600">
            Browse
          </Link>

          {session?.user ? (
            <>
              {/* Seller Link */}
              <Link href="/seller/dashboard" className="text-sm font-medium hover:text-blue-600 hidden md:block">
                Seller Dashboard
              </Link>

              {/* Orders */}
              <Link href="/orders" className="text-sm font-medium hover:text-blue-600 hidden md:block">
                My Orders
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative group">
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Sign Out */}
              <form action={async () => {
                'use server';
                await signOut();
              }}>
                <button type="submit" className="text-gray-500 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <Link href="/api/auth/signin" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}