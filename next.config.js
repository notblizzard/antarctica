/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/@:username",
        destination: "/user/:username",
      },
      {
        source: "/@:username/:id",
        destination: "/user/:username/:id",
      },
    ];
  },
  images: {
    domains: ["antarctica.notblizzard.dev", "localhost"],
  },
};

module.exports = nextConfig;
