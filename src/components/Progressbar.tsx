import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";
import { useVideoPlayer } from "./video-player/VideoPlayerContext";
import Hls from "hls.js";
// import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";
import {
  ORIENTATION,
  VIDEO_PLAYER_MODE,
} from "@/constants/videoplayer.constants";

interface ProgressbarProps {
  videoRef: HTMLVideoElement | null;
  isDraggable: boolean;
  videoUrl: string;
  orientation: ORIENTATION;
  mode?: VIDEO_PLAYER_MODE;
  isFullScreen: boolean;
}

const Progressbar = ({
  videoRef,
  isDraggable,
  videoUrl,
  orientation,
  mode,
  isFullScreen,
}: ProgressbarProps) => {
  const { isDragging, setIsDragging } = useVideoPlayer();
  const [progress, setProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [previewPosition, setPreviewPosition] = useState(0);
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);
  const [hlsInitialized, setHlsInitialized] = useState(false);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const [holdMouseInterval, setHoldMouseInterval] =
    useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    setHlsInitialized(false);
    const updateProgress = () => {
      const video = videoRef;
      if (video) {
        const progress = (video.currentTime / video.duration) * 100;
        setProgress(progress);
      }
    };

    videoRef?.addEventListener("timeupdate", updateProgress);

    return () => {
      videoRef?.removeEventListener("timeupdate", updateProgress);
    };
  }, [videoRef]);

  const initializeHls = (videoEl: HTMLVideoElement) => {
    const hls = new Hls();
    hls.loadSource(videoUrl);
    hls.attachMedia(videoEl);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setHlsInitialized(true);
    });
  };

  const generatePreviewThumbnail = useDebouncedCallback(() => {
    console.log("Generating preview thumbnail");
    if (!hlsInitialized && previewVideoRef.current) {
      initializeHls(previewVideoRef.current);
    }
    const previewTime = (previewPosition / 100) * (videoRef?.duration || 0);
    const tempCanvas = document.createElement("canvas");
    const context = tempCanvas.getContext("2d");

    if (context && previewVideoRef.current) {
      previewVideoRef.current.preload = "auto";
      previewVideoRef.current.muted = true;

      tempCanvas.width = videoRef?.videoWidth! / 3;
      tempCanvas.height = videoRef?.videoHeight! / 3;
      previewVideoRef.current.currentTime = previewTime;
      previewVideoRef.current.onseeked = () => {
        context.drawImage(
          previewVideoRef.current!,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );
        setPreviewThumbnail(tempCanvas.toDataURL());
      };
    }
  }, 300);

  useEffect(() => {
    if (!isDragging) {
      setPreviewThumbnail(null);
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      const progressBar = document.querySelector(".progress-bar-container");
      if (progressBar) {
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = (clickPosition / rect.width) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        setPreviewPosition(clampedPercentage);
        generatePreviewThumbnail();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      clearInterval(holdMouseInterval!);
      setIsDragging(false);
      const progressBar = document.querySelector(".progress-bar-container");
      if (progressBar && videoRef) {
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentage = (clickPosition / rect.width) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        videoRef.currentTime = (clampedPercentage / 100) * videoRef.duration;
        setProgress(clampedPercentage);
      }
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, videoRef]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    let isDragging = false;
    // Instead, just update the preview position
    if (e.buttons === 1 && isDraggable) {
      setPreviewPosition(getPosition(e));
    }
    setHoldMouseInterval(
      setInterval(() => {
        if (!isDragging) {
          console.log("Interval");
          isDragging = true;
          setIsDragging(true);
          generatePreviewThumbnail();
        }
      }, 200)
    );
  };
  const handlePointerUp = () => {
    clearInterval(holdMouseInterval!);
  };
  const getPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = (clickPosition / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    return clampedPercentage;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only allow clicks when isDraggable is true
    if (!videoRef || isDragging || !isDraggable) return;

    const clampedPercentage = getPosition(e);

    videoRef.currentTime = (clampedPercentage / 100) * videoRef.duration;
    setProgress(clampedPercentage);
  };

  // Add new pointer move handler for the progress bar itself
  const handleProgressBarPointerMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (e.buttons === 1 && isDraggable) {
      // Only set isDragging when user moves mouse while holding button
      setIsDragging(true);
    }
    if (isDraggable && !isDragging) {
      setPreviewPosition(getPosition(e));
    }
  };

  return (
    <div
      className={cn(
        "absolute z-50 transition-all bottom-0 left-3 right-3 progress-bar-container",
        {
          "right-0": mode === VIDEO_PLAYER_MODE.ROUNDED_R_NONE,
          "cursor-pointer": isDraggable,
          "right-0 left-0": isFullScreen,
        }
      )}
      onMouseEnter={() => isDraggable && setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onPointerDown={handleMouseDown}
      onPointerUp={handlePointerUp}
      onClick={handleProgressBarClick}
      onMouseMove={handleProgressBarPointerMove}
    >
      <video ref={previewVideoRef} muted className="hidden" />
      {/* Progress Bar */}
      <div
        className={cn(
          "absolute bottom-0 rounded-b-[16px] h-4 overflow-hidden left-0 right-0",
          {
            "rounded-br-none": mode === VIDEO_PLAYER_MODE.ROUNDED_R_NONE,
            "rounded-none": isFullScreen,
          }
        )}
      >
        <>
          <div className="bg-gray-500/50 absolute bottom-0 w-full h-1">
            <div
              className={
                "h-full bg-red-500 transition-all duration-200 ease-linear"
              }
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </>
      </div>

      {/* Preview Time */}
      {(isHovering || isDragging) && (
        <div
          className="absolute bottom-8 transition-opacity duration-1000 ease-linear transform -translate-x-1/2  rounded-md p-1 z-50 flex flex-col items-center gap-3"
          style={{
            left: `${previewPosition}%`,
          }}
        >
          {isDragging && (
            <div className="relative min-w-20 h-full rounded-md bg-[#00000066] aspect-[600/1040] w-[100px]">
              {previewThumbnail && (
                <img
                  src={previewThumbnail || ""}
                  width={600}
                  height={1040}
                  alt="Preview"
                  className="border relative min-w-20 rounded-md "
                />
              )}
            </div>
          )}
          <div className="px-3.5 py-1 font-12px font-bold text-white bg-[#00000066] rounded-[20px]">
            {(() => {
              const seconds = Math.floor(
                (previewPosition / 100) * (videoRef?.duration || 0)
              );
              const minutes = Math.floor(seconds / 60);
              const remainingSeconds = seconds % 60;
              return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
                .toString()
                .padStart(2, "0")}`;
            })()}
          </div>
        </div>
      )}

      {/* Dot Indicator */}
      <div
        className={cn(
          "absolute -bottom-1 w-3 h-3 bg-white rounded-full z-50 -ml-1.5 ease-linear scale-150 opacity-0",
          {
            "transition-all duration-200 scale-100": !isDragging,
            "opacity-100": isHovering || isDragging,
          }
        )}
        style={{
          left: `${isDragging ? previewPosition : progress}%`,
        }}
      />
    </div>
  );
};

export default Progressbar;
