import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IUser, useGetAvailableUserMutation } from "@services/userprofileApi";
import { useDebounce, useOutsideClick } from "@hooks";
import { IParentApi } from "@root/shared/types/Tree";
import { IAcquaintedRequest } from "@services/lettersApiV3";
import { IChatMessage2 } from "@services/chatApi";
import fileService from "@services/fileService";
import { CustomButton } from "@ui";
import { IFileResponce } from "@services/fileApi";
import { getParamFromUrl } from "@utils";
import { toast } from "react-toastify";
import { IUserWithAvatar } from "@services/api";
import { Link } from "react-router-dom";

interface IChatSendInput {
  onSendMessage: (parentId: number, text: string, files: string[]) => void;
  onEditMessage: (id: number, text: string, files: string[]) => void;
  msgAuthors: IUserWithAvatar[];
  disabled?: boolean;
  tree?: IParentApi | null;
  acquainted: (payload: IAcquaintedRequest) => void;
  replyEdit: { [key: string]: IChatMessage2 };
  changeReplyEdit: (key: string, value: IChatMessage2) => void;
  files: string[];
  setFiles: (value: string[]) => void;
  removeFile: (value: string) => void;
  closeReplyEdit: () => void;
  isMsgLoading?: boolean;
}

const map: Record<string, IUser> = {};
export const ChatSendInput: FC<IChatSendInput> = (props) => {
  const {
    onSendMessage,
    onEditMessage,
    msgAuthors,
    disabled,
    acquainted,
    replyEdit,
    changeReplyEdit,
    files,
    setFiles,
    removeFile,
    closeReplyEdit,
    isMsgLoading,
  } = props;
  const [text, setText] = useState(props.tree?.answerComment || "");
  const userPopupRef = useOutsideClick(() => {
    setShowHinter(false);
  });
  const inputRef: RefObject<HTMLDivElement> = useRef(null);

  const [replaceStart, setReplaceStart] = useState(-1);

  const [users, setUsers] = useState<IUser[]>([]);
  const [fileLoading, setFileLoading] = useState(false);
  const [showHinter, setShowHinter] = useState(false);
  const [msgAuthor, setMsgAuthor] = useState<IUserWithAvatar>({
    id: "",
    value: "",
    avatar: "",
  });

  useEffect(() => {
    if (replyEdit.reply && msgAuthors)
      msgAuthors.map((item) => {
        if (+item.id === replyEdit.reply.userId) setMsgAuthor(item);
      });
  }, [replyEdit.reply, msgAuthors]);

  const [getAvailableUsers] = useGetAvailableUserMutation();

  const handleSendMessage = (parentId: number) => {
    const newText = text.replaceAll(/@[0-9a-zA-z.@]{1,}/g, (match, p) => {
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
        return from === 0 ||
          str[from - 1] === " " ||
          str[from - 1] === "\n" ||
          str[from - 1] === "\t"
          ? from
          : -1;
      }
      from--;
    }
    return -1;
  };

  const handleMessage = useDebounce((value: string, selectionStart: number) => {
    const start = getStart(value, selectionStart);
    setReplaceStart(start);
    if (start !== -1 && value[selectionStart] !== " " && value.at(-1) === "@") {
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
    const filesFormats = [".doc", ".docx", ".xls", ".xlsx", ".pdf"];
    const file = event.files;

    if (!file || file.length === 0) {
      return;
    }
    setFileLoading(true);
    function ext(name: any) {
      return name.match(/\.([^.]+)$|$/)[1];
    }

    const isRightFormat = filesFormats.includes("." + ext(file[0]?.name));
    if (!isRightFormat) {
      toast(
        "Вы можете загрузить только документы в формате .pdf, .xls, .xlsx, .doc или .docx",
        {
          type: "error",
          position: "top-right",
        }
      );
      setFileLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append(idx.toString(), file[0]);

    await fileService
      .uploadFileV2(formData)
      .then((e) => {
        let resp = e as { data: IFileResponce };
        // console.log(getParamFromUrl(resp.data.url, 'fileName'))
        setFiles([...files, resp.data.url]);
      })
      .finally(() => setFileLoading(false));
  };

  useEffect(() => {
    let text = replyEdit?.edit?.text;
    if (text) {
      const newText = text
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
        .trimStart();
      setText(newText);
    }
  }, [replyEdit]);

  const tabSpace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;

    if (e.key === "Tab") {
      e.preventDefault();

      const cursorPosition = (e.target as HTMLInputElement).selectionStart ?? 0;
      const cursorEndPosition =
        (e.target as HTMLInputElement).selectionEnd ?? 0;
      const tab = "\t";

      (e.target as HTMLInputElement).value =
        value.substring(0, cursorPosition) +
        tab +
        value.substring(cursorEndPosition);

      // if you modify the value programmatically, the cursor is moved
      // to the end of the value, we need to reset it to the correct
      // position again
      (e.target as HTMLInputElement).selectionStart = cursorPosition + 1;
      (e.target as HTMLInputElement).selectionEnd = cursorPosition + 1;
    }
  };

  const fileLinksCls =
    "tw-flex tw-items-center  tw-text-slate-200 hover: tw-text-slate-300";

  const renderHints = () => {
    return (
      <Box
        ref={userPopupRef}
        sx={{
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
          maxHeight: "400px",
          position: "absolute",
          bottom: "calc(100% - 16px)",
          left: 20,
          width: "fit-content",
          maxWidth: "calc(100% - 20px)",
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "300px",
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
        paddingX: 2,
        backgroundColor: "#607D8B",
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 0px 2px 2px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
      }}
    >
      {showHinter && Boolean(users.length) && renderHints()}
      <Box
        sx={{
          position: "relative",
          paddingTop: "16px",
          zIndex: 100,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ flex: 1, position: "relative" }}>
          {replyEdit?.reply ? (
            <TextField
              disabled={disabled}
              inputRef={inputRef}
              fullWidth
              multiline
              value={text}
              onKeyDown={tabSpace}
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
                      {msgAuthor.value}
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
              value={text}
              onKeyDown={tabSpace}
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
              onKeyDown={tabSpace}
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
              // onKeyDown={(e) =>
              //   e.key === 'Enter'
              //     ? (e.preventDefault(),
              //       !text && !files?.length
              //         ? undefined
              //         : replyEdit.edit
              //         ? handleEditMessage(replyEdit?.edit?.id as number)
              //         : handleSendMessage(replyEdit?.reply?.id as number))
              //     : ''
              // }
              placeholder="Type text ..."
            />
          )}
        </Box>
        <Box
          paddingX={2}
          height={"100%"}
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
                  color: "#fff",
                  cursor: "pointer",
                }}
              />
            </IconButton>
          )}
          {/* <Button
            disabled={!props.tree?.canAcquainted}
            variant="outlined"
            onClick={onAcquainted}
          >
            Подписать
          </Button> */}
          <label
            className="tw-cursor-pointer tw-flex tw-items-center"
            htmlFor="file-upload"
          >
            {!fileLoading ? (
              <AttachFileIcon className="tw-text-white" />
            ) : (
              <CircularProgress size={25} className="tw-text-white" />
            )}
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
          <CustomButton
            sx={{
              fontWeight: 400,
              minWidth: "fit-content",
              "& .MuiButton-startIcon": {
                margin: 0,
              },
            }}
            // withRuToken
            disabled={disabled}
            startIcon={
              !isMsgLoading ? (
                <SendIcon
                  sx={{
                    "&.MuiSvgIcon-root": {
                      fontSize: "30px !important",
                    },
                    color: "#fff",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <CircularProgress size={30} className="tw-text-white" />
              )
            }
            onClick={() => {
              !text && !files?.length
                ? undefined
                : replyEdit.edit
                ? handleEditMessage(replyEdit?.edit?.id as number)
                : handleSendMessage(replyEdit?.reply?.id as number);
            }}
          ></CustomButton>
        </Box>
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
