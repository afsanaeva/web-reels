import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const Poll = ({
  setShowPoll,
  shortId,
}: {
  setShowPoll: (show: boolean) => void;
  shortId?: string;
}) => {
  return (
    <Card className="rounded-[28px]">
      <CardHeader>
        <CardTitle className="text-center font-22px font-bold">
          Would you like try out our new product?
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-2 px-4 pb-7">
        <div
          className="flex items-center w-full px-6 py-4 rounded-[64px] bg-gray-100 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
          onClick={() => setShowPoll(false)}
        >
          <p className="font-20px font-medium">Hell yeah!</p>
        </div>
        <div
          className="flex items-center w-full px-6 py-3 rounded-[64px] bg-gray-100 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
          onClick={() => setShowPoll(false)}
        >
          <p className="font-20px font-medium">No thanks</p>
        </div>
        <div
          className="flex items-center w-full px-6 py-4 rounded-[64px] bg-gray-100 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
          onClick={() => setShowPoll(false)}
        >
          <p className="font-20px font-medium">Maybe</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Poll;
