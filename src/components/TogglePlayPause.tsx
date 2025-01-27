import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const TogglePlayPause = ({
  isPlaying,
  togglePlay,
  size = "md",
}: {
  isPlaying: boolean;
  togglePlay: (e: React.MouseEvent<HTMLDivElement>) => void;
  size?: "md" | "sm";
}) => {
  return (
    <div
      className={cn(
        `flex items-center justify-center transition-opacity duration-300`,
        {
          "inset-0 absolute": size === "md",
        }
      )}
      onClick={togglePlay}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full bg-[#4248547A] text-white hover:bg-white/30 flex items-center justify-center",
          {
            "size-16": size === "md",
            "size-12": size === "sm",
          }
        )}
      >
        {isPlaying ? (
          <img
            src={"/icons/player/pause.svg"}
            alt="pause"
            width={16}
            height={16}
            className={cn({ "size-7": size === "md", "size-5": size === "sm" })}
          />
        ) : (
          <img
            src={"/icons/player/play.svg"}
            alt="play"
            width={16}
            height={16}
            className={cn({ "size-7": size === "md", "size-5": size === "sm" })}
          />
        )}
      </Button>
    </div>
  );
};

export default TogglePlayPause;
