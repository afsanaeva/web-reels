import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video } from "@/types/video";
import { Channel } from "@/types/channel";
// import { useVideoPlayer } from "./VideoPlayerContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DraggableScrollArea } from "@/components/ui/draggableScroll";
import FollowChannel from "./FollowChannel";

interface VideoInfoProps {
  video: Video;
  channel: Channel;
}

export function VideoInfo({ video, channel }: VideoInfoProps) {
  const [isDragging, setIsDragging] = useState(false); 
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "absolute bottom-7 left-7 right-16 z-20 flex items-start gap-3 flex-col transition-opacity duration-300",
        {
          "opacity-0": isDragging,
        }
      )}
    >
      <div className="flex items-start gap-3 flex-col">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={video.channelAvatar} />
              <AvatarFallback>JH</AvatarFallback>
            </Avatar>
            <span className="text-white font-20px truncate">
              {video.channel}
            </span>
          </div>
          {channel && (
            <FollowChannel
              onFollow={() => {
                console.log(`Followed channel: ${channel.name}`);
              }}
              channelId={channel.id}
              channelData={[channel]}
            />
          )}
        </div>
        <DraggableScrollArea
          className={` ${
            video.caption && video.caption.length > 50
              ? "overflow-y-auto h-[10vh]"
              : "overflow-hidden"
          }`}
        >
          <div>
            <p
              className={`text-white font-light font-18px mr-2 pt-2 ${
                isExpanded ? "" : "line-clamp-2"
              }`}
            >
              {video.caption}
            </p>
            {video.caption && video.caption.length > 50 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-white font-medium font-18px cursor-pointer mb-2"
                aria-expanded={isExpanded}
              >
                {isExpanded ? "less" : "more"}
              </button>
            )}
          </div>
        </DraggableScrollArea>

        <p className="text-white font-16px">{video.views} views</p>
      </div>
    </div>
  );
}
