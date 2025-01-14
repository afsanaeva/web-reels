"use client";

import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function SharePopover({ videoUrl }: { videoUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(videoUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <img
            src="/icons/share.svg"
            alt="Share"
            width={24}
            height={24}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Share</h3>
          <div className="flex justify-around w-full">
            <button className="flex flex-col items-center">
              <img
                src="/icons/messenger.svg"
                alt="Messenger"
                width={30}
                height={30}
              />
              <span className="text-sm text-gray-700">Messenger</span>
            </button>
            <button className="flex flex-col items-center">
              <img
                src="/icons/facebook.svg"
                alt="Facebook"
                width={30}
                height={30}
              />
              <span className="text-sm text-gray-700">Facebook</span>
            </button>
            <button className="flex flex-col items-center">
              <img
                src="/icons/whatsapp.svg"
                alt="WhatsApp"
                width={30}
                height={30}
              />
              <span className="text-sm text-gray-700">WhatsApp</span>
            </button>
            <button className="flex flex-col items-center">
              <img
                src="/icons/instagram.svg"
                alt="Instagram"
                width={30}
                height={30}
              />
              <span className="text-sm text-gray-700">Instagram</span>
            </button>
          </div>
          <div className="flex items-center w-full">
            <input
              type="text"
              value={videoUrl}
              readOnly
              className="flex-1 px-3 py-2 border rounded-l-md text-sm"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 text-sm font-semibold text-white bg-blue-500 rounded-r-md hover:bg-blue-600"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
