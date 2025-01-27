import Hls from "hls.js";

interface UseHlsInitializationProps {
  setInitializingVideos: React.Dispatch<React.SetStateAction<number[]>>;
  handleVideoLoad: (video: HTMLVideoElement, index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setLoadingStates: React.Dispatch<React.SetStateAction<boolean[]>>;
  loadingStates: boolean[];
}

export const useHlsInitialization = ({
  setInitializingVideos,
  handleVideoLoad,
  setIsPlaying,
  setLoadingStates,
  loadingStates,
}: UseHlsInitializationProps) => {
  const initializeHls = (
    video: HTMLVideoElement,
    src: string,
    index: number,
    onlyLoad: boolean = false
  ) => {
    try {
      if (Hls.isSupported()) {
        const hls = new Hls({
          startFragPrefetch: true,
          maxBufferSize: 10_000_000,
          maxBufferLength: 20,
          lowLatencyMode: true,
        });

        // Assign the HLS instance to the video element
        video.hlsInstance = hls;

        hls.on(Hls.Events.ERROR, () => {
          setInitializingVideos((prev) => prev.filter((i) => i !== index));
        });

        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, async () => {
          if (!onlyLoad) {
            handleVideoLoad(video, index);
            setInitializingVideos((prev) => prev.filter((i) => i !== index));
          }
        });
        hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
          console.log(`Loaded fragment: ${data.frag.sn}`);
          setInitializingVideos((prev) => prev.filter((i) => i !== index));
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        if (!onlyLoad) {
          handleVideoLoad(video, index);
        }
        setInitializingVideos((prev) => prev.filter((i) => i !== index));
      }
    } catch (error) {
      setInitializingVideos((prev) => prev.filter((i) => i !== index));
    }
  };

  const pauseHls = (video: HTMLVideoElement, index: number) => {
    console.log("pausing hls", video.hlsInstance);
    if (video.hlsInstance) {
      if (!loadingStates[index]) video.hlsInstance.stopLoad();
      video.pause();
    }
  };

  const resumeHls = (video: HTMLVideoElement, index: number) => {
    console.log("resuming hls", video.hlsInstance);
    if (video.hlsInstance) {
      video.hlsInstance.startLoad();
      video.play();
      setIsPlaying(true);
      setLoadingStates((prev) => {
        const newStates = [...prev];
        newStates[index] = false;
        return newStates;
      });
    }
  };

  return {
    initializeHls,
    pauseHls,
    resumeHls,
  };
};
