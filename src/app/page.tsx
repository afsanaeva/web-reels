// import { VerticalVideoPlayer } from "@/components/video-player/vertical-video-player";
import VideoPlayerScreen from "@/components/video-player/VideoPlayerScreen";
import { VideoPlayerProvider } from "@/components/video-player/VideoPlayerContext";

export default function Home() {
  return (
    <VideoPlayerProvider>
      <VideoPlayerScreen />
    </VideoPlayerProvider>
  );
}
