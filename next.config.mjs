/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === '1';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['msedge-tts'],
  ...(isStaticExport
    ? {
        output: 'export',
        basePath,
        assetPrefix: basePath || undefined,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
