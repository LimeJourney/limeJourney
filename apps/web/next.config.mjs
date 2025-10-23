/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  typescript: {
    // This will ignore TypeScript errors during the build process
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
