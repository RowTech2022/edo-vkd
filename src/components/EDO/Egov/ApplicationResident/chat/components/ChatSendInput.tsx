import { Box, Button, IconButton, TextField } from "@mui/material";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IUser, useGetAvailableUserMutation } from "@services/userprofileApi";
import { useDebounce } from "@hooks";
import { IChatMessage } from "@services/chatApi";
import fileService from "@services/fileService";
import { IFileResponce } from "@services/fileApi";
import { getParamFromUrl } from "@utils";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

interface IChatSendInput {
  onSendMessage: (parentId: number, text: string, files: string[]) => void;
  onEditMessage?: (id: number, text: string, files: string[]) => void;
  disabled?: boolean;
  replyEdit: { [key: string]: IChatMessage };
  checkPaymentVisible?: boolean;
  changeReplyEdit: (key: string, value: IChatMessage) => void;
  files: string[];
  setFiles: (value: string[]) => void;
  removeFile: (value: string) => void;
  closeReplyEdit: () => void;
  openCheckPaymentForm: () => void;
}

const map: Record<string, IUser> = {};
export const ChatSendInput: FC<IChatSendInput> = (props) => {
  const {
    onSendMessage,
    onEditMessage,
    disabled,
    replyEdit,
    changeReplyEdit,
    files,
    checkPaymentVisible,
    setFiles,
    removeFile,
    closeReplyEdit,
    openCheckPaymentForm,
  } = props;
  const [text, setText] = useState("");

  const inputRef: RefObject<HTMLDivElement> = useRef(null);

  const [replaceStart, setReplaceStart] = useState(-1);

  const [users, setUsers] = useState<IUser[]>([]);
  const [showHinter, setShowHinter] = useState(false);

  const [getAvailableUsers] = useGetAvailableUserMutation();

  const handleSendMessage = (parentId: number) => {
    const newText = text?.replaceAll(/@[0-9a-zA-z.@]{1,}/g, (match, p) => {
      const login = match.slice(1);
      if (map[login]) {
        const user = map[login];
        return `@{id: "${user.id}", value: "${user.value}"}`;
      }
      return match;
    });
    onSendMessage(parentId, newText, files);
    setText("");
    closeReplyEdit();
  };

  const handleEditMessage = (id: number) => {
    if (!onEditMessage) return;
    const newText = text.replaceAll(/@[0-9a-zA-z.@]{1,}/g, (match, p) => {
      const login = match.slice(1);
      if (map[login]) {
        const user = map[login];
        return `@{id: "${user.id}", value: "${user.value}"}`;
      }
      return match;
    });
    onEditMessage(id, newText, files);
    setText("");
    closeReplyEdit();
  };

  const getStart = (str: string, from: number) => {
    while (from >= 0) {
      if (str[from] === "@") {
        return from === 0 || str[from - 1] === " " ? from : -1;
      }
      from--;
    }
    return -1;
  };

  const handleMessage = useDebounce((value: string, selectionStart: number) => {
    const start = getStart(value, selectionStart);
    setReplaceStart(start);
    if (start !== -1 && value[selectionStart] !== " ") {
      const last: number = value.indexOf(" ", start);
      getAvailableUsers(value.slice(start + 1, last || value.length)).then(
        (res: any) => {
          if (res.error) return;
          setUsers(res.data.items || []);
          setShowHinter(true);
        }
      );
    }
  }, 400);

  const onInputMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    const start = e.target.selectionStart;
    setText(value);

    if (start && value[start]?.charCodeAt(0) !== 160) {
      handleMessage(value, start);
    } else {
      setShowHinter(false);
      setReplaceStart(-1);
    }
  };

  const onChangeEditMsg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    const start = e.target.selectionStart;
    setText(value);
    let newMessage = { ...replyEdit.edit, text: value };
    changeReplyEdit("edit", newMessage);
    if (start && value[start]?.charCodeAt(0) !== 160) {
      handleMessage(value, start);
    } else {
      setShowHinter(false);
      setReplaceStart(-1);
    }
  };

  const onSelectUser = (user: IUser) => {
    if (replaceStart !== -1) {
      const last = text.indexOf(" ", replaceStart + 1);
      map[user.login as string] = user;
      const raw =
        text.slice(0, replaceStart) +
        `@${user.login}` +
        (last !== -1 ? text.slice(last) + " " : " ");

      setText(raw);
      setShowHinter(false);
      inputRef.current?.focus();
    }
  };

  const handleUploadFile = async (idx: number, event: HTMLInputElement) => {
    const filesFormats = [".doc", ".docx", ".xlsx", ".pdf"];
    const file = event.files;

    if (!file) {
      return;
    }
    function ext(name: any) {
      return name.match(/\.([^.]+)$|$/)[1];
    }

    const isRightFormat = filesFormats.includes("." + ext(file[0].name));
    if (!isRightFormat) {
      toast("You can only upload pdf, xlsx and doc files");
      return;
    }

    const formData = new FormData();
    formData.append(idx.toString(), file[0]);

    await fileService.uploadFileV2(formData).then((e) => {
      let resp = e as { data: IFileResponce };
      setFiles([...files, resp.data.url]);
    });
  };

  useEffect(() => {
    let text = replyEdit?.edit?.text;
    if (text) setText(text);
  }, [replyEdit]);

  const fileLinksCls =
    "tw-flex tw-items-center tw-text-cyan-700 hover:tw-text-cyan-800";

  const renderHints = () => {
    return (
      <Box
        sx={{
          padding: 3,
          background: "#fff",
          borderTopLeftRadius: "30px",
          borderTopRightRadius: "30px",
          maxHeight: "140px",
          position: "absolute",
          bottom: "39px",
          left: 15,
          paddingBottom: 2,
          width: "calc(100% - 30px)",
          boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "100px",
          }}
        >
          {users.map((item) => {
            return (
              <h6
                onClick={() => onSelectUser(item)}
                key={item.id}
                className="tw-text-lg tw-py-1 tw-transition-opacity tw-duration-300 hover:tw-opacity-50 tw-cursor-pointer"
              >
                {item.value}
              </h6>
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        paddingX: 2,
        backgroundColor: "#cbebe8",
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
      }}
    >
      <Box
        sx={{
          position: "relative",
          paddingTop: "16px",
          zIndex: 100,
          width: "100%",
          display: "flex",
          alignItems: "end",
        }}
      >
        <Box sx={{ flex: 1, position: "relative" }}>
          {showHinter && Boolean(users.length) && renderHints()}
          {replyEdit?.reply ? (
            <TextField
              disabled={disabled}
              inputRef={inputRef}
              fullWidth
              multiline
              value={text}
              onChange={onInputMessage}
              sx={{
                border: "0",
                padding: "0",
                "& .MuiOutlinedInput-root": {
                  paddingTop: 4,
                  paddingBottom: 1,
                  paddingX: 2,
                  display: "block",
                  overflow: "hidden",
                },

                "& textarea": {
                  color: "#757575",
                },
              }}
              InputProps={{
                startAdornment: (
                  <div className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-grid tw-grid-cols-[22px_1fr] tw-py-1 tw-grid-rows-2 tw-text-[10px] tw-bg-yellow-500/20">
                    <i className="tw-row-span-2 tw-border-r-2 tw-mr-1 tw-border-primary" />
                    <p className="tw-text-secondary tw-font-bold tw-leading-none">
                      {replyEdit?.reply?.user?.value}
                    </p>
                    <p className="tw-text-zinc-500 tw-leading-none tw-truncate">
                      {(replyEdit?.reply?.text).replaceAll(
                        /@\{[0-9,() :a-zA-Zа-яА-ЯҚҲҒӮҶӢқҷӣғӯҳ\\"]{1,}\}/g,
                        (match, p) => {
                          return `${match.slice(
                            match.lastIndexOf(":") + 1,
                            match.length - 1
                          )}`;
                        }
                      )}
                    </p>
                  </div>
                ),
              }}
              placeholder="Type text ..."
            />
          ) : replyEdit.edit ? (
            <TextField
              disabled={disabled}
              inputRef={inputRef}
              fullWidth
              multiline
              value={(replyEdit?.edit?.text)
                .replaceAll(
                  /@\{[0-9,() :a-zA-Zа-яА-ЯҚҲҒӮҶӢқҷӣғӯҳ\\"]{1,}\}/g,
                  (match, p) => {
                    return `@${match.slice(
                      match.lastIndexOf(":") + 2,
                      match.length - 1
                    )}`;
                  }
                )
                .replaceAll('"', "")
                .trimStart()}
              onChange={onChangeEditMsg}
              sx={{
                border: "0",
                padding: "0",
                "& .MuiOutlinedInput-root": {
                  paddingTop: 4,
                  paddingBottom: 1,
                  paddingX: 2,
                  display: "block",
                  overflow: "hidden",
                },

                "& textarea": {
                  color: "#757575",
                },
              }}
              InputProps={{
                startAdornment: (
                  <div className="tw-absolute tw-top-0 tw-left-0 tw-w-full tw-grid tw-grid-cols-[22px_1fr] tw-py-2 tw-text-[10px] tw-bg-yellow-500/20">
                    <i className="tw-border-r-2 tw-mr-1 tw-border-primary" />
                    <p className="tw-text-secondary tw-font-bold tw-leading-none">
                      {"Редактировать"}
                    </p>
                  </div>
                ),
              }}
              placeholder="Type text ..."
            />
          ) : (
            <TextField
              disabled={disabled}
              inputRef={inputRef}
              fullWidth
              multiline
              value={text}
              onChange={onInputMessage}
              sx={{
                border: "0",
                padding: "0",
                "& .MuiOutlinedInput-root": {
                  paddingY: 1,
                  paddingX: 2,
                },

                "& textarea": {
                  color: "#757575",
                },
              }}
              placeholder="Type text ..."
            />
          )}
        </Box>
        <Box
          paddingX={2}
          height={"45px"}
          display={"flex"}
          gap={2}
          alignItems={"center"}
        >
          {Object.keys(replyEdit).length !== 0 && (
            <IconButton
              className="tw-absolute tw-top-1 tw-right-2"
              name="details"
              onClick={() => {
                closeReplyEdit();
                setText("");
              }}
            >
              <CloseIcon
                fontSize="small"
                sx={{
                  color: "#607D88",
                  cursor: "pointer",
                }}
              />
            </IconButton>
          )}
          <label className="tw-cursor-pointer" htmlFor="file-upload">
            <AttachFileIcon color="primary" />
            <input
              className="tw-hidden"
              accept="*"
              id="file-upload"
              type="file"
              onChange={(e) =>
                handleUploadFile(1, e.currentTarget as HTMLInputElement)
              }
            />
          </label>
          <SendIcon
            onClick={() =>
              disabled
                ? undefined
                : replyEdit.edit
                ? handleEditMessage(replyEdit?.edit?.id as number)
                : handleSendMessage(replyEdit?.reply?.id as number)
            }
            sx={{
              color: "#607D88",
              opacity: disabled ? 0.5 : 1,
              cursor: "pointer",
            }}
            fontSize="large"
          />
        </Box>
        {checkPaymentVisible && (
          <Button onClick={openCheckPaymentForm} variant="contained">
            Проверить оплату
          </Button>
        )}
      </Box>
      <Box className="tw-flex tw-gap-3 tw-flex-wrap tw-pb-[16px]">
        {files.map((item) => (
          <div key={item} className="tw-flex">
            <IconButton
              sx={{ padding: 0 }}
              name="Удалить"
              onClick={() => removeFile(item)}
            >
              <HighlightOffIcon fontSize="small" sx={{ color: "red" }} />
            </IconButton>
            <Link to={item} target="_blank" className={fileLinksCls}>
              <TextSnippetIcon fontSize="small" />
              <i className="tw-text-[9px]">
                {getParamFromUrl(item, "fileName")}
              </i>
            </Link>
          </div>
        ))}
      </Box>
    </Box>
  );
};
