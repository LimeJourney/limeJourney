/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  typescript: {
    // This will ignore TypeScript errors during the build process
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
