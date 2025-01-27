"use client";

declare global {
  interface HTMLVideoElement {
    hlsInstance?: Hls;
  }
}

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { InteractionButtons } from "./interaction-buttons";
import NavigationButtons from "./NavigationButtons";
import { useVideoPlayer } from "./VideoPlayerContext";
import { useEffect, useState } from "react";
import Hls from "hls.js";
import BlurryBackground from "./BlurryBackground";
import CommentList from "./comments/CommentList";
import { Explore } from "./explore/Explore";
import { useHlsInitialization } from "./hooks/useHlsInitialization";
import VideoPlayer from "@/components/VideoPlayer";
import { VideoInfo } from "./video-info";
import Poll from "./polls/Poll";
import Loader from "./Loader";
import { cn } from "@/lib/utils";
import { ORIENTATION, VIDEO_PLAYER_MODE } from "@/constants/videoplayer.constants";
import HeaderButtons from "./HeaderButtons";
import { videos } from "@/data/videos"; // Import the dummy data
import { channels } from "@/data/channel";

export default function VideoPlayerScreen() {
  const {
    api,
    setApi,
    videoRefs,
    loadingStates,
    setLoadingStates,
    currentIndex,
    setCurrentIndex,
    setProgress,
    handleVideoLoad,
    navigateVideo,
    setIsPlaying,
    isVideoMounted,
    showPoll,
    setShowPoll,
    autoplayFailed,
    showPlayPause,
    showMuteUnmute,
    setIsVideoMounted,
    togglePlay,
    toggleMute,
    isPlaying,
    isMuted,
    isHovering,
    setIsHovering,
    setIsFullScreen,
    isFullScreen,
  } = useVideoPlayer();

  const [initializingVideos, setInitializingVideos] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Use the dummy videos data
  const shorts = videos;
  const channelsData = channels;
  
  const { initializeHls, pauseHls, resumeHls } = useHlsInitialization({
    setInitializingVideos,
    handleVideoLoad,
    setIsPlaying,
    setLoadingStates,
    loadingStates,
  });

  // handle select
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const index = api.selectedScrollSnap();
      setCurrentIndex(index);
      setProgress(0);
      setLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[index] = true;
        return newStates;
      });

      // Pause loading for the previous video
      const previousIndex = currentIndex < index ? index - 1 : index + 1;
      const previousVideo = videoRefs.current[previousIndex];
      if (previousVideo) {
        pauseHls(previousVideo, previousIndex);
      }

      // Resume/initialize current video
      const currentVideo = videoRefs.current[index];
      if (currentVideo) {
        // Check if video already has an HLS instance attached and stopped loading HLS
        if (currentVideo.hlsInstance) {
          if (currentIndex > index) resumeHls(currentVideo, index);
          else handleVideoLoad(currentVideo, index);
        } else {
          initializeHls(currentVideo, shorts[index].src, index);
        }
      }
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, shorts, initializeHls]);

  // Initialize videos
  useEffect(() => {
    if (!isVideoMounted) return;
    const currentVideo = videoRefs.current[currentIndex];
    if (shorts?.[currentIndex] && currentVideo && currentIndex === 0) {
      initializeHls(currentVideo, shorts[currentIndex].src, currentIndex);
    }
  }, [isVideoMounted]); // Added currentIndex as a dependency

  // handle keydown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp") {
      navigateVideo("prev");
    } else if (e.key === "ArrowDown") {
      navigateVideo("next");
    }
  };

  // handle wheel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!isProcessing) {
      setIsProcessing(true);

      if (e.deltaY > 0) {
        navigateVideo("next");
      } else if (e.deltaY < 0) {
        navigateVideo("prev");
      }

      setTimeout(() => {
        setIsProcessing(false);
      }, 400);
    }
  };

  // toggle comments
  const [showComments, setShowComments] = useState(false);
  const [showExplore, setShowExplore] = useState(false);

  const toggleComments = () => setShowComments(!showComments);
  const toggleExplore = () => setShowExplore(!showExplore);

  return (
    <div
      className={cn(
        "relative w-full h-screen pt-4 select-none bg-black flex items-center justify-center overflow-hidden",
        {
          "pt-0": isFullScreen,
        }
      )}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      tabIndex={0}
    >
      <BlurryBackground videoRef={videoRefs?.current?.[currentIndex]} />

      <HeaderButtons
        isFullScreen={isFullScreen}
        setIsFullScreen={setIsFullScreen}
      />

      {/* Video Player Section */}
      <div className="flex-1 relative">
        <Carousel
          className="overflow-visible"
          opts={{ align: "start", watchDrag: false }}
          orientation="vertical"
          setApi={setApi}
        >
          <CarouselContent
        className={cn(
          "overflow-visible h-[100vh] grid grid-cols-1 carousel-container",
          {
            "m-0 p-0": isFullScreen,
          }
        )}
          >
        {shorts?.map((short, index) => (
          <CarouselItem
            key={short.id}
            className={cn("h-[99vh] w-fit mx-auto", {
          "h-[100vh] pt-0": isFullScreen,
            })}
          >
            <div className="relative h-full flex items-end">
          <div
            className={cn("rounded-[32px] w-full h-full relative ", {
              "rounded-r-none": showComments && showExplore,
              "rounded-none": isFullScreen,
            })}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <VideoPlayer
              isFullScreen={isFullScreen}
              isHovering={isHovering}
              showComments={showComments}
              orientation={ORIENTATION.VERTICAL}
              mode={
            showComments
              ? VIDEO_PLAYER_MODE.ROUNDED_R_NONE
              : undefined
              }
              showPlayPause={showPlayPause || autoplayFailed}
              showMuteUnmute={showMuteUnmute}
              isDraggable={false}
              ref={(el) => {
            videoRefs.current[index] = el;
              }}
              togglePlay={togglePlay}
              toggleMute={toggleMute}
              isPlaying={isPlaying}
              isMuted={isMuted}
              autoplayFailed={autoplayFailed}
              isVideoMounted={isVideoMounted}
              setIsVideoMounted={setIsVideoMounted}
              loop={false}
              videoUrl={short?.src}
            />

            {/* Poll */}
            {showPoll && (
              <div className="absolute my-auto inset-0 w-full h-fit px-4 z-50">
            <Poll setShowPoll={setShowPoll} />
              </div>
            )}

            {/* Video Info */}
            <VideoInfo video={short} channel={channelsData[index]} />

            {loadingStates[index] && (
              <div className="absolute z-[9999] inset-0 flex items-center justify-center size-full rounded-[32px] overflow-hidden">
            <Loader />
              </div>
            )}
          </div>
          {/* Interaction Buttons */}
            {!showComments && !showExplore && (
            <InteractionButtons
              video={short}
              onCommentClick={toggleComments}
              onExploreClick={toggleExplore}
            />
            )}

          {/* Comment List Section */}
          {showComments && (
            <div className="bg-white aspect-[600/1040] relative rounded-r-[32px] overflow-hidden h-full w-full flex items-center">
              <CommentList
            shortId={shorts[currentIndex]?.id.toString()}
            toggleComments={toggleComments}
              />
            </div>
          )}

          {showExplore && (
            <div className="bg-white aspect-[600/1040] relative rounded-r-[32px] overflow-hidden h-full w-full flex items-center">
              <Explore toggleExplore={toggleExplore} />
            </div>
          )}
            </div>
          </CarouselItem>
        ))}
          </CarouselContent>
        </Carousel>
        <NavigationButtons
          navigateVideo={navigateVideo}
          isLoading={loadingStates[currentIndex] || false}
        />
      </div>
    </div>
  );
}
