/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure for static export
  output: 'export',

  // Set the base path for GitHub Pages deployment
  // Note: Using 'telegram-app' based on your repository name
  basePath: process.env.NODE_ENV === 'production' ? '/telegram-app' : '',

  // Disable image optimization (required for static export)
  images: {
    unoptimized: true,
  },

  // Required to make the Next.js app work with GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/telegram-app' : '',

  // Other Next.js configs can go here...
};

module.exports = nextConfig;
