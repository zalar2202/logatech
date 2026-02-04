/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    output: "standalone",
    experimental: {
        reactCompiler: true,
    },
    sassOptions: {
        silenceDeprecations: ["import"],
    },
};

export default nextConfig;
