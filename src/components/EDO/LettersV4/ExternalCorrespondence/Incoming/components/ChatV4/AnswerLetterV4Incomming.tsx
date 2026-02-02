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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import AddMemberToConclusionModal from "./components/AddMemberToConclusionModal";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import OwnEditor from "./OwnEditor";
import {
  ExcelIcon,
  PdfIcon,
  WordIcon,
  OnlyOfficeEditor,
  UploadFileCard,
} from "@ui";
import { UploadFileLetters } from "@services/internal/incomingApi";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";
import { validateLettersFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import FileService from "@root/shared/ui/Card/service/fileService";
import { File as OwnFile } from "../File";
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
  const { data: userDetails } = useFetchUserDetailsQuery();
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
  const [initialUsersIds, setInitialUsersIds] = useState<number[]>([]);
  const [showContent, setShowContent] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  let [addLettersFile, setAddLettersFile] = useState<UploadFileLetters[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadFileLetters | null>(
    null,
  );
  const [hasPdf, setHasPdf] = useState(false);
  const [pdfFilePreviewModal, setPdfFilePreviewModal] = useState(false);
  const [isDocumentSaved, setIsDocumentSaved] = useState(false);
  const [initialBlankId, setInitialBlankId] = useState<string | null>(null);

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

  const [qrCodeResult, setQrCodeResult] = useState<boolean>(true);

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

  const handleDoneLetter = async (values: any) => {
    await doneLetter(values).then(() => {
      refetchData();
      setDoneOpen(false);
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
      FileService.getFileExtension(file[0]?.name),
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
          qr: qrCodeResult,
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
      const updatedUsers = [...prev, ...newUsers];
      // Очищаем/обновляем initialUsersIds при добавлении нового участника
      // чтобы кнопка "Сохранить участников" активировалась
      return updatedUsers;
    });
    setUsersModal(false);
  };

  const handleDeleteMember = (user: any) => () => {
    // Сразу удаляем участника из списка на фронте (оптимистичное обновление)
    const updatedUsers = selectedUsers.filter((item) => item !== user);
    setSelectedUsers(updatedUsers);
    // Обновляем начальные ID участников
    setInitialUsersIds(updatedUsers.map((el) => el.id));
    
    // Отправляем запрос на бэк асинхронно (fire and forget)
    const promise = deleteMember({
      userId: user.id,
      [typeIdKey]: mainDTO?.id,
    }).then((res: any) => {
      if (res.error) {
        // Если ошибка (например, участник не найден на бэке), 
        // участник уже удален на фронте, просто показываем сообщение
        toast.warning("Участник удален из списка, но не найден на сервере");
        return;
      }
      toast.success("Успешно удалено");
    }).catch((error) => {
      // При ошибке участник уже удален на фронте
      toast.warning("Участник удален из списка, но произошла ошибка при удалении на сервере");
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
        qr: qrCodeResult,
      }).then(async (submitResp) => {
        if (submitResp) {
          // Mark document as saved after successful create
          setIsDocumentSaved(true);
          
          // Update initialBlankId to current blank ID
          if (selectedBlank) {
            const currentBlank = JSON.parse(selectedBlank);
            if (currentBlank?.id) {
              setInitialBlankId(currentBlank.id.toString());
            }
          }
          
          if (paramFunc) {
            paramFunc();
          }
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
        // Set initial blank ID for comparison
        if (oneObj) {
          setInitialBlankId(oneObj.id?.toString() || null);
        }
      }

      if (initialValues?.finalFormUrl && initialValues?.newFormat) {
        console.log("Set: ", initialValues?.finalPdfUrl);

        setInitialDoc(initialValues?.finalFormUrl);
        setIsPdf(false);
        // If document already exists, mark as saved
        setIsDocumentSaved(true);
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

      const executors = initialValues?.executors?.map((el) => ({
        id: el?.userId,
        value: el?.userName,
        signInfo: el?.signInfo,
        signedAt: el?.signedAt,
        comment: el?.comment,
        userImage: el?.userImage,
      })) || [];
      setSelectedUsers(executors);
      // Сохраняем начальные ID участников для сравнения
      setInitialUsersIds(executors.map((el) => el.id));
      setEditorValue(initialValues?.content);
      
      // Инициализация значения Qr-кодом из initialValues
      if (initialValues?.результат !== undefined) {
        setQrCodeResult(initialValues?.результат);
      }
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

              // Reset document saved state when blank changes
              setIsDocumentSaved(false);
              setInitialBlankId(null);

              setSelecting(true);

              try {
                let response = null;
                let fileName = "";
                let fileBlob = null;
                if (selected?.id) {
                  // Используем оригинальное имя файла из API (fileName из списка бланков)
                  // Это поле содержит чистое имя файла без префиксов
                  fileName = selected?.fileName || selected?.name || "document.docx";
                  
                  // Если имя файла все еще содержит префиксы (на случай, если API вернул неправильное имя)
                  if (fileName && /^\d+_\d+_/.test(fileName)) {
                    // Убираем префиксы типа "165_883_" и суффиксы типа "_8_479614_651558"
                    // Ищем паттерн: числа_числа_ИМЯ_числа_числа_числа.расширение
                    const match = fileName.match(/^\d+_\d+_(.+?)_\d+_\d+_\d+\.(.+)$/);
                    if (match) {
                      fileName = `${match[1]}.${match[2]}`;
                    } else {
                      // Альтернативный паттерн: числа_числа_ИМЯ.расширение
                      const match2 = fileName.match(/^\d+_\d+_(.+)$/);
                      if (match2) {
                        fileName = match2[1];
                      }
                    }
                  }
                  
                  // Декодируем URL-кодирование, если есть
                  try {
                    fileName = decodeURIComponent(fileName);
                  } catch {
                    // Если декодирование не удалось, оставляем как есть
                  }
                  
                  response = await fetch(selected?.fileUrl);
                  fileBlob = await response.blob();
                } else {
                  response = await fetch("/Empty.docx");
                  fileBlob = await response.blob();
                  fileName = "Файл.docx";
                  selected = new File([fileBlob], fileName, {
                    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  });
                }

                const contentType =
                  response.headers.get("Content-Type") ||
                  "application/octet-stream";
                const file = new File([fileBlob], fileName, {
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
              ),
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

          <FormControlLabel
            control={
              <Checkbox
                checked={qrCodeResult}
                onChange={(e) => setQrCodeResult(e.target.checked)}
              />
            }
            label="С qr-кодом"
            sx={{ marginTop: 2 }}
          />

          {!initialValues?.transition?.buttonSettings?.btn_change?.hide && (
            <Button
              disabled={
                // Если readOnly === false, кнопка всегда активна (enabled), независимо от других условий
                // Если readOnly !== false (true или undefined), применяются все остальные условия
                initialValues?.transition?.buttonSettings?.btn_change?.readOnly === false
                  ? false
                  : loading ||
                    !selectedBlank || // Нет выбранного бланка - кнопка неактивна
                    allowEdit ||
                    initialValues?.transition?.buttonSettings?.btn_change?.readOnly ||
                    // Кнопка активна только если:
                    // 1. initialBlankId === null (первый выбор бланка) ИЛИ
                    // 2. initialBlankId !== null И выбранный бланк отличается от initialBlankId (бланк изменился)
                    // Иначе (бланк выбран и не изменился) - кнопка неактивна
                    (initialBlankId !== null && selectedBlank && JSON.parse(selectedBlank)?.id?.toString() === initialBlankId)
              }
              onClick={() => {
                // Если это кнопка "Изменить" (hasPdf && showEditor), открываем Word файл из finalFormUrl
                if (hasPdf && showEditor) {
                  if (initialValues?.finalFormUrl) {
                    // Устанавливаем Word файл из finalFormUrl
                    setInitialDoc(initialValues?.finalFormUrl);
                    setIsPdf(false);
                    setHasPdf(false);
                    setAllowEdit(true);
                    
                    // Обновляем docInfo для открытия Word файла
                    // Обновляем updatedAt, чтобы редактор перезагрузился с новым файлом
                    setDocInfo({
                      ...docInfo,
                      fileUrl: initialValues?.finalFormUrl,
                      fileName: getParam(initialValues?.finalFormUrl) || "document.docx",
                      fileType: "INCOMING_V4_FINAL_FILE",
                      updatedAt: new Date().toISOString().slice(0, 19),
                    });
                  } else {
                    toast.warning("Word файл не найден");
                  }
                  return;
                }

                // Если редактор открыт, сохраняем документ
                if (showEditor) {
                  const iframe = document.querySelector(
                    "#editor iframe",
                  ) as HTMLIFrameElement;
                  console.log("Iframe: ", iframe.contentWindow);
                  iframe.contentWindow?.postMessage(
                    JSON.stringify({
                      method: "ExecuteCommand",
                      params: ["Save", { forcesave: true }],
                    }),
                    "*",
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
                    qr: qrCodeResult,
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
          )}

          {initialDoc || selectedBlank ? (
            <div className="tw-w-full tw-border tw-p-4 tw-rounded-md">
              <p className="tw-text-blue-700">Документ</p>
              <div className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-space-x-3 tw-p-2">
                {(() => {
                  const fileName = initialDoc ? getParam(initialDoc) : "";
                  const lowerFileName = fileName.toLowerCase();

                  if (
                    lowerFileName.endsWith(".doc") ||
                    lowerFileName.endsWith(".docx")
                  ) {
                    return <div style={{ transform: 'scale(1.5)', display: 'inline-block' }}><WordIcon /></div>;
                  }

                  if (
                    lowerFileName.endsWith(".xls") ||
                    lowerFileName.endsWith(".xlsx")
                  ) {
                    return <div style={{ transform: 'scale(1.5)', display: 'inline-block' }}><ExcelIcon /></div>;
                  }

                  if (lowerFileName.endsWith(".pdf")) {
                    return <div style={{ transform: 'scale(1.5)', display: 'inline-block' }}><PdfIcon /></div>;
                  }

                  return <InsertDriveFileIcon sx={{ fontSize: 48 }} />;
                })()}
                <div className="tw-w-[85%] tw-flex tw-flex-col tw-space-y-3">
                  <p className="tw-text-[14px] tw-font-[600]">
                    Название:{" "}
                    <span className="tw-font-[300] tw-text-[14px]">
                      {initialDoc ? getParam(initialDoc) : "Без бланка"}
                    </span>
                  </p>
                  <div className="tw-flex tw-flex-row tw-space-x-2">
                    <Button
                      disabled={selecting || !isDocumentSaved}
                      variant="contained"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => {
                        if (selecting || !isDocumentSaved) return;
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
                      disabled={!isDocumentSaved}
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

          {!initialValues?.transition?.buttonSettings?.btn_add_member?.hide && (
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
          )}

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
                    {!initialValues?.transition?.buttonSettings?.btn_add_member?.hide && (
                      <Tooltip
                        className="tw-absolute tw-top-4 tw-right-3"
                        title="Удалить участника"
                      >
                        <ClearIcon
                          color="error"
                          className={`tw-cursor-pointer ${
                            initialValues?.transition?.buttonSettings?.btn_add_member?.readOnly
                              ? "tw-opacity-50 tw-cursor-not-allowed"
                              : ""
                          }`}
                          onClick={
                            initialValues?.transition?.buttonSettings?.btn_add_member?.readOnly
                              ? undefined
                              : handleDeleteMember(e)
                          }
                        />
                      </Tooltip>
                    )}
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

          {/* Кнопка Сохранить для участников - показывается когда участники изменены */}
          {(() => {
            const currentUsersIds = selectedUsers?.map((el) => el.id) || [];
            const usersChanged = 
              currentUsersIds.length !== initialUsersIds.length ||
              !currentUsersIds.every((id) => initialUsersIds.includes(id)) ||
              !initialUsersIds.every((id) => currentUsersIds.includes(id));

            if (!usersChanged) {
              return null;
            }

            return (
              <Button
                onClick={async () => {
                  if (!selectSigner) {
                    toast.warning("Выберите подписывающего");
                    return;
                  }
                  if (!selectedBlank) {
                    toast.warning("Выберите бланк");
                    return;
                  }

                  try {
                    const result = await handleSubmit({
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
                      qr: qrCodeResult,
                    });

                    if (result) {
                      // Обновляем начальные ID участников после успешного сохранения
                      setInitialUsersIds(selectedUsers?.map((el) => el.id) || []);
                      toast.success("Участники успешно сохранены");
                      if (refetchData) {
                        await refetchData();
                      }
                      if (refetchAnswer) {
                        await refetchAnswer();
                      }
                    }
                  } catch (error) {
                    console.error("Ошибка при сохранении участников:", error);
                    toast.error("Произошла ошибка при сохранении участников");
                  }
                }}
                type="button"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                Сохранить участников
              </Button>
            );
          })()}

          {/* <Button
            onClick={handleCheckFinalPdf}
            type="button"
            variant="contained"
          >
            Проверить конечный документ
          </Button> */}
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

          {!initialValues?.transition?.buttonSettings?.btn_done?.hide ? (
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
          ) : (
            <></>
          )}

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
        <div className="tw-w-[80%] tw-h-full tw-pt-[20px]">
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
            <div id="editor" className="tw-w-full tw-h-full tw-flex tw-flex-col">
              <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-2 tw-bg-gray-100 tw-border-b tw-border-gray-300">
                <div className="tw-flex tw-items-center tw-gap-2">
                  <span className="tw-text-sm tw-font-medium tw-text-gray-700">
                    {userDetails?.displayName || "Пользователь"}
                  </span>
                </div>
              </div>
              <div className="tw-flex-1 tw-overflow-hidden" style={{
                position: 'relative'
              }}>
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
              </div>
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
            onClick={async () => {
              const resp = await signAnswerLetter({
                incomingId: initialValues?.incomingId,
                comment: signAnswerComment,
              });

              if (!resp.hasOwnProperty("error")) {
                setSignAnswerModal(false);
                toast.success("Успешно подписан");
              }
              // Вызываем refetch в любом случае после подписания
              refetchData();
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

export default AnswerLetterV4Copy;
