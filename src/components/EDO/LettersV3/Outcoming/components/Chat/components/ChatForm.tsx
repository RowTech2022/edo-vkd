import { Box, Button, DialogTitle, Typography } from "@mui/material";
import { FC, useState, useMemo, useEffect } from "react";
import { ChatSendInput } from "./ChatSendInput";
import { ChatMessage } from "./ChatMessage";
import CloseIcon from "@mui/icons-material/Close";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { useSession , useOutsideClick } from "@hooks";
import { IChatMessage } from "@services/chatApi";
import { IParentApi } from "@root/shared/types/Tree";
import { IAcquaintedRequest } from "@services/lettersApiV3";
import { getParamFromUrl } from "@utils";
import { UploadFileLetters } from "@services/internal/incomingApi";
import { useFetchDownloadFilesMutation } from "@services/fileApi";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";

interface IChatForm {
  mainFiles?: UploadFileLetters[];
  messages: IChatMessage[];
  msgsLoading: boolean;
  resFiles?: string[];
  canSendMessage?: boolean;
  onSendMessage: (parentId: number, text: string, files: string[]) => void;
  onEditMessage: (id: number, text: string, files: string[]) => void;
  onCloseDiscution: () => void;
  onCloseModal: () => void;
  getDiscutions: () => void;
  incomingId: number;
  executorId: number;
  tree?: IParentApi | null;
  acquainted: (payload: IAcquaintedRequest) => void;
  messageEndRef: any;
}

export const ChatForm: FC<IChatForm> = ({
  mainFiles,
  messages = [],
  msgsLoading,
  resFiles,
  canSendMessage,
  onSendMessage,
  onEditMessage,
  onCloseDiscution,
  onCloseModal,
  getDiscutions,
  incomingId,
  executorId,
  tree,
  acquainted,
  messageEndRef,
}) => {
  const [downloadMediaMain] = useFetchDownloadFilesMutation();
  const { data: details } = useFetchUserDetailsQuery();
  const { data: session } = useSession();
  const docType = 21;
  const [replyEdit, setReplyEdit] = useState<{ [key: string]: IChatMessage }>(
    {}
  );
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
    return details?.id && item.user?.id == details?.id;
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

  const downloadFileMain = (res: any) => {
    const { file64, fileName } = res.data || {};
    const a = document.createElement("a");
    a.href = `data:application/pdf;base64,${file64}`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const setDownloadFileMain = async (fileName: string) => {
    if (fileName === "") return;
    await downloadMediaMain({ data: { fileName, type: docType } }).then(
      (res) => {
        downloadFileMain(res);
      }
    );
  };

  const title = (
    <DialogTitle
      className="tw-bg-primary"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "relative",
        color: "#fff",
      }}
      textAlign={"center"}
      fontSize={25}
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
            {mainFiles &&
              mainFiles.map((file, idx) => (
                <span
                  key={idx}
                  className="tw-text-black tw-text-xs tw-text-left tw-whitespace-nowrap tw-cursor-pointer hover:tw-text-secondary hover:tw-underline tw-truncate"
                  onClick={(e) => setDownloadFileMain(file.url)}
                >
                  <TextSnippetIcon fontSize="small" />
                  <i className="tw-text-[9px]">{file.url}</i>
                </span>
              ))}
          </Box>
        )}
      </div>
      <Typography variant="h6" color="#fff" textAlign="center">
        Обсуждение
      </Typography>
      <CloseIcon
        onClick={onCloseModal}
        sx={{
          color: "#fff",
          cursor: "pointer",
        }}
        fontSize="medium"
      />
    </DialogTitle>
  );

  const messagesContent = (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        paddingY: 1,
      }}
    >
      {msgsLoading && "Загрузка сообщений..."}
      {msgs.map((item, idx) => (
        <ChatMessage
          changeReplyEdit={changeReplyEdit}
          onCloseDiscution={onCloseDiscution}
          messages={item}
          key={idx}
          messageEndRef={messageEndRef}
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
      }}
      className="tw-flex tw-flex-col tw-justify-between"
    >
      <div className="">{title}</div>
      <div className="tw-overflow-y-auto tw-flex-grow tw-my-1 tw-h-full">
        {messagesContent}
      </div>
      <div className="tw-relative">
        <ChatSendInput
          disabled={!canSendMessage}
          onSendMessage={onSendMessage}
          onEditMessage={onEditMessage}
          incomingId={incomingId}
          executorId={executorId}
          tree={tree}
          acquainted={acquainted}
          replyEdit={replyEdit}
          changeReplyEdit={changeReplyEdit}
          files={files}
          setFiles={setFiles}
          removeFile={removeFile}
          closeReplyEdit={closeReplyEdit}
        />
      </div>
    </Box>
  );
};
