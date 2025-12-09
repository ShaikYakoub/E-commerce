// Simplified middleware config for now
// We'll import the full config later, but this enables session checks
export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};