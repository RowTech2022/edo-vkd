import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import { format } from "date-fns";
import { FC, useState } from "react";
import { IChatMessage2, useMessageSignMutation } from "@services/chatApi";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import CheckIcon from "@mui/icons-material/Check";
import { getParamFromUrl , deepCopy } from "@utils";
import { useOutsideClick , downloadFile } from "@hooks";
import { IUserWithAvatar } from "@services/api";
const chatMsgLength =
  Number(import.meta.env.VITE_PUBLIC_CHAT_DEFAULT_MESSAGE_LENGTH) || 750;

interface IChatMessageItemProps {
  discutionId?: number | null;
  type?: "left" | "right";
  item: IChatMessage2;
  user: IUserWithAvatar;
  isLast: boolean;
  messages: IChatMessage2[];
  onCloseDiscution: () => void;
  changeReplyEdit: (key: string, value: IChatMessage2) => void;
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
  let txt = text?.replaceAll(
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

export const ChatMessageItem: FC<IChatMessageItemProps> = ({
  discutionId,
  type,
  item,
  user,
  isLast,
  messages = [],
  onCloseDiscution,
  changeReplyEdit,
}) => {
  const [messageSign, { isLoading }] = useMessageSignMutation();
  const [showSignature, setShowSignature] = useState<number | undefined>();
  const [signature, setSignature] = useState<string>();
  const [fullText, setFullText] = useState<string>(item.text);
  const [showFullText, setShowFullText] = useState<boolean>(false);
  const ref = useOutsideClick(() => setShowSignature(undefined));
  const isLeft = type === "left";
  const iconCls =
    "tw-cursor-pointer tw-border-[1px] tw-rounded-full tw-p-[1px] tw-mx-[1px]";
  const iconBorderCls = isLeft ? "tw-border-primary" : "tw-border-secondary";

  const setDownloadFile = async (fileName: string, name: string) => {
    if (fileName === "") return;
    downloadFile(fileName);
  };

  const cutText = (text: string, limit: number) => {
    text = text.trim();
    if (text.length <= limit) {
      return text;
    } else {
      text = text.slice(0, limit);
      let newText = text.slice(0, text.lastIndexOf(" "));
      return newText + " ...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    }
  };

  const getMsgSign = (id: number, discutionId: number) => {
    if (!signature && id && discutionId) {
      messageSign({
        id,
        discutionId,
      }).then((res: any) => {
        setSignature(res.data.sign);
        setShowSignature(id);
      });
    } else {
      setShowSignature(id);
    }
  };

  const noResponseFiles = deepCopy(item);
  delete noResponseFiles.files;

  return (
    <Box
      key={item.id}
      sx={{
        maxWidth: "-webkit-fill-available",
        display: "inline-block",
        whiteSpace: "pre-line",
        paddingX: 2,
        paddingY: 1,
        backgroundColor: isLeft ? "#f6f7f9" : "#607D88",
        color: isLeft ? "#666" : "#fff",
        borderRadius: 3,
        [isLeft ? "borderBottomLeftRadius" : "borderBottomRightRadius"]: isLast
          ? 0
          : 12,
        boxShadow: `${
          isLeft ? "rgba(0, 0, 0, 0.05)" : "transparent"
        } 0px 0px 0px 2px`,
        position: "relative",
        marginX: 1,
      }}
    >
      {isLeft && (
        <h5 className="tw-text-xs tw-text-[#34d399] tw-font-medium">
          {user?.value}
        </h5>
      )}
      <span
        className="tw-text-xs tw-block max-w-full tw-overflow-hidden"
        dangerouslySetInnerHTML={{
          __html: formatMessage(
            item.parentId,
            item.parentShortMessage,
            !showFullText
              ? cutText(item.text, chatMsgLength)
              : fullText + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
            isLeft ? "#3b82f6" : "#34d399"
          ),
        }}
      ></span>
      {item.text.length > chatMsgLength && (
        <p
          className="tw-text-xs tw-text-[#34d399] hover:tw-underline tw-font-medium tw-cursor-pointer tw-absolute tw-bottom-3 tw-right-4"
          onClick={() => setShowFullText(!showFullText)}
        >
          {showFullText ? "Скрыть" : "Ещё"}
        </p>
      )}
      <span
        className={`${"tw-flex tw-absolute tw-top-0 tw-text-[9px]"} ${
          isLeft
            ? "tw-text-primary tw-left-[100%] tw-pl-2"
            : "tw-text-secondary tw-right-[100%] tw-pr-2"
        }`}
      >
        {isLeft && (
          <Tooltip
            ref={ref}
            className={`${iconCls} ${iconBorderCls}`}
            title="Подпись"
            onClick={() =>
              item.id && discutionId
                ? getMsgSign(item.id, discutionId)
                : undefined
            }
          >
            {isLoading ? (
              <CircularProgress
                className="tw-m-0"
                size={20}
                color="secondary"
              />
            ) : (
              <CheckIcon sx={{ fontSize: 20 }} />
            )}
          </Tooltip>
        )}
        <Tooltip
          className={`${iconCls} ${iconBorderCls}`}
          title={isLeft ? "Ответить" : "Изменить"}
        >
          {isLeft ? (
            <i onClick={() => changeReplyEdit("reply", noResponseFiles)}>
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
        {!isLeft && (
          <Tooltip
            ref={ref}
            className={`${iconCls} ${iconBorderCls}`}
            title="Подпись"
            onClick={() =>
              item.id && discutionId
                ? getMsgSign(item.id, discutionId)
                : undefined
            }
          >
            {isLoading ? (
              <CircularProgress size={20} color="secondary" />
            ) : (
              <CheckIcon sx={{ fontSize: 20 }} />
            )}
          </Tooltip>
        )}
      </span>
      <Typography
        sx={{
          position: "absolute",
          bottom: 0,
          [isLeft ? "left" : "right"]: "calc(100% + 8px)",
          color: "#777",
          fontSize: 11,
          lineHeight: "0.8",
        }}
        variant="subtitle2"
      >
        {getHours(item.createAt || Date.now())}
      </Typography>
      {item?.files && (
        <Box className="tw-flex tw-gap-2 tw-cursor-pointer tw-flex-wrap">
          {item.files.map((item, idx) => (
            <span
              key={idx}
              onClick={() => setDownloadFile(item, item)}
              className="tw-flex tw-items-center tw-text-cyan-400 hover:tw-text-cyan-500"
            >
              <TextSnippetIcon fontSize="small" />
              <i className="tw-text-[9px]">
                {getParamFromUrl(item, "fileName")}
              </i>
            </span>
          ))}
        </Box>
      )}
      {showSignature === item?.id && signature && (
        <div
          className={`${"tw-absolute tw-top-0 tw-text-[9px] tw-w-[280px] tw-shadow-[0_0_2px_black] tw-z-10"} ${
            isLeft
              ? "tw-text-primary tw-left-[calc(100%+31px)]"
              : "tw-text-secondary tw-right-[calc(100%+31px)]"
          }`}
        >
          <span className="tw-w-full tw-h-full">
            <img width={300} src={`data:image/png;base64,${signature}`} />
          </span>
        </div>
      )}
    </Box>
  );
};
