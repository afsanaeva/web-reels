"use client";
import React, { useState } from "react";
import NavBar from "./NavBar";
import { X, Search } from "lucide-react";
import { useQuery } from "@apollo/client";
import { SEARCH_EXPLORE_SHORTS } from "@/graphql/queries/exploreQueries";

interface ExploreProps {
  toggleExplore: () => void;
}

export const Explore: React.FC<ExploreProps> = ({ toggleExplore }) => {
  const [searchText, setSearchText] = useState<string | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);

  // Fetch shorts data
  const { data } = useQuery(SEARCH_EXPLORE_SHORTS, {
    variables: {
      text: null, 
      limit: 60, 
      offset: 0,
    },
  });

  const shorts = data?.shorts || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setSearchText(value || null); // Set to `null` if the input is empty

    if (!value) {
      setFilteredSuggestions([]);
      return;
    }

    //  suggestions based on title or caption
    const filtered = shorts.filter(
      (short: any) =>
        short.title.toLowerCase().includes(value.toLowerCase()) ||
        short.caption.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSuggestions(filtered);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchText(suggestion); // Set the input value
    setFilteredSuggestions([]); // Clear suggestions
  };

  return (
    <div className="flex flex-col h-full max-h-screen w-full max-w-xl mx-auto rounded-lg bg-[#F0F7FE]">
      {/* Header */}
      <div className="pb-2 mb-4 flex justify-between items-center sticky top-0 z-10 p-4">
        <div></div>
        <h3 className="font-24px">Explore Page</h3>
        <button onClick={toggleExplore} className="text-black p-2 rounded-md">
          <X />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5 mx-3">
        <div
          className="flex justify-between p-2 border rounded-full bg-[#FFFFFF] font-18px placeholder:text-[#A9AEC0]
          border-none focus-within:border-[#005AFF] focus-within:outline focus-within:outline-2 focus-within:outline-[#005AFF]"
        >
          <Search className="text-[#A9AEC0] text-lg" style={{ fontSize: "14px" }} />
          <input
            value={searchText || ""}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search"
            className="bg-[#FFFFFF] focus:outline-none w-full rounded-full px-2"
          />
        </div>

        {/* Suggestions Dropdown */}
        {filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white w-full mt-1 rounded-lg shadow-md h-[250px]">
            {filteredSuggestions.slice(0, 6).map((short: any, index: number) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(short.title || short.caption)}
               className="p-2 cursor-pointer hover:bg-gray-00 truncate max-w-[40ch]"
              >
                {short.title || short.caption}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* NavBar */}
      <NavBar searchText={searchText} />
    </div>
  );
};
