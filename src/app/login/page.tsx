import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string; success?: string }>; // 👈 1. Change Type to Promise
}) {
  const searchParams = await props.searchParams; // 👈 2. Await it

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       {/* ... rest of your JSX is fine, just use `searchParams.error` normally now ... */}
       {/* (Copy the rest of your JSX from the previous step, it works fine) */}
       {/* Just make sure you are using the 'searchParams' variable we created above */}
       <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
         {/* ... */}
         {searchParams.error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              Login failed. Check your password.
            </div>
         )}

        <form
          action={async (formData) => {
            "use server";
            try {
              // 1. Convert formData to a plain object
              const data = Object.fromEntries(formData);
              
              // 2. Add the redirectTo option explicitly
              await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirectTo: "/", // 👈 THIS FIXES THE ISSUE
              });
              
            } catch (error) {
              // Required for NextAuth redirects to work
              if ((error as Error).message.includes("NEXT_REDIRECT")) {
                throw error;
              }
              console.error("Login Error:", error);
              redirect("/login?error=InvalidCredentials");
            }
          }}
          className="mt-8 space-y-6"
        >
          {/* ... Inputs remain exactly the same ... */}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
          >
            Sign in
          </button>
          
          {/* Link to Register */}
          <div className="text-center text-sm">
            <span className="text-gray-500">Don&apos;t have an account? </span>
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}