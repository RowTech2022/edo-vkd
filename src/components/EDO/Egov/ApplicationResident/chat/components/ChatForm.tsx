import { Box, Button, Typography } from "@mui/material";
import { FC, useState, useMemo, useEffect } from "react";
import { ChatSendInput } from "./ChatSendInput";
import { ChatMessage } from "./ChatMessage";
import CloseIcon from "@mui/icons-material/Close";
import { IChatMessage } from "@services/chatApi";
import { useOutsideClick, useSession } from "@hooks";
import { getParamFromUrl } from "@utils";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";

interface IChatForm {
  messages: IChatMessage[];
  canSendMessage?: boolean;
  checkPaymentVisible?: boolean;
  resFiles?: string[];
  onSendMessage: (parentId: number, text: string, files: string[]) => void;
  onEditMessage?: (id: number, text: string, files: string[]) => void;
  onCloseDiscution: () => void;
  onCloseModal: () => void;
  getDiscutions: () => void;
  openCheckPaymentForm: () => void;
  mRef: any;
}

export const ChatForm: FC<IChatForm> = ({
  messages = [],
  resFiles,
  canSendMessage,
  checkPaymentVisible,
  onSendMessage,
  onEditMessage,
  onCloseDiscution,
  onCloseModal,
  getDiscutions,
  openCheckPaymentForm,
  mRef,
}) => {
  const { data: session } = useSession();

  const [replyEdit, setReplyEdit] = useState<{ [key: string]: IChatMessage }>(
    {}
  );
  const { data: details } = useFetchUserDetailsQuery();
  const [files, setFiles] = useState<string[]>([]);
  const [showFiles, setShowFiles] = useState(false);

  const fileRef = useOutsideClick(() => {
    setShowFiles(false);
  });

  const msgs = useMemo(() => {
    const content: IChatMessage[][] = [];
    let prevUser: any = -1;
    if (!messages) return [];
    messages?.forEach((item) => {
      if (prevUser === item.user?.id) {
        content[content.length - 1].push(item);
      } else {
        content.push([item]);
      }
      prevUser = item.user?.id || -1;
    });
    return content;
  }, [messages]);

  const isMe = (item: IChatMessage) => {
    return details?.id && item.user?.id == details.id;
  };

  useEffect(() => {
    let files = Object.values(replyEdit)[0]?.files;
    if (files) setFiles(files);
  }, [replyEdit]);

  const changeReplyEdit = (key: string, item: IChatMessage) => {
    setReplyEdit({ [key]: item });
  };

  const removeFile = (removeItem: string) => {
    setFiles(files.filter((item) => item !== removeItem));
  };

  const closeReplyEdit = () => {
    setFiles([]);
    setReplyEdit({});
  };

  const openFilesPopup = () => {
    setShowFiles(!showFiles);
  };

  const downloadFile = (res: any, withUrl?: boolean, name?: string) => {
    const a = document.createElement("a");
    const url = res;
    a.href = url;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const setDownloadFile = async (fileName: string, name: string) => {
    if (fileName === "") return;
    downloadFile(fileName, true, name);
  };

  const title = (
    <Box
      sx={{
        backgroundColor: "#607D8B",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "60px",
        padding: 1,
        boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 0px",
        position: "relative",
      }}
    >
      <div className="tw-relative tw-flex tw-gap-1">
        <Button
          sx={{
            color: "#fff",
            borderColor: "#fff",
          }}
          variant="outlined"
          size="small"
          onClick={() => openFilesPopup()}
        >
          Все файлы
        </Button>
        <Button
          sx={{
            color: "#fff",
            borderColor: "#fff",
          }}
          variant="outlined"
          size="small"
          onClick={getDiscutions}
        >
          Обновить
        </Button>

        {showFiles && resFiles?.length !== 0 && (
          <Box
            ref={fileRef}
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: 6,
              border: "8px solid #F1F3FD",
              background:
                "linear-gradient(0deg, rgba(96, 125, 139, 0.16) 0%, rgba(96, 125, 139, 0.16) 100%), #FEFBFF",
              boxShadow:
                "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
              "& ::-webkit-scrollbar": {
                width: 4,
              },
              "& ::-webkit-scrollbar-track": {
                webkitBoxShadow: "5px 5px 5px -5px rgba(34, 60, 80, 0.2) inset",
                backgroundColor: "#f9f9fd",
              },
              "& ::-webkit-scrollbar-thumb": {
                backgroundColor: "#607D8B",
              },
              paddingY: 1,
              paddingLeft: 1,
              paddingRight: 3,
              maxHeight: "400px",
              position: "absolute",
              top: "calc(100% + 16px)",
              left: 0,
              width: "fit-content",
              maxWidth: "150%",
              zIndex: 99,
            }}
          >
            {resFiles &&
              resFiles.map((file, idx) => (
                <span
                  key={idx}
                  className="tw-text-black tw-text-xs tw-text-left tw-whitespace-nowrap tw-cursor-pointer hover:tw-text-secondary hover:tw-underline tw-truncate"
                  onClick={(e) => setDownloadFile(file, file)}
                >
                  <TextSnippetIcon fontSize="small" />
                  <i className="tw-text-[9px]">
                    {getParamFromUrl(file, "fileName")}
                  </i>
                </span>
              ))}
          </Box>
        )}
      </div>
      <Typography variant="h6" color="#fff" textAlign="center">
        {checkPaymentVisible
          ? "Обсуждение между заявителем и испольнителем"
          : "Обсуждение"}
      </Typography>
      <CloseIcon
        onClick={onCloseModal}
        sx={{
          color: "#fff",
          cursor: "pointer",
        }}
        fontSize="medium"
      />
    </Box>
  );

  const messagesContent = (
    <Box
      sx={{
        overflowY: "auto",
        paddingY: 1,
      }}
    >
      {msgs.map((item, idx) => (
        <ChatMessage
          changeReplyEdit={changeReplyEdit}
          onCloseDiscution={onCloseDiscution}
          messages={item}
          key={idx}
          mRef={mRef}
          type={isMe(item[0]) ? "right" : "left"}
        />
      ))}
    </Box>
  );

  return (
    <Box
      sx={{
        minWidth: "600px",
        height: "80vh",
        minHeight: "500px",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        gridTemplateRows: "60px 1fr 100px",
      }}
      className="tw-grid tw-grid-flow-rows"
    >
      <div>{title}</div>
      <div className="tw-overflow-y-auto tw-my-1">{messagesContent}</div>
      <div>
        <ChatSendInput
          disabled={!canSendMessage}
          onSendMessage={onSendMessage}
          onEditMessage={onEditMessage}
          replyEdit={replyEdit}
          changeReplyEdit={changeReplyEdit}
          files={files}
          setFiles={setFiles}
          removeFile={removeFile}
          closeReplyEdit={closeReplyEdit}
          checkPaymentVisible={checkPaymentVisible}
          openCheckPaymentForm={openCheckPaymentForm}
        />
      </div>
    </Box>
  );
};
