import React from "react";
import { ChevronLeft, Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useQuery } from "@apollo/client";
import {
  EXPLORE_CHANNELS_LIST_WITH_DETAILS,
  EXPLORE_CHANNEL_DETAILS,
} from "@/graphql/queries/exploreQueries";
import { numberToSI } from "@/utils/commonFunction";
import FollowChannel from "../FollowChannel";
import { Loader2 } from "lucide-react";

interface ChannelDetailsShortsProps {
  channelId: string;
  onBack?: () => void; // Optional back handler
}

const ChannelDetailsShorts: React.FC<ChannelDetailsShortsProps> = ({
  channelId,
  onBack,
}) => {
  const { loading, error, data } = useQuery(EXPLORE_CHANNEL_DETAILS, {
    variables: { channelId },
  });

  const { loading: detailsLoading, data: detailsData } = useQuery(
    EXPLORE_CHANNELS_LIST_WITH_DETAILS,
    {
      variables: {
        channelId,
        type: "TOP",
        limit: 50,
        offset: 0,
      },
    }
  );

  if (detailsLoading) return <Loader2 className="animate-spin size-10" />;

  const shorts = detailsData?.shortsForChannel || [];

  if (loading) return <Loader2 className="animate-spin size-10" />;
  if (error) {
    console.error("Error loading channel details:", error);
  }

  const channel = data?.channel;

  return (
    <div>
      {/* Back Button */}
      {onBack && (
        <button onClick={onBack} className=" text-black ">
          <ChevronLeft />
        </button>
      )}

      {/* Channel Details */}
      <div className="flex flex-col items-center text-center">
        <div>
          <img
            className="rounded-full w-24 h-24 object-cover"
            src={channel?.avatar?.original || "/assets/placeholder.png"}
            alt={`${channel.name}'s avatar`}
          />
        </div>

        <div className="flex flex-col items-center mt-4">
          <h1 className="text-[#000E3C] text-2xl font-bold mb-2">{channel.name}</h1>
          <FollowChannel
            onFollow={() => { } }
            channelId={channel?._id}
            className={channel?.isFollowed
              ? "bg-[#005AFF] text-white"
              : "bg-[#005AFF] text-white"} channelData={[]}          />
          <p className="text-[#4A4A4A] text-sm mt-2">{channel.description}</p>

          <div className="flex gap-4 justify-center items-center mt-4">
            <div>
              <p className="text-[#005AFF] font-26px font-bold">
                {numberToSI(channel.totalShort || 0)}
              </p>
              <p className="text-[#4A4A4A] font-16px">Total Videos</p>
            </div>
            <div>
              <p className="text-[#005AFF] font-26px font-bold">
                {numberToSI(channel.totalView || 0)}
              </p>
              <p className="text-[#4A4A4A] font-16px">Total Views</p>
            </div>
            <div>
              <p className="text-[#005AFF] font-26px font-bold">
                {numberToSI(channel.totalFollower || 0)}
              </p>
              <p className="text-[#4A4A4A] font-16px">Followers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shorts Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-5">
        {shorts?.map((short: any) => (
          <AspectRatio
            key={short._id}
            ratio={10 / 16}
            className="relative rounded-lg overflow-hidden"
          >
            <img
              src={short?.thumbnail?.original || "/assets/placeholder.png"}
              alt={`${short.caption} thumbnail`}
              className="object-cover rounded-lg w-full h-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="text-white w-10 h-7 fill-white opacity-80" />
            </div>
          </AspectRatio>
        ))}
      </div>
    </div>
  );
};

export default ChannelDetailsShorts;
