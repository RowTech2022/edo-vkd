import React from "react";

import ReplyIcon from "@mui/icons-material/Reply";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { normalizeValue2 } from "./ChatInput";

const ReplyMessage = ({ obj, setShowReply }) => {
  return (
    <main className="tw-w-full tw-flex tw-justify-between tw-items-start">
      <div className="wrapper-reply-message tw-flex tw-items-center tw-gap-5">
        <ReplyIcon fontSize="large" className="tw-text-[#007cd2]" />
        <div className="reply-message">
          <p className="tw-text-[#007cd2] tw-font-medium">В ответ {obj.name}</p>
          <p
            className="text-[#939393]"
            dangerouslySetInnerHTML={{
              __html: normalizeValue2(obj.message),
            }}
          />
        </div>
      </div>
      <IconButton onClick={() => setShowReply({ visible: false, info: null })}>
        <CloseIcon />
      </IconButton>
    </main>
  );
};

export default ReplyMessage;
