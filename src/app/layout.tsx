// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar"; // Import it

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
        <Navbar /> {/* Add this line */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}