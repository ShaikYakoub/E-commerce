import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { auth } from "@/auth"; 
import { db } from "@/lib/db"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js E-Commerce",
  description: "Professional E-Commerce Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  let userWithRole = null;
  if (session?.user?.id) {
    const dbUser = await db.user.findUnique({
      where: { id: session.user.id },
      // 🟢 FIX: We can now safely select 'image' because we added it to the DB!
      select: { 
        name: true, 
        email: true, 
        image: true, 
        role: true 
      }, 
    });
    userWithRole = dbUser;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          <Navbar initialUser={userWithRole} />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}