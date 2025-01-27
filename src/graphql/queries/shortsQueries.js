import { gql } from "@apollo/client";

export const GET_SHORTS = gql`
  query Shorts($limit: Int, $offset: Int, $shortId: ID) {
    shorts(limit: $limit, offset: $offset, shortId: $shortId) {
      _id
      title
      thumbnail {
        xsmall
        original
      }
      caption
      isUsedInPollTarget

      video {
        _id
        videoUrl
        original
        converStatus
      }
      likeCount
      viewCount
      commentCount
      shareCount
      reportCount
      watchTime
      channel {
        _id
        name
        avatar {
          original
          _id
        }
      }
      liked
      nocodePlayer {
        playIcon {
          original
        }
        pauseIcon {
          original
        }
        likeIcon {
          original
        }
        commentIcon {
          original
        }
        shareIcon {
          original
        }
        muteIcon {
          original
        }
        unmuteIcon {
          original
        }
        exploreIcon {
          original
        }
        pollIcon {
          original
        }
        searchIcon {
          original
        }
        backIcon {
          original
        }
        closeIcon {
          original
        }
        showMoreIcon {
          original
        }
        showLessIcon {
          original
        }
        dontRecommendIcon {
          original
        }
        reportShortIcon {
          original
        }
        somethingWentWrongIcon {
          original
        }
        hideAdIcon {
          original
        }
        reportAdIcon {
          original
        }
        ctaColor
        ctaSize
        ctaStyle
        controlEngagement {
          comment
          share
          likeCount
          follow
        }
        tapInteraction {
          tapToMute
          tapToPause
        }
        endOfVideoInteraction {
          autoScrollToNextVideo
          loopToCurrentVideo
        }
        progressBarInteraction {
          dragProgressBar
          staticProgressBar
        }
        webScrollBehavior {
          horizontal
          vertical
        }
        webScrollButtons {
          hideButtons
          showButtons
        }
      }
    }
  }
`;

export const GET_SHORT = gql`
  query Short($shortId: ID) {
    short(id: $shortId) {
      _id
      title
      thumbnail {
        xsmall
        original
      }
      caption
      isUsedInPollTarget
      video {
        _id
        videoUrl
        original
        converStatus
      }
      likeCount
      viewCount
      commentCount
      shareCount
      reportCount
      watchTime
      channel {
        _id
        name
        avatar {
          original
          _id
        }
      }
      liked
      nocodePlayer {
        playIcon {
          original
        }
        pauseIcon {
          original
        }
        likeIcon {
          original
        }
        commentIcon {
          original
        }
        shareIcon {
          original
        }
        muteIcon {
          original
        }
        unmuteIcon {
          original
        }
        exploreIcon {
          original
        }
        pollIcon {
          original
        }
        searchIcon {
          original
        }
        backIcon {
          original
        }
        closeIcon {
          original
        }
        showMoreIcon {
          original
        }
        showLessIcon {
          original
        }
        dontRecommendIcon {
          original
        }
        reportShortIcon {
          original
        }
        somethingWentWrongIcon {
          original
        }
        hideAdIcon {
          original
        }
        reportAdIcon {
          original
        }
        ctaColor
        ctaSize
        ctaStyle
        controlEngagement {
          comment
          share
          likeCount
          follow
        }
        tapInteraction {
          tapToMute
          tapToPause
        }
        endOfVideoInteraction {
          autoScrollToNextVideo
          loopToCurrentVideo
        }
        progressBarInteraction {
          dragProgressBar
          staticProgressBar
        }
        webScrollBehavior {
          horizontal
          vertical
        }
        webScrollButtons {
          hideButtons
          showButtons
        }
      }
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

export const GET_SHORTS_IDS = gql`
  query Shorts($limit: Int) {
    shorts(limit: $limit) {
      _id
    }
  }
`;
