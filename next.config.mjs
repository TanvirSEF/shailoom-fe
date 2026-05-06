/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-e4743cbe43414a50ad213f3115824850.r2.dev",
      },
    ],
  },
}

export default nextConfig
