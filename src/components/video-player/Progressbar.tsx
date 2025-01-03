import React from "react";

const Progressbar = ({
  index,
  currentIndex,
  progress,
}: {
  index: number;
  currentIndex: number;
  progress: number;
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
      <div
        className="h-full bg-red-500 transition-all duration-100"
        style={{
          width: `${index === currentIndex ? progress : 0}%`,
        }}
      />
    </div>
  );
};

export default Progressbar;
