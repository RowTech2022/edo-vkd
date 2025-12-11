import React from "react";
import { normalizeValue2 } from "./ChatInput";

export const ReplyUserMessage = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="wrapper tw-max-w-full tw-bg-[#0000001a] tw-p-[10px] tw-rounded-md tw-border-l-[10px] tw-border-[#0000001a] tw-mb-[10px] tw-cursor-pointer"
    >
      <p className="font-semibold tw-text-[#000000a0]">{item.name}</p>
      <p
        className="tw-text-[#000000a0]"
        dangerouslySetInnerHTML={{
          __html: normalizeValue2(item.text),
        }}
      />
    </div>
  );
};
