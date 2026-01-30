/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    output: "standalone",
    reactCompiler: true,
    sassOptions: {
        silenceDeprecations: ["import"],
    },
};

export default nextConfig;
