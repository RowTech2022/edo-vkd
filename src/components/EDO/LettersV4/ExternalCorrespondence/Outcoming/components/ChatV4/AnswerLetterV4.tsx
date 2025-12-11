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
  useDoneLetterV4Mutation,
  useFetchLetterApproveListV4Query,
  useRejectAnswerOutcomingV4Mutation,
  useSendToApproveLetterV4Mutation,
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

const findFileName = (url: string) => {
  if (url) {
    const parsedUrl = new URL(url);
    const fileName = parsedUrl.searchParams.get("fileName");
    return fileName;
  }
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
  const [answerMyBlanks, { data: blankList }] = useAnswerMyBlanksMutation();
  const [selectedBlank, setSelectedBlank] = useState(null);
  const [selectSearchValue, setSelectSearchValue] = useState("");
  const [selectSigner, setSelectSigner] = useState(null);
  const [initialDoc, setInitialDoc] = useState(null);
  const [editorCore, setEditorCore] = useState(null);
  const [usersModal, setUsersModal] = useState(false);
  const [editorValue, setEditorValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showContent, setShowContent] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  let [addLettersFile, setAddLettersFile] = useState<UploadFileLetters[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadFileLetters | null>(
    null
  );
  const [pdfFilePreviewModal, setPdfFilePreviewModal] = useState(false);

  const handleVisibleShowEditor = (state: boolean) => {
    setShowEditor(state);
  };

  const [signAnswerModal, setSignAnswerModal] = useState(false);
  const [signAnswerComment, setSignAnswerComment] = useState("");

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [sendToApproveOpen, setSendToApproveOpen] = useState(false);
  const [doneOpen, setDoneOpen] = useState(false);

  const [showMember, setShowMember] = useState<null | number>(null);
  const [showSign, setShowSign] = useState(null);

  const [showCommentEds, setShowCommentEds] = useState(false);

  const [rejectLetterOutcoming] = useRejectAnswerOutcomingV4Mutation();

  const [sendToApprove] = useSendToApproveLetterV4Mutation();
  const [doneLetter] = useDoneLetterV4Mutation();

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
    const promise = deleteMember({
      userId: user.id,
      ["outComingId"]: mainDTO?.id,
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
      const doc = editorCore.documentViewer.getDocument();

      // Получаем .docx
      const docxFileData = await doc.getFileData({ downloadType: "docx" });
      const docxBlob = new Blob([docxFileData], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const formData = new FormData();
      formData.append(
        "file",
        docxBlob,
        `outComingId_${mainDTO?.outComingId}_finalDoc.docx`
      );

      const uploadResponse = await fileService.uploadFileV2(formData);
      const docxResp = uploadResponse as { data: IFileResponce };
      let pdfResp = null;

      if (paramFunc) {
        const pdfFileData = await doc.getFileData({ downloadType: "pdf" });
        const pdfBlob = new Blob([pdfFileData], {
          type: "application/pdf",
        });

        const pdfFormData = new FormData();
        pdfFormData.append(
          "file",
          pdfBlob,
          `outComingId_${mainDTO?.outComingId}_finalDoc.pdf`
        );

        const pdfUploadResp = await fileService.uploadFileV2(pdfFormData);
        pdfResp = pdfUploadResp as { data: IFileResponce };
      }

      // Основной submit
      handleSubmit({
        isRefetchable,
        executorIds: selectedUsers?.map((el) => el.id),
        signerId: +selectSigner?.id,
        language: 1,
        content: editorValue,
        blankId: Number(JSON.parse(selectedBlank)?.id),
        fileUrl: docxResp.data,
        finalPdfUrl: pdfResp?.data,
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

  useEffect(() => {
    answerMyBlanks({});
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
        const oneObj = blankList?.items?.find(
          (el) => el.id === +initialValues?.blank?.id
        );
        setSelectedBlank(JSON.stringify(oneObj));
        setInitialDoc(oneObj?.value);
      }

      if (initialValues?.finalFormUrl && initialValues?.newFormat) {
        setInitialDoc(initialValues?.finalFormUrl);
        setIsPdf(false);
      }

      if (initialValues?.finalPdfUrl && initialValues?.newFormat) {
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

  console.log("Testkskldjflksd");

  return (
    <Dialog
      sx={{
        "& .MuiPaper-root": { height: "94vh", width: "100vw" },
        // position: "relative",
        overflow: "hidden",
        position: "relative",
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
            onChange={(e) => {
              const selected = JSON.parse(e.target.value);
              setSelectedBlank(e.target.value);
              setInitialDoc(selected?.fileUrl);
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
                    return <WordIcon />;
                  }

                  if (
                    lowerFileName.endsWith(".xls") ||
                    lowerFileName.endsWith(".xlsx")
                  ) {
                    return <ExcelIcon />;
                  }

                  if (lowerFileName.endsWith(".pdf")) {
                    return <PdfIcon />;
                  }

                  return <InsertDriveFileIcon sx={{ fontSize: 40 }} />;
                })()}
                <div className="tw-w-[85%] tw-flex tw-flex-col tw-space-y-3">
                  <p className="tw-text-[12px] tw-font-[600]">
                    Название:
                    <Tooltip
                      title={
                        initialDoc ? findFileName(initialDoc) : "Без бланка"
                      }
                    >
                      <span className="tw-font-[300] tw-text-ellipsis tw-whitespace-nowrap tw-overflow-hidden tw-block">
                        {initialDoc ? findFileName(initialDoc) : "Без бланка"}
                      </span>
                    </Tooltip>
                  </p>
                  <div className="tw-flex tw-flex-row tw-space-x-2">
                    <Button
                      size="small"
                      sx={{ fontSize: "12px" }}
                      variant="contained"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => {
                        setPdfFilePreviewModal(false);
                        handleVisibleShowEditor(true);
                      }}
                    >
                      Открыть
                    </Button>
                    <Button
                      size="small"
                      sx={{ fontSize: "12px" }}
                      variant="contained"
                      startIcon={<CloseIcon />}
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

          {!initialValues?.transition?.buttonSettings?.btn_setNumber?.hide ? (
            <Button
              disabled={
                initialValues?.transition?.buttonSettings?.btn_setNumber
                  ?.readOnly
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

          {!initialValues?.transition?.buttonSettings?.btn_set_sign?.hide ? (
            <Button
              onClick={() => {
                if (mainDTO) {
                  getAnswerDataForSign(mainDTO?.["outComingId"]).then(
                    ({ data }) => {
                      setInitialDoc(data?.[0]);
                    }
                  );
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

          <Button
            disabled={
              loading ||
              initialValues?.transition?.buttonSettings?.btn_change?.readOnly
            }
            onClick={() => handleSaveDoc(true)}
            type="button"
            variant="contained"
          >
            {isPdf && showEditor ? "Изменить" : "Сохранить"}
          </Button>

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
            <div className="tw-w-full tw-h-full">
              <OnlyOfficeEditor url={initialDoc} fileName="Test.docx" />
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
