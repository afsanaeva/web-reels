export type Comment = {
    id: number;
    short: {
      id: number;
      title: string;
      commentCount: number;
      deleted: boolean;
      caption: string;
      allowComment: boolean;
      status: string;
      reportCount: number;
    };
    user: {
      id: number;
      username: string;
      name: string;
      avatar: {
        id: number;
        original: string;
      };
    };
    text: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    likeCount: number;
    isLiked: boolean;
    isDisliked: boolean;
    unlikeCount: number;
  };
  