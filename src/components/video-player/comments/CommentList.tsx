import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scrollArea";
import { Heart, X } from "lucide-react";
import { numberToSI } from "@/utils/commonFunction";
import CommentActionsDropdown from "./CommentAction";
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

    const years = currentDate.getFullYear() - date.getFullYear();
    let months = currentDate.getMonth() - date.getMonth();
    if (months < 0) {
      months += 12;
    }
    const days = Math.floor(differenceInTime / (1000 * 3600 * 24)) % 30;
    const hours = Math.floor((differenceInTime % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((differenceInTime % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((differenceInTime % (1000 * 60)) / 1000);

    return { years, months, days, hours, minutes, seconds };
  };

  const timestampToDisplay = updatedAt || createdAt;
  const { years, months, days, hours, minutes, seconds } = getElapsedTime(timestampToDisplay);

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
  const [comments, setComments] = useState(dummyComments); // Use dummy data
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>("");
  const [newCommentText, setNewCommentText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editCommentId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editCommentId]);

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const newComment = {
      id: comments.length + 1,
      short: {
        id: parseInt(shortId),
        title: "Short Title",
        commentCount: comments.length + 1,
        deleted: false,
        caption: "",
        allowComment: true,
        status: "active",
        reportCount: 0,
      },
      user: {
        id: 1,
        username: "new_user",
        name: "New User",
        avatar: {
          id: 1,
          original: "/assets/default-avatar.png",
        },
      },
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

  const handleSaveEdit = () => {
    if (!editCommentId || !editCommentText.trim()) return;

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === editCommentId
          ? { ...comment, text: editCommentText, updatedAt: new Date().toISOString() }
          : comment
      )
    );
    toast({ description: "Comment edited successfully.", variant: "success" });
    setEditCommentId(null);
    setEditCommentText("");
  };

  const handleDeleteComment = (commentId: number) => {
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    toast({ description: "Comment deleted successfully.", variant: "success" });
  };

  const handleLikeDislike = (commentId: number, isLiked: boolean) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, isLiked: !isLiked, likeCount: isLiked ? comment.likeCount - 1 : comment.likeCount + 1 }
          : comment
      )
    );
  };

  const handleEmojiClick = (emoji: string) => {
    if (editCommentId) {
      setEditCommentText((prev) => prev + emoji);
    } else {
      setNewCommentText((prev) => prev + emoji);
    }
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full max-h-screen w-full max-w-xl mx-auto rounded-lg">
      <div className="pb-2 mb-4 flex justify-between items-center sticky top-0 bg-white z-10 p-4">
        <h3 className="font-24px">
          {numberToSI(comments.length)} {comments.length === 1 ? "Comment" : "Comments"}
        </h3>
        <button onClick={toggleComments} className="text-black p-2 rounded-md">
          <X />
        </button>
      </div>

      <ScrollArea className="flex-grow max-h-full">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex flex-col space-y-1 px-4 py-2"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={comment.user.avatar.original || "/assets/default-avatar.png"}
                  alt={`${comment.user.name}'s avatar`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex gap-2">
                    <div className="font-18px text-[#000F3C] font-bold">{comment.user.name}</div>
                    <DaysSinceCreated createdAt={comment.createdAt} updatedAt={comment.updatedAt} />
                  </div>
                  <div className="text-[#000E3C] font-16px font-medium">{comment.text}</div>
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
              } }
              onDelete={() => handleDeleteComment(comment.id)} onToggle={function (): void {
                throw new Error("Function not implemented.");
              } } id={""}            />
          </div>
        ))}
      </ScrollArea>

      <div className="mt-4 flex flex-col sticky bottom-0 bg-white z-10 p-4">
        <div className="flex justify-between mb-4">
          {["👍", "😂", "❤️", "😍", "😮", "🥰", "😢", "😠"].map((emoji) => (
            <span
              key={emoji}
              className="text-2xl cursor-pointer transition-transform transform hover:scale-125"
              onClick={() => handleEmojiClick(emoji)}
            >
              {emoji}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <img src="/assets/emotions/image.png" alt="User avatar" className="w-10 h-10 rounded-full" />
          <div className="flex w-full p-2 border rounded-full bg-[#F6FAFE]">
            <input
              ref={inputRef}
              type="text"
              placeholder="Add a comment..."
              className="bg-[#F6FAFE] w-full rounded-full px-2"
              value={editCommentId ? editCommentText : newCommentText}
              onChange={(e) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                editCommentId
                  ? setEditCommentText(e.target.value)
                  : setNewCommentText(e.target.value);
              }}
            />
            <button onClick={editCommentId ? handleSaveEdit : handleAddComment}>
              <img src="/assets/send.png" alt="Send" width={30} height={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
