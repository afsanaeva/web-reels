import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
const ToggleMuteUnmute = ({
  isMuted,
  toggleMute,
  size = "md",
}: {
  isMuted: boolean;
  toggleMute: (e: React.MouseEvent<any>) => void;
  size?: "md" | "sm";
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center transition-opacity duration-300",
        {
          "inset-0 absolute": size === "md",
        }
      )}
      onClick={toggleMute}
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
        {isMuted ? (
          <img
            src={"/icons/player/mute.svg"}
            alt="mute"
            width={16}
            height={16}
            className={cn({ "size-8": size === "md", "size-5": size === "sm" })}
          />
        ) : (
          <img
            src={"/icons/player/unmute.svg"}
            alt="unmute"
            width={16}
            height={16}
            className={cn({ "size-8": size === "md", "size-5": size === "sm" })}
          />
        )}
      </Button>
    </div>
  );
};

export default ToggleMuteUnmute;
