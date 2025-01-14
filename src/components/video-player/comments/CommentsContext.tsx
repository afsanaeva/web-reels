// import React, { createContext, useContext, useState, ReactNode } from "react";
// import { useQuery } from "@apollo/client";
// import { GET_COMMENTS } from "@/graphql/queries/commentListQueries";

// interface Comment {
//   id: string;
//   user: string;
//   time: string;
//   text: string;
//   likes: number;
// }

// interface CommentContextType {
//   comments: Comment[];
//   loading: boolean;
//   error: any;
//   addComment: (newComment: Comment) => void;
// }

// const CommentContext = createContext<CommentContextType | undefined>(
//   undefined
// );

// export const CommentProvider = ({ children }: { children: ReactNode }) => {
//   const { data, loading, error } = useQuery(GET_COMMENTS);
//   const [comments, setComments] = useState<Comment[]>(data?.comments || []);

//   // Add a new comment
//   const addComment = (newComment: Comment) => {
//     setComments((prevComments) => [newComment, ...prevComments]);
//   };

//   // Update comments when query data changes
//   React.useEffect(() => {
//     if (data?.comments) {
//       setComments(data.comments);
//     }
//   }, [data]);

//   return (
//     <CommentContext.Provider value={{ comments, loading, error, addComment }}>
//       {children}
//     </CommentContext.Provider>
//   );
// };

// // Custom hook to use the CommentContext
// export const useCommentContext = () => {
//   const context = useContext(CommentContext);
//   if (!context) {
//     throw new Error("useCommentContext must be used within a CommentProvider");
//   }
//   return context;
// };
