export const revalidate = 2592000; // applies to both page and metadata

import { notFound } from "next/navigation";

import { getOptions, getSinglePostData } from '@/utils/fetchData'

import Header from '@/Components/UI/Header/Header'
import Footer from '@/Components/UI/Footer/Footer'
import HtmlPageTemplate from '@/Components/Pages/HtmlPageTemplate/HtmlPageTemplate/HtmlPageTemplate'
import BreadcrumbHero from '@/Components/UI/Hero/BreadcrumbHero'
import { buildPageMetadata } from '@/utils/buildPageMetadata'
import PageSchema from '@/Components/SEO/PageSchema'

export async function generateMetadata(props, parent) {
    // read route params

    // fetch data
    const data = await getSinglePostData( 'privacy-policy', '/wp-json/wp/v2/pages')

    if (data?.length > 0) {
        return buildPageMetadata({
            seoData: data[0].yoast_head_json,
            path: "/privacy-policy",
        })
    }
}

export default async function Contact() {

    const postData = await getSinglePostData("privacy-policy", "/wp-json/wp/v2/pages")
    const options = await getOptions()
    if (!postData?.length) notFound()

    return (
        <>
            <PageSchema
                path="/privacy-policy"
                name={postData[0]?.title?.rendered || "Privacy Policy"}
                breadcrumbs={[
                    { name: "Home", path: "" },
                    { name: "Privacy Policy", path: "/privacy-policy" },
                ]}
            />
            <Header />
            <main>
                <BreadcrumbHero title={postData[0].title.rendered}/> 
                <HtmlPageTemplate pageData={postData[0]} />
            </main>
            <Footer showFooterCta={false} className="mt-32" footerCtaData={options.footer_cta} contactInfo={options.contact_info} socialData={options.social_links}/>
        </>
    )
}
