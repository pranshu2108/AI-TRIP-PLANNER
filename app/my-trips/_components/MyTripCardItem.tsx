import React, { useEffect, useState } from "react";
import { Trip } from "../page";
import Image from "next/image";
import { ArrowBigRightIcon } from "lucide-react";
import { Activity } from "@/app/create-new-trip/_components/ChatBox";
import axios from "axios";
import Link from "next/link";

type Props = {
  trip: Trip;
};

function MyTripCardItem({ trip }: Props) {
  const [placePhotoUrl, setPlacePhotoUrl] = useState<string>();

  useEffect(() => {
    trip && GetGooglePlaceDetail();
  }, [trip]);

  const GetGooglePlaceDetail = async () => {
    const result = await axios.post("/api/google-place-detail", {
      placeName: trip?.tripDetail?.destination,
    });
    if (!result?.data) {
      return;
    }
    setPlacePhotoUrl(result.data);
  };

  return (
    <Link
      href={"/view-trip/" + trip?.tripId}
      className=" p-4 shadow rounded-2xl"
    >
      <Image
        src={placePhotoUrl ? placePhotoUrl : "/placeholder.jpg"}
        alt="trip image"
        width={400}
        height={400}
        className="rounded-xl  object-cover w-full h-[300]"
      />
      <h2 className="flex gap-2 font-semibold text-xl mt-2">
        {trip?.tripDetail?.origin}
        <ArrowBigRightIcon />
        {trip?.tripDetail?.destination}
      </h2>
      <h2 className="mt-2 text-gray-500">
        {trip?.tripDetail?.duration} Trip with {trip?.tripDetail?.budget}
      </h2>
    </Link>
  );
}

export default MyTripCardItem;
