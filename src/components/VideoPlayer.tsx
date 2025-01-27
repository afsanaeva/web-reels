"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import MiniButtons from "./MiniButtons";
import TogglePlayPause from "./TogglePlayPause";
import ToggleMuteUnmute from "./ToggleMuteUnmute";
import Progressbar from "./Progressbar";
import {
  ORIENTATION,
  VIDEO_PLAYER_MODE,
} from "@/constants/videoplayer.constants";
import { cn } from "@/lib/utils";
import { videos } from "@/data/videos";

type VideoPlayerProps = {
  showComments: boolean;
  orientation: ORIENTATION;
  showPlayPause?: boolean;
  showMuteUnmute?: boolean;
  isDraggable?: boolean;
  tapToMute?: boolean;
  togglePlay: (e: React.MouseEvent<HTMLDivElement | HTMLVideoElement>) => void;
  toggleMute: () => void;
  isPlaying: boolean;
  isMuted: boolean;
  autoplayFailed: boolean;
  isVideoMounted: boolean;
  setIsVideoMounted: (value: boolean) => void;
  loop: boolean;
  videoUrl: string;
  mode?: VIDEO_PLAYER_MODE;
  isHovering: boolean;
  isFullScreen: boolean;
};
const video = videos[0];
// eslint-disable-next-line react/display-name
const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      orientation = ORIENTATION.VERTICAL,
      showPlayPause = true,
      showMuteUnmute = false,
      isDraggable = true,
      tapToMute = false,
      togglePlay,
      toggleMute,
      isPlaying,
      isMuted,
      autoplayFailed,
      isVideoMounted,
      setIsVideoMounted,
      loop,
      videoUrl,
      mode,
      isHovering,
      isFullScreen,
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [, setVideoLoaded] = useState(false);

    const combinedRef = (node: HTMLVideoElement) => {
      videoRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
      if (autoplayFailed) {
        togglePlay(e);
      } else if (tapToMute) {
        toggleMute();
      } else {
        togglePlay(e);
      }
    };

    // Ensure video is mounted and autoplay is enabled
    useEffect(() => {
      if (videoRef.current && !isVideoMounted) {
        setIsVideoMounted(true);
      }
    }, [isVideoMounted, setIsVideoMounted]);

    // Handling video load and autoplay logic
    useEffect(() => {
      if (videoRef.current) {
        const videoElement = videoRef.current;
        if (videoElement && !autoplayFailed) {
          videoElement.src = videoUrl; // Set the video URL
          videoElement.load(); // Reload video to apply the new source
          videoElement.play().catch((error) => {
            console.log("Autoplay failed, user must interact with video", error);
            setVideoLoaded(true); // Allow user interaction to play the video
          });
        }
      }
    }, [videoUrl, autoplayFailed]);

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            `bg-gray-950 aspect-[600/1040] relative overflow-hidden h-full w-full flex items-center rounded-[32px]`,
            {
              "rounded-r-none": mode === VIDEO_PLAYER_MODE.ROUNDED_R_NONE,
              "rounded-none": isFullScreen,
            }
          )}
        >
          <MiniButtons
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            isMuted={isMuted}
            toggleMute={toggleMute}
            isHovering={isHovering}
          />
          <video
            ref={combinedRef}
            className="m-auto w-full object-contain"
            controls={false}
            playsInline
            onClick={handleVideoClick}
            muted={isMuted}
            src={video.src}
            loop={loop}
            onContextMenu={(e) => e.preventDefault()}
            onLoadedData={() => setVideoLoaded(true)} // Check when the video data is loaded
          />

          {/* Play/Pause Overlay */}
          {showPlayPause && (
            <TogglePlayPause isPlaying={isPlaying} togglePlay={togglePlay} />
          )}
          {showMuteUnmute && (
            <ToggleMuteUnmute isMuted={isMuted} toggleMute={toggleMute} />
          )}
        </div>

        {/* Progress Bar */}
        <Progressbar
          videoRef={videoRef.current}
          videoUrl={videoUrl}
          isDraggable={isDraggable}
          orientation={orientation}
          mode={mode}
          isFullScreen={isFullScreen}
        />
      </div>
    );
  }
);

export default VideoPlayer;
