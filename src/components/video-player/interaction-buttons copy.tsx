import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Video } from "@/types/video";
import Image from "next/image";
import { SHORT_LIKE_DISLIKE } from "@/graphql/mutations/shortsMutation";
import { Heart } from "lucide-react";
import ShareLinkModal from "@/components/ShareLinkModal";

interface InteractionButtonsProps {
  video: Video;
  onCommentClick: () => void;
  onExploreClick: () => void;
}

export function InteractionButtons({
  video,
  onCommentClick,onExploreClick,
}: InteractionButtonsProps) {
  const [likeCount, setLikeCount] = useState(video.likeCount);
  const [isLiked, setIsLiked] = useState(video.isLiked);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [toggleLikeDislike] = useMutation(SHORT_LIKE_DISLIKE, {
    variables: { shortId: video?._id },
    onError: (error) => {
      console.error("Failed to toggle like/dislike", error);
    },
  });

  const handleLikeDislike = async () => {
    try {
      // Optimistically update the UI
      setIsLiked((prev: any) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));

      // Call the mutation
      await toggleLikeDislike();
    } catch (error) {
      console.error("Error toggling like/dislike:", error);

      // Rollback UI changes in case of error
      setIsLiked((prev: any) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    }
  };

  const toggleShareModal = () => setIsShareModalOpen((prev) => !prev);

  return (
    <div className="relative z-20 flex ml-6 pb-3">
      {/* Interaction Buttons */}
      <div className="flex flex-col items-center gap-7">
        {/* Like Button */}
        <InteractionButton
          icon={
            isLiked ? (
              <img
                src={"/icons/redHeart.svg"}
                alt="red heart"
                width={30}
                height={30}
              />
            ) : (
              <img
                src={"/icons/Heart.svg"}
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
              src={"/icons/comment.svg"}
              alt="comment"
              width={25}
              height={30}
            />
          }
          label={video.commentCount.toString()}
          onClick={onCommentClick}
        />

        {/* Share Button */}
        <InteractionButton
          icon={
            <img
              src={"/icons/share.svg"}
              alt="share"
              width={25}
              height={30}
            />
          }
          label={video.shareCount.toString()}
          onClick={toggleShareModal}
        />
        {/* Share Modal */}
        <ShareLinkModal
           videoUrl={`${process.env.NEXT_PUBLIC_GRAPHQL_URL}/@${video.title}/video/${video._id}`}
          isOpen={isShareModalOpen}
          toggleModal={toggleShareModal}
        />

        {/* Explore Button */}
        <InteractionButton
          icon={
            <img
              src={"/icons/explore.svg"}
              alt="compass"
              width={25}
              height={30}
            />
          }
          label="Explore"
          onClick={onExploreClick}
        />

        {/* More Options Button */}
        <InteractionButton
          icon={
            <img
              src={"/icons/more.svg"}
              alt="more"
              width={25}
              height={25}
              className="w-5 h-5"
            />
          }
          label="More"
        />
        {/* <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-white hover:bg-transparent"
        >
          <img
            src={"/icons/more.svg"}
            alt="more"
            width={25}
            height={25}
            className="w-5 h-5"
          />
          More
        </Button> */}
      </div>
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
        className="rounded-full text-white hover:bg-transparent"
        onClick={onClick}
      >
        {icon}
      </Button>
      <span className="text-white font-16px">{label}</span>
    </div>
  );
}
