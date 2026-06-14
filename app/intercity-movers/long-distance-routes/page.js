export const revalidate = 2592000; // applies to both page and metadata

import { notFound } from "next/navigation";

import Header from '@/Components/UI/Header/Header'
import { getSinglePostData, getGoogleReviews, getOptions, getLongDistanceRoutes } from '@/utils/fetchData'
import Footer from '@/Components/UI/Footer/Footer'
import Layout from '@/Components/UI/Layout/Layout'
import LocationCarouselSection from '@/Components/UI/Layout/Sections/LocationCarousel/LocationCarouselSection'
import LongDistanceRoutes from '@/Components/UI/LongDistanceRoutes/LongDistanceRoutes';
import { buildPageMetadata } from '@/utils/buildPageMetadata';
import { nzCitiesData } from '@/utils/staticData/nzCitiesData';
import dayjs from "@/utils/dayjs-setup"; // with customParseFormat extended
import reviewsData from "@/data/google-reviews.json";


export async function generateMetadata(props, parent) {
    // read route params

    // fetch data
    const data = await getSinglePostData('long-distance-movers', '/wp-json/wp/v2/intercity-movers')

    return buildPageMetadata({
        seoData: data?.[0]?.yoast_head_json,
        path: "/intercity-movers/long-distance-routes",
    })
}

export default async function Page({ searchParams }) {

    const params = await searchParams; // ✅ required in Next.js 15+

    const from = params?.from ?? null;           // e.g. "auckland"
    const to = params?.to ?? null;             // e.g. "wellington"
    const date = params?.date ?? null;           // e.g. "2025-11-20" (YYYY-MM-DD)



    const options = await getOptions()
    const longDistanceRoutes = await getLongDistanceRoutes()
    if (!longDistanceRoutes) notFound()

    // const googleReviews = await getGoogleReviews()
    // if (!data?.length) notFound()
    // const sections = data[0]?.acf?.sections
    return (
        <>
            <Header />


            <main>
                {/* <Layout sections={sections} uspData={options.usp} statsData={options.status} locationsCovered={options.locations_covered} hoursCalculatorData={options.hours_calculator} servicesData={options.services}/> */}
                {/* <LocationCarouselSection title={"Moving Across New Zealand"} cards={intercityLocationData} />  */}
                {/* <Layout sections={postData[0]?.acf?.sections} /> */}
                {/* <USP showTitle={true} statsArray={options.stats.items} cards={options.usp.items} title={options.usp.section_title} description={options.usp.section_description} /> */}

                {/* <GoogleReviewsCarousel data={googleReviews} /> */}
                <LongDistanceRoutes nzCitiesData={nzCitiesData}
                    initialFilters={{ from, to, date }}
                    longDistanceRoutesData={longDistanceRoutes?.cards} />
            </main>
            <Footer

                showFooterCta={true} className="mt-32" footerCtaData={{ title: "No routes found", description: "We might still be able to help! Smart Movers runs nationwide routes on request.", cta_link: { url: "/get-intercity-quote", title: "Request a custom quote" } }} contactInfo={options.contact_info} socialData={options.social_links} />
        </>
    )
}
