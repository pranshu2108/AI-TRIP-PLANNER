"use client";
import React, { useEffect, useState } from "react";
import ChatBox from "./_components/ChatBox";
import Itinerary from "./_components/Itinerary";
import { useTripDetail } from "../provider";
import GlobalMap from "./_components/GlobalMap";
import { Globe2, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function CreateNewTrip() {
  //@ts-ignore
  const { triDetailInfo, setTripDetailInfo } = useTripDetail();
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    setTripDetailInfo(null);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10">
      <div>
        <ChatBox></ChatBox>
      </div>
      <div className="col-span-2 relative">
        {activeIndex === 0 ? <Itinerary></Itinerary> : <GlobalMap></GlobalMap>}
        <div
          className={` pointer-events-none absolute w-full flex justify-center ${
            activeIndex === 0 ? "bottom-20" : "bottom-10"
          }`}
        >
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="lg"
                className=" pointer-events-auto bg-black hover:bg-gray-500 cursor-pointer"
                onClick={() => setActiveIndex(activeIndex == 0 ? 1 : 0)}
              >
                {activeIndex === 0 ? <Plane /> : <Globe2 />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> Switch Between Trip and Map</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default CreateNewTrip;
