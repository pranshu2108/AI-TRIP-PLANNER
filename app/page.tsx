import { Button } from "@/components/ui/button";
import Image from "next/image";
import Hero from "./_components/Hero";
import { CityList } from "./_components/CItyList";

export default function Home() {
  return (
    <div>
      <Hero/>
      <CityList/>
    </div>

  );
}
