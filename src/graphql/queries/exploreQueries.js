import { gql } from "@apollo/client";

export const GET_EXPLORE_SHORTS = gql`
  query Shorts(
    $text: String
    $channelId: ID
    $shortId: ID
    $purpose: ShortPurposeType
    $limit: Int
    $offset: Int
  ) {
    shorts(
      text: $text
      channelId: $channelId
      shortId: $shortId
      purpose: $purpose
      limit: $limit
      offset: $offset
    ) {
      _id
      thumbnail {
        original
        xsmall
        small
        medium
        large
        xlarge
      }
      video {
        videoUrl
        previewUrl
      }
      channel {
        avatar {
          original
          xsmall
          small
          medium
          large
          xlarge
        }
        caption
        isFollowed
        name
      }
      likeCount
      liked
      viewCount
      commentCount
      shareCount
      allowAds
      title
      isSubscribe
      allowSharing
      allowComment
      ctaButtons {
        event
        conditions {
          isTrue
          buttonLabel
          buttonLink
        }
      }
      caption
      channel {
        _id
        name
        avatar {
          original
        }
      }
    }
  }
`;

export const SEARCH_EXPLORE_SHORTS = gql`
  query Shorts($offset: Int, $limit: Int, $text: String) {
    shorts(offset: $offset, limit: $limit, text: $text) {
      _id
      title
      caption
    }
  }
`;

export const EXPLORE_CHANNELS_LIST_WITH_DETAILS = gql`
  query ShortsForChannel(
    $type: ShortChannelType
    $limit: Int
    $offset: Int
    $channelId: ID!
  ) {
    shortsForChannel(
      type: $type
      limit: $limit
      offset: $offset
      channelId: $channelId
    ) {
      _id
      caption
      title
      video {
        _id
        original
        videoUrl
      }
      viewCount
      watchTime
      isSubscribe
      channel {
        _id
        avatar {
          original
          _id
        }
        caption
        totalFollower
        totalView
        totalUser
        totalShort
        description
        name
      }
      thumbnail {
        _id
        original
      }
    }
  }
`;

export const EXPLORE_CHANNEL_LIST = gql`
  query Channels(
    $limit: Int
    $includeDisabled: Boolean
    $offset: Int
    $search: String
  ) {
    channels(
      limit: $limit
      includeDisabled: $includeDisabled
      offset: $offset
      search: $search
    ) {
      _id
      name
      description
      avatar {
        original
      }
      title
      categories {
        _id
        name
      }
      caption
      tags

      totalUser

      isCtaButtons
      totalFollower
      totalShort
      totalView
      isFollowed
      disabled
      autoComplete
      partnerSubscriptionId

      isUsedInAds
      isUsedInEntryPoint
    }
  }
`;

export const EXPLORE_CHANNEL_DETAILS = gql`
  query Channel($channelId: ID!) {
    channel(id: $channelId) {
      _id
      avatar {
        _id
        original
      }
      caption
      title
      totalFollower
      totalShort
      totalUser
      totalView
      name
      isFollowed
      description
    }
  }
`;
