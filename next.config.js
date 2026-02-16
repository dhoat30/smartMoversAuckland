const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://smartmovers.co.nz"
    : "http://localhost:3000");
const siteName = "Smart Movers";

// bundle analyzer
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfigp} */
const nextConfig = {
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms.smartmovers.co.nz",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  env: {
    url: "https://cms.smartmovers.co.nz",
    siteUrl: baseUrl,
    siteName: siteName,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
