import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
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
import AddMemberToConclusionModal from "./components/AddMemberToConclusionModal";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import OwnEditor from "./OwnEditor";
import {
  ExcelIcon,
  PdfIcon,
  WordIcon,
  UploadFileCard,
  OnlyOfficeEditor,
} from "@ui";
import { UploadFileLetters } from "@services/internal/incomingApi";
import { validateLettersFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import FileService from "@root/shared/ui/Card/service/fileService";
import { File } from "../../../Incoming/components/File";
import {
  useDeleteAnswerMemberIncomingV4Mutation,
  useFetchLetterApproveListV4Query,
  useRejectAnswerOutcomingV4Mutation,
  useSendToApproveLetterV4Mutation,
  useDoneLetterV4OutcomingMutation,
  useLazyGetAnswerDataForSignQuery,
  IFileResponce,
  useAnswerMyBlanksMutation,
  useAnswerOutcomingSetNumberMutation,
} from "@services/lettersApiV4";
import DocumentPdf from "./components/DocumentPdf";
import { toast } from "react-toastify";
import { RejectModal } from "./components/RejectModal";
import ClearIcon from "@mui/icons-material/Clear";
import { SendTopApproveOrDoneModal } from "./components/SendToApproveModal";
import fileService from "@services/fileService";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";

const findFileName = (url: string) => {
  if (url) {
    try {
      const parsedUrl = new URL(url);
      const fileName = parsedUrl.searchParams.get("fileName");
      if (fileName) return fileName;
      // If no fileName in query params, try to extract from path
      const pathParts = parsedUrl.pathname.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && lastPart.includes(".")) {
        return lastPart;
      }
    } catch (e) {
      // If URL parsing fails, try to extract filename from string
      const match = url.match(/([^\/\?]+\.(docx?|pdf|xlsx?))(?:\?|$)/i);
      if (match) return match[1];
    }
  }
  return null;
};

const getParam = (url: string, key = "fileName") => {
  if (url) {
    const parsedUrl = new URL(url);
    const fileName = parsedUrl.searchParams.get(key);
    return fileName;
  }
};

const generateRandomFileName = (file) => {
  const ext = file?.name ? file.name.split(".").pop() : "docx";
  const randomName = crypto.randomUUID();
  return `${randomName}.${ext}`;
};

// Generate 6 random digits
const generateRandomNumbers = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates 6-digit number
};

// Add 6 random numbers to filename before extension
const addRandomNumbersToFileName = (fileName: string) => {
  if (!fileName) return fileName;
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) {
    // No extension, just add numbers
    return `${fileName}_${generateRandomNumbers()}`;
  }
  const nameWithoutExt = fileName.substring(0, lastDotIndex);
  const extension = fileName.substring(lastDotIndex);
  return `${nameWithoutExt}_${generateRandomNumbers()}${extension}`;
};

const docType = 21;

function AnswerLetterV4({
  modalState,
  setModalState,
  handleSubmit,
  pdfResponse,
  loading,
  initialValues,
  signAnswerLetter,
  isSignAnswerLoading,
  mainDTO,
  refetchData,
  outComingId,
}: {
  modalState: boolean;
  setModalState: (state: boolean) => void;
  handleSubmit: (param: any) => Promise<boolean>;
  pdfResponse: string | null;
  loading: boolean;
  initialValues: any;
  signAnswerLetter: any;
  isSignAnswerLoading: boolean;
  mainDTO?: any;
  refetchData: () => void;
  outComingId: number;
}) {
  const signersList = useFetchLetterApproveListV4Query();
  const { data: userDetails } = useFetchUserDetailsQuery();
  const [answerMyBlanks, { data: blankList }] = useAnswerMyBlanksMutation();
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
  const [isPdf, setIsPdf] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  let [addLettersFile, setAddLettersFile] = useState<UploadFileLetters[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadFileLetters | null>(
    null
  );
  const [pdfFilePreviewModal, setPdfFilePreviewModal] = useState(false);
  const [isDocumentSaved, setIsDocumentSaved] = useState(false);
  const [initialBlankId, setInitialBlankId] = useState<string | null>(null);
  const [isFileSavedToService, setIsFileSavedToService] = useState(false);
  const [initialUsersIds, setInitialUsersIds] = useState<number[]>([]);

  // Вычисляем, есть ли несохраненные изменения участников
  const usersChanged = useMemo(() => {
    const currentUsersIds = selectedUsers?.map((el) => el.id) || [];
    return (
      currentUsersIds.length !== initialUsersIds.length ||
      !currentUsersIds.every((id) => initialUsersIds.includes(id)) ||
      !initialUsersIds.every((id) => currentUsersIds.includes(id))
    );
  }, [selectedUsers, initialUsersIds]);

  const handleVisibleShowEditor = (state: boolean) => {
    setShowEditor(state);
  };

  const [signAnswerModal, setSignAnswerModal] = useState(false);
  const [signAnswerComment, setSignAnswerComment] = useState("");
  const [qrCodeResult, setQrCodeResult] = useState<boolean>(true);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [sendToApproveOpen, setSendToApproveOpen] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);

  const [showMember, setShowMember] = useState<null | number>(null);
  const [showSign, setShowSign] = useState(null);

  const [showCommentEds, setShowCommentEds] = useState(false);

  const [rejectLetterOutcoming] = useRejectAnswerOutcomingV4Mutation();

  const [sendToApprove] = useSendToApproveLetterV4Mutation();
  const [doneLetter] = useDoneLetterV4OutcomingMutation();

  const [deleteMember] = useDeleteAnswerMemberIncomingV4Mutation();

  const [getAnswerDataForSign] = useLazyGetAnswerDataForSignQuery();

  const [setNumberMutate] = useAnswerOutcomingSetNumberMutation();

  const handleRejectForm = async (values: any) => {
    const requestReject = rejectLetterOutcoming;
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
    return doneLetter(values).then(() => {
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
          isRefetchable: true,
          executorIds: selectedUsers?.map((el) => el.id),
          signerId: +selectSigner?.id,
          language: 1,
          content: editorValue,
          attachments: addLettersFile,
          blankId: Number(JSON.parse(selectedBlank)?.id),
          qr: qrCodeResult,
        });
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

  const editorRef = useRef<{ print: () => void }>(null);

  const handleExternalPrint = () => {
    editorRef.current?.print();
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
    // Сразу удаляем участника из списка на фронте (оптимистичное обновление)
    const updatedUsers = selectedUsers.filter((item) => item !== user);
    setSelectedUsers(updatedUsers);
    // Обновляем начальные ID участников
    setInitialUsersIds(updatedUsers.map((el) => el.id));
    
    // Отправляем запрос на бэк асинхронно (fire and forget)
    const promise = deleteMember({
      userId: user.id,
      ["outComingId"]: mainDTO?.id,
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

  // Save OnlyOffice document asynchronously (fire and forget)
  // Sends save command without waiting for response
  const saveOnlyOfficeDocument = useCallback(() => {
    if (!showEditor || isPdf) {
      return;
    }

    try {
      const iframe = document.querySelector(
        ".tw-w-full.tw-h-full iframe, [id*='editor'] iframe",
      ) as HTMLIFrameElement;
      
      if (iframe?.contentWindow) {
        // Send save command asynchronously - don't wait for response
        iframe.contentWindow.postMessage(
          JSON.stringify({
            method: "ExecuteCommand",
            params: ["Save", { forcesave: true }],
          }),
          "*",
        );
        console.log("Save command sent to OnlyOffice (async, no wait)");
      }
    } catch (error) {
      console.error("Ошибка при отправке команды сохранения:", error);
    }
  }, [showEditor, isPdf]);

  // Handle modal close with auto-save - send save command asynchronously
  // Called when closing via X button or clicking outside the modal
  // OnlyOffice saves to file service via callback URL automatically
  // We don't wait for save to complete - just send the command and close
  const handleCloseModal = () => {
    // Send save command to OnlyOffice asynchronously (fire and forget)
    // OnlyOffice will automatically save to file service via callback URL
    // We don't wait for the response - just send the command and close immediately
    if (showEditor && !isPdf) {
      saveOnlyOfficeDocument(); // Async, no await
      console.log("Save command sent to OnlyOffice, closing modal immediately");
    }
    
    // Close the modal immediately without waiting
    setModalState(false);
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
      // Save OnlyOffice document first - same logic as incoming module
      if (showEditor) {
        saveOnlyOfficeDocument();
      }

      // Use saveOrReplaceData if available, otherwise use initialValues
      if (!selectedBlank) {
        toast.warning("Выберите бланк");
        return;
      }
      
      const parsedBlank = JSON.parse(selectedBlank);
      const blankIdToSend = Number(parsedBlank?.id);
      
      if (!blankIdToSend || isNaN(blankIdToSend)) {
        toast.warning("Неверный ID бланка");
        return;
      }
      
      handleSubmit({
        isRefetchable,
        executorIds: selectedUsers?.map((el) => el.id),
        signerId: +selectSigner?.id,
        language: 1,
        content: editorValue,
        blankId: blankIdToSend,
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
          // Mark document as saved
          setIsDocumentSaved(true);
          
          // Update initialBlankId to current blank ID so save button becomes disabled
          if (selectedBlank) {
            const currentBlank = JSON.parse(selectedBlank);
            if (currentBlank?.id) {
              setInitialBlankId(currentBlank.id.toString());
            }
          }
          
          // Refetch data first to get updated initialValues with new docInfo
          if (isRefetchable) {
            await refetchData();
            // docInfo will be updated automatically by useEffect when initialValues changes
            // After refetch, initialValues will be updated with finalFormUrl
            // We'll open the file in useEffect when initialValues changes
          } else if (docInfo) {
            // If not refetching, update updatedAt manually to prevent version change error
            setDocInfo({
              ...docInfo,
              updatedAt: new Date().toISOString(),
            });
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

  useEffect(() => {
    answerMyBlanks({});
  }, []);

  // Auto-open editor when modal opens and document exists (only if saved)
  // Автоматическое открытие редактора отключено
  // useEffect(() => {
  //   if (modalState && initialDoc && initialValues?.newFormat && !showEditor && isDocumentSaved) {
  //     setTimeout(() => {
  //       handleVisibleShowEditor(true);
  //     }, 300);
  //   }
  // }, [modalState, initialDoc, initialValues?.newFormat, isDocumentSaved]);

  useEffect(() => {
    if (modalState) {
      setShowContent(pdfResponse);
    }
  }, [modalState, pdfResponse]);

  // Listen for OnlyOffice events, especially "version changed" event
  // Only process version change events (type 2), ignore all other state changes
  useEffect(() => {
    if (!modalState || !showEditor) return;

    const handleOnlyOfficeMessage = (event: MessageEvent) => {
      try {
        // OnlyOffice sends messages from iframe
        // Check if message is from OnlyOffice iframe
        const iframe = document.querySelector(
          ".tw-w-full.tw-h-full iframe, [id*='editor'] iframe",
        ) as HTMLIFrameElement;
        if (iframe && event.source !== iframe.contentWindow) {
          return; // Ignore messages from other sources
        }
        
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        // STRICT CHECK: Only process messages that are specifically about version changes (type 2)
        // OnlyOffice sends onDocumentStateChange with type 2 when version changes
        // Must check: event type is onDocumentStateChange AND data.type === 2
        // Ignore all other state changes (type 0, 1) - these are normal document edits
        const isVersionChanged = 
          (data?.type === 'onDocumentStateChange' && 
           data?.data && 
           typeof data.data === 'object' && 
           data.data.type === 2) || 
          (data?.event === 'onDocumentStateChange' && 
           data?.data && 
           typeof data.data === 'object' && 
           data.data.type === 2) ||
          (data?.message && 
           (data.message.includes('Версия изменилась') || 
            data.message.includes('version changed')));
        
        // Only process if it's definitely a version change (type 2)
        // Ignore all other messages to prevent unnecessary reloads
        if (isVersionChanged) {
          console.log("OnlyOffice version changed message detected (type 2), reloading latest version:", data);
          
          // Prevent OnlyOffice from showing the modal by immediately reloading the document
          // First, close editor to force cleanup
          handleVisibleShowEditor(false);
          
          // Refetch data to get latest version with new updatedAt from server
          refetchData();
          
          // Wait for refetch to complete, then update docInfo and URL with new timestamp
          // This will clear OnlyOffice cache by changing the document key
          setTimeout(() => {
            // Get fresh URL from initialValues after refetch
            // The refetch should have updated initialValues with new finalFormUrl
            const freshUrl = initialValues?.finalFormUrl;
            
            if (freshUrl) {
              // Add timestamp to URL to bypass browser and OnlyOffice cache
              const urlWithCacheBuster = freshUrl.includes('?') 
                ? `${freshUrl}&_t=${Date.now()}`
                : `${freshUrl}?_t=${Date.now()}`;
              
              // Update initialDoc with cache-busted URL
              setInitialDoc(urlWithCacheBuster);
              
              // Update docInfo with new timestamp to force OnlyOffice to reload with new key
              // This will generate a new document.key in OnlyOfficeEditor, clearing the cache
              const newUpdatedAt = new Date().toISOString();
              
              // Update docInfo - this will trigger OnlyOfficeEditor to recreate with new key
              if (docInfo) {
                setDocInfo({
                  ...docInfo,
                  updatedAt: newUpdatedAt,
                });
              } else {
                // If docInfo doesn't exist, create it
                setDocInfo({
                  documentId: mainDTO?.id || mainDTO?.outComingId || outComingId,
                  fileType: "OUTCOMING_V4_FINAL_FILE",
                  updatedAt: newUpdatedAt,
                });
              }
              
              // Reopen editor - OnlyOfficeEditor will recreate with new key and URL
              // The new key will force OnlyOffice to reload the document from URL, bypassing cache
              setTimeout(() => {
                handleVisibleShowEditor(true);
              }, 300);
            }
          }, 800);
        }
      } catch (error) {
        // Ignore parsing errors for non-JSON messages
      }
    };

    window.addEventListener('message', handleOnlyOfficeMessage);

    return () => {
      window.removeEventListener('message', handleOnlyOfficeMessage);
    };
  }, [modalState, showEditor, docInfo, refetchData, initialValues?.finalFormUrl, initialValues?.docInfo]);

  useEffect(() => {
    if (initialValues) {
      if (initialValues?.signer?.userId) {
        setSelectSigner({
          id: initialValues?.signer?.userId,
          value: initialValues?.signer?.userName,
        });
      }

      if (initialValues?.docInfo) {
        setDocInfo(initialValues?.docInfo);
      } else {
        setDocInfo({
          documentId: mainDTO?.id || mainDTO?.outComingId || outComingId,
          fileType: "OUTCOMING_V4_FINAL_FILE",
        });
      }

      if (initialValues?.blank && blankList?.items) {
        const oneObj = blankList.items.find(
          (el) => el.id === Number(initialValues?.blank?.id)
        );
        if (oneObj) {
          const blankStr = JSON.stringify(oneObj);
          setSelectedBlank(blankStr);
          // Set initial blank ID for comparison
          setInitialBlankId(oneObj.id?.toString() || null);
          // If document already exists, mark as saved
          if (initialValues?.finalFormUrl) {
            setIsDocumentSaved(true);
          }
        }
      }

      if (initialValues?.finalFormUrl && initialValues?.newFormat) {
        setInitialDoc(initialValues?.finalFormUrl);
        setIsPdf(false);
        // Mark as saved if document exists
        setIsDocumentSaved(true);
        setIsFileSavedToService(true); // File already exists in service
        // Don't auto-open editor - user must click "Открыть" button
        // Update docInfo if it exists to ensure latest version
        if (initialValues?.docInfo?.updatedAt && docInfo) {
          setDocInfo({
            ...docInfo,
            updatedAt: initialValues.docInfo.updatedAt,
          });
        }
      }

      if (initialValues?.finalPdfUrl && initialValues?.newFormat) {
        setInitialDoc(initialValues?.finalPdfUrl);
        setIsPdf(true);
        // Automatically open editor if PDF exists
        if (initialValues?.finalPdfUrl) {
          setTimeout(() => {
            handleVisibleShowEditor(true);
          }, 500);
        }
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
      
      // Инициализируем qr из initialValues
      if (initialValues?.qr !== undefined) {
        setQrCodeResult(initialValues.qr);
      }
    }
  }, [initialValues, blankList]);

  //console.log("Testkskldjflksd");

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
          onClose={handleCloseModal}
        >
          <IconButton
            onClick={handleCloseModal}
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
      <main className="tw-grid tw-grid-cols-[1fr_4fr] tw-gap-1 tw-h-full">
        <aside className="tw-flex tw-flex-col tw-space-y-4 tw-h-full tw-overflow-y-auto tw-p-4 category-scrollbar">
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
              // Reset saved state when blank changes
              setIsDocumentSaved(false);
              setIsFileSavedToService(false); // Reset file saved state
              let selected = JSON.parse(e.target.value);

              setSelecting(true);

              try {
                let response = null;
                let fileName = "";
                let fileBlob = null;
                if (selected?.id) {
                  fileName = getParam(selected?.fileUrl) || selected?.fileName;
                  if (!fileName) {
                    const ext = selected?.fileName?.split(".").pop() || "docx";
                    fileName = `${crypto.randomUUID()}.${ext}`;
                  }
                  // Add 6 random numbers to filename
                  fileName = addRandomNumbersToFileName(fileName);
                  response = await fetch(selected?.fileUrl);
                  fileBlob = await response.blob();
                } else {
                  response = await fetch("/Empty.docx");
                  fileBlob = await response.blob();
                  fileName = `${crypto.randomUUID()}_${generateRandomNumbers()}.docx`;
                }

                const contentType =
                  response.headers.get("Content-Type") ||
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                const file = new window.File([fileBlob], fileName, {
                  type: contentType,
                });
                const formData = new FormData();
                formData.append("blank", file, fileName);
                await fileService
                  .saveOrReplaceFile(formData, {
                    documentId: mainDTO?.id || mainDTO?.outComingId || outComingId || docInfo?.documentId,
                    fileType: docInfo?.fileType || "OUTCOMING_V4_FINAL_FILE",
                    fileName: fileName,
                  })
                  .then((e) => {
                    // Check if response status is 200 (success)
                    if (e?.status === 200 || e?.status === 201) {
                      let resp = e as { data: IFileResponce };
                      setSaveOrReplaceData(resp.data);
                      setInitialDoc(resp?.data.url);
                      setIsFileSavedToService(true); // Mark file as saved to service
                    } else {
                      setIsFileSavedToService(false);
                      toast.error("Не удалось сохранить файл в файл-сервис");
                    }
                  })
                  .catch((error) => {
                    setIsFileSavedToService(false);
                    console.error("Error saving file to service:", error);
                    toast.error("Ошибка при сохранении файла в файл-сервис");
                  })
                  .finally(() => setSelecting(false));

                setSelectedBlank(e.target.value);
              } catch {
                setIsFileSavedToService(false);
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
            {blankList?.items?.map((item: any) => (
              <MenuItem key={item.id} value={JSON.stringify(item)}>
                {item.fileName}
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

          {/* Кнопка Сохранить - показывается перед документом, скрыта когда disabled */}
          {initialValues?.newFormat && (() => {
            // Проверяем все условия для disabled
            const isDisabled = 
              loading ||
              !selectedBlank || // Нет выбранного бланка
              !isFileSavedToService || // Файл не сохранен в файл-сервис
              initialValues?.transition?.buttonSettings?.btn_change?.readOnly ||
              usersChanged || // Участники изменены, но не сохранены
              // Кнопка disabled если бланк выбран и не изменился
              (initialBlankId !== null && selectedBlank && JSON.parse(selectedBlank)?.id?.toString() === initialBlankId);

            // Показываем кнопку только если она НЕ disabled
            if (isDisabled) {
              return null;
            }

            return (
              <Button
                onClick={() => handleSaveDoc(true)}
                type="button"
                variant="contained"
                fullWidth
              >
                Сохранить
              </Button>
            );
          })()}

          {initialDoc || selectedBlank ? (
            <div className="tw-w-full tw-border tw-p-4 tw-rounded-md">
              <p className="tw-text-blue-700">Документ</p>
              <div className="tw-flex tw-flex-row tw-items-center tw-justify-center tw-space-x-3 tw-py-2">
                {(() => {
                  const fileName = initialDoc ? findFileName(initialDoc) : "";
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
                    Название:
                    <Tooltip
                      title={
                        initialDoc ? findFileName(initialDoc) : "Без бланка"
                      }
                    >
                      <span className="tw-font-[300] tw-text-[14px] tw-text-ellipsis tw-whitespace-nowrap tw-overflow-hidden tw-block">
                        {initialDoc ? findFileName(initialDoc) : "Без бланка"}
                      </span>
                    </Tooltip>
                  </p>
                  {/* Кнопки Открыть и Закрыть показываются только после сохранения */}
                  <div className="tw-flex tw-flex-row tw-space-x-2">
                    <Button
                      variant="contained"
                      startIcon={<OpenInNewIcon />}
                      disabled={!isDocumentSaved || usersChanged}
                      onClick={() => {
                        setPdfFilePreviewModal(false);
                        handleVisibleShowEditor(true);
                      }}
                    >
                      Открыть
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<CloseIcon />}
                      disabled={!isDocumentSaved || usersChanged}
                      onClick={() => handleVisibleShowEditor(false)}
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
                initialValues?.transition?.buttonSettings?.btn_change?.readOnly ||
                usersChanged // Участники изменены, но не сохранены
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

          {!initialValues?.transition?.buttonSettings?.btn_setNumber?.hide ? (
            <Button
              disabled={
                initialValues?.transition?.buttonSettings?.btn_setNumber
                  ?.readOnly ||
                usersChanged // Участники изменены, но не сохранены
              }
              onClick={() => {
                setNumberMutate(outComingId);
              }}
              type="button"
              variant="contained"
            >
              Вставить номер в исходящих
            </Button>
          ) : (
            <></>
          )}


          {/* Кнопка Сохранить для старого формата - оставляем для совместимости */}
          {!initialValues?.newFormat && (
            <Button
              disabled={
                loading ||
                initialValues?.transition?.buttonSettings?.btn_change?.readOnly ||
                usersChanged // Участники изменены, но не сохранены
              }
              onClick={() => handleSaveDoc(true)}
              type="button"
              variant="contained"
            >
              {isPdf && showEditor ? "Изменить" : "Сохранить"}
            </Button>
          )}

          {!initialValues?.transition?.buttonSettings?.btn_sign?.hide ? (
            <Button
              onClick={signAnswerClick}
              disabled={
                initialValues?.transition?.buttonSettings?.btn_sign?.readOnly ||
                usersChanged // Участники изменены, но не сохранены
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
            disabled={usersChanged} // Участники изменены, но не сохранены
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
                initialValues?.transition?.buttonSettings?.btn_reject?.readOnly ||
                usersChanged // Участники изменены, но не сохранены
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
                </>
              );
            })}
          </div>

          {/* Кнопка Сохранить для участников - показывается когда участники изменены */}
          {(() => {

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
                      finalPdfUrl: null,
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
                      refetchData();
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

          {!initialValues?.transition?.buttonSettings?.btn_sendToApprove
            ?.hide ? (
            <Button
              disabled={
                initialValues?.transition?.buttonSettings?.btn_sendToApprove
                  ?.readOnly ||
                usersChanged // Участники изменены, но не сохранены
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
                  initialValues?.transition?.buttonSettings?.btn_done?.readOnly ||
                  usersChanged // Участники изменены, но не сохранены
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
                <File
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
        </aside>
        <div className="tw-h-full tw-p-2 tw-overflow-y-auto">
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
            <div className="tw-w-full tw-h-full tw-flex tw-flex-col">
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
                  url={initialDoc} 
                  fileName={initialDoc ? findFileName(initialDoc) || getParam(initialDoc) || "document.docx" : "document.docx"}
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
        onClose={() => {
          setSendToApproveOpen(false);
          setDoneOpen(false);
        }}
        descriptions={{
          btnTitle: doneOpen ? "Завершить" : "Сохранить",
          modalTitle: doneOpen ? "Завершить письмо" : "Отправить на подпись",
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
              await handleSaveDoc(false, async () => {
                const resp = await signAnswerLetter({
                  outComingId: mainDTO.outComingId,
                  comment: signAnswerComment,
                });

                if (!resp.hasOwnProperty("error")) {
                  setSignAnswerModal(false);
                  toast.success("Успешно подписан");
                }
                // Вызываем refetch в любом случае после подписания
                refetchData();
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
