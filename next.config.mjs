/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "drive.google.com",
                port: "",
                pathname: "/uc*", // This will match the correct image URL format
            },
            {
                protocol: "https",
                hostname: "img.youtube.com",
                port: "",
                pathname: "/**", // This will match all paths under this hostname
            }
        ],
    }
};

    export default nextConfig;
