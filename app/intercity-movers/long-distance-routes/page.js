import Header from "@/Components/UI/Header/Header";
import Footer from "@/Components/UI/Footer/Footer";
import LongDistanceRoutes from "@/Components/UI/LongDistanceRoutes/LongDistanceRoutes";
import routeData from "@/data/long-distance-routes.json";
import { buildPageMetadata } from "@/utils/buildPageMetadata";
import { getNewZealandDate } from "@/utils/routeSchedule";
import { nzCitiesData } from "@/utils/staticData/nzCitiesData";

export function generateMetadata() {
  return buildPageMetadata({
    seoData: routeData.metadata,
    path: "/intercity-movers/long-distance-routes",
  });
}

export default async function Page({ searchParams }) {
  // Reading searchParams renders per request, so the initial dates stay current
  // without a rebuild or a scheduled CMS update.
  const params = await searchParams;
  const from = typeof params?.from === "string" ? params.from : null;
  const to = typeof params?.to === "string" ? params.to : null;
  const date = typeof params?.date === "string" ? params.date : null;

  return (
    <>
      <Header />
      <main>
        <LongDistanceRoutes
          nzCitiesData={nzCitiesData}
          initialFilters={{ from, to, date }}
          initialToday={getNewZealandDate()}
          longDistanceRoutesData={routeData.cards}
        />
      </main>
      <Footer
        showFooterCta
        className="mt-32"
        footerCtaData={{
          title: "No routes found",
          description:
            "We might still be able to help! Smart Movers runs nationwide routes on request.",
          cta_link: {
            url: "/get-intercity-quote",
            title: "Request a custom quote",
          },
        }}
        socialData={routeData.socialLinks}
      />
    </>
  );
}
