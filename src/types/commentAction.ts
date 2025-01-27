export type CommentAction = {
    deleteComment: {
      id: number;
      batch: string;
    };
    editComment: {
      id: number;
      text: string;
      updatedAt: string; // ISO date string
      likeCount: number;
      published: boolean;
      batch: string;
    };
    addComment: {
      id: number;
      text: string;
      batch: string;
      user: {
        id: number;
      };
    };
    commentLikeDislike: {
      id: number;
      comment: {
        isDisliked: boolean;
        isLiked: boolean;
        likeCount: number;
        short: {
          id: number;
        };
        unlikeCount: number;
        text: string;
      };
      liked: boolean;
      type: "LIKE" | "DISLIKE"; // Reaction type
    };
    commentUserNameEdit: {
      id: number;
      username: string;
      name: string;
    };
  };
  