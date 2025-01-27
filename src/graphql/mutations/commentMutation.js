import { gql } from "@apollo/client";

export const DELETE_COMMENT = gql`
  mutation RemoveComment($commentId: ID!) {
    removeComment(commentId: $commentId) {
      _id
      batch
    }
  }
`;

export const EDIT_COMMENT = gql`
  mutation UpdateComment($commentId: ID!, $text: String!) {
    updateComment(commentId: $commentId, text: $text) {
      _id
      text
      updatedAt
      likeCount
      published
      batch
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($shortId: ID!, $text: String!) {
    addComment(shortId: $shortId, text: $text) {
      _id
      text
      batch
      user {
        _id
      }
    }
  }
`;

export const COMMENT_LIKE_DISLIKE = gql`
  mutation AddOrUpdateCommentReaction(
    $commentId: ID!
    $shortId: ID!
    $type: Reaction
  ) {
    addOrUpdateCommentReaction(
      commentId: $commentId
      shortId: $shortId
      type: $type
    ) {
      _id
      comment {
        isDisliked
        isLiked
        likeCount
        short {
          _id
        }
        unlikeCount
        text
      }
      liked
      type
    }
  }
`;

export const COMMENT_USER_NAME_EDIT = gql`
  mutation UpdateUser($name: String) {
    updateUser(name: $name) {
      _id
      username
      name
    }
  }
`;
