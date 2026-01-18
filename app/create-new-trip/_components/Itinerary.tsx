"use client";
import React, { useEffect, useState } from "react";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Star,
  Ticket,
  Timer,
  Wallet2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Content } from "next/font/google";
import HotelCardItem from "./HotelCardItem";
import PlaceCardItem from "./PlaceCardItem";
import { useTripDetail } from "@/app/provider";
import { TripInfo } from "./ChatBox";
import { px } from "motion";

// const TRIP_DATA = {
//   destination: "Delhi",
//   duration: "3 days",
//   origin: "New York",
//   budget: "Moderate",
//   group_size: "1 person",
//   hotels: [
//     {
//       hotel_name: "Bloomrooms @ New Delhi Railway Station",
//       hotel_address:
//         "Near New Delhi Railway Station, Connaught Place, New Delhi",
//       price_per_night: "$45",
//       hotel_image_url:
//         "https://www.bloomrooms.com/images/bloomrooms-new-delhi-railway-station.jpg",
//       geo_coordinates: {
//         latitude: 28.641,
//         longitude: 77.217,
//       },
//       rating: 4,
//       description:
//         "A budget-friendly hotel offering clean, comfortable rooms with modern amenities close to New Delhi Railway Station and major attractions.",
//     },
//   ],
//   itinerary: [
//     {
//       day: 1,
//       day_plan: "Visit historical sites and explore Old Delhi.",
//       best_time_to_visit_day: "Morning to early afternoon",
//       activities: [
//         {
//           place_name: "Red Fort",
//           place_details:
//             "A UNESCO World Heritage Site, the Red Fort is a historic fort with massive red sandstone walls, showcasing Mughal architecture.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/1/1e/Red_Fort_in_New_Delhi_03-2016_img3.jpg",
//           geo_coordinates: {
//             latitude: 28.6562,
//             longitude: 77.241,
//           },
//           place_address: "Netaji Subhash Marg, Chandni Chowk, New Delhi",
//           ticket_pricing: "INR 35 for Indians, INR 500 for foreigners",
//           time_travel_each_location: "30 mins from hotel",
//           best_time_to_visit: "9 AM - 12 PM",
//         },
//         {
//           place_name: "Jama Masjid",
//           place_details:
//             "One of the largest mosques in India, located near Red Fort, with beautiful architecture and a vibrant market around.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/8/82/Jama_Masjid_front.JPG",
//           geo_coordinates: {
//             latitude: 28.65,
//             longitude: 77.233,
//           },
//           place_address: "Jama Masjid Rd, Old Delhi",
//           ticket_pricing: "Free entry",
//           time_travel_each_location: "10 mins walk from Red Fort",
//           best_time_to_visit: "9 AM - 11 AM",
//         },
//         {
//           place_name: "Chandni Chowk Market",
//           place_details:
//             "A bustling market known for street food, spices, jewelry, and traditional Indian goods.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/4/4f/OldDelhi-ChandniChowk-Market-2009.jpg",
//           geo_coordinates: {
//             latitude: 28.6566,
//             longitude: 77.2303,
//           },
//           place_address: "Chandni Chowk, New Delhi",
//           ticket_pricing: "Free entry",
//           time_travel_each_location: "5 mins from Jama Masjid",
//           best_time_to_visit: "12 PM - 3 PM",
//         },
//       ],
//     },
//     {
//       day: 2,
//       day_plan: "Explore New Delhi's cultural and government landmarks.",
//       best_time_to_visit_day: "Morning to late afternoon",
//       activities: [
//         {
//           place_name: "India Gate",
//           place_details:
//             "A war memorial located in the heart of New Delhi, surrounded by gardens and ideal for a relaxed walk.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/e/e4/India_Gate_in_New_Delhi_03-2016_img1.jpg",
//           geo_coordinates: {
//             latitude: 28.6129,
//             longitude: 77.2295,
//           },
//           place_address: "Rajpath, India Gate, New Delhi",
//           ticket_pricing: "Free entry",
//           time_travel_each_location: "20 mins from hotel",
//           best_time_to_visit: "8 AM - 11 AM",
//         },
//         {
//           place_name: "Humayun's Tomb",
//           place_details:
//             "This UNESCO World Heritage Site is a beautiful Mughal garden tomb and a precursor to the Taj Mahal.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/0/0b/Humayun%27s_Tomb_in_March_2016-06.jpg",
//           geo_coordinates: {
//             latitude: 28.5933,
//             longitude: 77.2507,
//           },
//           place_address: "Mathura Road, Nizamuddin, New Delhi",
//           ticket_pricing: "INR 40 for Indians, INR 600 for foreigners",
//           time_travel_each_location: "25 mins from India Gate",
//           best_time_to_visit: "11 AM - 2 PM",
//         },
//         {
//           place_name: "Lotus Temple",
//           place_details:
//             "Known for its flowerlike shape, the Lotus Temple is a Bahá'í House of Worship open to all for meditation and reflection.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/7/7a/Lotus_Temple_New_Delhi_2018_01.jpg",
//           geo_coordinates: {
//             latitude: 28.5535,
//             longitude: 77.2588,
//           },
//           place_address:
//             "Lotus Temple Rd, Bahapur, Shambhu Dayal Bagh, Kalkaji, New Delhi",
//           ticket_pricing: "Free entry",
//           time_travel_each_location: "20 mins from Humayun's Tomb",
//           best_time_to_visit: "3 PM - 5 PM",
//         },
//       ],
//     },
//     {
//       day: 3,
//       day_plan: "Shopping and leisure with a visit to cultural museums.",
//       best_time_to_visit_day: "Morning to early evening",
//       activities: [
//         {
//           place_name: "National Museum, New Delhi",
//           place_details:
//             "Houses a vast range of artifacts reflecting India's rich cultural heritage from pre-historic times to modern.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/c/c7/National_Museum_Delhi_Entrance.JPG",
//           geo_coordinates: {
//             latitude: 28.614,
//             longitude: 77.2109,
//           },
//           place_address:
//             "Janpath, Rajpath Area, Central Secretariat, New Delhi",
//           ticket_pricing: "INR 20 for Indians, INR 650 for foreigners",
//           time_travel_each_location: "15 mins from hotel",
//           best_time_to_visit: "10 AM - 1 PM",
//         },
//         {
//           place_name: "Connaught Place",
//           place_details:
//             "A major shopping and commercial center with restaurants, shops, and street vendors.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/f/f4/Connaught_Place_-_New_Delhi_-_India_-_2019.jpg",
//           geo_coordinates: {
//             latitude: 28.6324,
//             longitude: 77.2197,
//           },
//           place_address: "Connaught Place, New Delhi",
//           ticket_pricing: "Free entry",
//           time_travel_each_location: "10 mins from National Museum",
//           best_time_to_visit: "1 PM - 5 PM",
//         },
//         {
//           place_name: "India Habitat Centre",
//           place_details:
//             "A cultural hub featuring art exhibitions, concerts, and a tranquil garden café for relaxation.",
//           place_image_url:
//             "https://upload.wikimedia.org/wikipedia/commons/b/bb/India_Habitat_Centre_Delhi.jpg",
//           geo_coordinates: {
//             latitude: 28.6153,
//             longitude: 77.2083,
//           },
//           place_address: "Lodhi Rd, New Delhi",
//           ticket_pricing: "Free entry",
//           time_travel_each_location: "5 mins from Connaught Place",
//           best_time_to_visit: "4 PM - 6 PM",
//         },
//       ],
//     },
//   ],
// };

function Itinerary() {
  //@ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
  const [tripData, setTripData] = useState<TripInfo | null>(null);

  useEffect(() => {
    tripDetailInfo && setTripData(tripDetailInfo);
  }, [tripDetailInfo]);

  const data = tripData
    ? [
        {
          title: "Recommended Hotels",
          content: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripData?.hotels.map((hotel, index) => (
                <HotelCardItem key={hotel.hotel_name} hotel={hotel} />
              ))}
            </div>
          ),
        },
        ...tripData?.itinerary.map((dayData) => ({
          title: `Day ${dayData?.day}`,
          content: (
            <div key={`day-${dayData.day}`}>
              <p>Best time : {dayData?.best_time_to_visit_day}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dayData?.activities.map((activity, index) => (
                  <PlaceCardItem
                    key={activity.place_name}
                    activity={activity}
                  />
                ))}
              </div>
            </div>
          ),
        })),
      ]
    : [];
  return (
    <div
      className={`relative w-full h-[85vh]  rounded-2xl ${
        tripData ? "overflow-y-auto" : "overflow-y-hidden"
      }`}
    >
      {/*@ts-ignore*/}
      {tripData ? (
        <Timeline data={data} tripdata={tripData} />
      ) : (
        <div className="relative overflow-hidden">
          <h2 className="absolute bottom-15 left-10 z-10 flex gap-2 text-3xl text-white items-center">
            <ArrowLeft />
            Getting to know you to Build Perfect Trip here...
          </h2>

          <Image
            src="/travel.png"
            alt="loading"
            width={800}
            height={800}
            className="w-full object-cover "
          />
        </div>
      )}
    </div>
  );
}

export default Itinerary;
