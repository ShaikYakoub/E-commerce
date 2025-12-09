import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// 🛡️ FALLBACK SECRET: Prevents build crash if env var is missing
const secret = process.env.AUTH_SECRET || "build_fallback_secret_123";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret, // Explicitly use the secret
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);
        if (parsed.success) {
          const { email, password } = parsed.data;
          const user = await db.user.findUnique({ where: { email } });
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  trustHost: true, // 🛡️ Helps with Vercel deployment issues
});