"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";
import { CarouselApi } from "@/components/ui/carousel";
import { GET_SHORT, GET_SHORTS } from "@/graphql/queries/shortsQueries";
import { ApolloError, useLazyQuery, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";

interface VideoPlayerContextType {
  api: CarouselApi | undefined;
  setApi: (api: CarouselApi) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  progress: number;
  setProgress: (progress: number) => void;
  showPlayPause: boolean;
  setShowPlayPause: (show: boolean) => void;
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  abortControllers: React.MutableRefObject<(AbortController | null)[]>;
  loadingStates: boolean[];
  setLoadingStates: (
    states: boolean[] | ((prev: boolean[]) => boolean[])
  ) => void;
  togglePlay: (e: React.MouseEvent<any>) => void;
  navigateVideo: (direction: "next" | "prev") => void;
  handleVideoLoad: (video: HTMLVideoElement, index: number) => void;
  shorts: any[];
  loading: boolean;
  error: ApolloError | undefined;
  fetchMore: (variables: any) => void;
  showPoll: boolean;
  setShowPoll: (show: boolean) => void;
  isVideoMounted: boolean;
  setIsVideoMounted: (mounted: boolean) => void;
  toggleMute: () => void;
  isMuted: boolean;
  showMuteUnmute: boolean;
  autoplayFailed: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  isHovering: boolean;
  setIsHovering: (hovering: boolean) => void;
  isFullScreen: boolean;
  setIsFullScreen: (fullScreen: boolean) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(
  undefined
);
const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export function VideoPlayerProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const { data, loading, error, fetchMore } = useQuery(GET_SHORTS, {
    variables: {
      limit: 5,
      offset: 0,
      shortId: isValidObjectId(params.id as string) ? params.id : null,
    },
    fetchPolicy: "network-only",
  });

  const { data: shortData } = useQuery(GET_SHORT, {
    variables: {
      shortId: isValidObjectId(params.id as string) ? params.id : null,
    },
  });

  const filterShorts = (shorts: any[]) => {
    return shorts.filter((s: any) => {
      if (s?.video?.converStatus === "PROGRESSING") {
        return false;
      }
      return s._id !== shortData?.short?._id;
    });
  };
  const combinedShorts =
    shortData?.short && shortData?.short.video.converStatus !== "PROGRESSING"
      ? [shortData?.short, ...filterShorts(data?.shorts || [])]
      : filterShorts(data?.shorts || []);

  const [api, setApi] = useState<CarouselApi>();
  const [isVideoMounted, setIsVideoMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayPause, setShowPlayPause] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const abortControllers = useRef<(AbortController | null)[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    new Array(data?.shorts?.length || 0).fill(false)
  );
  const [showPoll, setShowPoll] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showMuteUnmute, setShowMuteUnmute] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleMute = () => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      video.muted = !video.muted;
      setIsMuted(!isMuted);
      setShowMuteUnmute(true);
      setTimeout(() => setShowMuteUnmute(false), 1000);
    }
  };

  const togglePlay = (e: React.MouseEvent<any>) => {
    e.stopPropagation();
    const video = videoRefs.current[currentIndex];
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setShowPlayPause(true);
      setTimeout(() => setShowPlayPause(false), 1000);
    }
  };

  const navigateVideo = (direction: "next" | "prev") => {
    if (!api) return;
    if (direction === "next") {
      api.scrollNext();
    } else {
      api.scrollPrev();
    }
  };

  // Modify handleVideoLoad to include preloading
  const handleVideoLoad = async (video: HTMLVideoElement, index: number) => {
    try {
      const controller = new AbortController();
      abortControllers.current[index] = controller;

      setLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[index] = true;
        return newStates;
      });

      // Add event listeners for play/pause states
      video.addEventListener("play", () => {
        setIsPlaying(true);
        setAutoplayFailed(false);
      });

      video.addEventListener("pause", () => {
        setIsPlaying(false);
      });
      await video.play();
      setAutoplayFailed(false);

      setLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[index] = false;
        return newStates;
      });
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        console.error("Video playback failed:", error);
        setAutoplayFailed(true);
        setIsPlaying(false);
        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });
      }
    }
  };

  return (
    <VideoPlayerContext.Provider
      value={{
        api,
        setApi,
        currentIndex,
        setCurrentIndex,
        isPlaying,
        setIsPlaying,
        progress,
        setProgress,
        showPlayPause,
        setShowPlayPause,
        videoRefs,
        abortControllers,
        loadingStates,
        setLoadingStates,
        togglePlay,
        navigateVideo,
        handleVideoLoad,
        shorts: combinedShorts,
        loading,
        error,
        fetchMore,
        showPoll,
        setShowPoll,
        isVideoMounted,
        setIsVideoMounted,
        toggleMute,
        isMuted,
        showMuteUnmute,
        autoplayFailed,
        isDragging,
        setIsDragging,
        isHovering,
        setIsHovering,
        isFullScreen,
        setIsFullScreen,
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);
  if (context === undefined) {
    throw new Error("useVideoPlayer must be used within a VideoPlayerProvider");
  }
  return context;
}
