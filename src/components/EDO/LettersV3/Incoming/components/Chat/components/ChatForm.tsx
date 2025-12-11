import { Box, CircularProgress, DialogTitle, Typography } from "@mui/material";
import { FC, useState, useMemo, useEffect } from "react";
import { ChatSendInput } from "./ChatSendInput";
import { ChatMessage } from "./ChatMessage";
import CloseIcon from "@mui/icons-material/Close";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import PersonIcon from "@mui/icons-material/Person";
import { useSession , useOutsideClick } from "@hooks";
import { IChatMessage2, IChatMessages2 } from "@services/chatApi";
import { IParentApi } from "@root/shared/types/Tree";
import { IAcquaintedRequest } from "@services/lettersApiV3";
import { getParamFromUrl , newDateFormat } from "@utils";
import { UploadFileLetters } from "@services/internal/incomingApi";
import { useFetchDownloadFilesMutation } from "@services/fileApi";
import { IUserWithAvatar } from "@services/api";
import { format, getDate, getMonth, getYear } from "date-fns";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";

interface IChatForm {
  subject?: string | null;
  mainFiles?: UploadFileLetters[];
  messages: IChatMessages2[];
  users: IUserWithAvatar[];
  msgsLoading: boolean;
  resFiles?: string[];
  canSendMessage?: boolean;
  onSendMessage: (parentId: number, text: string, files: string[]) => void;
  onEditMessage: (id: number, text: string, files: string[]) => void;
  onCloseDiscution: () => void;
  onCloseModal: () => void;
  getDiscutions: () => void;
  discutionId?: number | null;
  incomingId: number;
  executorId: number;
  tree?: IParentApi | null;
  acquainted: (payload: IAcquaintedRequest) => void;
  messageEndRef: any;
}

export const ChatForm: FC<IChatForm> = ({
  subject,
  mainFiles,
  messages = [],
  users = [],
  msgsLoading,
  resFiles,
  canSendMessage,
  onSendMessage,
  onEditMessage,
  onCloseDiscution,
  onCloseModal,
  getDiscutions,
  discutionId,
  tree,
  acquainted,
  messageEndRef,
}) => {
  const [downloadMediaMain] = useFetchDownloadFilesMutation();
  const { data: session } = useSession();
  const { data: details } = useFetchUserDetailsQuery();
  const docType = 21;
  const [replyEdit, setReplyEdit] = useState<{ [key: string]: IChatMessage2 }>(
    {}
  );
  const [showUsers, setShowUsers] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [showFiles, setShowFiles] = useState(false);
  const userRef = useOutsideClick(() => {
    setShowUsers(false);
  });

  const getGroupedByUser = (item: IChatMessages2) => {
    const { messages } = item;
    const grouped: IChatMessage2[][] = [];
    let prevUser: any = -1;
    messages?.forEach((item) => {
      if (prevUser === item.userId) {
        grouped[grouped.length - 1].push(item);
      } else {
        grouped.push([item]);
      }
      prevUser = item.userId || -1;
    });
    return { ...item, messages: grouped };
  };

  const msgs = useMemo(() => {
    if (!messages) return [];
    return messages?.map((item) => getGroupedByUser(item));
  }, [messages]);

  const isMe = (item: IChatMessage2) => {
    return details?.id && item.userId == details?.id;
  };

  useEffect(() => {
    let files = Object.values(replyEdit)[0]?.files;
    if (files) setFiles(files);
  }, [replyEdit]);

  const changeReplyEdit = (key: string, item: IChatMessage2) => {
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

  const openUsersPopup = () => {
    setShowUsers(!showUsers);
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

  const isToday = (date: any) => {
    let msgDate = getDate(new Date(date));
    const now = new Date();

    if (
      getMonth(new Date(date)) === getMonth(now) &&
      getYear(new Date(date)) === getYear(now)
    ) {
      if (msgDate === now.getDate()) {
        return "today";
      } else if (msgDate === now.getDate() - 1) {
        return "yesterday";
      } else {
        return;
      }
    }
    return;
  };

  const scrollToEnd = (messageEndRef: any) => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollToEnd(messageEndRef);
  }, [messages]);

  const btnCls =
    "tw-text-sm tw-py-[4px] tw-px-[9px] tw-rounded-3xl tw-border-[1px] tw-border-transparent hover:tw-border-white tw-transition-colors tw-duration-300 tw-cursor-pointer tw-uppercase";

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
      <div className="tw-relative tw-flex tw-items-center tw-gap-1">
        <span ref={userRef} className={btnCls} onClick={() => openUsersPopup()}>
          Участники
          {showUsers && users?.length !== 0 && (
            <Box
              className="mf_custom_popup"
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
              {users &&
                users.map((user, idx) => (
                  <span
                    key={idx}
                    className="tw-text-black tw-text-xs tw-text-left tw-whitespace-nowrap tw-cursor-pointer hover:tw-text-secondary hover:tw-underline tw-truncate"
                  >
                    <PersonIcon fontSize="small" />
                    <i className="tw-text-[9px]">{user.value}</i>
                  </span>
                ))}
            </Box>
          )}
        </span>
        <span ref={userRef} className={btnCls} onClick={() => openFilesPopup()}>
          Все файлы
          {showFiles && (resFiles?.length !== 0 || mainFiles?.length !== 0) && (
            <Box
              className="mf_custom_popup"
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
        </span>
        <span ref={userRef} className={btnCls} onClick={() => getDiscutions()}>
          Обновить
        </span>
        <span className="tw-text-sm tw-ml-2">
          Тема: {subject || "неизвестно"}
        </span>
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
      {msgsLoading && (
        <div className="tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center">
          <CircularProgress size={25} color="secondary" />
          <p>Загрузка сообщений...</p>
        </div>
      )}
      {msgs.map((item, idx) => (
        <div key={idx}>
          {item.date && (
            <p className="tw-text-xs tw-text-center tw-mx-auto tw-w-fit tw-text-white tw-bg-secondary/70 tw-px-4 tw-py-1 tw-rounded-2xl tw-mb-2">
              {isToday(item.date) === "today"
                ? "Сегодня"
                : isToday(item.date) === "yesterday"
                ? "Вчера"
                : format(new Date(item.date), newDateFormat)}
            </p>
          )}
          {item.messages &&
            item.messages.map((msg, idx) => (
              <ChatMessage
                discutionId={discutionId}
                changeReplyEdit={changeReplyEdit}
                onCloseDiscution={onCloseDiscution}
                messages={msg}
                users={users}
                key={idx}
                messageEndRef={messageEndRef}
                type={isMe(msg[0]) ? "right" : "left"}
              />
            ))}
        </div>
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
          msgAuthors={users}
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
