import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { placeName } = await req.json();
  const BASE_url = "https://places.googleapis.com/v1/places:searchText";
  const config = {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process?.env.GOOGLE_PLACE_API_KEY,
      "X-Goog-FieldMask": "places.displayName,places.id,places.photos",
    },
  };

  try {
    const result = await axios.post(
      BASE_url,
      {
        textQuery: placeName,
      },
      config
    );
    const placeRefName = result?.data?.places[0]?.photos[0]?.name;
    const PhotoRefUrl = `https://places.googleapis.com/v1/${placeRefName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${process?.env.GOOGLE_PLACE_API_KEY}`;
    return NextResponse.json(PhotoRefUrl);
  } catch (error: any) {
    console.log("Google API error:", error?.response?.data);

    return NextResponse.json(
      {
        message: error?.response?.data || error.message,
      },
      { status: error?.response?.status || 500 }
    );
  }
}
