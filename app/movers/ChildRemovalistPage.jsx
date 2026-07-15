import Image from "next/image";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import Header from "@/Components/UI/Header/Header";
import Footer from "@/Components/UI/Footer/Footer";
import Layout from "@/Components/UI/Layout/Layout";
import JsonLd from "@/Components/SEO/JsonLd";
import LocationQuoteForm from "@/Components/UI/Layout/Sections/LocationQuoteForm/LocationQuoteForm";
import reviewsData from "@/data/google-reviews.json";
import { buildLocationSchema, summariseReviews } from "@/utils/schema";
import { deriveSuburbName } from "@/utils/locationBusinessData";
import styles from "./ChildRemovalistPage.module.scss";

export default function ChildRemovalistPage({ post, options, parentSlug }) {
  const image = post?.acf?.image;
  const parentName = parentSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const reviews = summariseReviews(reviewsData);
  const suburb = deriveSuburbName({
    title: post?.title?.rendered,
    slug: post?.slug,
  });
  const schema = buildLocationSchema({
    siteUrl: process.env.siteUrl,
    siteName: process.env.siteName,
    parentSlug,
    childSlug: post?.slug,
    post,
    reviews,
  });

  return (
    <>
      <JsonLd data={schema} />
      <Header />
      <main>
        <article className={styles.article}>
          <Container maxWidth="lg">
            <nav aria-label="breadcrumb" className={styles.breadcrumb}>
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href={`/movers/${parentSlug}`}>{parentName}</Link>
              <span>/</span>
              <span>{post.title.rendered}</span>
            </nav>
            <Typography variant="h2" component="h1" className={`${styles.title} mb-16`}>
              {post.title.rendered}
            </Typography>

            {image?.url && (
              <div className={styles.imageWrapper}>
                <Image
                  src={image.url}
                  alt={image.alt || post.title.rendered}
                  width={image.width || 1920}
                  height={image.height || 1080}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  className={styles.image}
                />
              </div>
            )}

            {post.content?.rendered && (
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            )}
          </Container>
        </article>

        <LocationQuoteForm
          pageTitle={post?.title?.rendered}
          location={suburb}
          reviewerPics={options?.reviewer_pics}
        />

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
