"use client";

import { useState, useRef, useEffect } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { VideoInfo } from "./video-info";
import { InteractionButtons } from "./interaction-buttons";
import { videos } from "@/data/videos";
import { channels } from "@/data/channel";
import Loader from "./Loader";
import TogglePlayPause from "./TogglePlayPause";
import Progressbar from "./Progressbar";
import NavigationButtons from "./NavigationButtons";
import CommentList from "./comments/CommentList";
import { Explore } from "./explore/Explore";
import BlurryBackground from "./BlurryBackground";

export function VerticalVideoPlayer() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayPause, setShowPlayPause] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const abortControllers = useRef<(AbortController | null)[]>([]);
  const [oncePlayed, setOncePlayed] = useState(false);
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    new Array(videos.length).fill(false)
  );

  // Add new function to handle preloading
  const preloadAdjacentVideos = (currentIndex: number) => {
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    const nextIndex = (currentIndex + 1) % videos.length;

    [prevIndex, nextIndex].forEach((index) => {
      const video = videoRefs.current[index];
      if (video && video.preload !== "auto") {
        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[index] = true;
          return newStates;
        });

        video.preload = "auto";
        video.load();

        // Add loadeddata event listener to update loading state
        video.addEventListener(
          "loadeddata",
          () => {
            setLoadingStates((prev) => {
              const newStates = [...prev];
              newStates[index] = false;
              return newStates;
            });
          },
          { once: true }
        );
      }
    });
  };
  const Channels = channels;

  // Modify handleVideoLoad to include preloading
  const handleVideoLoad = async (video: HTMLVideoElement, index: number) => {
    try {
      if (abortControllers.current[index]) {
        abortControllers.current[index]?.abort();
      }

      const controller = new AbortController();
      abortControllers.current[index] = controller;

      if (oncePlayed) {
        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[index] = true;
          return newStates;
        });

        await video.play();
        setIsPlaying(true);

        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });

        // Preload adjacent videos after current video starts playing
        preloadAdjacentVideos(index);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.name !== "AbortError") {
        console.error("Video playback failed:", error);
        setLoadingStates((prev) => {
          const newStates = [...prev];
          newStates[index] = false;
          return newStates;
        });
      }
    }
  };

  const updateProgress = () => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    }
  };

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      const index = api.selectedScrollSnap();
      setCurrentIndex(index);
      setProgress(0);

      videoRefs.current.forEach((video, i) => {
        if (i === index && video) {
          handleVideoLoad(video, i);
        } else if (video) {
          if (abortControllers.current[i]) {
            abortControllers.current[i]?.abort();
            abortControllers.current[i] = null;
          }
          video.pause();
          // video.currentTime = 0;
        }
      });
    });
  }, [api, oncePlayed, loadingStates]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      const handleVideoEnd = () => {
        if (api) {
          api.scrollNext();
        }
      };

      currentVideo.addEventListener("timeupdate", updateProgress);
      currentVideo.addEventListener("ended", handleVideoEnd);

      return () => {
        currentVideo.removeEventListener("timeupdate", updateProgress);
        currentVideo.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [currentIndex, api]);

  const togglePlay = (
    e: React.MouseEvent<HTMLButtonElement | HTMLVideoElement>
  ) => {
    e.stopPropagation();
    const video = videoRefs.current[currentIndex];
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        // video.muted = true;
        try {
          video.play();
          setOncePlayed(true);
        } catch (error) {
          console.error("Video playback failed:", error);
        }
      }
      setIsPlaying(!isPlaying);
      setShowPlayPause(true);
      setTimeout(() => setShowPlayPause(false), 1000); // Hide after 1 second
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        navigateVideo("prev");
      } else if (e.key === "ArrowDown") {
        navigateVideo("next");
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Use a debounce/throttle mechanism to prevent multiple rapid scrolls
      const now = Date.now();
      if (!handleWheel.lastCall || now - handleWheel.lastCall > 500) {
        // 500ms cooldown
        if (e.deltaY > 0) {
          navigateVideo("next");
        } else {
          navigateVideo("prev");
        }
        handleWheel.lastCall = now;
      }
    };
    // Add type declaration for the lastCall property
    handleWheel.lastCall = 0 as number;

    window.addEventListener("keydown", handleKeyDown);
    const container = document.querySelector(".carousel-container");
    if (container) {
      container.addEventListener(
        "wheel",
        handleWheel as unknown as EventListener,
        {
          passive: false,
        }
      );
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (container) {
        container.removeEventListener(
          "wheel",
          handleWheel as unknown as EventListener
        );
      }
    };
  }, [api]);

  useEffect(() => {
    return () => {
      abortControllers.current.forEach((controller) => {
        if (controller) {
          controller.abort();
        }
      });
    };
  }, []);

    // toggle comments
    const [showComments, setShowComments] = useState(false);
    const [showExplore, setShowExplore] = useState(false);
  
    const toggleComments = () => setShowComments(!showComments);
    const toggleExplore = () => setShowExplore(!showExplore);

  return (
    <div className="relative w-full h-[100vh] bg-black flex items-center justify-center overflow-hidden">
        <BlurryBackground videoRef={videoRefs?.current?.[currentIndex]} />
      <Carousel
        className="overflow-visible"
        opts={{ align: "start", loop: true }}
        orientation="vertical"
        setApi={setApi}
      >
        <CarouselContent className="mt-2 overflow-visible h-[100vh] grid grid-cols-1 gap-10 carousel-container">
          {videos.map((video, index) => (
            <CarouselItem key={video.id} className="h-[98vh] w-fit mx-auto">
              <div className="relative h-full gap-4 flex items-end">
                <div className="bg-gray-950 relative h-full w-full flex items-center rounded-t-lg">
                  {/* Loading Overlay */}
                  {loadingStates[index] && <Loader />}

                  <video
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[index] = el;
                      }
                    }}
                    className="m-auto max-h-full w-fit object-contain"
                    src={video.src}
                    preload={index === currentIndex ? "auto" : "none"}
                    playsInline
                    onClick={togglePlay}
                  />

                  {/* Play/Pause Overlay */}
                  {showPlayPause && (
                    <TogglePlayPause
                      isPlaying={isPlaying}
                      togglePlay={togglePlay}
                    />
                  )}

                  <VideoInfo video={video} channel={Channels[index]} />

                  {/* Progress Bar */}
                  <Progressbar
                    index={index}
                    currentIndex={currentIndex}
                    progress={progress}
                  />
                </div>
                {!showComments && !showExplore && (
                  <InteractionButtons
                    video={video}
                    onCommentClick={toggleComments}
                    onExploreClick={toggleExplore}
                  />
                )}

                {/* Comment List Section */}
                {showComments && (
                  <div className="bg-white aspect-[600/1040] relative rounded-r-[32px] overflow-hidden h-full w-full flex items-center">
                    <CommentList
                      shortId={video.id.toString()}
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

      {/* Navigation Buttons */}
      <NavigationButtons navigateVideo={navigateVideo} />
    </div>
  );
}
