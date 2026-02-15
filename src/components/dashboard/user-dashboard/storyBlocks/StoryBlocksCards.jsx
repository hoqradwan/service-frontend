"use client";
import React from "react";

const StoryBlocksCards = ({ card }) => {
  const { data, title, bgColor } = card;
  return (
    <div className={`shadow-lg  p-4 text-white ${bgColor} rounded-md`}>
      <div className="">
        <p className="text-[24px]">{data }</p>
        <p className="text-[14px]">{title}</p>
      </div>
    </div>
  );
};

export default StoryBlocksCards;
