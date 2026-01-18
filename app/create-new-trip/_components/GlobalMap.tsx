import React, { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { Activity, Itinerary } from "./ChatBox";

function GlobalMap() {
  const mapContainerRef = useRef(null);
  //@ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string;

    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40],
      zoom: 1.7,
      projection: "globe",
    });

    const markers: mapboxgl.Marker[] = [];

    if (tripDetailInfo) {
      tripDetailInfo.itinerary.forEach((itinerary: Itinerary) => {
        itinerary.activities.forEach((activity: Activity) => {
          const { longitude, latitude } = activity.geo_coordinates ?? {};

          if (typeof longitude === "number" && typeof latitude === "number") {
            const marker = new mapboxgl.Marker({ color: "red" })
              .setLngLat([longitude, latitude])
              .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setText(activity.place_name),
              )
              .addTo(map); // ✅ FIXED HERE

            markers.push(marker);

            map.flyTo({
              center: [longitude, latitude],
              zoom: 5,
            });
          }
        });
      });
    }

    return () => {
      markers.forEach((marker) => marker.remove());
      map.remove();
    };
  }, [tripDetailInfo]);

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ width: "95%", height: "85vh", borderRadius: 20 }}
      ></div>
    </div>
  );
}

export default GlobalMap;
