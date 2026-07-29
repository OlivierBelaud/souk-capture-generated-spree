/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,

  // The dev-tools badge would leak into reviewer/validator screenshots.
  devIndicators: false,
};
export default nextConfig;
