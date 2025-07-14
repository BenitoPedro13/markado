const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      handlebars: path.join(__dirname, 'node_modules/express-handlebars/dist/index.js'),
      '@': path.join(__dirname, 'src'),
      '~': path.join(__dirname),
    };
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
