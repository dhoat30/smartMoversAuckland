export const revalidate = 2592000; // applies to both page and metadata

import { notFound } from "next/navigation";

import Header from "@/Components/UI/Header/Header";
import {
  getSinglePostData,
  getGoogleReviews,
  getOptions,
} from "@/utils/fetchData";
import Footer from "@/Components/UI/Footer/Footer";
import Layout from "@/Components/UI/Layout/Layout";
import GoogleReviewsCarousel from "@/Components/UI/GoogleReviews/GoogleReviewsCarousel";
import { buildPageMetadata } from "@/utils/buildPageMetadata";
import reviewsData from "@/data/google-reviews.json";
// run to get reviews GOOGLE_PLACE_ID="..." SERPAPI_API_KEY="..." npm run sync:reviews

export async function generateMetadata(props, parent) {
  // read route params

  // fetch data
  const data = await getSinglePostData("home", "wp-json/wp/v2/pages");

  if (data?.length > 0) {
    return buildPageMetadata({ seoData: data[0].yoast_head_json, path: "" });
  }
}

export default async function Home() {
  const data = await getSinglePostData("home", "wp-json/wp/v2/pages");
  const options = await getOptions();
  // const googleReviews = await getGoogleReviews()
  if (!data?.length) notFound();
  const sections = data[0]?.acf?.sections;
  return (
    <>
      <Header />
      <main>
        <Layout
          googleReviewsData={reviewsData}
          uspTable={options.usp_table}
          sections={sections}
          uspData={options.usp}
          statsData={options.status}
          locationsCovered={options.locations_covered}
          hoursCalculatorData={options.hours_calculator}
          servicesData={options.services}
        />

        {/* <USP showTitle={true} statsArray={options.stats.items} cards={options.usp.items} title={options.usp.section_title} description={options.usp.section_description} /> */}
      </main>
      <Footer
        showFooterCta={true}
        className="mt-32"
        footerCtaData={options.footer_cta}
        contactInfo={options.contact_info}
        socialData={options.social_links}
      />
    </>
  );
}
