/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // تجاهل أخطاء ESLint أثناء النشر
  },
  typescript: {
    ignoreBuildErrors: true, // تجاهل أخطاء TypeScript أثناء النشر
  },
};

module.exports = nextConfig;
