/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "", // It's okay to leave this as an empty string
      },
    ],
  },
  output: 'standalone', // Updated from experimental.outputStandalone
};

export default nextConfig;

