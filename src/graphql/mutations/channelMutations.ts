import { gql } from "@apollo/client";

export const FOLLOW_CHANNEL = gql`
  mutation FollowChannel($channel: ID!) {
    followChannel(channel: $channel) {
      channel {
        isFollowed
      }
    }
  }
`;

export const UNFOLLOW_CHANNEL = gql`
  mutation UnfollowChannel($channel: ID!) {
    unfollowChannel(channel: $channel) {
      channel {
        _id
        isFollowed
      }
    }
  }
`;

export const GET_CHANNEL_FOLLOW_STATE = gql`
  query Channels {
    channels {
      _id
      name
      totalUser
      totalFollower
      isFollowed
    }
  }
`;
