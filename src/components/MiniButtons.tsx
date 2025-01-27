import { cn } from "@/lib/utils";
import TogglePlayPause from "./TogglePlayPause";
import ToggleMuteUnmute from "./ToggleMuteUnmute";

export default function MiniButtons({
  isPlaying,
  togglePlay,
  isMuted,
  toggleMute,
  size = "sm",
  isHovering,
}: {
  isPlaying: boolean;
  togglePlay: (e: React.MouseEvent<HTMLDivElement>) => void;
  isMuted: boolean;
  toggleMute: (e: React.MouseEvent<HTMLDivElement>) => void;
  size?: "md" | "sm";
  isHovering: boolean;
}) {
  return (
    <div
      className={cn(
        `absolute flex items-center justify-center transition-opacity duration-300 top-7 left-7 z-50 gap-3`,
        {
          "opacity-100": isHovering,
          "opacity-0": !isHovering,
        }
      )}
    >
      <TogglePlayPause
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        size={size}
      />
      <ToggleMuteUnmute isMuted={isMuted} toggleMute={toggleMute} size={size} />
    </div>
  );
}
