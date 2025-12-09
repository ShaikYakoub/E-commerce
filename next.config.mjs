/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io", // UploadThing
        pathname: "**",
      },
      { 
        protocol: "https",
        hostname: "images.unsplash.com", 
        pathname: "**" 
      },
    ],
  },
};

export default nextConfig;