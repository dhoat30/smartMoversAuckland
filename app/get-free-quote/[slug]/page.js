export const revalidate = 2592000; // applies to both page and metadata

import { notFound } from "next/navigation";

import Header from "@/Components/UI/Header/Header";
import {
  getAllPostSlugs,
  getSinglePostData,
  getGoogleReviews,
  getOptions,
} from "@/utils/fetchData";
import Footer from "@/Components/UI/Footer/Footer";
import Layout from "@/Components/UI/Layout/Layout";
import { buildPageMetadata } from "@/utils/buildPageMetadata";
import reviewsData from "@/data/google-reviews.json";

export function generateStaticParams() {
  return getAllPostSlugs("wp-json/wp/v2/quote-pages");
}

export async function generateMetadata({ params }, parent) {
  const param = await params;
  const slug = param.slug;
  const data = await getSinglePostData(slug, "/wp-json/wp/v2/quote-pages");

  if (data?.length > 0) {
    return buildPageMetadata({
      seoData: data[0].yoast_head_json,
      path: `/get-free-quote/${slug}`,
      noindex: true,
    });
  }
}

export default async function Home({ params }) {
  const param = await params;
  const slug = param.slug;
  const data = await getSinglePostData(slug, "/wp-json/wp/v2/quote-pages");

  const options = await getOptions();
  // const googleReviews = await getGoogleReviews()
  if (!data?.length) notFound();
  const sections = data[0]?.acf?.sections;
  const reviewerPics = options?.reviewer_pics;

  return (
    <>
      <Header />
      <main>
        <Layout
          sections={sections}
          googleReviewsData={reviewsData}
          ugcVideos={options.ugc_videos}
          uspData={options.usp}
          statsData={options.status}
          locationsCovered={options.locations_covered}
          hoursCalculatorData={options.hours_calculator}
          spaceCalculatorData={options.cubic_meter_calculator}
          servicesData={options.services}
          reviewerPics={reviewerPics}
        />
        {/* <Layout sections={postData[0]?.acf?.sections} /> */}
        {/* <USP showTitle={true} statsArray={options.stats.items} cards={options.usp.items} title={options.usp.section_title} description={options.usp.section_description} /> */}

        {/* <GoogleReviewsCarousel data={googleReviews} /> */}
      </main>
      <Footer
        showFooterCta={false}
        className="mt-32"
        footerCtaData={options.footer_cta}
        contactInfo={options.contact_info}
        socialData={options.social_links}
         hideBotttomCta={true}
      />
    </>
  );
}
