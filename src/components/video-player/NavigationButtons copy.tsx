import { ChevronUp, ChevronDown } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const NavigationButtons = ({
  navigateVideo,
  isLoading,
}: {
  navigateVideo: (direction: "prev" | "next") => void;
  isLoading: boolean;
}) => {
  return (
    <div className="absolute right-20 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black/20 text-white hover:bg-white/20"
        onClick={() => navigateVideo("prev")}
      >
        <ChevronUp className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-black/20 text-white hover:bg-white/20"
        onClick={() => navigateVideo("next")}
        disabled={isLoading}
      >
        <ChevronDown className="h-8 w-8" />
      </Button>
    </div>
  );
};

export default NavigationButtons;
