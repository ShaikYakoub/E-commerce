// src/app/layout.tsx
export const dynamic = "force-dynamic"; 

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react"; // 👈 1. Import Suspense
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js E-Commerce",
  description: "Professional E-Commerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Wrap Navbar in Suspense with a fallback */}
        <Suspense fallback={<div className="h-16 border-b bg-white" />}>
          <Navbar />
        </Suspense>
        
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}