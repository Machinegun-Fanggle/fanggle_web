// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/:path*",
                destination: "http://machiengun-soft:2001/:path*",
            },
        ]
    },
}

module.exports = nextConfig
