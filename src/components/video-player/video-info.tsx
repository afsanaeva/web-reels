import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Video } from "@/types/video";

interface VideoInfoProps {
  video: Video;
}

export function VideoInfo({ video }: VideoInfoProps) {
  return (
    <div className="absolute bottom-4 left-4 right-16 z-20 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 border-2 border-white shrink-0">
          <AvatarImage src={video.channelAvatar} />
          <AvatarFallback>JH</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold truncate">{video.channel}</span>
            <Button variant="secondary" size="sm" className="rounded-full h-8 px-4">
              Follow
            </Button>
          </div>
          <p className="text-white/90 text-sm line-clamp-2 mt-1">{video.title}</p>
          <p className="text-white/70 text-sm mt-1">{video.views}</p>
        </div>
      </div>
    </div>
  );
} 