import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // 🛡️ UPDATED MATCHER: Excludes /api routes and static files
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};