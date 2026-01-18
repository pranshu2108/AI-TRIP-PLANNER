import React, { useState } from "react";
import { Button } from "@/components/ui/button";

function SelectDays({ onSelectedOption }: any) {
  const [days, setDays] = useState(3); // default value

  const increment = () => setDays((d) => d + 1);
  const decrement = () => {
    if (days > 1) setDays((d) => d - 1);
  };

  const handleConfirm = () => {
    onSelectedOption(`${days} Days`);
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-center text-lg font-semibold mb-4">
        How many days do you want to travel?
      </h2>

      <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-full shadow-inner">
        {/* Minus button */}
        <button
          onClick={decrement}
          className="
            w-10 h-10 flex items-center justify-center rounded-full border bg-white 
            text-xl font-bold 
            cursor-pointer 
            transition-all duration-200

            hover:bg-gray-100 
            active:bg-gray-300 active:scale-95
          "
        >
          -
        </button>

        {/* Days display */}
        <span className="text-xl font-bold">{days} Days</span>

        {/* Plus button */}
        <button
          onClick={increment}
          className="
            w-10 h-10 flex items-center justify-center rounded-full border bg-white 
            text-xl font-bold
            cursor-pointer 
            transition-all duration-200

            hover:bg-gray-100 
            active:bg-gray-300 active:scale-95
          "
        >
          +
        </button>
      </div>

      {/* Confirm button */}
      <Button
        onClick={handleConfirm}
        className="
          mt-5 px-6 py-2 rounded-full text-white bg-orange-500
          transition-all duration-200
          
          hover:bg-orange-600
          active:bg-orange-700 active:scale-95
          cursor-pointer
        "
      >
        Confirm
      </Button>
    </div>
  );
}

export default SelectDays;
