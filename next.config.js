const { siteUrl } = require('./next-sitemap.config');

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.NODE_ENV === "production" ? "https://smartmovers.co.nz" : "http://localhost:3000");
    const siteName = "Smart Movers"

// bundle analyzer 
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfigp} */
const nextConfig = {

    compiler: {
        // Enables the styled-components SWC transform
        styledComponents: true
    },
    images: {
       
     
        remotePatterns: [{
            protocol: 'http',
            hostname: 'localhost',
            port: '10070',
            pathname: '/**',
        },
        {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/**'
        }
        
    ],
    },
    env: {
        url: "http://localhost:10070",
        siteUrl: baseUrl,
        siteName: siteName,
    },
}

module.exports = withBundleAnalyzer(nextConfig)

