import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Compass, MoreVertical } from "lucide-react";
import { Video } from "@/types/video";

interface InteractionButtonsProps {
  video: Video;
}

export function InteractionButtons({ video }: InteractionButtonsProps) {
  return (
    <div className="flex flex-col items-center gap-6 relative z-20">
      <InteractionButton icon={<Heart className="h-6 w-6" />} label={video.likes} />
      <InteractionButton icon={<MessageCircle className="h-6 w-6" />} label={video.comments} />
      <InteractionButton icon={<Share2 className="h-6 w-6" />} label={video.shares} />
      <InteractionButton icon={<Compass className="h-6 w-6" />} label="Explore" />
      <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-white/20">
        <MoreVertical className="h-6 w-6" />
      </Button>
    </div>
  );
}

interface InteractionButtonProps {
  icon: React.ReactNode;
  label: string;
}

function InteractionButton({ icon, label }: InteractionButtonProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Button variant="ghost" size="icon" className="rounded-full bg-black/20 text-white hover:bg-white/20">
        {icon}
      </Button>
      <span className="text-white text-sm">{label}</span>
    </div>
  );
} 