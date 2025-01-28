import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video } from "@/types/video";
import { videos } from "@/data/videos";

interface InteractionButtonsProps {
  video: Video;
  onCommentClick: () => void;
  onExploreClick: () => void;
}

export function InteractionButtons({
  video,
  onCommentClick,
  onExploreClick,
}: InteractionButtonsProps) {
  const [likeCount, setLikeCount] = useState(video.likes);
  const [isLiked, setIsLiked] = useState(video.isLiked);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const toggleShareModal = () => setIsShareModalOpen((prev) => !prev);

  const handleLikeDislike = () => {
    setIsLiked(!isLiked);
    // setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Like Button */}
      <InteractionButton
        icon={
          isLiked ? (
            <img
              src="/icons/redHeart.svg"
              alt="red heart"
              width={30}
              height={30}
            />
          ) : (
            <img
              src="/icons/Heart.svg"
              alt="heart"
              width={30}
              height={30}
            />
          )
        }
        label={likeCount.toString()}
        onClick={handleLikeDislike}
      />

      {/* Comment Button */}
      <InteractionButton
        icon={
          <img
            src="/icons/comment.svg"
            alt="comment"
            width={25}
            height={30}
          />
        }
        label={video.comments}
        onClick={onCommentClick}
      />

      {/* Share Button */}
      <InteractionButton
        icon={
          <img
            src="/icons/share.svg"
            alt="share"
            width={25}
            height={30}
          />
        }
        label={video.shares}
        onClick={toggleShareModal}
      />

      {/* Explore Button */}
      <InteractionButton
        icon={
          <img
            src="/icons/explore.svg"
            alt="explore"
            width={25}
            height={30}
          />
        }
        label="Explore"
        onClick={onExploreClick}
      />
    </div>
  );
}

interface InteractionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function InteractionButton({ icon, label, onClick }: InteractionButtonProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-gray-700 text-white hover:bg-gray-600"
        onClick={onClick}
      >
        {icon}
      </Button>
      <span className="text-white text-sm">{label}</span>
    </div>
  );
}

// Main Component to Render Videos
export default function App() {
  const handleCommentClick = () => {
    console.log("Comment button clicked!");
  };

  const handleExploreClick = () => {
    console.log("Explore button clicked!");
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8 flex flex-col gap-6 overflow-auto">
      {videos.map((video) => (
        <div key={video.id} className="flex items-center gap-6 bg-gray-800 p-4 rounded-lg">
          {/* Video Thumbnail */}
          <video src={video.src} controls className="w-32 h-32 rounded-lg"></video>

          {/* Video Details */}
          <div>
            <h3 className="text-white font-bold">{video.title}</h3>
            <p className="text-gray-400 text-sm">{video.channel}</p>
            <InteractionButtons
              video={video}
              onCommentClick={handleCommentClick}
              onExploreClick={handleExploreClick}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
