const isProduction = "production" === process.env.NODE_ENV;

/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProduction ? "/bon-de-commande" : "",
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
