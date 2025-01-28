import React, { createContext, useContext, useState, ReactNode } from "react";
import { Comment } from "@/types/comment"; // Assuming this matches your structure
import { comments as dummyComments } from "@/data/comment";

interface CommentContextType {
  comments: Comment[];
  loading: boolean;
  error: any;
  addComment: (newComment: Comment) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(
  undefined
);

export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  // Add a new comment
  const addComment = (newComment: Comment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
  };

  // Simulating loading/error for demonstration
  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Assume dummy data already loaded, no actual fetching
      } catch (err) {
        setError("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  return (
    <CommentContext.Provider value={{ comments, loading, error, addComment }}>
      {children}
    </CommentContext.Provider>
  );
};

// Custom hook to use the CommentContext
export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useCommentContext must be used within a CommentProvider");
  }
  return context;
};
