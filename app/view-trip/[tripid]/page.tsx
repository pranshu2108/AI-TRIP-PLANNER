"use client";

import GlobalMap from "@/app/create-new-trip/_components/GlobalMap";
import Itinerary from "@/app/create-new-trip/_components/Itinerary";
import { Trip } from "@/app/my-trips/page";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Viewtrip() {
  const { tripid } = useParams();
  const { userDetail, setUserDetail } = useUserDetail();
  const [tripData, setTripData] = useState<Trip>();
  //@ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  useEffect(() => {
    userDetail && GetTrip();
  }, [userDetail]);
  const convex = useConvex();
  const GetTrip = async () => {
    const result = await convex.query(api.tripDetail.GetTripbyId, {
      uid: userDetail._id,
      tripid: tripid?.toString() ?? "",
    });
    console.log("Trip by id", result);
    setTripData(result[0]);
    setTripDetailInfo(result[0]?.tripDetail);
  };

  return (
    <div className="grid grid-cols-5">
      <div className="col-span-3">
        <Itinerary />
      </div>
      <div className="col-span-2">
        <GlobalMap />
      </div>
    </div>
  );
}

export default Viewtrip;
