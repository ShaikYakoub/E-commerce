import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config"; // Import the new config

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, // Spread the base config
  secret: process.env.AUTH_SECRET || "build_fallback_secret_123",
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
});