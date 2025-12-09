// src/app/register/page.tsx
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import Link from "next/link";

export default async function RegisterPage(props: {
    searchParams: Promise<{ error?: string }>; // 👈 1. Promise Type
  }) {
    const searchParams = await props.searchParams; // 👈 2. Await it
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
           {/* ... */}
           {searchParams.error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {searchParams.error}
              </div>
           )}

        <form
          action={async (formData) => {
            "use server";
            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            if (!name || !email || !password) {
              redirect("/register?error=All fields are required");
            }

            try {
              // 1. Check if user exists
              const existingUser = await db.user.findUnique({
                where: { email },
              });

              if (existingUser) {
                redirect("/register?error=Email already exists");
              }

              // 2. Hash password
              const hashedPassword = await bcrypt.hash(password, 10);

              // 3. Create User
              await db.user.create({
                data: {
                  name,
                  email,
                  password: hashedPassword,
                  role: "USER", // Default role
                },
              });
            } catch (error) {
              // If it's a redirect error, let it pass
              if ((error as Error).message.includes("NEXT_REDIRECT")) {
                throw error;
              }
              console.error("Registration Error:", error);
              redirect("/register?error=Something went wrong");
            }

            // 4. Redirect to login on success
            redirect("/login?success=Account created! Please log in.");
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
          >
            Sign Up
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}