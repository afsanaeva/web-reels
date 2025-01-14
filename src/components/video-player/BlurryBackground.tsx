import React, { useEffect, useRef } from "react";

const BlurryBackground = ({
  videoRef,
}: {
  videoRef: HTMLVideoElement | null;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoRef || !canvasRef.current) return;

    const updateCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      // Match canvas size to video dimensions
      canvas.width = videoRef.videoWidth;
      canvas.height = videoRef.videoHeight;

      // Draw current video frame to canvas
      context.drawImage(videoRef, 0, 0, canvas.width, canvas.height);
    };

    // Update canvas when video loads new data or seeks
    videoRef.addEventListener("loadeddata", updateCanvas);
    videoRef.addEventListener("playing", updateCanvas);
    videoRef.addEventListener("seeked", updateCanvas);

    // Initial update attempt
    if (videoRef.readyState >= 2) {
      updateCanvas();
    }

    return () => {
      videoRef.removeEventListener("loadeddata", updateCanvas);
      videoRef.removeEventListener("playing", updateCanvas);
      videoRef.removeEventListener("seeked", updateCanvas);
    };
  }, [videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full object-cover opacity-50 blur-3xl"
    />
  );
};

export default BlurryBackground;
