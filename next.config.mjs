/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    output: "standalone",
    reactCompiler: true,
    images: {
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
