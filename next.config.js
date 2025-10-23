const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development' || process.env.SKIP_TYPE_CHECK === 'true',
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
      '~': path.join(__dirname),
      'handlebars/runtime': path.join(__dirname, 'node_modules/handlebars/dist/cjs/handlebars.runtime'),
      handlebars: path.join(__dirname, 'node_modules/handlebars/dist/cjs/handlebars'),
    };
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
