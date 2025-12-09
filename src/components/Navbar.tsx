"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { ShoppingCart, LogOut, User, Settings, LayoutDashboard, Package, Store } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface UserType {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface NavbarProps {
  initialUser?: UserType | null;
}

export function Navbar({ initialUser }: NavbarProps) {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserType | null>(initialUser || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(initialUser || null);
  }, [initialUser]);

  // Fetch cart count
  useEffect(() => {
    if (user) {
      fetch("/api/cart/count")
        .then((res) => res.json())
        .then((data) => setCartCount(data.count))
        .catch(() => {});
    }
  }, [user]);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight flex items-center gap-1">
          STORE<span className="text-blue-600">.</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium hover:text-blue-600 hidden sm:block">
            Browse
          </Link>

          {user ? (
            <>
              {/* Cart Icon */}
              <Link href="/cart" className="relative group mr-2">
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* ⭐ USER PROFILE DROPDOWN ⭐ */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none transition-transform active:scale-95"
                >
                  {/* The Profile Circle */}
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 relative shadow-sm">
                    {user.image ? (
                      <Image src={user.image} alt="Profile" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                    
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b mb-2 bg-gray-50/50">
                      <p className="text-sm font-semibold text-gray-900">{user.name || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                    {/* ONLY show this link if role is SELLER or ADMIN */}
                    {(user.role === "SELLER" || user.role === "ADMIN") && (
                      <Link 
                        href="/seller/dashboard" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" /> Seller Dashboard
                      </Link>
                    )}

                      <Link 
                        href="/orders" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </Link>

                      <Link 
                        href="/settings" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t mt-2 pt-2 px-2">
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          setUser(null);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/login" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-sm">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}