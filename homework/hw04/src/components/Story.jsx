import React from "react";

export default function Story({ storyData }) {
  console.log("story should be here");
  console.log(storyData);
  const { user } = storyData;

  function storyPart() {
    return (
      <div class="flex flex-col justify-center items-center">
      <img src={storyData.user.thumb_url} class="rounded-full border-4 border-gray-300 w-20" />
      <p class="text-xs text-gray-500">{storyData.user.username}</p>
  </div>
    );
  }
  console.log(storyData.thumb_url);
  return storyPart();
}
