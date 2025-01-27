import { gql } from "@apollo/client";

export const GET_COMMENTS = gql`
  query Comments($shortId: ID!, $limit: Int, $offset: Int) {
    comments(shortId: $shortId, limit: $limit, offset: $offset) {
      _id
      short {
        _id
        title
        commentCount
        deleted
        caption
        allowComment
        status
        reportCount
      }
      user {
        _id
        username
        name
        avatar {
          _id
          original
        }
      }
      text
      createdAt
      updatedAt
      likeCount
      isLiked
      isDisliked
      unlikeCount
    }
  }
`;
