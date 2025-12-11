import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  MenuItem,
  TextField,
  Dialog,
  Autocomplete,
  Modal,
  CircularProgress,
  Tooltip,
  Avatar,
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";

import headerTitle1 from "@root/assets/headerTitle1.jpg";
import headerTitle2 from "@root/assets/headerTitle2.jpg";
import headerTitle3 from "@root/assets/headerTitle3.jpg";
import AddMemberToConclusionModal from "./components/AddMemberToConclusionModal";
import OwnEditor from "./OwnEditor";
import {
  useDeleteAnswerMemberIncomingV4Mutation,
  useDoneLetterV4Mutation,
  useFetchLetterApproveListV4Query,
  useOrganisationMyBlanksMutation,
  useRejectAnswerIncomingV4Mutation,
  useRejectAnswerOutcomingV4Mutation,
  useSendToApproveLetterV4Mutation,
} from "@services/lettersApiV4";
import DocumentPdf from "./components/DocumentPdf";
import { SignIncoming } from "./components/SignIncoming";
import { toast } from "react-toastify";
import { RejectModal } from "./components/RejectModal";
import ClearIcon from "@mui/icons-material/Clear";
import { SendTopApproveOrDoneModal } from "./components/SendToApproveModal";

const headerTitleHash = {
  1: headerTitle1,
  2: headerTitle2,
  3: headerTitle3,
};

function AnswerLetterV4({
  modalState,
  setModalState,
  handleSubmit,
  pdfResponse,
  loading,
  initialValues,
  signAnswerLetter,
  isSignAnswerLoading,
  typeIdKey,
  mainDTO,
  itIsOutcomming,
  refetchData,
  isOutcoming,
}: {
  modalState: boolean;
  setModalState: (state: boolean) => void;
  handleSubmit: (param: any) => void;
  pdfResponse: string | null;
  loading: boolean;
  initialValues: any;
  signAnswerLetter: any;
  isSignAnswerLoading: boolean;
  typeIdKey: string;
  itIsOutcomming: boolean;
  mainDTO?: any;
  refetchData: () => void;
  isOutcoming?: boolean;
}) {
  const signersList = useFetchLetterApproveListV4Query();
  const [organisationMyBlanks] = useOrganisationMyBlanksMutation();

  const [blankList, setBlankList] = useState([]);
  const [selectedBlank, setSelectedBlank] = useState(null);
  const [selectSearchValue, setSelectSearchValue] = useState("");
  const [selectSigner, setSelectSigner] = useState(null);
  const [selectedHeaderTitle, setSelectedHeaderTitle] = useState(null);
  const [usersModal, setUsersModal] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showContent, setShowContent] = useState(null);

  const [signAnswerModal, setSignAnswerModal] = useState(false);
  const [signAnswerComment, setSignAnswerComment] = useState("");

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [sendToApproveOpen, setSendToApproveOpen] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);

  const [showMember, setShowMember] = useState<null | number>(null);
  const [showSign, setShowSign] = useState(null);

  const [showCommentEds, setShowCommentEds] = useState(false);

  const [rejectLetter] = useRejectAnswerIncomingV4Mutation();
  const [rejectLetterOutcoming] = useRejectAnswerOutcomingV4Mutation();

  const [sendToApprove] = useSendToApproveLetterV4Mutation();
  const [doneLetter] = useDoneLetterV4Mutation();

  const [deleteMember] = useDeleteAnswerMemberIncomingV4Mutation();

  const handleRejectForm = async (values: any) => {
    const requestReject = isOutcoming ? rejectLetterOutcoming : rejectLetter;
    await requestReject(values).then(() => {
      refetchData();
      setRejectModalOpen(false);
    });
  };

  const handleSendToApprove = async (values: any) => {
    await sendToApprove(values).then(() => {
      refetchData();
      setSendToApproveOpen(false);
    });
  };

  const handleDoneLetter = async (values: any) => {
    await doneLetter(values).then(() => {
      refetchData();
      setDoneOpen(false);
    });
  };

  const organisationBlank = async () => {
    try {
      const res = await organisationMyBlanks({});
      //@ts-ignore
      setBlankList(res.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  const answerClick = () => {
    if (showContent) {
      setShowContent(null);
    } else {
      if (selectSigner && editorValue.length && selectedBlank) {
        handleSubmit({
          executorIds: selectedUsers?.map((el) => el.id),
          signerId: +selectSigner?.id,
          language: 1,
          content: editorValue,
          blankId: Number(selectedBlank),
        });
        refetchData();
      } else {
        toast.warning("Заполните все данные");
      }
      return;
    }
  };

  const signAnswerClick = () => {
    setSignAnswerModal(true);
    refetchData();
  };

  const handlePutShowInfoBlockOfConclusionEds = (clickedItem: number) => {
    if (showMember === null) {
      setShowMember(clickedItem);
    } else {
      setShowMember(null);
    }
  };

  const handleShowCommentEds = () => {
    setShowCommentEds(!showCommentEds);
  };

  const handleSignerSelect = (event, newValue) => {
    setSelectSigner(newValue);
  };

  const handleAddUser = (param) => {
    setSelectedUsers((prev) => {
      const existingIds = new Set(prev.map((user) => user.id));
      const newUsers = param.filter((user) => !existingIds.has(user.id));
      return [...prev, ...newUsers];
    });
    setUsersModal(false);
  };

  const handleDeleteMember = (user: any) => () => {
    const promise = deleteMember({
      userId: user.id,
      incomingId: mainDTO?.id,
    }).then((res: any) => {
      if (res.error) return;
      setSelectedUsers(selectedUsers.filter((item) => item !== user));
      toast.success("Успешно удалено");
    });

    toast.promise(promise, {
      pending: "Участник удаляется",
      error: "Произошла ошибка",
    });
  };

  useEffect(() => {
    organisationBlank();
  }, []);

  useEffect(() => {
    if (modalState) {
      setShowContent(pdfResponse);
    }
  }, [modalState, pdfResponse]);

  useEffect(() => {
    if (initialValues) {
      if (initialValues?.signer?.userId) {
        setSelectSigner({
          id: initialValues?.signer?.userId,
          value: initialValues?.signer?.userName,
        });
      }

      if (initialValues?.blank) {
        setSelectedBlank(initialValues.blank.id);
      }
      if (initialValues?.language) {
        setSelectedHeaderTitle(initialValues?.language);
      }

      setSelectedUsers(
        initialValues?.executors?.map((el) => ({
          id: el?.userId,
          value: el?.userName,
          signInfo: el?.signInfo,
          signedAt: el?.signedAt,
          comment: el?.comment,
          userImage: el?.userImage,
        }))
      );
      setEditorValue(initialValues?.content);
    }
  }, [initialValues]);

  return (
    <Dialog
      sx={{
        "& .MuiPaper-root": { height: "100vh" },
        // position: "relative",
        overflow: "hidden",
      }}
      fullWidth={true}
      maxWidth="lg"
      open={Boolean(modalState)}
      onClose={() => setModalState(false)}
    >
      <main className="tw-flex tw-w-[95%] tw-mx-auto tw-h-full flex flex-row tw-justify-between tw-items-start tw-space-x-3">
        <div className="tw-w-[26%] tw-flex tw-flex-col tw-space-y-4 tw-h-[90%] tw-overflow-y-auto">
          <TextField
            disabled={
              initialValues?.transition?.buttonSettings?.btn_change?.readOnly
            }
            size="small"
            select
            fullWidth
            label="Бланк"
            value={selectedBlank}
            onChange={(e) => setSelectedBlank(e.target.value)}
            sx={{
              width: "100%",
              marginTop: 3,
              "& .MuiInputBase-root": {
                border: "1px solid #007cd2",
                borderRadius: "10px",
                outline: "none",
              },
            }}
          >
            {blankList.map((item: any) => (
              <MenuItem key={item.id} value={item.id}>
                {item.value}
              </MenuItem>
            ))}
          </TextField>

          <Autocomplete
            disabled={
              initialValues?.transition?.buttonSettings?.btn_change?.readOnly
            }
            options={signersList.data?.items || []}
            getOptionLabel={(option) => option.value} // Что будет отображаться в текстовом поле
            isOptionEqualToValue={(option, value) => option.id === value.id} // Важно для правильного определения выбранного значения
            onChange={handleSignerSelect}
            value={selectSigner} // Контролируемый компонент
            onInputChange={(event, newInputValue) =>
              setSelectSearchValue(newInputValue)
            } // Обновляем searchValue для фильтрации
            renderInput={(params) => (
              <TextField
                {...params}
                label="Подписыващий"
                placeholder="Подписыващий"
                variant="outlined" // Или "standard", "filled"
                fullWidth
                size="small"
                sx={{
                  marginBottom: 2,
                  "& .MuiInputBase-root": {
                    border: "1px solid #007cd2",
                    borderRadius: "10px",
                    outline: "none",
                  },
                }}
              />
            )}
            // Отключить мультивыбор (по умолчанию Autocomplete позволяет выбрать один элемент)
            multiple={false}
          />

          {!initialValues?.transition?.buttonSettings?.btn_change?.hide ||
          initialValues?.finalFormUrl ? (
            <Button
              disabled={
                loading ||
                initialValues?.transition?.buttonSettings?.btn_change?.readOnly
              }
              onClick={answerClick}
              type="button"
              variant="contained"
            >
              {showContent ? "Изменить текст" : "Сохранить текст"}
            </Button>
          ) : (
            <></>
          )}
          {!initialValues?.transition?.buttonSettings?.btn_sign?.hide ? (
            <Button
              onClick={signAnswerClick}
              disabled={
                initialValues?.transition?.buttonSettings?.btn_sign?.readOnly
              }
              type="button"
              variant="contained"
            >
              Подписать
            </Button>
          ) : (
            <></>
          )}
          <Button
            type="button"
            variant="contained"
            onClick={async () => {
              const url = initialValues?.finalFormUrl;

              if (!url) {
                toast.warning("PDF не найден");
                return;
              }

              try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Ошибка загрузки PDF");

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);

                const iframe = document.createElement("iframe");
                iframe.style.display = "none";
                iframe.src = blobUrl;

                document.body.appendChild(iframe);

                iframe.onload = () => {
                  iframe.contentWindow?.focus();
                  iframe.contentWindow?.print();
                  // НЕ удаляем iframe и blobUrl
                };
              } catch (err) {
                console.error(err);
                toast.error("Не удалось распечатать PDF");
              }
            }}
          >
            Печать
          </Button>
          {!initialValues?.transition?.buttonSettings?.btn_reject?.hide ? (
            <Button
              color="error"
              type="button"
              variant="contained"
              onClick={() => setRejectModalOpen(true)}
              disabled={
                initialValues?.transition?.buttonSettings?.btn_reject?.readOnly
              }
            >
              Отвергнуть
            </Button>
          ) : (
            <></>
          )}

          <Button
            disabled={
              initialValues?.transition?.buttonSettings?.btn_add_member
                ?.readOnly
            }
            onClick={() => {
              setUsersModal(true);
            }}
            type="button"
            variant="outlined"
          >
            Добавить участника
          </Button>

          <div className="tw-flex tw-flex-col tw-space-y-2">
            {selectedUsers?.map((e: any) => {
              return (
                <>
                  <div
                    className={`eds-item tw-w-full tw-flex tw-justify-center tw-py-[15px] tw-relative ${
                      !e.comment && e.signedAt
                        ? "tw-bg-[#28ff2880]"
                        : e.comment && e.signedAt
                        ? "tw-bg-[#ffa600ae]"
                        : "tw-bg-transparent"
                    }`}
                  >
                    <Tooltip title={e?.value || ""} placement="top-start">
                      <IconButton
                        onClick={() =>
                          handlePutShowInfoBlockOfConclusionEds(e.id)
                        }
                        className={`${
                          e.signedAt ? "tw-opacity-100" : "tw-opacity-30"
                        }`}
                        key={e.id}
                        sx={{
                          padding: "0px",
                        }}
                      >
                        <Avatar
                          src={e?.userImage}
                          className="tw-border-[2px] tw-border-[#007cd2]"
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      className="tw-absolute tw-top-4 tw-right-3"
                      title="Удалить участника"
                    >
                      <ClearIcon
                        color="error"
                        className="tw-cursor-pointer"
                        onClick={handleDeleteMember(e)}
                      />
                    </Tooltip>
                  </div>
                  {e.id === showMember ? (
                    <div className="tw-bg-[#ffffffbd] tw-flex tw-flex-col tw-gap-1 tw-items-start tw-py-[20px] tw-px-[10px] tw-w-full">
                      <p className="tw-text-[14px] tw-font-[600]">{e.value}</p>
                      <p
                        onClick={() => {
                          if (e.signedAt && !showSign) {
                            setShowSign(e.id);
                          } else {
                            setShowSign(null);
                          }
                        }}
                        className={`text-[14px] tw-cursor-pointer ${
                          e.signedAt ? "tw-text-[#007cd2]" : "tw-text-[red]"
                        }`}
                      >
                        {e.signedAt ? "Подписан" : "Не подписан"}
                      </p>
                      {showSign === e.id ? (
                        <SignIncoming sign={e?.signInfo} />
                      ) : (
                        <></>
                      )}
                      {e.comment && (
                        <Button
                          onClick={() => handleShowCommentEds()}
                          variant="text"
                          sx={{
                            paddingY: "0",
                            paddingX: "5px",
                            paddingLeft: "0",
                            textTransform: "none",
                            fontWeight: "400",
                            display: "flex",
                            gap: "5px",
                          }}
                        >
                          <NotesIcon fontSize="small" />
                          <p>Комментарий</p>
                        </Button>
                      )}
                      {showCommentEds && (
                        <p className="text-[14px]">{e.comment}</p>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
          </div>

          {!initialValues?.transition?.buttonSettings?.btn_sendToApprove
            ?.hide ? (
            <Button
              disabled={
                initialValues?.transition?.buttonSettings?.btn_sendToApprove
                  ?.readOnly
              }
              onClick={() => {
                setSendToApproveOpen(true);
              }}
              type="button"
              variant="contained"
            >
              Отправить на подпись
            </Button>
          ) : (
            <></>
          )}

          <div className="tw-flex tw-flex-1 tw-items-end">
            <Button
              disabled={
                initialValues?.transition?.buttonSettings?.btn_done?.readOnly
              }
              fullWidth
              onClick={() => {
                setDoneOpen(true);
              }}
              type="button"
              variant="contained"
            >
              Завершить
            </Button>
          </div>
        </div>
        <div className="tw-w-[74%] tw-h-[95%] tw-overflow-y-auto">
          <div className="tw-w-full">
            {showContent ? (
              <DocumentPdf url={pdfResponse} />
            ) : (
              <div className="tw-w-[794px] tw-overflow-y-auto">
                <OwnEditor content={editorValue} setContent={setEditorValue} />
              </div>
            )}
          </div>
        </div>
      </main>

      <RejectModal
        entry={{ ...initialValues, id: initialValues?.incomingId }}
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        rejectAccessForm={handleRejectForm}
        type={5}
      />

      {usersModal && (
        <AddMemberToConclusionModal
          handleModalVisible={setUsersModal}
          handleSubmit={handleAddUser}
        />
      )}

      <SendTopApproveOrDoneModal
        entry={mainDTO}
        open={sendToApproveOpen || doneOpen}
        descriptions={{
          btnTitle: doneOpen ? "Завершить" : "Сохранить",
          modalTitle: doneOpen
            ? "Завершить письмо"
            : "Отправить на подпись",
        }}
        onClose={() => {
          setSendToApproveOpen(false);
          setDoneOpen(false);
        }}
        executeAction={doneOpen ? handleDoneLetter : handleSendToApprove}
      />

      <Modal open={signAnswerModal} onClose={() => setSignAnswerModal(false)}>
        <div className="tw-w-[30%] tw-mx-auto tw-mt-[20%] tw-p-8 tw-bg-slate-100 tw-flex tw-flex-col tw-space-y-5 tw-items-center tw-rounded-2xl">
          <TextField
            size="small"
            fullWidth
            name="description"
            label="Комментария"
            value={signAnswerComment}
            onChange={(e) => {
              setSignAnswerComment(e.target.value);
            }}
          />

          <Button
            onClick={() => {
              signAnswerLetter({
                [typeIdKey]: itIsOutcomming
                  ? mainDTO.outComingId
                  : initialValues?.incomingId,
                comment: signAnswerComment,
              }).then((resp) => {
                if (!resp.hasOwnProperty("error")) {
                  setSignAnswerModal(false);
                  toast.success("Успешно подписан");
                  refetchData();
                }
              });
            }}
            sx={{ minWidth: 136 }}
            variant="contained"
            type="button"
          >
            {isSignAnswerLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Отправить"
            )}
          </Button>
        </div>
      </Modal>
    </Dialog>
  );
}

export default AnswerLetterV4;
