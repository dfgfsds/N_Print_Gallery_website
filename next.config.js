/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3pyarv4eotqu4.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "www.printongo.com",
      },
      {
        protocol: "https",
        hostname: "ecomapi.ftdigitalsolutions.org",
      },
      {
        protocol: "https",
        hostname: "semantic-ui.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com", // 👈 add this
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
      },
      {
        protocol: "https",
        hostname: "gubera-test-api.justvy.in",
      },
      {
        protocol: "https",
        hostname: "api-test.justvy.in",
      },
      {
        protocol: "http",
        hostname: "82.29.161.36",
      },
      {
        protocol: "https",
        hostname: "82.29.161.36",
      },
    ],
  },
  eslint: {
    // 🚀 Ignores ESLint errors/warnings during production builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
