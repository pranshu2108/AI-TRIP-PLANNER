import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { aj } from "../arcjet/route";
import { auth, currentUser } from "@clerk/nextjs/server";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `You are an AI Trip Planner Agent.

Your goal is to help the user plan a trip by asking ONE relevant trip-related question at a time.

Respond in STRICT JSON only.
Do NOT include explanations, markdown, or extra text.

────────────────────────
QUESTION FLOW (FOLLOW EXACT ORDER)
Ask for the following details ONE BY ONE, in this exact order:

1. Starting location (source)
2. Destination city or country (destination)
3. Group size (groupSize)
4. Budget (budget)
5. Trip duration in days (TripDuration)

────────────────────────
IMPORTANT RULES

- Accept ANY user input as the answer.
- Do NOT validate, judge, or restrict values.
- Whatever the user types is the correct answer.
- After receiving an answer, ALWAYS move to the next step in the order above.
- Ask ONLY ONE question at a time.
- Do NOT ask irrelevant or extra questions.
- If the user message is empty, ask them to repeat.
- Maintain a conversational, friendly tone.

────────────────────────
RESPONSE FORMAT RULES

- During the question-asking phase, ALWAYS return ONLY this JSON shape:

{
  "resp": "string",
  "ui": "source | destination | groupSize | budget | TripDuration"
}

- The "ui" value MUST correspond to the NEXT required detail in the order list.
- NEVER mismatch the question and the "ui" value.

────────────────────────
FINAL STEP

Once ALL required details are collected, return ONLY:

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
- Keep all descriptions under 10 words

Output Schema (fill with real values):

{
  "trip_plan": {
    "destination": "string",
    "duration": "string",       
    "origin": "string",
    "budget": "string",          
    "group_size": "string",     
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "string",
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
            "geo_coordinates": {
              "latitude": 0,
              "longitude": 0
            },
            "place_address": "string",
            "ticket_pricing": "string",
            "best_time_to_visit": "string",
            "time_travel_each_location": "string"
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
      max_tokens: 1200,
    });
    console.log(completion.choices[0].message);

    const message = completion.choices[0].message;
    return NextResponse.json(JSON.parse(message.content ?? ""));
  } catch (err) {
    return NextResponse.json(err);
  }
}

// export async function POST(req: NextRequest) { const { messages, isFinal } = await req.json(); try { const completion = await openai.chat.completions.create({ model: "openai/gpt-4.1-mini", response_format: { type: "json_object" }, messages: [ { role: "system", content: isFinal ? FINAL_PROMPT : PROMPT, }, ...messages, ], max_tokens: 2000, }); console.log(completion.choices[0].message); const message = completion.choices[0].message; return NextResponse.json(JSON.parse(message.content ?? "")); } catch (err) { return NextResponse.json(err); }
