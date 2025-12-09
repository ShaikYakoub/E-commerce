import NextAuth from "next-auth";
export { auth as middleware } from "@/auth";

export const config = {
  // Update the matcher to exclude internal Next.js paths and static files
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};