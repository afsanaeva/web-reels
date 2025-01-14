import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Channel } from "@/types/channel";

interface FollowChannelProps {
  channelId: number; // Use `number` since your `id` is a number in the dummy data
  onFollow: () => void;
  className?: string;
  channelData: Channel[]; // Array of channels from the provided dummy data
}

const FollowChannel = ({
  channelId,
  onFollow,
  className,
  channelData,
}: FollowChannelProps) => {
  const [isFollowed, setIsFollowed] = useState<boolean | null>(null);

  // Sync local state with dummy data
  useEffect(() => {
    const channel = channelData.find((ch) => ch.id === channelId);
    if (channel) {
      setIsFollowed(channel.isFollowed);
    }
  }, [channelId, channelData]);

  const toggleFollow = () => {
    const channelIndex = channelData.findIndex((ch) => ch.id === channelId);
    if (channelIndex !== -1) {
      const updatedChannel = { ...channelData[channelIndex] };

      // Toggle the follow state
      updatedChannel.isFollowed = !isFollowed;

      // Update the local dummy data array
      channelData[channelIndex] = updatedChannel;

      // Update the local state
      setIsFollowed(updatedChannel.isFollowed);

      // Call the `onFollow` callback
      onFollow();
    }
  };

  if (isFollowed === null) return null; // Show nothing until state is synced

  return (
    <Button
      variant="secondary"
      size="sm"
      className={cn(
        "rounded-full h-8 px-4 transition-all duration-300",
        isFollowed ? "bg-[#424854CC] text-white" : "bg-white text-primary",
        className
      )}
      onClick={toggleFollow}
    >
      {isFollowed ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowChannel;
