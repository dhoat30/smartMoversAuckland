import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 2592000; // 30 days

const THIRTY_DAYS = 2592000;

function buildSerpUrl({ placeId, apiKey, pageToken, forceNoCache }) {
  // SerpAPI docs: no_cache=true bypasses SerpAPI cache (which is ~1h). :contentReference[oaicite:1]{index=1}
  const params = new URLSearchParams({
    engine: "google_maps_reviews",
    place_id: placeId,
    api_key: apiKey,
    hl: "en",
    gl: "nz",
    reviews_sort: "newest", // SerpAPI param is sort_by in docs; keeping your working behavior
  });

  if (pageToken) params.set("next_page_token", pageToken);
  if (forceNoCache) params.set("no_cache", "true");

  return `https://serpapi.com/search.json?${params.toString()}`;
}

async function fetchAllReviews({ placeId, apiKey, forceNoCache }) {
  let allReviews = [];
  let pageToken = null;
  let pageCount = 0;
  const maxPages = 5;

  while (pageCount < maxPages) {
    const apiUrl = buildSerpUrl({ placeId, apiKey, pageToken, forceNoCache });

    // IMPORTANT:
    // - When Next is caching this route (revalidate), the route output is cached.
    // - This fetch can be cached too, but we don't need "force-cache".
    // - Use Next revalidate for long caching; use no-store when forcing fresh fetch.
    const response = await fetch(
      apiUrl,
      forceNoCache
        ? { cache: "no-store" }
        : { next: { revalidate: THIRTY_DAYS } },
    );

    if (!response.ok) {
      const preview = (await response.text()).slice(0, 300);
      throw new Error(`SerpAPI HTTP ${response.status}: ${preview}`);
    }

    const data = await response.json();

    const reviewsArr =
      data.reviews ||
      data.place_reviews ||
      data.reviews_results ||
      data.user_reviews ||
      data.local_reviews ||
      [];

    if (Array.isArray(reviewsArr)) allReviews = allReviews.concat(reviewsArr);

    const nextToken = data.serpapi_pagination?.next_page_token;
    if (nextToken) {
      pageToken = nextToken;
      pageCount++;
    } else {
      break;
    }
  }

  return allReviews;
}

export async function GET(req) {
  try {
    const placeId = process.env.GOOGLE_PLACE_ID;
    const apiKey = process.env.SERPAPI_API_KEY;

    if (!placeId || !apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing SERPAPI_API_KEY or GOOGLE_PLACE_ID",
          reviews: [],
        },
        { status: 400 },
      );
    }

    // Manual refresh: /api/google-reviews?refresh=true
    const url = new URL(req.url);
    const refresh = url.searchParams.get("refresh") === "true";

    // If refresh=true, we bypass SerpAPI cache.
    let reviews = await fetchAllReviews({
      placeId,
      apiKey,
      forceNoCache: refresh,
    });

    // If we got 0 reviews on a normal run, retry once bypassing SerpAPI cache.
    // This addresses SerpAPI cached "no reviews" edge cases. :contentReference[oaicite:2]{index=2}
    if (!refresh && reviews.length === 0) {
      reviews = await fetchAllReviews({ placeId, apiKey, forceNoCache: true });
    }

    // Prevent caching an empty response for 30 days:
    if (reviews.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "SerpAPI returned 0 reviews (not caching empty)",
          reviews: [],
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { success: true, totalReviews: reviews.length, reviews },
      { status: 200 },
    );
  } catch (err) {
    console.error("google-reviews route error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to fetch reviews",
        reviews: [],
      },
      { status: 503 },
    );
  }
}
