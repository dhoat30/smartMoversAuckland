export const revalidate = 2592000; // applies to both page and metadata

import Header from '@/Components/UI/Header/Header'
import {getSinglePostData, getGoogleReviews, getOptions} from '@/utils/fetchData'
import Footer from '@/Components/UI/Footer/Footer'
import Layout from '@/Components/UI/Layout/Layout'
import GoogleReviewsCarousel from '@/Components/UI/GoogleReviews/GoogleReviewsCarousel'

export async function generateMetadata({ params }, parent) {
    const param = await params
    const slug = param.slug
    const data = await getSinglePostData(slug, '/wp-json/wp/v2/intercity-movers');
  
    const previousImages = (await parent).openGraph?.images || [];
  
    if (data.length > 0) {
      const seoData = data[0].yoast_head_json;
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
              url: seoData?.og_image?.[0]?.url,
              width: 800,
              height: 600,
            },
            {
              url: seoData?.og_image?.[0]?.url,
              width: 1800,
              height: 1600,
            },
          ],
          type: 'website',
        },
      };
    }
  }

  export default async function Home({params}) {
    const param = await params
    const slug = param.slug
    const data = await getSinglePostData( slug, '/wp-json/wp/v2/intercity-movers')
    const options= await getOptions()
    const googleReviews = await getGoogleReviews()
    if(!data) return {notFound: true}
    const sections = data[0]?.acf?.sections
    return (
        <>
            <Header />
            <main>
            <Layout googleReviewsData={googleReviews} sections={sections} uspData={options.usp} statsData={options.status} locationsCovered={options.locations_covered} spaceCalculatorData={options.cubic_meter_calculator} servicesData={options.services} />
                {/* <Layout sections={postData[0]?.acf?.sections} /> */}
                {/* <USP showTitle={true} statsArray={options.stats.items} cards={options.usp.items} title={options.usp.section_title} description={options.usp.section_description} /> */}
                
                 {/* <GoogleReviewsCarousel data={googleReviews} /> */}

            </main>
            <Footer showFooterCta={false} className="mt-32" footerCtaData={options.footer_cta} contactInfo={options.contact_info} socialData={options.social_links} />
        </>
    )
}
