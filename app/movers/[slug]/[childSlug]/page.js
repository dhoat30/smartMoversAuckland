export const revalidate = 2592000;

import { notFound } from "next/navigation";

import ChildRemovalistPage from "../../ChildRemovalistPage";
import {
  getHierarchicalPostSlugs,
  getOptions,
  getSinglePostData,
} from "@/utils/fetchData";

const getRemovalistData = async (parentSlug, childSlug) => {
  const [parentData, childData] = await Promise.all([
    getSinglePostData(parentSlug, "/wp-json/wp/v2/removalists"),
    getSinglePostData(childSlug, "/wp-json/wp/v2/removalists"),
  ]);
  const parent = parentData?.[0];
  const child = childData?.[0];

  if (!parent || parent.parent || !child || child.parent !== parent.id) {
    return null;
  }

  return child;
};

export async function generateStaticParams() {
  const { children } = await getHierarchicalPostSlugs(
    "wp-json/wp/v2/removalists",
  );
  return children;
}

export async function generateMetadata({ params }) {
  const { slug, childSlug } = await params;
  const data = await getRemovalistData(slug, childSlug);

  if (data) {
    const seoData = data.yoast_head_json;
    // Prefer the landscape hero image over Yoast's og_image (often a portrait map).
    const openGraphImage = data.acf?.image || seoData?.og_image?.[0];
    const pageUrl = `${process.env.siteUrl}/movers/${slug}/${childSlug}`;
    const yoastRobots = seoData?.robots || {};
    const images = openGraphImage?.url
      ? [
          {
            url: openGraphImage.url,
            width: openGraphImage.width || 1200,
            height: openGraphImage.height || 630,
          },
        ]
      : [];

    return {
      title: seoData?.title,
      description: seoData?.description,
      metadataBase: new URL(process.env.siteUrl),
      alternates: {
        canonical: pageUrl,
      },
      robots: {
        index: yoastRobots.index !== "noindex",
        follow: yoastRobots.follow !== "nofollow",
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
      openGraph: {
        title: seoData?.title,
        description: seoData?.description,
        url: pageUrl,
        siteName: process.env.siteName,
        locale: "en_NZ",
        images,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: seoData?.title,
        description: seoData?.description,
        images: images.map((image) => image.url),
      },
    };
  }
}

export default async function Page({ params }) {
  const { slug, childSlug } = await params;
  const [post, options] = await Promise.all([
    getRemovalistData(slug, childSlug),
    getOptions(),
  ]);

  if (!post) notFound();

  return <ChildRemovalistPage post={post} options={options} parentSlug={slug} />;
}
