import Image from "next/image";
import React from "react";

const HeaderButtons = ({
  isFullScreen,
  setIsFullScreen,
}: {
  isFullScreen: boolean;
  setIsFullScreen: (value: boolean) => void;
}) => {
  return (
    <>
      {!isFullScreen && (
        <img
          src="/icons/player/chevron.svg"
          alt="chevron"
          width={40}
          height={40}
          className="h-8 cursor-pointer hover:scale-110 transition-all duration-300 absolute top-10 left-10 z-50"
        />
      )}
      <img
        onClick={() => setIsFullScreen(!isFullScreen)}
        src={
          isFullScreen
            ? "/icons/player/small-screen.svg"
            : "/icons/player/full-screen.svg"
        }
        alt="share"
        width={54}
        height={54}
        className="h-12 cursor-pointer hover:scale-110 transition-all duration-300 ml-auto absolute top-10 right-10 z-50"
      />
    </>
  );
};

export default HeaderButtons;
