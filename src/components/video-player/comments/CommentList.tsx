import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_COMMENTS } from "@/graphql/queries/commentListQueries";
import { ScrollArea } from "@/components/ui/scrollArea";
import {
  EDIT_COMMENT,
  ADD_COMMENT,
  DELETE_COMMENT,
  COMMENT_LIKE_DISLIKE,
  COMMENT_USER_NAME_EDIT,
} from "@/graphql/mutations/commentMutation";
import { Heart, X } from "lucide-react";
import { numberToSI } from "@/utils/commonFunction";
import CommentActionsDropdown from "./CommentAction";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export const DaysSinceCreated = ({
  createdAt,
  updatedAt,
}: {
  createdAt: number;
  updatedAt: number;
}) => {
  const getElapsedTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - date.getTime();

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(differenceInTime / (1000 * 3600 * 24));
    const hours = Math.floor(
      (differenceInTime % (1000 * 3600 * 24)) / (1000 * 3600)
    );
    const minutes = Math.floor(
      (differenceInTime % (1000 * 3600)) / (1000 * 60)
    );
    const seconds = Math.floor((differenceInTime % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const timestampToDisplay = updatedAt || createdAt; // Use updatedAt if it exists
  const { days, hours, minutes, seconds } = getElapsedTime(timestampToDisplay);

  let timeString = "";

  if (days > 0) {
    timeString = `${days}d`; // Only display days if they exist
  } else if (hours > 0) {
    timeString = `${hours}h`; // Only display hours if days are 0
  } else if (minutes > 0) {
    timeString = `${minutes}m`; // Only display minutes if hours and days are 0
  } else {
    timeString = `${seconds}s`; // Default to seconds
  }

  if (!timeString) {
    timeString = "just now";
  }

  timeString = timeString.trim();

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
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS, {
    variables: { shortId, offset: 0 },
  });

  const [addComment] = useMutation(ADD_COMMENT);
  const [editComment] = useMutation(EDIT_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);
  const [toggleLikeDislike] = useMutation(COMMENT_LIKE_DISLIKE);

  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>(""); // Prefilled text for editing
  const [newCommentText, setNewCommentText] = useState<string>(""); // Input text for new comment
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [updateUserName] = useMutation(COMMENT_USER_NAME_EDIT);

  const togglePopup = (name: string) => {
    setUserName(name); // Pre-fill the username state
    setIsPopupVisible(true); // Show the popup
  };

  const handleApply = async () => {
    try {
      // Trigger the mutation with the updated username
      await updateUserName({
        variables: { name: userName },
      });

      // Show success toast
      toast({
        description: "Changes applied successfully.",
        variant: "success",
      });

      setIsPopupVisible(false); // Close the popup
    } catch (error) {
      console.error("Failed to update username", error);

      // Show error toast
      toast({
        description: "Unable to change.",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    // Autofocus when edit mode is active
    if (editCommentId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editCommentId]);

  const handleSaveEdit = async () => {
    if (!editCommentId || !editCommentText.trim()) return;

    try {
      await editComment({
        variables: { commentId: editCommentId, text: editCommentText },
      });

      // Show success toast
      toast({
        description: "Comment edited successfully.",
        variant: "success",
      });

      setEditCommentId(null); // Clear the edit comment ID
      setEditCommentText(""); // Clear the edit comment text
      refetch(); // Refresh the comments list
    } catch (error) {
      console.error("Failed to edit comment", error);

      // Show error toast
      toast({
        description: "Failed to Edit Comment",
        variant: "error",
      });
    }
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;

    try {
      await addComment({
        variables: { shortId, text: newCommentText },
        update: (cache, { data: { addComment } }) => {
          // Ensure proper typing
          type CommentsData = { comments: { user: string; text: string }[] };
          const existingData = cache.readQuery<CommentsData>({
            query: GET_COMMENTS,
            variables: { shortId, offset: 0 },
          });

          // Write updated data to cache
          cache.writeQuery({
            query: GET_COMMENTS,
            variables: { shortId, offset: 0 },
            data: {
              comments: [addComment, ...(existingData?.comments ?? [])],
            },
          });
        },
      });

      // Show success toast
      toast({
        description: "Comment added successfully.",
        variant: "success",
      });

      setNewCommentText(""); // Clear input field
    } catch (error) {
      console.error("Failed to add comment", error);

      // Show error toast
      toast({
        description: "Failed to Add Comment.",
        variant: "error",
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment({
        variables: { commentId },
        update: (cache) => {
          // Define the type for existing data
          type CommentsData = {
            comments: { _id: string; user: string; text: string }[];
          };

          // Read the current cache
          const existingData = cache.readQuery<CommentsData>({
            query: GET_COMMENTS,
            variables: { shortId, offset: 0 },
          });

          if (existingData?.comments) {
            // Filter out the deleted comment and update the cache
            const updatedComments = existingData.comments.filter(
              (comment) => comment._id !== commentId
            );

            cache.writeQuery({
              query: GET_COMMENTS,
              variables: { shortId, offset: 0 },
              data: {
                comments: updatedComments,
              },
            });
          }
        },
      });

      // Show success toast
      toast({
        description: "Comment Deleted.",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to delete comment", error);

      // Show error toast
      toast({
        description: "Failed to Delete Comment.",
        variant: "error",
      });
    }
  };

  const handleLikeDislike = async (comment: any) => {
    try {
      const type = comment.isLiked ? "unlike" : "like"; // Determine type
      await toggleLikeDislike({
        variables: { commentId: comment._id, shortId, type },
      });

      // Refetch to get updated comments
      refetch();
    } catch (error) {
      console.error("Failed to toggle like/dislike", error);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    if (editCommentId) {
      // Update the text for editing
      setEditCommentText((prev) => prev + emoji);
    } else {
      // Update the text for new comments
      setNewCommentText((prev) => prev + emoji);
    }
  
    // Refocus on the input field
    inputRef.current?.focus();
  };
  
  if (loading)
    return (
      <div className="flex justify-center items-center text-center ml-10">
        Loading comments...
      </div>
    );
  if (error) return <p>Error loading comments: {error.message}</p>;

  const comments = data?.comments || [];

  return (
    <div className="flex flex-col h-full max-h-screen w-full max-w-xl mx-auto rounded-lg">
      {/* Header */}
      <div className="pb-2 mb-4 flex justify-between items-center sticky top-0 bg-white z-10 p-4">
        <div></div>
        <h3 className="font-24px">
          {numberToSI(comments.length || 0)}
          {comments.length < 2 ? " Comment" : " Comments"}
        </h3>
        <button onClick={toggleComments} className="text-black p-2 rounded-md">
          <X />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-grow  max-h-full">
        <ScrollArea className="h-[55vh] 2xl:h-[66vh] 3xl:h-[73vh] cursor-pointer">
          {comments.map((comment: any) => (
            <div
              key={comment._id}
              className={`flex flex-col space-y-1 px-4 py-2 ${
                activeCommentId === comment._id ? "bg-[#F0F7FE]" : ""
              }`}
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 group">
                    {/* User Avatar */}
                    <img
                      src={comment.user?.avatar || "/assets/emotions/user.png"}
                      alt={`${comment.user?.name || "Anonymous"}'s avatar`}
                      className="w-10 h-10 rounded-full bg-blue-500"
                      width={40}
                      height={40}
                    />

                    {/* Pencil Icon Overlay , Edit name*/}
                    <div
                      className="absolute bottom-[-8px] right-[-5px] flex justify-center items-center bg-white rounded-md w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
                      onClick={() =>
                        togglePopup(comment.user?.name || "Anonymous")
                      }
                    >
                      <img
                        src="/icons/edit.svg"
                        alt="Edit Icon"
                        className="w-4 h-4"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <div className="font-18px text-[#000F3C] font-bold">
                        {comment.user?.name || "Anonymous"}
                      </div>
                      •
                      <div className="font-14px mt-[2px] text-[#000F3C]">
                        <DaysSinceCreated
                          createdAt={comment.createdAt}
                          updatedAt={comment.updatedAt}
                        />
                      </div>
                    </div>
                    <div className="text-[#000E3C] font-16px font-medium">
                      {comment.text}
                    </div>
                  </div>
                </div>
                <div
                  className="mt-1 cursor-pointer mr-2"
                  onClick={() => handleLikeDislike(comment)}
                >
                  <Heart
                    size={15}
                    fill={comment.isLiked ? "#FF003C" : "none"}
                    color={comment.isLiked ? "#FF003C" : "black"}
                  />
                </div>
              </div>
              <div className="flex">
                <div className="font-14px text-[#000F3C] mt-[10px] ml-[50px] font-medium">
                  {comment.likeCount || 0}{" "}
                  {comment.likeCount < 2 ? "like" : "likes"}
                </div>
                <div className="ml-2 mt-1">
                  <CommentActionsDropdown
                    onToggle={() =>
                      setActiveCommentId((prev) =>
                        prev === comment._id ? null : comment._id
                      )
                    }
                    onEdit={() => {
                      setEditCommentId(comment._id);
                      setEditCommentText(comment.text);
                    }}
                    onDelete={() => handleDeleteComment(comment._id)} // Delete logic
                    id={comment._id}
                  />
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Bottom Section */}
      <div className="mt-4 flex flex-col sticky bottom-0 bg-white z-10 p-4">
      <div className="flex justify-between mb-4">
        {["👍", "😂", "❤️","😍","😮", "🥰","😢", "😠"].map((emoji) => (
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
          <img
            src="/assets/emotions/image.png"
            alt="Anonymous avatar"
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
          />
          <div
            className="flex justify-between w-full p-2 border rounded-full bg-[#F6FAFE] font-18px
  placeholder:text-[#A9AEC0] border-none focus-within:border-[#005AFF] focus-within:outline focus-within:outline-2 focus-within:outline-[#005AFF]"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Add a comment..."
              className="bg-[#F6FAFE] focus:outline-none w-full rounded-full px-2"
              value={editCommentId ? editCommentText : newCommentText}
              onChange={(e) => {
                if (editCommentId) {
                  setEditCommentText(e.target.value);
                } else {
                  setNewCommentText(e.target.value);
                }
              }}
            />
            <button
              onClick={editCommentId ? handleSaveEdit : handleAddComment}
              className="cursor-pointer"
            >
              <img
                src="/assets/send.png"
                alt="Send Icon"
                width={30}
                height={30}
                className="cursor-pointer"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Name Popup */}
      {isPopupVisible && (
        <div>
          {/* Background Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40"></div>
          <div
            className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] px-4 py-2 bg-white rounded-lg shadow-lg w-[300px] z-50"
            style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <h3 className="text-[#000E3C] font-18px font-medium mb-2">
              Edit name
            </h3>
            <div className="flex gap-3">
              <img
                src="/assets/emotions/image.png"
                alt="Anonymous avatar"
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
              <input
                type="text"
                value={userName} // Pre-filled username
                onChange={(e) => setUserName(e.target.value)}
                className="bg-[#F6FAFE] focus:outline-none w-full rounded-full px-2 font-18px font-medium"
              />
            </div>
            <div className="flex justify-end gap-1 mt-2">
              <Button
                variant="ghost"
                onClick={() => setIsPopupVisible(false)}
                className="rounded-full text-[#000E3C] font-18px"
              >
                Cancel
              </Button>
              <Button
                variant="ghost"
                onClick={handleApply}
                className="rounded-full font-18px text-[#005AFF] focus:text-gray-500"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
