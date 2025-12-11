import { Avatar, Box, Link, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";
import { FC } from "react";
import { IChatMessage } from "@services/chatApi";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { getParamFromUrl } from "@utils";

interface IChatMessageProps {
  type?: "left" | "right";
  messages: IChatMessage[];
  onCloseDiscution: () => void;
  changeReplyEdit: (key: string, value: IChatMessage) => void;
  mRef?: any;
}

const getHours = (date: string | number | Date) => {
  date = date instanceof Date ? date : new Date(date);
  return format(date, "HH:mm");
};

const formatMessage = (
  parentId: number | undefined,
  parentShortMessage: string | undefined,
  text: string,
  color: string
) => {
  let txt = text.replaceAll(
    /@\{[0-9,() :a-zA-Zа-яА-ЯҚҲҒӮҶӢқҷӣғӯҳ\\"]{1,}\}/g,
    (match, p) => {
      return `<span style="color: ${color}">${match.slice(
        match.lastIndexOf(":") + 1,
        match.length - 1
      )}</span> `;
    }
  );
  let txtParent = parentShortMessage?.replaceAll(
    /@\{[0-9,() :a-zA-Zа-яА-ЯҚҲҒӮҶӢқҷӣғӯҳ\\"]{1,}\}/g,
    (match, p) => {
      return (
        `<span style="color: ${color}">${match.slice(
          match.lastIndexOf(":") + 1,
          match.length - 1
        )}</span> ` ?? ""
      );
    }
  );

  if (parentId)
    return (
      `<p style="display: block; font-size: 10px; opacity: 0.7; padding-left: 5px; border-left: 2px solid #00000090; cursor: pointer">${txtParent}</p>` +
      txt
    );
  else return txt;
};

export const ChatMessage: FC<IChatMessageProps> = ({
  type = "right",
  messages = [],
  onCloseDiscution,
  changeReplyEdit,
  mRef,
}) => {
  const isLeft = type === "left";
  const iconCls =
    "tw-cursor-pointer tw-border-[1px] tw-rounded-full tw-p-[1px] tw-mx-[1px]";
  const iconBorderCls = isLeft ? "tw-border-primary" : "tw-border-secondary";

  const renderMessage = (item: IChatMessage, isLast: boolean) => {
    return (
      <Typography
        key={item.id}
        variant="body1"
        sx={{
          display: "inline-block",
          whiteSpace: "pre-line",
          paddingX: 2,
          paddingY: 1,
          backgroundColor: isLeft ? "#f6f7f9" : "#607D88",
          color: isLeft ? "#666" : "#fff",
          borderRadius: 3,
          [isLeft ? "borderBottomLeftRadius" : "borderBottomRightRadius"]:
            isLast ? 0 : 12,
          boxShadow: `${
            isLeft ? "rgba(0, 0, 0, 0.05)" : "transparent"
          } 0px 0px 0px 2px`,
          position: "relative",
          "&:hover": {
            "& .chat-reply-edit": {
              [isLeft ? "paddingLeft" : "paddingRight"]: "8px !important",
              opacity: "1 !important",
            },
          },
        }}
      >
        <span
          className="tw-text-xs"
          dangerouslySetInnerHTML={{
            __html: formatMessage(
              item.parentId,
              item.parentShortMessage,
              item.text,
              isLeft ? "#3b82f6" : "#34d399"
            ),
          }}
        ></span>
        <p
          className={`${"chat-reply-edit tw-flex tw-absolute tw-top-0 tw-opacity-0 tw-transition-all tw-duration-300 tw-ease-out tw-text-[9px] hover:tw-underline"} ${
            isLeft
              ? "tw-text-primary tw-left-[100%]"
              : "tw-text-secondary tw-right-[100%]"
          }`}
        >
          <Tooltip
            className={`${iconCls} ${iconBorderCls} tw-hidden`}
            title={isLeft ? "Ответить" : "Изменить"}
          >
            {isLeft ? (
              <i onClick={() => changeReplyEdit("reply", item)}>
                <ReplyIcon sx={{ fontSize: 15 }} />
              </i>
            ) : (
              <i onClick={() => changeReplyEdit("edit", item)}>
                <EditIcon sx={{ fontSize: 15 }} />
              </i>
            )}
          </Tooltip>
          {item.showAcceptButton && (
            <Tooltip
              className={`${iconCls} ${iconBorderCls}`}
              title="Принять"
              onClick={onCloseDiscution}
            >
              <i>
                <BookmarkAddIcon sx={{ fontSize: 15 }} />
              </i>
            </Tooltip>
          )}
        </p>
        <Typography
          sx={{
            position: "absolute",
            bottom: 0,
            [isLeft ? "left" : "right"]: "calc(100% + 8px)",
            color: "#777",
            fontSize: 11,
          }}
          variant="subtitle2"
        >
          {getHours(item.createAt || Date.now())}
        </Typography>
        {item?.files && (
          <Box className="tw-flex tw-gap-2">
            {item.files.map((item) => (
              <Link
                key={item}
                href={item}
                target="_blank"
                className="tw-flex tw-items-center tw-text-cyan-400 hover:tw-text-cyan-500"
              >
                <TextSnippetIcon fontSize="small" />
                <i className="tw-text-[9px]">
                  {getParamFromUrl(item, "fileName")}
                </i>
              </Link>
            ))}
          </Box>
        )}
      </Typography>
    );
  };

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
        <Tooltip title={messages[0].user?.value || "Unknown"}>
          <Avatar
            alt={messages[0].user?.value || "Unknown"}
            src="/static/images/avatar/1.jpg"
            sx={{
              width: 28,
              height: 28,
              bgcolor: isLeft ? "#607D8B" : "#009688",
            }}
          />
        </Tooltip>
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
        {messages.map((item, idx) =>
          renderMessage(item, idx + 1 === messages.length)
        )}
        <div ref={mRef}></div>
      </Box>
    </Box>
  );
};
