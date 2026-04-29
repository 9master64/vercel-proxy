/** @type {import('next').NextConfig} */
const nextConfig = {
  // استفاده از تابع به عنوان پروکسی
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/api/[...slug]',
      },
    ];
  },
};

module.exports = nextConfig;
