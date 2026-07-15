import Header from "@/Components/UI/Header/Header";
import Footer from "@/Components/UI/Footer/Footer";
import Layout from "@/Components/UI/Layout/Layout";
import PageSchema from "@/Components/SEO/PageSchema";
import { deriveSuburbName } from "@/utils/locationBusinessData";
import reviewsData from "@/data/google-reviews.json";

export default function RemovalistPage({ post, options }) {
  return (
    <>
      <PageSchema
        path={`/movers/${post?.slug}`}
        name={post?.title?.rendered}
        businessCity={post?.slug}
        breadcrumbs={[
          { name: "Home", path: "" },
          { name: post?.title?.rendered, path: `/movers/${post?.slug}` },
        ]}
        services={[
          {
            name: post?.title?.rendered,
            serviceType: "House and furniture removals",
            areaServed: {
              "@type": "City",
              name: deriveSuburbName({
                title: post?.title?.rendered,
                slug: post?.slug,
              }),
            },
          },
        ]}
      />
      <Header />
      <main>
        <Layout
          sections={post?.acf?.sections}
          googleReviewsData={reviewsData}
          ugcVideos={options.ugc_videos}
          uspData={options.usp}
          statsData={options.status}
          locationsCovered={options.locations_covered}
          hoursCalculatorData={options.hours_calculator}
          servicesData={options.services}
        />
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
