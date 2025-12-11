import {
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Modal,
  TextField,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { FC, useEffect, useState, useRef } from "react";
import ShowConclusionFile from "./ShowConclusionFIle";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ShortcutOutlinedIcon from "@mui/icons-material/ShortcutOutlined";
import { SignIncoming } from "./SignIncoming";
import { ReplyUserMessage } from "./ReplyUserMessage";
import MoreVertMessage from "./MoreVertMessage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { normalizeValue, normalizeValue2 } from "./ChatInput";

export interface ChatMessage {
  id: number;
  parentId: number;
  parentName: string;
  parentShortMessage: string;
  files: string[];
  userId: number;
  user: User;
  text: string;
  createAt: Date;
  updateAt: Date;
  date: Date;
  sign64: string;
  showAcceptButton: boolean;
  canEdit: boolean;
  isConclusion: boolean;
  isSendParent: boolean;
}

export interface User {
  id: string;
  value: string;
  avatar: string;
  organistionName: string;
  positionName: string;
}

interface IProps {
  messages: ChatMessage[];
  onReplyClick: (param: { name: string; message: string; id: number }) => void;
  onEditClick: (values: any) => void;
  sendToParentClick: (values: any) => void;
  isSendToParentSuccess: boolean;
  isSendToParentLoading: boolean;
}
export const ChatMessages: FC<IProps> = ({
  messages,
  onReplyClick,
  onEditClick,
  sendToParentClick,
  isSendToParentSuccess,
  isSendToParentLoading,
}) => {
  const { data: userDetails } = useFetchUserDetailsQuery();
  const [currentId, setCurrentId] = useState(null);
  const [showMoreVert, setShowMoreVert] = useState(null);
  const [sendToParentModal, setSendToParentModal] = useState({
    visible: false,
    inputValue: "",
    id: null,
  });
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleToggleModal = (state: boolean) => {
    setSendToParentModal((prev) => ({ ...prev, visible: state }));
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [files, setFiles] = useState([]);

  const showToastMessage = () => {
    toast.success("Успешно скопировано!", {
      position: "top-right",
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Ошибка при копировании текста: ", err);
    }
  };

  useEffect(() => {
    if (isSendToParentSuccess) {
      toast.success("Успешно отправлено!", {
        position: "top-right",
      });
      setSendToParentModal({
        id: null,
        inputValue: "",
        visible: false,
      });
    }
  }, [isSendToParentSuccess]);
  return (
    <>
      <div className="tw-flex tw-flex-col tw-divide-y tw-gap-4 tw-w-full">
        {messages?.map((item, i, arr) => {
          const parentMessage = arr.find((el: any) => el.id === item?.parentId);
          return (
            <div
              key={`message-${i + 1}`}
              className="tw-w-full tw-py-2 tw-transition-all tw-ease-linear tw-duration-100"
              ref={(el) => {
                if (el) {
                  messageRefs.current[item.id] = el;
                }
              }}
            >
              <div
                className={`tw-flex tw-flex-col tw-gap-4 tw-w-[50%] ${
                  userDetails?.id === Number(item?.user?.id)
                    ? "tw-ml-auto tw-items-end"
                    : "tw-mr-auto tw-items-start"
                }`}
              >
                <p className="tw-text-[14px] tw-text-slate-600 tw-text-[400] tw-mb-1.5">
                  {dayjs(item?.createAt).format("DD-MM-YYYY HH:mm")}
                </p>
                {item?.parentId ? (
                  <ReplyUserMessage
                    item={{
                      name: parentMessage?.user?.value,
                      text: parentMessage?.text,
                    }}
                    onClick={() => {
                      const refEl = messageRefs.current[parentMessage?.id];
                      if (refEl) {
                        refEl.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                        });

                        setTimeout(() => {
                          refEl.style.backgroundColor = "#e6f3ff";

                          setTimeout(() => {
                            refEl.style.backgroundColor = "";
                          }, 2500);
                        }, 200);
                      }
                    }}
                  />
                ) : (
                  <></>
                )}
                <div
                  className={`tw-w-full tw-flex tw-gap-3 ${
                    userDetails?.id === Number(item?.user?.id)
                      ? "tw-justify-end"
                      : "tw-justify-start"
                  }`}
                  key={item.id}
                >
                  <div className="tw-py-2">
                    <Avatar src={item.user.avatar} />
                  </div>
                  <div>
                    <p className="tw-text-lg tw-font-medium">
                      {item.user.value}
                    </p>
                    <p
                      className="tw-break-all"
                      dangerouslySetInnerHTML={{
                        __html: normalizeValue2(item.text),
                      }}
                    />
                  </div>

                  {userDetails?.id === Number(item?.user?.id) &&
                  !item?.isConclusion ? (
                    <div className="panel-control tw-relative">
                      <IconButton
                        onClick={() => {
                          if (!showMoreVert) {
                            setShowMoreVert(item.id);
                          } else {
                            setShowMoreVert(null);
                          }
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      {showMoreVert === item.id ? (
                        <MoreVertMessage
                          editClick={() => {
                            if (item?.canEdit === false) {
                              toast.warning("Изменение недоступно!", {
                                position: "top-right",
                              });

                              return;
                            }

                            onEditClick(item);
                            setShowMoreVert(null);
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                {item?.sign64 && currentId === item.id ? (
                  <SignIncoming sign={{ sign: item?.sign64 }} />
                ) : (
                  <></>
                )}
                {item?.isConclusion ? (
                  <>
                    <p>Заключение</p>

                    <div className="wrapper-panel tw-ml-[40px] tw-flex tw-gap-5 tw-items-center">
                      <Button
                        onClick={() => {
                          setFiles(item?.files);
                          setModalVisible(true);
                        }}
                        sx={{
                          display: "flex",
                          gap: "5px",
                          textTransform: "none",
                        }}
                      >
                        <p>Посмотреть</p>
                      </Button>
                      <Button
                        disabled={item?.isSendParent}
                        onClick={() => {
                          handleToggleModal(true);
                          setSendToParentModal((prev) => ({
                            ...prev,
                            id: item?.id,
                          }));
                        }}
                        sx={{
                          display: "flex",
                          gap: "5px",
                          textTransform: "none",
                        }}
                      >
                        <p>Отправить</p>
                      </Button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div className="wrapper-panel tw-flex tw-gap-5 tw-items-center">
                  <IconButton
                    sx={{ padding: "0" }}
                    onClick={() => {
                      showToastMessage();
                      copyToClipboard(item.text ?? "");
                    }}
                  >
                    <Tooltip title="Скопировать">
                      <ContentCopyIcon fontSize="small" />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      if (!currentId) {
                        setCurrentId(item.id);
                      } else {
                        setCurrentId(null);
                      }
                    }}
                    sx={{ padding: "0" }}
                  >
                    <CheckCircleOutlineOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    sx={{ padding: "0" }}
                    onClick={() =>
                      onReplyClick({
                        name: item?.user?.value,
                        message: item?.text,
                        id: item?.id,
                      })
                    }
                  >
                    <Tooltip title="Ответить">
                      <ShortcutOutlinedIcon
                        fontSize="small"
                        className="tw-transform tw-rotate-180"
                      />
                    </Tooltip>
                  </IconButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={sendToParentModal.visible}
        onClose={() => handleToggleModal(false)}
      >
        <div className="tw-w-[30%] tw-mx-auto tw-mt-[20%] tw-p-8 tw-bg-slate-100 tw-flex tw-flex-col tw-space-y-5 tw-items-center tw-rounded-2xl">
          <TextField
            size="small"
            fullWidth
            name="description"
            label="Комментария"
            value={sendToParentModal.inputValue}
            onChange={(e) => {
              setSendToParentModal((prev) => ({
                ...prev,
                inputValue: e.target.value,
              }));
            }}
          />

          <Button
            onClick={() => {
              sendToParentClick({
                messageId: sendToParentModal?.id,
                description: sendToParentModal?.inputValue,
              });
            }}
            sx={{ minWidth: 136 }}
            variant="contained"
            type="button"
          >
            {isSendToParentLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Отправить"
            )}
          </Button>
        </div>
      </Modal>

      <ShowConclusionFile
        files={files}
        visible={modalVisible}
        setVisible={(state: boolean) => setModalVisible(state)}
      />
    </>
  );
};
