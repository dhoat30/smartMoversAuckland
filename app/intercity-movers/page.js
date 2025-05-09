
import Header from '@/Components/UI/Header/Header'
import {getSinglePostData, getGoogleReviews, getOptions} from '@/utils/fetchData'
import Footer from '@/Components/UI/Footer/Footer'
import Layout from '@/Components/UI/Layout/Layout'
import LocationCarouselSection from '@/Components/UI/Layout/Sections/LocationCarousel/LocationCarouselSection'



export async function generateMetadata(props, parent) {
    // read route params

    // fetch data
    const data = await getSinglePostData( 'long-distance-movers', '/wp-json/wp/v2/intercity-movers')

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

  export default async function Home() {
    const data = await getSinglePostData( 'long-distance-movers', '/wp-json/wp/v2/pages')
    const intercityArchiveData = await getSinglePostData( '', '/wp-json/wp/v2/intercity-movers')

    let intercityLocationData
    if(intercityArchiveData.length > 0 ) { 

        intercityLocationData =   intercityArchiveData.map((item)=> { 
            const movePrice = item.acf?.sections.find(
                (section) => section.acf_fc_layout === "show_space_calculator"
              )?.price;
            return { 
                id: item.id, 
                title: item.title.rendered,
                url: `/intercity-movers/${item.slug}`, 
                image: item.acf?.image,
                price: movePrice, 
                priceUnit: "m",
                power: "3"

            }
        })
    }
    const options= await getOptions()
    // const googleReviews = await getGoogleReviews()
    if(!data) return {notFound: true}
    const sections = data[0]?.acf?.sections
    return (
        <>
            <Header />
            <main>
            <Layout sections={sections} uspData={options.usp} statsData={options.status} locationsCovered={options.locations_covered} hoursCalculatorData={options.hours_calculator} servicesData={options.services}/>
            <LocationCarouselSection title={"Moving Across New Zealand"} cards={intercityLocationData} /> 
                {/* <Layout sections={postData[0]?.acf?.sections} /> */}
                {/* <USP showTitle={true} statsArray={options.stats.items} cards={options.usp.items} title={options.usp.section_title} description={options.usp.section_description} /> */}
                
                 {/* <GoogleReviewsCarousel data={googleReviews} /> */}

            </main>
            <Footer showFooterCta={true} className="mt-32" footerCtaData={options.footer_cta} contactInfo={options.contact_info} socialData={options.social_links}/>
        </>
    )
}
