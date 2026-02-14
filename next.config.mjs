/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    output: "standalone",
    reactCompiler: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 3600,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'logatech.net',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            }
        ],
    },
    experimental: {
        // ... experimental options
    },
    sassOptions: {
        silenceDeprecations: ["import"],
    },
};

export default nextConfig;
