/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/content',
        destination: '/about',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
