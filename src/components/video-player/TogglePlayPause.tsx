import React from "react";
import { Button } from "../ui/button";
import { Pause, Play } from "lucide-react";

const TogglePlayPause = ({
  isPlaying,
  togglePlay,
}: {
  isPlaying: boolean;
  togglePlay: (e: React.MouseEvent<HTMLButtonElement | HTMLVideoElement>) => void;
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
      <Button
        variant="ghost"
        size="icon"
        className="h-16 w-16 rounded-full bg-white/20 text-white hover:bg-white/30"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-8 w-8" />
        ) : (
          <Play className="h-8 w-8" />
        )}
      </Button>
    </div>
  );
};

export default TogglePlayPause;
