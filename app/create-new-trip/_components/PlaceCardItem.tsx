"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, Ticket, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Activity } from "./ChatBox";

type prop = {
  activity: Activity;
};

function PlaceCardItem({ activity }: prop) {
  const [placePhotoUrl, setPlacePhotoUrl] = useState<string>();

  useEffect(() => {
    activity && GetGooglePlaceDetail();
  }, [activity]);

  const GetGooglePlaceDetail = async () => {
    const result = await axios.post("/api/google-place-detail", {
      placeName: activity?.place_name + ":" + activity?.place_address,
    });
    if (!result?.data) {
      return;
    }
    setPlacePhotoUrl(result.data);
  };

  return (
    <div>
      <Image
        src={placePhotoUrl ? placePhotoUrl : "/placeholder.jpg"}
        alt={activity.place_name}
        width={400}
        height={200}
        className="rounded-xl object-cover my-2"
      />
      <h2 className="font-semibold text-lg">{activity?.place_name}</h2>
      <p className="text-gray-500 line-clamp-2 mt-1">
        {activity?.place_details}
      </p>
      <h2 className="flex gap-2 text-blue-600 line-clamp-2 mt-1">
        <Ticket />
        {activity?.ticket_pricing}
      </h2>
      <p className="flex text-orange-300 gap-2 mt-1">
        <Clock /> {activity?.time_travel_each_location}
      </p>
      <p className="flex text-gray-500 gap-2 mt-1">
        <Timer /> {activity?.best_time_to_visit}
      </p>
      <Link
        href={
          "https://www.google.com/maps/search/?api=1&query=" +
          activity?.place_name
        }
        target="_blank"
      >
        <Button size={"sm"} variant={"outline"} className="w-full mt-2">
          View
          <ExternalLink />
        </Button>
      </Link>
    </div>
  );
}

export default PlaceCardItem;
