"use client";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShortList from "./ShortList";
import ChannelList from "./ChannelList";
import { ScrollArea } from "@/components/ui/scrollArea";

interface NavBarProps {
  searchText: string | null;
}

const NavBar: React.FC<NavBarProps> = ({ searchText }) => {

  return (
    <div className="flex pb-2.5 3xl:pb-3 font-18px max-3xl:leading-[22.4px] leading-[28px] justify-between gap-5 border-b-[1px] text-[#424854] tracking-[-0.15px] mx-3">
      <Tabs
        defaultValue="shorts"
        className="xl:w-[400px] 2xl:w-[400px] 3xl:w-[600px] w-[400px]"
      >
        <TabsList>
          <TabsTrigger value="shorts">Shorts</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[75vh] xl:h-[75vh] 2xl:h-[75vh] 3xl:h-[80vh] cursor-pointer text-[#A9AEC0]">
          <TabsContent value="shorts">
            <ShortList searchText={searchText} />
          </TabsContent>
          <TabsContent value="channels">
            <ChannelList  />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default NavBar;
