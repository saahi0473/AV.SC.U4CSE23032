/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['logging_middleware'],
  experimental: {
    externalDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'http://20.207.122.201/evaluation-service/:path*',
      },
    ];
  },
};

export default nextConfig;
