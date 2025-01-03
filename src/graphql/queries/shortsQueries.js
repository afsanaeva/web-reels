import { gql } from "@apollo/client";

export const GET_SHORTS = gql`
  query Shorts($limit: Int, $text: String, $offset: Int) {
    shorts(limit: $limit, text: $text, offset: $offset) {
      _id
      title
      thumbnail {
        xsmall
        original
      }
      caption
      isUsedInPollTarget
    }
  }
`;

export const GET_TRENDING_SHORTS = gql`
  query AutoFillEntryPointShorts {
    autoFillEntryPointShorts {
      _id
      title
      thumbnail {
        xsmall
        original
      }
      caption
    }
  }
`;
