import { gql } from "@apollo/client";

export const SHORT_LIKE_DISLIKE = gql`
  mutation AddOrRemoveLikeOnShort($shortId: ID!) {
    addOrRemoveLikeOnShort(shortId: $shortId) {
      _id
      liked
      createdAt
    }
  }
`;
