
export const revalidate = 2592000; // applies to both page and metadata

import Header from '@/Components/UI/Header/Header'
import {getSinglePostData, getGoogleReviews, getOptions} from '@/utils/fetchData'
import Footer from '@/Components/UI/Footer/Footer'
import Layout from '@/Components/UI/Layout/Layout'



export async function generateMetadata(props, parent) {

    // optionally access and extend (rather than replace) parent metadata

        return {
            title: "Intercity Moving Routes Across NZ | Smart Movers",
            description: "Compare available long-distance moving routes across New Zealand. Find shared loads, save up to 40%, and book affordable Auckland–Christchurch moves and more.",
            metadataBase: new URL(process.env.siteUrl),
            openGraph: {
                title: "Intercity Moving Routes Across NZ | Smart Movers",
                description: "Compare available long-distance moving routes across New Zealand. Find shared loads, save up to 40%, and book affordable Auckland–Christchurch moves and more.",
                url: process.env.siteUrl,
                siteName: process.env.siteName,
               
                type: 'website',
            },
        }
    
}

  export default async function Home({searchParams }) {
    const data = await getSinglePostData( 'intercity-move-routes-cta', '/wp-json/wp/v2/pages')
    const options= await getOptions()
    if(!data) return {notFound: true}
    const sections = data[0]?.acf?.sections

      const routeId =
    (typeof searchParams?.routeId === "string" && searchParams.routeId.trim()) || null;

    return (
        <>
            <Header />
            <main style={{background: "var(--light-surface-container-low)"}}>
            <Layout routeId={routeId}   sections={sections} uspData={options.usp} statsData={options.status} locationsCovered={options.locations_covered} hoursCalculatorData={options.hours_calculator} spaceCalculatorData={options.cubic_meter_calculator} />
                {/* <Layout sections={postData[0]?.acf?.sections} /> */}
                {/* <USP showTitle={true} statsArray={options.stats.items} cards={options.usp.items} title={options.usp.section_title} description={options.usp.section_description} /> */}
                
                 {/* <GoogleReviewsCarousel data={googleReviews} /> */}

            </main>
            <Footer showFooterCta={false} className="mt-32" footerCtaData={options.footer_cta} contactInfo={options.contact_info} socialData={options.social_links}/>
        </>
    )
}
