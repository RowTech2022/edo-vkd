import { Avatar, Box, Tooltip } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { ChatMessageItem } from "./ChatMessageItem";
import { useOutsideClick } from "@hooks";
import { IChatMessage2, IChatUserInfo } from "@services/chatApiV35";

interface IChatMessageProps {
  discutionId?: number | null;
  type?: "left" | "right";
  messages: IChatMessage2[];
  users: IChatUserInfo[];
  onCloseDiscution: (value: number) => void;
  changeReplyEdit: (key: string, value: IChatMessage2) => void;
  mRef?: any;
  messageEndRef?: any;
  download?: any;
}

export const ChatMessage: FC<IChatMessageProps> = ({
  discutionId,
  type = "right",
  messages = [],
  users,
  onCloseDiscution,
  changeReplyEdit,
  messageEndRef,
}) => {
  const ref = useOutsideClick(() => setShowUserInfo(false));
  const isLeft = type === "left";
  const [user, setUser] = useState<IChatUserInfo>({
    id: "",
    value: "",
    avatar: "",
    organistionName: "",
    positionName: "",
  });
  const [showUserInfo, setShowUserInfo] = useState<boolean>(false);

  useEffect(() => {
    if (users)
      users?.map((item) => {
        if (+item?.id === messages[0]?.userId) setUser(item);
      });
  }, [messages, users]);

  return (
    <Box
      paddingRight={isLeft ? "0px" : "50px"}
      paddingLeft={isLeft ? "50px" : "0px"}
      position={"relative"}
      display="flex"
      justifyContent={isLeft ? "start" : "end"}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 6,
          [isLeft ? "left" : "right"]: "10px",
        }}
      >
        <div
          ref={ref}
          className="tw-cursor-pointer"
          onClick={() => setShowUserInfo(!showUserInfo)}
        >
          <Tooltip title={user?.value || "Unknown"}>
            <Avatar
              alt={user?.value || "Unknown"}
              src={user?.avatar || ""}
              sx={{
                width: 40,
                height: 40,
                bgcolor: isLeft ? "#607D8B" : "#009688",
              }}
            />
          </Tooltip>
          {showUserInfo && (
            <Box
              className={`tw-absolute tw-top-[calc(100%+6px)] tw-left-auto tw-w-[250px] tw-p-2 tw-text-xs tw-grid tw-place-items-center tw-rounded-[16px] tw-border-4 tw-border-[#F1F3FD] tw-z-40 ${
                isLeft ? "tw-left-0" : "tw-right-0"
              }`}
              sx={{
                background:
                  "linear-gradient(0deg, rgba(96, 125, 139, 0.16) 0%, rgba(96, 125, 139, 0.16) 100%), #FEFBFF",
                boxShadow:
                  "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
                "&::-webkit-scrollbar": {
                  width: 4,
                },
                "&::-webkit-scrollbar-track": {
                  webkitBoxShadow:
                    "5px 5px 5px -5px rgba(34, 60, 80, 0.2) inset",
                  backgroundColor: "#f9f9fd",
                  marginY: 1,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#607D8B",
                  borderRadius: "2px",
                },
              }}
            >
              <Avatar
                alt={user?.value || "Unknown"}
                src={user?.avatar || ""}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: isLeft ? "#607D8B" : "#009688",
                }}
              />
              <b className="tw-text-center">
                {user?.value || "Имя неизвестно"}
              </b>
              <span className="tw-text-center">
                <p className="tw-text-primary">Организация:</p>
                {user?.organistionName}
              </span>
              <span className="tw-text-center">
                <p className="tw-text-primary">Позиция:</p>
                {user?.positionName}
              </span>
            </Box>
          )}
        </div>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: isLeft ? "start" : "end",
          flexDirection: "column",
          rowGap: 1,
          maxWidth: "50%",
        }}
      >
        {messages.map((item, idx) => (
          <ChatMessageItem
            discutionId={discutionId}
            type={type}
            key={idx}
            item={item}
            user={user}
            isLast={idx + 1 === messages?.length}
            messages={messages}
            changeReplyEdit={changeReplyEdit}
            onCloseDiscution={onCloseDiscution}
          />
        ))}
        <div ref={messageEndRef}></div>
      </Box>
    </Box>
  );
};
