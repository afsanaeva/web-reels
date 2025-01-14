import React, { useState } from "react";
import { Play } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useQuery } from "@apollo/client";
import {
  EXPLORE_CHANNELS_LIST_WITH_DETAILS,
  EXPLORE_CHANNEL_LIST,
} from "@/graphql/queries/exploreQueries";
import { Button } from "@/components/ui/button";
import { numberToSI } from "@/utils/commonFunction";
import ChannelDetailsShorts from "./ChannelDetails";
import { Loader2 } from "lucide-react";

const ChannelList: React.FC = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  const {
    loading: channelLoading,
    error: channelError,
    data: channelData,
  } = useQuery(EXPLORE_CHANNEL_LIST, {
    variables: {
      limit: 50,
      includeDisabled: false,
      offset: 0,
      search: "",
    },
  });

  if (channelLoading) return <Loader2 className="animate-spin size-10" />;
  if (channelError) {
    console.error("Error loading channel:", channelError);
  }

  const channels = channelData?.channels || [];

  return (
    <div>
      {selectedChannelId ? (
        // Show channel details if a channel is selected
        <ChannelDetailsShorts
          channelId={selectedChannelId}
          onBack={() => setSelectedChannelId(null)} // Reset to show list
        />
      ) : (
        // Show list of channels
        <div>
          {channels.map((channel: any) => (
            <ChannelDetails
              key={channel._id}
              channelId={channel._id}
              channel={channel}
              onSelect={() => setSelectedChannelId(channel._id)} // Set selected channel
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ChannelDetailsProps {
  channelId: string;
  channel: any;
  onSelect: () => void;
}

const ChannelDetails: React.FC<ChannelDetailsProps> = ({
  channelId,
  channel,
  onSelect,
}) => {
  const {
    loading: detailsLoading,
    data: detailsData,
  } = useQuery(EXPLORE_CHANNELS_LIST_WITH_DETAILS, {
    variables: {
      channelId,
      type: "TOP",
      limit: 3,
      offset: 0,
    },
  });

  if (detailsLoading) return <p></p>;

  const shorts = detailsData?.shortsForChannel || [];

  return (
    <div className="cursor-pointer relative rounded-[24px]">
      <div className="flex justify-between mt-5">
        <div className="flex items-center gap-3">
          <img
            className="rounded-full w-12 h-12 object-cover"
            src={channel?.avatar?.original || "/assets/placeholder.png"}
            alt={`${channel.name}'s avatar`}
          />
          <div>
            <h1 className="text-[#000E3C] font-20px font-bold">
              {channel.name}
            </h1>
            <h1 className="text-[#000E3C] font-14px font-medium">
              {numberToSI(channel.totalView || 0)} Views
            </h1>
          </div>
        </div>
        <Button
          onClick={onSelect} // Select the channel for details view
          variant="secondary"
          size="sm"
          className="rounded-full px-3 bg-[#005AFF] text-white"
        >
          See More
          <img src={"/icons/arrow.svg"} alt="comment" width={15} height={15} />
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
        {shorts.map((short: any) => (
          <AspectRatio
            key={short._id}
            ratio={10 / 16}
            className="relative rounded-lg overflow-hidden mt-2"
          >
            <img
              src={short?.thumbnail?.original || "/assets/placeholder.png"}
              alt={`${short.caption} thumbnail`}
              className="object-cover rounded-[24px] w-full h-full"
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

export default ChannelList;
