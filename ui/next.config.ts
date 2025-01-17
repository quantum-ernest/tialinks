import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                hostname: 'www.google.com',
            },
        ],
    },
    output: "standalone",
};

export default nextConfig;
