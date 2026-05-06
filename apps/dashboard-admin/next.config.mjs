import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@autonorme/ui', '@autonorme/types']
};

export default withNextIntl(nextConfig);
