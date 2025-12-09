// src/components/Navbar.tsx
"use client"; // 👈 Critical: Runs in browser only

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, LogOut, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart count when user is logged in
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/cart/count")
        .then((res) => res.json())
        .then((data) => setCartCount(data.count))
        .catch((err) => console.error("Failed to fetch cart", err));
    }
  }, [session?.user?.id]);

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

          {status === "loading" ? (
             <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          ) : session?.user ? (
            <>
              {/* Desktop Links */}
              <Link href="/seller/dashboard" className="text-sm font-medium hover:text-blue-600 hidden md:block">
                Seller Dashboard
              </Link>

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

              {/* Sign Out Button */}
              <button 
                onClick={() => signOut()} 
                className="text-gray-500 hover:text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}