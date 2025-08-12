export const revalidate = 2592000; // applies to both page and metadata

import { getOptions, getSinglePostData } from '@/utils/fetchData'

import Header from '@/Components/UI/Header/Header'
import Footer from '@/Components/UI/Footer/Footer'
import HtmlPageTemplate from '@/Components/Pages/HtmlPageTemplate/HtmlPageTemplate/HtmlPageTemplate'
import BreadcrumbHero from '@/Components/UI/Hero/BreadcrumbHero'

export async function generateMetadata(props, parent) {
    // read route params

    // fetch data
    const data = await getSinglePostData( 'terms-and-conditions', '/wp-json/wp/v2/pages')

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []
    if (data.length > 0) {
        const seoData = data[0].yoast_head_json
        return {
            title: seoData?.title,
            description: seoData?.description,
            metadataBase: new URL(process.env.siteUrl),
            openGraph: {
                title: seoData?.title,
                description: seoData?.description,
                url: process.env.siteUrl,
                siteName: process.env.siteName,
                images: [
                    {
                        url: seoData?.og_image && seoData?.og_image[0]?.url,
                        width: 800,
                        height: 600,
                    }, {
                        url: seoData?.og_image && seoData?.og_image[0].url,
                        width: 1800,
                        height: 1600,
                    },

                ],
                type: 'website',
            },
        }
    }
}

export default async function Contact() {

    const postData = await getSinglePostData("terms-and-conditions", "/wp-json/wp/v2/pages")
    const options = await getOptions()
    if (!postData) {
        return {
            notFound: true,
        }
    }

    return (
        <>
            <Header />
            <main>
                <BreadcrumbHero title={postData[0].title.rendered}/> 
                <HtmlPageTemplate pageData={postData[0]} />
            </main>
            <Footer showFooterCta={false} className="mt-32" footerCtaData={options.footer_cta} contactInfo={options.contact_info} socialData={options.social_links}/>
        </>
    )
}
