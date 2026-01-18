"user client"
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menuoptions = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Pricing",
    path: "/pricing",
  },
  {
    name: "Contact us",
    path: "/contact-us",
  },
];

function Header() {
  const {user}=useUser();
  const path = usePathname();

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 shadow-sm flex justify-between items-center p-4">
      <div className="flex gap-2 items-center">
        <Image src={"/logo.svg"} width={30} height={30} alt="logo" />
        <h2 className="font-bold text-2xl">AI Trip Planner</h2>
      </div>

      <div className="flex gap-8 items-center">
        {menuoptions.map((menu, index) => (<Link href={menu.path} key={index}>
            <h2 className="text-lg hover:scale-105 transition-all hover:text-primary ">
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      
      <div className="flex gap-5 items-center">
       {!user? <SignInButton mode="modal">
        <Button className="cursor-pointer">Get Started</Button>
        </SignInButton> :
        path == '/create-new-trip' ? 
        <Link href={'/my-trips'}>
        <Button className="cursor-pointer">My Trips</Button>
        </Link>:
         <Link href={'/create-new-trip'}>
        <Button className="cursor-pointer">Create New Trip</Button>
        </Link>}
        <UserButton/>
      </div>

    </div>
  );
}

export default Header;
