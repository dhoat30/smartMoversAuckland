/** @type {import('next-sitemap').IConfig} */

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.NODE_ENV === 'production'
        ? 'https://www.smartmovers.co.nz'
        : 'http://localhost:3000');

const fetchCmsJson = async (endpoint) => {
    const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
    });
    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
        throw new Error(`CMS request failed with HTTP ${response.status}.`);
    }
    if (!/(^|\s|;)application\/(?:[\w.-]+\+)?json(?:\s*;|$)/i.test(contentType)) {
        throw new Error(`Expected JSON but received ${contentType || 'an unknown content type'}.`);
    }

    return response.json();
};

const getData = async (endpoint, urlPrefix) => {
    try {
        const data = await fetchCmsJson(endpoint);
        return data.map(post => `/${urlPrefix}/${post.slug}`);
    } catch (error) {
        console.error(`Failed to fetch data from ${endpoint}:`, error);
        return [];
    }
};

const getHierarchicalData = async (endpoint, urlPrefix) => {
    try {
        const data = await fetchCmsJson(endpoint);
        const slugsById = new Map(data.map(post => [post.id, post.slug]));

        return data.map(post => post.parent && slugsById.has(post.parent)
            ? `/${urlPrefix}/${slugsById.get(post.parent)}/${post.slug}`
            : `/${urlPrefix}/${post.slug}`);
    } catch (error) {
        console.error(`Failed to fetch hierarchical data from ${endpoint}:`, error);
        return [];
    }
};

const getLocalRemovalists = () => getHierarchicalData('https://cms.smartmovers.co.nz/wp-json/wp/v2/removalists?_fields=id,slug,parent&per_page=100', "movers");
const getInterstateRemovalists = () => getData('https://cms.smartmovers.co.nz/wp-json/wp/v2/intercity-movers?acf_format=standard&per_page=100', "intercity-movers");

module.exports = {
    siteUrl,
    generateRobotsTxt: true,
    sitemapSize: 1000,
    exclude: [
        '/thank-you',
        '/order-received',
        '/checkout',
        '/form-submitted/thank-you',
        // Lead-gen / quote pages are noindex — city & intercity pages are the canonical pages
        '/get-free-quote',
        '/get-free-quote/*',
        '/get-intercity-quote',
        '/long-distance-route-quote',
        '/internal',
        '/internal/*',
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: '/',
                disallow: '/internal/',
            },
        ],
    },
    additionalPaths: async (config) => {
        // const blogUrls = await getBlogsData();
        const localRemovalists = await getLocalRemovalists();
        const interstateRemovalists = await getInterstateRemovalists();

        // Return all generated URLs for sitemap
        return [
            // ...await Promise.all(blogUrls.map(url => config.transform(config, url))),
            ...await Promise.all(localRemovalists.map(url => config.transform(config, url))),
            ...await Promise.all(interstateRemovalists.map(url => config.transform(config, url))),
        ];
    },
};
