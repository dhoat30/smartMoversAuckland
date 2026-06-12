import Header from "@/Components/UI/Header/Header";
import Footer from "@/Components/UI/Footer/Footer";
import Layout from "@/Components/UI/Layout/Layout";
import reviewsData from "@/data/google-reviews.json";

export default function RemovalistPage({ post, options }) {
  return (
    <>
      <Header />
      <main>
        <Layout
          sections={post?.acf?.sections}
          googleReviewsData={reviewsData}
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
