import React from "react";
import { Button } from "../ui/button";
// import { Pause, Play } from "lucide-react";

const TogglePlayPause = ({
  isPlaying,
  togglePlay,
}: {
  isPlaying: boolean;
  togglePlay: (
    e: React.MouseEvent<HTMLButtonElement | HTMLVideoElement>
  ) => void;
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
      <Button
        variant="ghost"
        size="icon"
        className="h-16 w-16 e hover:bg-white/30n rounded-full bg-[#4248547A] text-white hover:bg-white/30 flex items-center justify-center"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <img
            src={"/icons/player/pause.svg"}
            alt="pause"
            width={16}
            height={16}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={"/icons/player/play.svg"}
            alt="play"
            width={16}
            height={16}
          />
        )}
      </Button>
    </div>
  );
};

export default TogglePlayPause;
