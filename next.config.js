const webpack = require("webpack");

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Content-Security-Policy",
    value:
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.coingecko.com http://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js https://www.google-analytics.com https://www.googletagmanager.com/ https://*.google.com https://cdn.usefathom.com https://*.hcaptcha.com https://*.freshworks.com https://www.gstatic.com;",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config, { buildId }) {
    config.module.rules.push({ test: /\.svg$/, use: ["@svgr/webpack"] });
    config.plugins.push(
      new webpack.DefinePlugin({ "process.env.BUILD_ID": JSON.stringify(buildId) })
    );
    return config;
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/fund",
        permanent: false,
      },
      process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
        ? {
            source: "/((?!maintenance)(?!_next)(?!static).*)",
            destination: "/maintenance",
            permanent: false,
          }
        : {
            source: "/maintenance",
            destination: "/",
            permanent: false,
          },
    ];
  },

  staticPageGenerationTimeout: 240000,
};

module.exports = nextConfig;
