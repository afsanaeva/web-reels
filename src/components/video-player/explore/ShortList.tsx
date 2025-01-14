"use client";
import { Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useQuery } from "@apollo/client";
import { GET_EXPLORE_SHORTS } from "@/graphql/queries/exploreQueries";
// import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

interface Short {
  _id: string;
  thumbnail?: {
    original?: string;
  };
}

interface ShortListProps {
  searchText: string | null;
}

const ShortList: React.FC<ShortListProps> = ({ searchText }) => {
  const { loading, error, data } = useQuery(GET_EXPLORE_SHORTS, {
    variables: {
      text: searchText,
      channelId: null,
      shortId: null,
      limit: 60,
      offset: 0,
      // purpose: "EXPLORE_SHORT", if i use this then search not work
    },
  });

  if (loading)
    return (
      // <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
      //   {Array.from({ length: 12 }).map((_, index) => (
      //     <div key={index} className="relative rounded-[24px]">
      //       <Skeleton className="h-[180px] rounded-[24px] w-full" />
      //     </div>
      //   ))}
      // </div>
     <Loader2 className="animate-spin size-10 text-center" />
    );
  if (error) {
    console.error("Error loading shorts:", error);
  }

  const shorts: Short[] = data?.shorts || [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
      {shorts.map((short: Short) => (
        <div key={short._id} className="cursor-pointer relative rounded-[24px]">
          <AspectRatio
            ratio={10 / 16}
            className="relative rounded-lg overflow-hidden"
          >
            <img
              src={
                short.thumbnail?.original
                  ? short.thumbnail.original
                  : "/assets/placeholder.png"
              }
              alt="video_thumbnail"
              className="object-cover rounded-[24px] w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="text-white w-10 h-7 fill-white opacity-80" />
            </div>
          </AspectRatio>
        </div>
      ))}
    </div>
  );
};

export default ShortList;
