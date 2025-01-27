import { CommentAction } from "@/types/commentAction";

export const commentAction = {
    deleteComment: {
      id: 1, // `commentId` in the mutation
      batch: "batch_12345",
    },
    editComment: {
      id: 1, // `commentId` in the mutation
      text: "This is the updated comment text.",
      updatedAt: "2024-01-12T14:00:00Z",
      likeCount: 15,
      published: true,
      batch: "batch_54321",
    },
    addComment: {
      id: 2, // `commentId` generated after adding
      text: "This is a new comment.",
      batch: "batch_67890",
      user: {
        id: 501,
      },
    },
    commentLikeDislike: {
      id: 3, // Reaction ID
      comment: {
        isDisliked: false,
        isLiked: true,
        likeCount: 30,
        short: {
          id: 101, // Short ID associated with the comment
        },
        unlikeCount: 2,
        text: "This is an insightful comment.",
      },
      liked: true,
      type: "LIKE", // Reaction type: LIKE or DISLIKE
    },
    commentUserNameEdit: {
      id: 501, // User ID
      username: "new_username",
      name: "New Name",
    },
  };
  