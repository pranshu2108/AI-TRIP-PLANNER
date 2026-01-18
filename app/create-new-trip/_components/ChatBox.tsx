"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDays from "./SelectDays";
import FinalUi from "./FinalUi";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";

type Message = {
  role: string;
  content: string;
  ui?: string;
};

export type TripInfo = {
  budget: string;
  destination: string;
  duration: string;
  group_size: string;
  origin: string;
  hotels: Hotel[];
  itinerary: Itinerary[];
};

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  description: string;
};

export type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};

type ChatBoxProps = {
  setActiveIndex?: (index: number) => void;
};

function ChatBox({ setActiveIndex }: ChatBoxProps) {
  const onTripGenerated = () => {
    // when AI finishes or Final UI is reached
    setActiveIndex?.(0); // 👈 switch to Itinerary
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [Loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo>();
  const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
  const { userDetail, setUserDetail } = useUserDetail();
  //@ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const onSend = async (
    overrideMessage?: string,
    options?: { silent?: boolean },
  ) => {
    console.log("onSend triggered");
    const finalMessage = (overrideMessage ?? userInput)?.trim();
    if (!finalMessage) return;

    setLoading(true);
    setUserInput("");

    const newMsg: Message = {
      role: "user",
      content: finalMessage,
    };
    console.log("New Message:", newMsg);
    if (!options?.silent) {
      setMessages((prev) => [...prev, newMsg]);
    }

    console.log("isFinal", isFinal);
    const result = await axios.post("/api/aimodel", {
      messages: [...messages, newMsg],
      isFinal: isFinal,
    });

    console.log("TRIP Response:", result.data);

    !isFinal &&
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result?.data?.resp,
          ui: result?.data?.ui,
        },
      ]);

    if (isFinal) {
      setTripDetail(result?.data?.trip_plan);
      setTripDetailInfo(result?.data?.trip_plan);
      const tripId = uuidv4();
      await SaveTripDetail({
        tripDetail: result?.data?.trip_plan,
        tripId: tripId,
        uid: userDetail?._id,
      });
    }

    setLoading(false);
  };

  const RenderGenerativeUi = (ui: string) => {
    if (ui === "budget") {
      return (
        <BudgetUi
          onSelectedOption={(v: string) => {
            onSend(v); // <-- Send directly to the function
          }}
        />
      );
    } else if (ui === "groupSize") {
      return (
        <GroupSizeUi
          onSelectedOption={(v: string) => {
            onSend(v); // <-- Send directly to the function
          }}
        />
      );
    } else if (ui === "TripDuration") {
      return (
        <SelectDays
          onSelectedOption={(v: string) => {
            onSend(v); // <-- Send directly to the function
          }}
        />
      );
    } else if (ui === "Final") {
      return <FinalUi viewTrip={onTripGenerated} disable={!tripDetail} />;
    }
    return null;
  };

  // useEffect(() => {
  //   const lastMsg = messages[messages.length - 1];
  //   console.log("useeffect triggered", lastMsg);
  //   if (lastMsg?.ui === "Final") {
  //     console.log("finalmessagetrigerred", lastMsg);
  //     setIsFinal(true);
  //     console.log("finalstate", isFinal);
  //     onSend("__GENERATE_FINAL_PLAN__");
  //   }
  // }, [messages]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];

    if (lastMsg?.ui === "Final") {
      setIsFinal(true);
    }
  }, [messages]);

  useEffect(() => {
    if (isFinal) {
      onSend("GENERATE FINAL PLAN NOW", { silent: true });
    }
  }, [isFinal]);

  return (
    <div className="h-[85vh] flex flex-col border rounded-r-2xl p-5 bg-gray-50">
      {messages.length === 0 && !Loading && (
        <EmptyBoxState
          onSelectOption={(v: string) => {
            setUserInput(v);
            onSend();
          }}
        />
      )}

      {/* DisplayMessages */}
      <section className="flex-1 overflow-y-auto p-4">
        {messages.map((msg: Message, index) =>
          msg.role === "user" ? (
            <div className="flex justify-end mt-2" key={index}>
              <div className="max-w-lg bg-primary text-white px-4 py-2 rounded-lg">
                {msg.content}
              </div>
            </div>
          ) : (
            <div className="flex justify-start mt-2" key={index}>
              <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg">
                {msg.content}
                {RenderGenerativeUi(msg.ui ?? "")}
              </div>
            </div>
          ),
        )}

        {Loading && (
          <div className="flex justify-start mt-2">
            <div className="max-w-lg bg-gray-100 text-black px-4 py-2 rounded-lg">
              {<Loader className="animate-spin" />}
            </div>
          </div>
        )}
      </section>

      <section>
        <div className="border rounded-2xl p-4 shadow-2xl relative">
          <Textarea
            placeholder="Send a message..."
            className="w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
          />
          <Button
            size={"icon"}
            className="absolute bottom-6 right-6"
            onClick={() => onSend()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ChatBox;
