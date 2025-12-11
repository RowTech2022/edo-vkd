import React, { useEffect, useState, useRef } from "react";
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
import AddMemberToConclusionModal from "./components/AddMemberToConclusionModal";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import OwnEditor from "./OwnEditor";
import { OnlyOfficeEditor, UploadFileCard } from "@ui";
import { UploadFileLetters } from "@services/internal/incomingApi";
import { validateLettersFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import FileService from "@root/shared/ui/Card/service/fileService";
import { File as OwnFile } from "../../../Incoming/components/File";
import {
  useDeleteAnswerMemberIncomingV4Mutation,
  useDoneLetterV4Mutation,
  useFetchLetterApproveListV4Query,
  useAnswerMyBlanksMutation,
  useRejectAnswerIncomingV4Mutation,
  useRejectAnswerOutcomingV4Mutation,
  useSendToApproveLetterV4Mutation,
  useAnswerMyBlanksIncomingMutation,
  useLazyGetAnswerDataForSignIncomingQuery,
  useAnswerIncomingCheckFinalPdfMutation,
  IFileResponce,
  useUpdateAnswerLetterV4Mutation,
} from "@services/lettersApiV4";
import DocumentPdf from "./components/DocumentPdf";
import { SignIncoming } from "./components/SignIncoming";
import { toast } from "react-toastify";
import { RejectModal } from "./components/RejectModal";
import ClearIcon from "@mui/icons-material/Clear";
import { SendTopApproveOrDoneModal } from "./components/SendToApproveModal";
import fileService from "@services/fileService";

import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

const chatURL =
  (import.meta.env.VITE_PUBLIC_CHAT_URL || "/") + "LattersV4Incomming_";

const getParam = (url: string, key = "fileName") => {
  if (url) {
    const parsedUrl = new URL(url);
    const fileName = parsedUrl.searchParams.get(key);
    return fileName;
  }
};

const docType = 21;

function AnswerLetterV4Copy({
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
  refetchAnswer,
}: {
  modalState: boolean;
  setModalState: (state: boolean) => void;
  handleSubmit: (param: any) => Promise<boolean>;
  pdfResponse: string | null;
  loading: boolean;
  initialValues: any;
  signAnswerLetter: any;
  isSignAnswerLoading: boolean;
  typeIdKey: string;
  itIsOutcomming: boolean;
  mainDTO?: any;
  refetchData: () => Promise<any>;
  refetchAnswer?: () => Promise<any>;
  isOutcoming?: boolean;
}) {
  const signersList = useFetchLetterApproveListV4Query();
  const officeRef = useRef<any>(null);
  const [answerMyBlanks, { data: blankList }] = useAnswerMyBlanksMutation();
  const [answerMyBlanksIncoming, { data: blankListIncoming }] =
    useAnswerMyBlanksIncomingMutation();

  const [checkFinalPdfMutate] = useAnswerIncomingCheckFinalPdfMutation();
  const [selectedBlank, setSelectedBlank] = useState(null);
  const [selectSearchValue, setSelectSearchValue] = useState("");
  const [saveOrReplaceData, setSaveOrReplaceData] = useState(null);
  const [selectSigner, setSelectSigner] = useState(null);
  const [initialDoc, setInitialDoc] = useState(null);
  const [docInfo, setDocInfo] = useState<any>(null);
  const [editorCore, setEditorCore] = useState(null);
  const [usersModal, setUsersModal] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showContent, setShowContent] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  let [addLettersFile, setAddLettersFile] = useState<UploadFileLetters[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadFileLetters | null>(
    null
  );
  const [hasPdf, setHasPdf] = useState(false);
  const [pdfFilePreviewModal, setPdfFilePreviewModal] = useState(false);

  const handleVisibleShowEditor = (state: boolean) => {
    setShowEditor(state);
  };

  // Функция-обертка для кнопок, чтобы закрыть редактор перед действием
const handleActionWithEditorClose = (action: () => void) => {
  handleVisibleShowEditor(false); // закрываем редактор
  setTimeout(() => {
    action(); // выполняем основное действие
      }, 50); // даем время React безопасно размонтировать редактор
};

  const [signAnswerModal, setSignAnswerModal] = useState(false);
  const [signAnswerComment, setSignAnswerComment] = useState("");

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [sendToApproveOpen, setSendToApproveOpen] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);

  const [showMember, setShowMember] = useState<null | number>(null);
  const [showSign, setShowSign] = useState(null);

  const [selecting, setSelecting] = useState(false);

  const [showCommentEds, setShowCommentEds] = useState(false);

  const [rejectLetter] = useRejectAnswerIncomingV4Mutation();
  const [updateAnswer] = useUpdateAnswerLetterV4Mutation();
  const [rejectLetterOutcoming] = useRejectAnswerOutcomingV4Mutation();

  const [sendToApprove] = useSendToApproveLetterV4Mutation();
  const [doneLetter] = useDoneLetterV4Mutation();

  const [deleteMember] = useDeleteAnswerMemberIncomingV4Mutation();
  const [getAnswerDataForSignIncoming, { data: answerDataForSignIncoming }] =
    useLazyGetAnswerDataForSignIncomingQuery();

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

  const handleApprove = async (values: any) => {
    await signAnswerLetter(values).then(() => {
      refetchData();
      setSignAnswerModal(false);
      toast.success("Успешно подписан");
      setModalState(false)
    });
  };


  const handleDoneLetter = async (values: any) => {
    await doneLetter(values).then(() => {
      refetchData();
      setDoneOpen(false);
  
      setTimeout(() => {
        window.location.reload();
      }, 500); 
    });
  };

  const onSelectFile = (file: UploadFileLetters) => {
    handleVisibleShowEditor(false);
    setSelectedFile(file);
    setPdfFilePreviewModal(true);
  };

  const handleUploadFile = async (id: string, event: HTMLInputElement) => {
    const file = event.files;
    if (!file) {
      return;
    }

    const validFileType = await validateLettersFileType(
      FileService.getFileExtension(file[0]?.name)
    );

    if (!validFileType.isValid) {
      alert(validFileType.errorMessage);
      return;
    }

    const formData = new FormData();
    formData.append("file", file[0]);

    try {
      setIsUploading(true); // <-- установить флаг загрузки
      const e = await fileService.uploadFileV2(formData);
      const resp = e as { data: UploadFileLetters };
      const files = addLettersFile.concat(resp.data).reverse();
      setAddLettersFile([...files]);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
      alert("Не удалось загрузить файл.");
    } finally {
      setIsUploading(false); // <-- сбросить флаг загрузки
    }
  };

  const handleFileRemove = (file: UploadFileLetters) => {
    const files = addLettersFile.filter((item) => item.url !== file.url);
    setAddLettersFile(files);
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
          attachments: addLettersFile,
          blankId: Number(JSON.parse(selectedBlank)?.id),
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
    handleVisibleShowEditor(false);
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
      [typeIdKey]: mainDTO?.id,
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

  const handleCheckFinalPdf = () => {
    // checkFinalPdfMutate(mainDTO.id).then(({ data }: any) => {
    //   if (data?.hasFile) {
    //     setInitialDoc(data?.url);
    //     setIsPdf(true);
    //   }
    // });

    if (initialValues?.finalPdfUrl && initialValues?.newFormat) {
      setInitialDoc(initialValues?.finalPdfUrl);
      setIsPdf(true);
    }
  };

  const handleSaveDoc = async (isRefetchable: boolean, paramFunc?: any) => {
    if (isPdf && showEditor) {
      setIsPdf(false);
      setInitialDoc(initialValues?.finalFormUrl);
      return;
    }

    if (!selectSigner) {
      toast.warning("Заполните все данные");
      return;
    }

    try {
      handleSubmit({
        isRefetchable,
        executorIds: selectedUsers?.map((el) => el.id),
        signerId: +selectSigner?.id,
        language: 1,
        content: editorValue,
        blankId: Number(JSON.parse(selectedBlank)?.id),
        fileUrl: saveOrReplaceData || {
          url: initialValues?.finalFormUrl,
        },
        finalPdfUrl: null,
        attachments: addLettersFile,
        newFormat:
          !initialValues?.finalFormUrl || initialValues?.newFormat
            ? true
            : false,
      }).then(async (submitResp) => {
        if (submitResp && paramFunc) {
          paramFunc();
        }
      });
    } catch (error) {
      console.error("Ошибка при сохранении документа:", error);
      toast.error("Произошла ошибка при сохранении документа.");
    }
  };

  const editorRef = useRef<{ print: () => void }>(null);

  const handleExternalPrint = () => {
    editorRef.current?.print();
  };

  const generateRandomFileName = (file) => {
    const ext = file.name.split(".").pop();
    const randomName = crypto.randomUUID();
    return `${randomName}.${ext}`;
  };

  useEffect(() => {
    if (isOutcoming) {
      answerMyBlanks({});
    } else {
      answerMyBlanksIncoming({});
    }
  }, []);

  useEffect(() => {
    if (modalState) {
      setShowContent(pdfResponse);
    }
  }, [modalState, pdfResponse]);

  const incomingId = mainDTO?.id;
  useEffect(() => {
    if (!modalState) return;

    let connection: null | HubConnection = null;

    console.log("IncomingId: ", incomingId);
    if (incomingId) {
      try {
        connection = new HubConnectionBuilder()
          .withUrl(chatURL + incomingId, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          })
          .configureLogging(LogLevel.Information)
          .build();

        connection.on("updateAnswer", (...arg) => {
          console.log("ReceiveMessage: ", arg);
          handleVisibleShowEditor(false);
          refetchAnswer?.().then(() => {
            handleVisibleShowEditor(true);
          });
        });

        connection.onclose((e) => {
          console.log(999, "close");
        });

        connection.start();
      } catch (e) {
        console.log("ERROR", e);
        connection = null;
      }
    }

    return () => {
      if (connection) connection.stop();
    };
  }, [incomingId, modalState]);

  useEffect(() => {
    console.log("InitialValuesChanged: ", initialValues);
    if (initialValues) {
      if (initialValues?.signer?.userId) {
        setSelectSigner({
          id: initialValues?.signer?.userId,
          value: initialValues?.signer?.userName,
        });
      }

      if (initialValues?.blank) {
        const oneObj = (
          isOutcoming ? blankList : blankListIncoming
        )?.items?.find((el) => el.id === Number(initialValues?.blank?.id));
        setSelectedBlank(JSON.stringify(oneObj));
      }

      if (initialValues?.finalFormUrl && initialValues?.newFormat) {
        console.log("Set: ", initialValues?.finalPdfUrl);

        setInitialDoc(initialValues?.finalFormUrl);
        setIsPdf(false);
      }

      if (initialValues?.docInfo) {
        setDocInfo(initialValues?.docInfo);
      } else {
        setDocInfo({
          documentId: mainDTO?.id,
          fileType: "INCOMING_V4_FINAL_FILE",
        });
      }

      if (initialValues?.finalPdfUrl && initialValues?.newFormat) {
        console.log("Set: ", initialValues?.finalPdfUrl);
        setHasPdf(true);

        setInitialDoc(initialValues?.finalPdfUrl);
        setIsPdf(true);
      }

      if (initialValues?.attachments) {
        setAddLettersFile(initialValues?.attachments);
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

  useEffect(() => {
    console.log(">>>>>>> CHANGED <<<<<<<<");
  }, [initialValues]);

  return (
    <Dialog
      sx={{
        "& .MuiPaper-root": {
          height: "94vh",
          width: "100vw",
          position: "relative",
        },
        // position: "relative",
        overflow: "hidden",
      }}
      fullWidth={true}
      maxWidth={false}
      open={Boolean(modalState)}
      onClose={() => setModalState(false)}
    >
      <IconButton
        onClick={() => setModalState(false)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          color: "grey.800",
        }}
      >
        <CloseIcon />
      </IconButton>
      <main className="tw-flex tw-w-[98%] tw-ml-auto tw-h-full flex flex-row tw-justify-between tw-items-start tw-space-x-3">
        <div className="tw-w-[20%] tw-flex tw-flex-col tw-space-y-4 tw-h-[90%] tw-overflow-y-auto">
          <TextField
            disabled={
              initialValues?.transition?.buttonSettings?.btn_change?.readOnly
            }
            size="small"
            select
            fullWidth
            label="Бланк"
            value={selectedBlank}
            onChange={async (e) => {
              setShowEditor(false);
              let selected = JSON.parse(e.target.value);

              setSelecting(true);

              try {
                let response = null;
                let fileName = "";
                let fileBlob = null;
                if (selected?.id) {
                  if (/[А-Яа-яЁё]/.test(selected?.name || "")) {
                    selected = new File(
                      [selected],
                      generateRandomFileName(selected.name),
                      {
                        type: selected.type,
                        lastModified: selected.lastModified,
                      }
                    );
                  }
                  fileName = getParam(selected?.fileUrl);
                  response = await fetch(selected?.fileUrl);
                  fileBlob = await response.blob();
                } else {
                  response = await fetch("/Empty.docx");
                  fileBlob = await response.blob();
                  fileName = generateRandomFileName({ name: "Файл.docx" });
                  selected = new File([fileBlob], fileName, {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  });
                }

                const contentType =
                  response.headers.get("Content-Type") ||
                  "application/octet-stream";
                const file = new File([fileBlob], "newFile", {
                  type: contentType,
                });
                const formData = new FormData();
                formData.append("blank", file, fileName);
                await fileService
                  .saveOrReplaceFile(formData, {
                    ...docInfo,
                    fileName: fileName,
                  })
                  .then((e) => {
                    let resp = e as { data: IFileResponce };

                    setSaveOrReplaceData(resp.data);
                    setInitialDoc(resp?.data.url);
                  })
                  .finally(() => setSelecting(false));

                setSelectedBlank(e.target.value);
              } catch {
                setSelecting(false);
              }
            }}
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
            {(isOutcoming ? blankList : blankListIncoming)?.items?.map(
              (item: any) => (
                <MenuItem key={item.id} value={JSON.stringify(item)}>
                  {item.fileName}
                </MenuItem>
              )
            )}
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

          <Button
            disabled={
              loading ||
              allowEdit ||
              initialValues?.transition?.buttonSettings?.btn_change?.readOnly
            }
            onClick={() => {
              if (showEditor) {
                const iframe = document.querySelector(
                  "#editor iframe"
                ) as HTMLIFrameElement;
                console.log("Iframe: ", iframe.contentWindow);
                iframe.contentWindow?.postMessage(
                  JSON.stringify({
                    method: "ExecuteCommand",
                    params: ["Save", { forcesave: true }],
                  }),
                  "*"
                );
              }

              if (isPdf) {
                setIsPdf(false);
              } else {
                setShowEditor(false);
                handleSubmit({
                  isRefetchable: true,
                  executorIds: selectedUsers?.map((el) => el.id),
                  signerId: +selectSigner?.id,
                  language: 1,
                  content: editorValue,
                  blankId: Number(JSON.parse(selectedBlank)?.id),
                  fileUrl: saveOrReplaceData || {
                    url: initialValues?.finalFormUrl,
                  },
                  attachments: addLettersFile,
                  newFormat:
                    !initialValues?.finalFormUrl || initialValues?.newFormat
                      ? true
                      : false,
                }).then((resp) => {
                  if (isPdf && showEditor) {
                    handleVisibleShowEditor(false);
                    setTimeout(() => {
                      setAllowEdit(true);
                      handleVisibleShowEditor(true);
                    }, 2000);
                  }
                });
              }
            }}
            type="button"
            variant="contained"
          >
            {hasPdf && showEditor ? "Изменить" : "Сохранить"}
          </Button>

          {initialDoc || selectedBlank ? (
            <div className="tw-w-full tw-border tw-p-4 tw-rounded-md">
              <p className="tw-text-blue-700">Документ</p>
              <div className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-space-x-3 tw-p-2">
                <InsertDriveFileIcon sx={{ fontSize: 40 }} />
                <div className="tw-w-[85%] tw-flex tw-flex-col tw-space-y-3">
                  <p className="tw-text-[12px] tw-font-[600]">
                    Название:{" "}
                    <span className="tw-font-[300]">
                      {initialDoc ? getParam(initialDoc) : "Без бланка"}
                    </span>
                  </p>
                  <div className="tw-flex tw-flex-row tw-space-x-2">
                    <Button
                      disabled={selecting}
                      size="small"
                      sx={{ fontSize: "12px" }}
                      variant="contained"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => {
                        if (selecting) return;
                        setPdfFilePreviewModal(false);
                        handleVisibleShowEditor(false);
                        setTimeout(() => {
                          handleVisibleShowEditor(true);
                          setAllowEdit(false);
                        }, 500);
                      }}
                    >
                      Открыть
                    </Button>
                    <Button
                      size="small"
                      sx={{ fontSize: "12px" }}
                      variant="contained"
                      startIcon={<CloseIcon />}
                      onClick={() => {
                        handleVisibleShowEditor(false);
                      }}
                    >
                      Закрыть
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {!initialValues?.newFormat ? (
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

          {!initialValues?.transition?.buttonSettings?.btn_set_sign?.hide ? (
            <Button
              onClick={() => {
                if (mainDTO) {
                  getAnswerDataForSignIncoming(mainDTO?.id).then(({ data }) => {
                    if (data && docInfo) {
                      refetchData?.();
                    }
                  });
                }
              }}
              disabled={
                initialValues?.transition?.buttonSettings?.btn_set_sign
                  ?.readOnly
              }
              type="button"
              variant="contained"
            >
              Вставить подпись
            </Button>
          ) : (
            <></>
          )}

          {!initialValues?.transition?.buttonSettings?.btn_sign?.hide ? (
            <Button
            onClick={() => handleActionWithEditorClose(signAnswerClick)}
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

              if (initialValues?.newFormat) {
                handleExternalPrint();
              } else {
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
              onClick={() => handleActionWithEditorClose(() => setRejectModalOpen(true))}
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

          <Button
            onClick={handleCheckFinalPdf}
            type="button"
            variant="contained"
          >
            Проверить конечный документ
          </Button>
          {!initialValues?.transition?.buttonSettings?.btn_sendToApprove
            ?.hide ? (
            <Button
              disabled={
                initialValues?.transition?.buttonSettings?.btn_sendToApprove
                  ?.readOnly
              }
              onClick={() => handleActionWithEditorClose(() => setSendToApproveOpen(true))}

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
              onClick={() => handleActionWithEditorClose(() => setDoneOpen(true))}

              type="button"
              variant="contained"
            >
              Завершить
            </Button>
          </div>

          <div className="tw-w-full">
            {!initialValues?.transition?.buttonSettings?.btn_attachment
              ?.hide ? (
              <UploadFileCard
                change={handleUploadFile}
                isLoading={isUploading}
                item={addLettersFile as any}
              />
            ) : (
              <></>
            )}

            <div className="tw-mb-4 tw-w-full tw-flex tw-flex-col tw-space-y-3">
              {addLettersFile?.map((item, idx) => (
                <OwnFile
                  key={item?.url}
                  type={docType}
                  file={item as UploadFileLetters}
                  active={selectedFile?.url === item?.url}
                  onClick={onSelectFile}
                  onRemove={handleFileRemove}
                  removeDisabled={
                    initialValues?.transition?.buttonSettings?.btn_attachment
                      ?.readOnly
                  }
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="tw-w-[80%] tw-h-full">
          {pdfFilePreviewModal && selectedFile?.url && (
            <DocumentPdf url={selectedFile?.url} />
          )}
          {!initialValues?.newFormat ? (
            <div className="tw-w-full">
              {showContent ? (
                <DocumentPdf url={pdfResponse} />
              ) : (
                <div className="tw-w-[794px] tw-overflow-y-auto tw-mx-auto">
                  <OwnEditor
                    content={editorValue}
                    setContent={setEditorValue}
                  />
                </div>
              )}
            </div>
          ) : showEditor ? (
            <div id="editor" className="tw-w-full tw-h-full">
              <OnlyOfficeEditor
                editorRef={officeRef}
                url={
                  hasPdf && !allowEdit
                    ? initialValues?.finalPdfUrl
                    : docInfo?.fileUrl
                }
                fileName={
                  hasPdf && !allowEdit
                    ? getParam(initialValues?.finalPdfUrl)
                    : docInfo?.fileName
                }
                documentId={docInfo?.documentId || ""}
                fileType={docInfo?.fileType}
                updatedAt={docInfo?.updatedAt?.slice(0, 19) || ""}
              />
              {/* <SDKEditor
                ref={editorRef}
                initialDoc={initialDoc}
                handleSaveDoc={(core) => setEditorCore(core)}
                isPdf={isPdf}
              /> */}
            </div>
          ) : (
            <></>
          )}
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
          modalTitle: doneOpen ? "Завершить письмо" : "Отправить на подпись",
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
            onClick={    () => handleApprove({
              incomingId: initialValues?.incomingId,
              comment: signAnswerComment,
            })  }
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

export default AnswerLetterV4Copy;
