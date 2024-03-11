const isProduction = 'production' === process.env.NODE_ENV

/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: isProduction ? '/tracer' : '',
    output: 'export',
    images: { unoptimized: true }
};

export default nextConfig;
