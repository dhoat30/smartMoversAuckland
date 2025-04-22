import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";


export async function GET() {
  try {
    const client = new ApifyClient({
      token: process.env.APIFY_API,
    });

    const input = {
      startUrls: [
        {
          url: process.env.GOOGLE_LOCATION_URL,
        },
      ],
      maxReviews: 50,
      reviewsSort: "newest",
      language: "en",
      reviewsOrigin: "all",
      personalData: true,
    };

    const run = await client.actor("Xb8osYTtOjlsgI6k9").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}


export async function Post(req, res) {
  const response = await res.json();

  return NextResponse.json(response)
}