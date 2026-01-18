import { TripInfo } from "@/app/create-new-trip/_components/ChatBox";
import { createContext } from "react";
export type TripContexttype = {
  tripDetailInfo: TripInfo | null;
  setTripDetailInfo: React.Dispatch<React.SetStateAction<TripInfo | null>>;
};

export const TripDetailContext = createContext<TripContexttype | undefined>(
  undefined
);
