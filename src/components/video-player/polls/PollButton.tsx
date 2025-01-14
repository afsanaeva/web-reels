import Image from "next/image";
import React from "react";

const PollButton = (props: any) => {
  return (
    <button
      className="flex items-center gap-2.5  p-3 bg-white hover:bg-white/70 transition-colors rounded-[14px]"
      {...props}
    >
      <img src="/icons/poll.svg" alt="poll" width={24} height={24} />
      <div className="text-left">
        <div className="font-semibold font-18px">Poll</div>
        <div className="font-14px">Give your response</div>
      </div>
    </button>
  );
};

export default PollButton;
