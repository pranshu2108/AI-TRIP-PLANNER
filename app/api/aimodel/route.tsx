import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aj } from "../arcjet/route";
import { auth, currentUser } from "@clerk/nextjs/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time. Respond in strict JSON only (no explanations or extra text) with the following JSON schema:

Ask for the following details in this exact order, one at a time:
1. Starting location (source)
2. Destination city or country
3. Group size
4. Budget
5. Trip duration (number of days)
6. Travel interests
7. Special requirements or preferences

IMPORTANT RULE:
- Accept ANY user input as the answer. Do NOT validate, do NOT judge, do NOT limit the allowed values. Whatever the user types is the correct answer. Always move to the next step.

Other rules:
- Do not ask multiple questions at once, and never ask irrelevant questions.
- If the user's answer is empty (blank message), ask them to repeat. Otherwise ALWAYS accept the answer.
- Always maintain a conversational, interactive tone.
- Along with "resp", always return the correct UI key: 'budget', 'groupSize', 'TripDuration', 'interests', 'preferences', or 'Final'. (Do NOT change the casing.)
- During the question-asking phase, you must ONLY return: 
  { "resp": "...", "ui": "..." }
  Do NOT include any other fields.
- Once all required information is collected, return:
  {
    "resp": "All required details received. Generating your complete trip plan now.",
    "ui": "Final"
  }
`;

const FINAL_PROMPT = `You are a travel planning AI.

Use the conversation so far to understand:
- origin (where the user starts their journey),
- destination,
- budget,
- group size,
- and trip duration.

Now generate a complete travel plan STRICTLY in valid JSON format that matches the schema below.

IMPORTANT RULES:
- Output **ONLY** a single JSON object. No explanation, no markdown, no backticks.
- Replace every "string" and "number" example in the schema with REAL values.
- 'rating', 'latitude', 'longitude', and 'day' MUST be numbers (no quotes).
- Do not add any extra fields that are not in the schema.
- Do not wrap the JSON with '''json or any text.

Output Schema (fill with real values):

{
  "trip_plan": {
    "destination": "string",
    "duration": "string",        // e.g., "5 days"
    "origin": "string",
    "budget": "string",          // e.g., "Luxury"
    "group_size": "string",      // e.g., "2 people"
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
        "hotel_image_url": "string",
        "geo_coordinates": {
          "latitude": 0,
          "longitude": 0
        },
        "rating": 0,
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": {
              "latitude": 0,
              "longitude": 0
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "time_travel_each_location": "string",
            "best_time_to_visit": "string"
          }
        ]
      }
    ]
  }
}
`;

export async function POST(req: NextRequest) {
  const { messages, isFinal } = await req.json();
  const user = await currentUser();
  const { has } = await auth();
  const hasPremiumAccess = has({ plan: "monthly" });
  const decision = await aj.protect(req, {
    userId: user?.primaryEmailAddress?.emailAddress ?? "",
    requested: isFinal ? 5 : 0,
  });

  console.log("decision", decision);
  console.log("permium access", hasPremiumAccess);
  //@ts-ignore
  if (decision?.reason?.remaining == 0 && !hasPremiumAccess) {
    return NextResponse.json({
      resp: "No Free Credit Remaining",
      ui: "LimitReached",
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: isFinal ? FINAL_PROMPT : PROMPT,
        },
        ...messages,
      ],
      max_tokens: 100,
    });
    console.log(completion.choices[0].message);

    const message = completion.choices[0].message;
    return NextResponse.json(JSON.parse(message.content ?? ""));
  } catch (err) {
    return NextResponse.json(err);
  }
}

// export async function POST(req: NextRequest) { const { messages, isFinal } = await req.json(); try { const completion = await openai.chat.completions.create({ model: "openai/gpt-4.1-mini", response_format: { type: "json_object" }, messages: [ { role: "system", content: isFinal ? FINAL_PROMPT : PROMPT, }, ...messages, ], max_tokens: 2000, }); console.log(completion.choices[0].message); const message = completion.choices[0].message; return NextResponse.json(JSON.parse(message.content ?? "")); } catch (err) { return NextResponse.json(err); }
