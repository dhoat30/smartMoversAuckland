export const revalidate = 2592000; // applies to both page and metadata

import { notFound } from "next/navigation";
import Header from "@/Components/UI/Header/Header";
import {
  getSinglePostData,
  getOptions,
} from "@/utils/fetchData";
import Footer from "@/Components/UI/Footer/Footer";
import Layout from "@/Components/UI/Layout/Layout";
import LocationCarouselSection from "@/Components/UI/Layout/Sections/LocationCarousel/LocationCarouselSection";
import { buildPageMetadata } from "@/utils/buildPageMetadata";
import PageSchema from "@/Components/SEO/PageSchema";

import reviewsData from "@/data/google-reviews.json";

export async function generateMetadata(props, parent) {
  // read route params

  // fetch data
  const data = await getSinglePostData(
    "last-minute-movers",
    "/wp-json/wp/v2/intercity-movers",
  );

  return buildPageMetadata({
    seoData: data?.[0]?.yoast_head_json,
    path: "/last-minute-movers",
  });
}

export default async function Home() {
  const data = await getSinglePostData(
    "last-minute-movers",
    "/wp-json/wp/v2/pages",
  );

  const options = await getOptions();
  if (!data?.length) notFound();
  const sections = data[0]?.acf?.sections;
  return (
    <>
      <PageSchema
        path="/last-minute-movers"
        name={data?.[0]?.title?.rendered || "Last Minute Movers"}
        businessCity="auckland"
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: "Last Minute Movers", path: "/last-minute-movers" },
        ]}
        services={[
          { name: "Last minute & urgent moving", serviceType: "Moving service" },
        ]}
      />
      <Header />
      <main>
        <Layout
          googleReviewsData={reviewsData}
          ugcVideos={options.ugc_videos}
          uspTable={options.usp_table}
          sections={sections}
          uspData={options.usp}
          statsData={options.status}
          locationsCovered={options.locations_covered}
          hoursCalculatorData={options.hours_calculator}
          servicesData={options.services}
        />
        {/* <Layout sections={postData[0]?.acf?.sections} /> */}
        {/* <USP showTitle={true} statsArray={options.stats.items} cards={options.usp.items} title={options.usp.section_title} description={options.usp.section_description} /> */}

        {/* <GoogleReviewsCarousel data={googleReviews} /> */}
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
