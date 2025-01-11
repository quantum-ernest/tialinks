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
};

export default nextConfig;
