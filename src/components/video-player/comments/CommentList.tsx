import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scrollArea";
import { Heart, X } from "lucide-react";
import { numberToSI } from "@/utils/commonFunction";
import CommentActionsDropdown from "./CommentAction";
// import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { comments as dummyComments } from "@/data/comment";

export const DaysSinceCreated = ({
  createdAt,
  updatedAt,
}: {
  createdAt: string;
  updatedAt: string;
}) => {
  const getElapsedTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const currentDate = new Date();

    const differenceInTime = currentDate.getTime() - date.getTime();

    // Calculate years
    const years = currentDate.getFullYear() - date.getFullYear();

    // Calculate months
    let months = currentDate.getMonth() - date.getMonth();
    if (months < 0) {
      months += 12;
    }

    // Calculate days
    const days = Math.floor(differenceInTime / (1000 * 3600 * 24)) % 30;

    // Calculate hours
    const hours = Math.floor(
      (differenceInTime % (1000 * 3600 * 24)) / (1000 * 3600)
    );

    // Calculate minutes
    const minutes = Math.floor(
      (differenceInTime % (1000 * 3600)) / (1000 * 60)
    );

    // Calculate seconds
    const seconds = Math.floor((differenceInTime % (1000 * 60)) / 1000);

    return { years, months, days, hours, minutes, seconds };
  };

  const timestampToDisplay = updatedAt || createdAt;
  const { years, months, days, hours, minutes, seconds } =
    getElapsedTime(timestampToDisplay);

  let timeString = "";
  if (years > 0) timeString = `${years}y`;
  else if (months > 0) timeString = `${months}mo`;
  else if (days > 0) timeString = `${days}d`;
  else if (hours > 0) timeString = `${hours}h`;
  else if (minutes > 0) timeString = `${minutes}m`;
  else timeString = `${seconds}s`;

  const label = updatedAt && updatedAt !== createdAt ? "(edited)" : "";

  return (
    <div>
      {timeString} ago <span style={{ color: "#A9AEC0" }}>{label}</span>
    </div>
  );
};

export default function CommentList({
  shortId,
  toggleComments,
}: {
  shortId: string;
  toggleComments: () => void;
}) {
  const [comments, setComments] = useState(dummyComments); // Use dummy comments data
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>("");
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const togglePopup = (name: string) => {
    setUserName(name);
    setIsPopupVisible(true);
  };

  const handleApply = () => {
    // Simulate username update
    toast({ description: "Changes applied successfully.", variant: "success" });
    setIsPopupVisible(false);
  };

  useEffect(() => {
    if (editCommentId && inputRef.current) inputRef.current.focus();
  }, [editCommentId]);

  const handleSaveEdit = () => {
    if (!editCommentId || !editCommentText.trim()) return;

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === editCommentId
          ? {
              ...comment,
              text: editCommentText,
              updatedAt: new Date().toISOString(),
            }
          : comment
      )
    );
    toast({ description: "Comment edited successfully.", variant: "success" });
    setEditCommentId(null);
    setEditCommentText("");
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const newComment = {
      id: comments.length + 1,
      short: { id: parseInt(shortId), title: "Short Title" },
      user: { id: 1, name: "New User", avatar: { id: 1, original: "" } },
      text: newCommentText,
      createdAt: new Date().toISOString(),
      updatedAt: "",
      likeCount: 0,
      isLiked: false,
      isDisliked: false,
      unlikeCount: 0,
    };

    setComments((prevComments) => [newComment, ...prevComments]);
    toast({ description: "Comment added successfully.", variant: "success" });
    setNewCommentText("");
  };

  const handleDeleteComment = (commentId: number) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
    toast({ description: "Comment deleted successfully.", variant: "success" });
  };

  const handleLikeDislike = (commentId: number, isLiked: boolean) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !isLiked,
              likeCount: isLiked
                ? comment.likeCount - 1
                : comment.likeCount + 1,
            }
          : comment
      )
    );
  };

  return (
    <div className="flex flex-col h-full max-h-screen w-full max-w-xl mx-auto rounded-lg">
      {/* Header */}
      <div className="pb-2 mb-4 flex justify-between items-center sticky top-0 bg-white z-10 p-4">
        <h3 className="font-24px">
          {numberToSI(comments.length)}{" "}
          {comments.length === 1 ? "Comment" : "Comments"}
        </h3>
        <button onClick={toggleComments} className="text-black p-2 rounded-md">
          <X />
        </button>
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-grow max-h-full">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`flex flex-col space-y-1 px-4 py-2 ${
              activeCommentId === comment.id ? "bg-[#F0F7FE]" : ""
            }`}
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    comment.user.avatar.original || "/assets/default-avatar.png"
                  }
                  alt={`${comment.user.name}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex gap-2">
                    <div className="font-18px text-[#000F3C] font-bold">
                      {comment.user.name}
                    </div>
                    <DaysSinceCreated
                      createdAt={comment.createdAt}
                      updatedAt={comment.updatedAt}
                    />
                  </div>
                  <div className="text-[#000E3C] font-16px font-medium">
                    {comment.text}
                  </div>
                </div>
              </div>
              <Heart
                size={15}
                fill={comment.isLiked ? "#FF003C" : "none"}
                color={comment.isLiked ? "#FF003C" : "black"}
                onClick={() => handleLikeDislike(comment.id, comment.isLiked)}
              />
            </div>
            <CommentActionsDropdown
              onEdit={() => {
                setEditCommentId(comment.id);
                setEditCommentText(comment.text);
              }}
              onDelete={() => handleDeleteComment(comment.id)}
              id={comment.id}
            />
          </div>
        ))}
      </ScrollArea>

      {/* New Comment Input */}
      <div className="mt-4 flex items-center gap-3 p-4 bg-white sticky bottom-0 z-10">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a comment..."
          className="flex-grow border p-2 rounded-lg"
          value={editCommentId ? editCommentText : newCommentText}
          onChange={(e) =>
            editCommentId
              ? setEditCommentText(e.target.value)
              : setNewCommentText(e.target.value)
          }
        />
        <button onClick={editCommentId ? handleSaveEdit : handleAddComment}>
          Submit
        </button>
      </div>
    </div>
  );
}
