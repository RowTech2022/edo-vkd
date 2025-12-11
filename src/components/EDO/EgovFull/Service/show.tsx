import { Card } from "@ui";
import { FC, useEffect, useMemo, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { EgovActions } from "./forms/EgovActions";
import { useFormik } from "formik";
import { EgovServiceForm } from "./forms/EgovServiceForm";
import { EgovRequiredFilesForm } from "./forms/EgovRequiredFilesForm";
import { transformValues } from "./helpers/transformValues";
import { toast } from "react-toastify";
import { deepCopy, newDateFormat, toastPromise } from "@utils";
import { generateFromForUpdate } from "./helpers/generateFromForUpdate";
import EgovIndicator from "./forms/EgovIndicator";
import {
  IEgovServiceRequestsActionRequest,
  IEgovServiceRequestsCreateDocRequest,
  IEgovServiceRequestsCreateResponse,
  useAddDownloadSignMutation,
  useAddFilesMutation,
  useApproveDocEgovServiceRequestsMutation,
  useApproveReadyTextMutation,
  useCloseEgovServiceRequestsMutation,
  useCreateDocEgovServiceRequestsMutation,
  useDownloadQRCodeMutation,
  useLazyFetchEgovServiceRequestsByIdQuery,
  useSignEgovServiceRequestsMutation,
  useUpdateEgovServiceRequestsMutation,
} from "@services/egovServiceRequests";
import { Reject, ResolutionSend } from "./modals";
import { Button, Modal, TextField, Typography } from "@mui/material";
import { Chat } from "./components/Chat";
import { IParentApi } from "@root/shared/types/Tree";
import { useOpenChatMutation } from "@services/chatEgovApi";
import { EgovFilesAcceptedForm } from "./forms/EgovFilesAcceptedForm";
import { initialValuesForUpdate } from "./helpers/schemaForUpdate";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EgovApplicationStatus } from "@root/components/Registries/EgovFull/Organisation/helpers/constants";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ReactQuill from "react-quill/lib";
import { reactQuillModules } from "../../LettersV3.5/InternalCorrespondence/Email/helpers/constants";
import "@react-pdf-viewer/core/lib/styles/index.css";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { useAppSelector } from "@root/store/hooks";
import RejectDocument from "./modals/RejectDocument";
import ChangePatState from "./modals/ChangePatState";

interface IEgovCreate {
  id?: number;
  orgId?: number;
  srvId?: number;
}

const saveAlerts = {
  pending: "Изменение сохраняются",
  success: "Изменение сохранено",
  error: "Произошла ошибка",
};

function saveBase64Image(base64String: string, fileName: string) {
  if (typeof window === "undefined") return;

  const binaryString = atob(base64String);

  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([byteArray], { type: "image/png" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;

  link.click();

  URL.revokeObjectURL(url);
}

const escapeTabsAndSpaces = (text: string) => {
  const htmlTagsRegex = /<\/?[^>]+>/g;

  const parts = text.split("\t");

  const paragraphs = parts.map((part) => {
    if (part === "") {
      return "&nbsp;";
    }

    if (htmlTagsRegex.test(part)) {
      return part;
    }

    return part.replace(/ /g, "&nbsp;");
  });

  return paragraphs.join("\t");
};

const EgovFullServiceShow: FC<IEgovCreate> = ({ id, orgId, srvId }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.split("/");
  const [fetchEgovServiceRequestsById, { isFetching }] =
    useLazyFetchEgovServiceRequestsByIdQuery();
  const [updateEgovServiceRequests] = useUpdateEgovServiceRequestsMutation();
  const [signEgovServicesRequests] = useSignEgovServiceRequestsMutation();
  const [createDocEgovServicesRequests] =
    useCreateDocEgovServiceRequestsMutation();
  const [approveDocEgovServicesRequests] =
    useApproveDocEgovServiceRequestsMutation();
  const [closeEgovServicesRequests] = useCloseEgovServiceRequestsMutation();
  const [downloadQRCode] = useDownloadQRCodeMutation();
  const [addDownloadSign] = useAddDownloadSignMutation();

  const [readyText, setReadyText] = useState("");
  const [readyFile, setReadyFile] = useState("");

  const [approveReadyText] = useApproveReadyTextMutation();
  const [addFiles] = useAddFilesMutation();

  const [modal, setModal] = useState<any>({
    show: false,
    component: Reject,
  });

  const [DTO, setDTO] = useState<IEgovServiceRequestsCreateResponse | null>(
    null
  );

  const [openChat] = useOpenChatMutation();

  const mode = useAppSelector((state) => state.snackbar.mode);

  const [discutionId, setDiscutionId] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  const [treeFromExecutors, setTreeFromExecutors] = useState<IParentApi | null>(
    null
  );

  const fetchData = async (id: number) => {
    await fetchEgovServiceRequestsById(id)
      .then((res: any) => {
        if (res.data) {
          setDTO(res.data);
          const readyText = res?.data?.readyDucementText?.readyText || "";
          //readyFile = res?.data?.readyDucementText?.signedReadyFile || ''

          const readyFile = `<img src="data:image/png;base64,${res?.data?.readyDucementText?.signedReadyFile}" alt="document-signature" />`;

          const signBase64 = res?.data?.readyDucementText?.sign;

          const updatedReadyText =
            readyText +
            `<br><br><br><br><br><br><img src="data:image/png;base64,${signBase64}" alt="document-signature" />`;

          setReadyText(
            res?.data?.readyDucementText?.sign ? updatedReadyText : readyText
          );

          setReadyFile(readyFile);
        }
      })
      .catch(() => {});
  };

  function base64Blob(base64Data: string, mimeType: string) {
    const base64WithoutPrefix = base64Data.replace(
      /^data:image\/png;base64,/,
      ""
    );
    const byteChars = atob(base64WithoutPrefix);
    const byteArrays = [];

    for (let offset = 0; offset < byteChars.length; offset += 512) {
      const slice = byteChars.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  const saveBase64AsPng = (base64: string, filename: string) => {
    const blob = base64Blob(base64, "image/png");
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const closeChat = (id: number) => {
    setChatOpen(false);
    fetchData(id);
  };

  const formikValues = useMemo(() => {
    return DTO ? generateFromForUpdate(DTO) : deepCopy(initialValuesForUpdate);
  }, [DTO]);

  const formik = useFormik({
    initialValues: formikValues,
    enableReinitialize: true,
    onSubmit(values) {
      const { acceptedFiles, ...others } = values;
      const payload = transformValues(others);

      toast.promise(
        async () => {
          let res = null;
          if (id) {
            res = await updateEgovServiceRequests({
              ...others,
            });
          }

          if (res && "data" in res) {
            navigate(
              `/modules/egovFull/Organisation/${orgId}/Service/${srvId}/show/${res.data.id}`
            );
          }
        },
        {
          pending: srvId ? "Изменение сохраняются" : "Услуга обновляться",
          success: srvId ? "Изменение сохранено" : "Услуга обновлена",
          error: "Произошла ошибка",
        }
      );
    },
  });
  const formik2 = useFormik({
    initialValues: formikValues,
    enableReinitialize: true,
    onSubmit(values) {
      const { acceptedFiles, ...others } = values;
      const payload = transformValues(others);

      toast.promise(
        async () => {
          let res = null;
          if (id) {
            res = await updateEgovServiceRequests({
              ...others,
            });
          }

          if (res && "data" in res) {
            navigate(
              `/modules/egovFull/Organisation/${orgId}/Service/${srvId}/show/${res.data.id}`
            );
          }
        },
        {
          pending: srvId ? "Изменение сохраняются" : "Услуга обновляться",
          success: srvId ? "Изменение сохранено" : "Услуга обновлена",
          error: "Произошла ошибка",
        }
      );
    },
  });
  const handles = {
    back() {
      navigate(-1);
    },

    save() {
      formik.submitForm();
    },

    sign() {
      const promise = signEgovServicesRequests({
        id: DTO?.id || 0,
        timestamp: "",
      });

      promise
        .then((res: any) => {
          if (!res.error && "data" in res) {
            setDTO(res.data);
          }
        })
        .catch((err) => console.log(err));

      toast.promise(promise, saveAlerts);
    },

    sendToResolution() {
      setModal({
        ...modal,
        show: true,
        component: ResolutionSend,
      });
    },
    rejectDocument() {
      setModal({
        ...modal,
        show: true,
        component: RejectDocument,
      });
    },

    changePatState() {
      setModal({
        ...modal,
        show: true,
        component: ChangePatState,
      });
    },
    createDoc() {
      if (!formik.values.acceptedFiles.length) {
        toast.error("Необходимо закрепить документ");
        return;
      }

      const payload: IEgovServiceRequestsCreateDocRequest = {
        id: Number(id),
        files: formik.values.acceptedFiles,
      };

      const promise = createDocEgovServicesRequests(payload);

      promise
        .then((res: any) => {
          if (!res.error && "data" in res) {
            setDTO(res.data);
          }
        })
        .catch((err) => console.log(err));

      toast.promise(promise, saveAlerts);
    },

    accept() {
      if (!formik.values.acceptedFiles.length) return;

      const payload: IEgovServiceRequestsActionRequest = {
        id: Number(id),
      };

      const promise = approveDocEgovServicesRequests(payload);

      toastPromise(promise, saveAlerts, {
        then(data) {
          setDTO(data);
        },
      });
    },

    close() {
      const promise = closeEgovServicesRequests({
        id: DTO?.id || 0,
        timestamp: "",
      });

      promise
        .then((res: any) => {
          if (!res.error && "data" in res) {
            setDTO(res.data);
          }
        })
        .catch((err) => console.log(err));

      toast.promise(promise, saveAlerts);
    },

    // Добавляем метод для обработки файлов
    addFiles({ id }: { id: number }) {
      if (!formik2.values.acceptedFiles.length) {
        toast.error("Необходимо прикрепить файлы");
        return;
      }

      const payload = {
        id,
        files: formik2.values.acceptedFiles,
      };

      const promise = addFiles(payload);

      promise
        .then((res: any) => {
          if (!res.error && "data" in res) {
            setDTO(res.data);
          }
        })
        .catch((err) => console.log(err));

      toast.promise(promise, saveAlerts);
    },
  };

  const downloadSign = async () => {
    try {
      const res = await addDownloadSign({
        requestId: id,
      });
      //@ts-ignore
      if (res?.data?.sign) {
        //@ts-ignore
        const base64Image = res.data.sign;
        const byteCharacters = atob(base64Image);
        const byteArray = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteArray], { type: "image/png" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "signed_document.png";
        link.click();
        toast.success("Успешно загружено");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, show: false });
  };

  const openChatWithClientModal = () => {
    if (!DTO?.userDiscutionId) {
      openChat({
        id: DTO?.id || 0,
        docType: 25,
        clientChat: true,
        timestamp: DTO?.timestamp || "",
      }).then((res: any) => {
        if (res.error) return;
        setDiscutionId(res.data.id);
        setChatOpen(true);
        setDTO(
          // @ts-ignore
          ({
            ...DTO,
            userDiscutionId: res.data.id,
          } as IEgovServiceRequestsCreateResponse) || null
        );
      });
    } else {
      setDiscutionId(DTO?.userDiscutionId);
      setChatOpen(true);
    }
  };

  const openChatModal = () => {
    if (!DTO?.mainDiscutionId) {
      openChat({
        id: DTO?.id || 0,
        docType: 25,
        clientChat: false,
        timestamp: DTO?.timestamp || "",
      }).then((res: any) => {
        if (res.error) return;
        setDiscutionId(res.data.id);
        setChatOpen(true);
        setDTO(
          // @ts-ignore
          ({
            ...DTO,
            mainDiscutionId: res.data.id,
          } as IEgovServiceRequestsCreateResponse) || null
        );
      });
    } else {
      setDiscutionId(DTO?.mainDiscutionId);
      setChatOpen(true);
    }
  };

  const docType = DTO?.egovServiceNameType == 2;
  const showReadyDocumentBlock = DTO?.showReadyDocumentBlock == true;

  const isFormDisabled = DTO?.state === EgovApplicationStatus.Done;
  const isFilesCollectShow =
    DTO?.readyFiles?.length !== 0 ||
    !DTO?.transitions?.buttonSettings?.btn_collect?.readOnly;

  const [docNumber, setDocNumber] = useState();
  const [protokolNumber, setProtokolNumber] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const handleSave = async () => {
    try {
      const resp = await approveReadyText({
        id,
        docNumber,
        protokolNumber,
        protokolDate: selectedDate,
      });

      if (!resp.hasOwnProperty("error")) {
        toast.success("Текст успешно сохранен");
      }
    } catch (error) {
      toast.error("Ошибка при сохранении");
    }
  };

  useEffect(() => {
    // Проверяем, что все поля заполнены
    if (docNumber && protokolNumber && selectedDate) {
      setIsSaveDisabled(false); // Разблокировать кнопку
    } else {
      setIsSaveDisabled(true); // Заблокировать кнопку
    }
  }, [docNumber, protokolNumber, selectedDate]);

  return (
    <>
      <form className="tw-flex tw-flex-col tw-gap-4 tw-pb-6">
        {/* <Card
          title={
            path.at(-1) !== "create"
              ? "Редактирование услуги"
              : "Создание услуги"
          }
        > */}
        <div className="tw-mt-4">
          <EgovActions
            // @ts-ignore
            handles={handles}
            transitions={DTO?.transitions}
            formik={formik}
            createMode={!Boolean(srvId)}
            disabled={isFormDisabled}
          >
            <EgovIndicator
              activeState={DTO?.state || 0}
              endStatus={EgovApplicationStatus.Done}
            />
          </EgovActions>
        </div>
        {/* </Card> */}

        {DTO?.regUserType == 2 && (
          <Card title="Информация об организации">
            <div
              style={{ paddingTop: 10 }}
              className={`tw-py-4 tw-px-4 mf_block_bg ${
                mode === "dark" && "tw-bg-dark-paper"
              } tw-rounded-[26px]`}
            >
              <EgovServiceForm DTO={DTO} org={true} />
            </div>
          </Card>
        )}

        <Card title="Основная информация">
          <div
            style={{ paddingTop: 10 }}
            className="tw-py-4 tw-px-4 mf_block_bg tw-rounded-[26px]"
          >
            <EgovServiceForm DTO={DTO} />
          </div>
        </Card>

        <Card title="Необходимые документы">
          <div className="tw-flex tw-flex-col">
            <Button
              sx={{ mb: "16px", alignSelf: "self-end" }}
              disabled={
                !DTO?.userDiscutionId &&
                DTO?.transitions?.buttonSettings?.btn_openChatWithClient
                  ?.readOnly
              }
              variant="outlined"
              onClick={() => {
                openChatWithClientModal();
              }}
            >
              {DTO?.userDiscutionId
                ? "Открыть чат с клиентом"
                : "Создать чат с клиентом"}
            </Button>
            <div
              style={{ paddingTop: 10 }}
              className="tw-py-4 tw-px-4 mf_block_bg tw-rounded-[26px]"
            >
              <EgovRequiredFilesForm
                uploadDisabled={isFormDisabled}
                formik={formik}
              />
            </div>
          </div>
        </Card>
        {DTO?.executor && (
          <Card title="Исполнитель">
            <div
              style={{ paddingTop: 10 }}
              className="tw-flex tw-items-center tw-justify-between tw-py-4 tw-px-4 mf_block_bg tw-rounded-[26px]"
            >
              <Typography>
                <b className="tw-bg-primary tw-py-3 tw-px-4 tw-mr-2 tw-rounded-full tw-text-emerald-50">
                  {DTO?.executor?.id}
                </b>
                {DTO?.executor?.value}
              </Typography>

              <Button
                disabled={
                  !DTO?.mainDiscutionId &&
                  DTO?.transitions?.buttonSettings?.btn_openChat?.readOnly
                }
                variant="outlined"
                onClick={() => {
                  openChatModal();
                }}
              >
                {DTO?.mainDiscutionId ? "Исполнение" : "Создать исполнение"}
              </Button>
            </div>
          </Card>
        )}

        {DTO && isFilesCollectShow && !docType && (
          <Card title="Результат - электронный документ с ЭЦП">
            <div
              style={{ paddingTop: 10 }}
              className="tw-flex tw-flex-col tw-gap-2 tw-py-4 tw-px-4 tw-mb-4 mf_block_bg tw-rounded-[26px]"
            >
              {DTO?.readyDucementText?.signedReadyFile && (
                <>
                  <div className="tw-border-2 tw-w-[65%] tw-m-[auto] tw-mb-4">
                    <img
                      className="tw-m-[auto]"
                      src={`data:image/png;base64,${DTO?.readyDucementText?.signedReadyFile}`}
                      alt="Документ с ЭЦП"
                    />
                  </div>
                </>
              )}

              {!DTO?.readyDucementText?.signedReadyFile && (
                <div className="tw-flex tw-gap-1 tw-flex-col">
                  <div className="tw-flex tw-gap-2 tw-flex-row">
                    <Button
                      disabled={
                        DTO?.transitions?.buttonSettings?.btn_collect?.readOnly
                      }
                      variant="outlined"
                      onClick={async () => {
                        const { data }: any = await downloadQRCode({
                          requestId: id,
                        });
                        if (data?.qrCode) {
                          saveBase64Image(data.qrCode, "qrcode.png");
                        }
                      }}
                    >
                      Загрузить qrCode
                    </Button>
                    <Button
                      disabled={
                        DTO?.transitions?.buttonSettings?.btn_collect?.readOnly
                      }
                      variant="outlined"
                      onClick={downloadSign}
                    >
                      Загрузить ЭЦП
                    </Button>
                  </div>
                  {DTO?.readyDucementText?.readyText && (
                    <ReactQuill
                      className="tw-w-[210mm] tw-h-[297mm] tw-m-auto tw-mb-10"
                      value={readyText}
                      modules={reactQuillModules}
                      onChange={(value) => setReadyText(value)}
                      theme="snow"
                    />
                  )}
                  <div className="tw-mt-8">
                    <EgovFilesAcceptedForm
                      uploadDisabled={
                        DTO?.transitions?.buttonSettings?.btn_collect?.readOnly
                      }
                      formik={formik2}
                      text="Word не более 10MB"
                    />
                    <div className="tw-self-end tw-flex tw-gap-4 tw-mt-6 tw-justify-end tw-mb-6">
                      <Button
                        disabled={
                          DTO?.transitions?.buttonSettings?.btn_collect
                            ?.readOnly
                        }
                        variant="outlined"
                        onClick={() => {
                          handles.addFiles({ id: id });
                        }}
                      >
                        Сохранить
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!DTO?.readyDucementText?.readyText &&
                DTO?.readyDucementText?.sign && (
                  <div className="tw-border-2 tw-w-[65%] tw-m-[auto] tw-mb-4">
                    <img
                      className="tw-m-[auto]"
                      src={`data:image/png;base64,${DTO?.readyDucementText?.sign}`}
                      alt="ЭЦП"
                    />
                  </div>
                )}

              {DTO?.readyDucementText?.signedReadyFile && (
                <div className="tw-flex tw-gap-6 tw-justify-center">
                  <Button
                    endIcon={<FileDownloadOutlinedIcon />}
                    size="medium"
                    variant="outlined"
                    onClick={async () => {
                      // @ts-ignore
                      const fileUrl =
                        DTO?.readyDucementText?.signedReadyFileUrl;
                      if (fileUrl) {
                        try {
                          const response = await fetch(fileUrl);
                          const blob = await response.blob();
                          const link = document.createElement("a");
                          link.href = URL.createObjectURL(blob);
                          link.download = "signed_document.pdf";
                          link.click();
                        } catch (error) {
                          console.error("Ошибка при скачивании файла:", error);
                        }
                      }
                    }}
                  >
                    Сохранить
                  </Button>

                  <Button
                    endIcon={<LocalPrintshopOutlinedIcon />}
                    size="medium"
                    variant="outlined"
                    onClick={() => {
                      // Загружаем PDF по ссылке
                      const pdfUrl = DTO?.readyDucementText?.signedReadyFileUrl;

                      if (pdfUrl) {
                        const printWindow = window.open(pdfUrl, "_blank");
                        printWindow?.focus();
                      }
                    }}
                  >
                    Распечатать
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {DTO && isFilesCollectShow && docType && showReadyDocumentBlock && (
          <Card title="Результат - электронный документ с ЭЦП">
            <div className="tw-flex tw-flex-col tw-gap-2 tw-py-4 tw-px-4 tw-mb-4 mf_block_bg tw-rounded-[26px]">
              {/* Блок для signedReadyFile */}
              {DTO?.readyDucementText?.signedReadyFile && (
                <>
                  <div className="tw-flex tw-justify-center tw-gap-2 tw-mt-4 tw-mb-4">
                    <TextField
                      label="Номер документа"
                      name="docNumber"
                      size="small"
                      type="number"
                      value={docNumber}
                      // @ts-ignore
                      onChange={(e) => setDocNumber(Number(e.target.value))}
                      required
                    />
                    <TextField
                      name="protokolNumber"
                      size="small"
                      type="number"
                      label="Номер протокола"
                      value={protokolNumber}
                      onChange={(e) =>
                        // @ts-ignore
                        setProtokolNumber(Number(e.target.value))
                      }
                      required
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        inputFormat={newDateFormat}
                        label="Дата протокола"
                        renderInput={(params) => (
                          <TextField size="small" {...params} required />
                        )}
                      />
                    </LocalizationProvider>
                    <Button
                      variant="outlined"
                      onClick={handleSave}
                      disabled={isSaveDisabled}
                    >
                      Сохранить
                    </Button>
                  </div>
                  <div className="tw-border-2 tw-w-[65%] tw-m-[auto] tw-mb-4">
                    <img
                      className="tw-m-[auto]"
                      src={`data:image/png;base64,${DTO?.readyDucementText?.signedReadyFile}`}
                      alt="Документ с ЭЦП"
                    />
                  </div>
                </>
              )}

              {/* Блок для readyText, если нет signedReadyFile */}
              {!DTO?.readyDucementText?.signedReadyFile &&
                DTO?.readyDucementText?.readyText && (
                  <div className="tw-flex tw-gap-1 tw-flex-col">
                    <div className="tw-flex tw-gap-2 tw-flex-row">
                      <Button
                        disabled={
                          DTO?.transitions?.buttonSettings?.btn_collect
                            ?.readOnly
                        }
                        variant="outlined"
                        onClick={async () => {
                          const { data }: any = await downloadQRCode({
                            requestId: id,
                          });
                          if (data?.qrCode) {
                            saveBase64Image(data.qrCode, "qrcode.png");
                          }
                        }}
                      >
                        Загрузить qrCode
                      </Button>
                      <Button
                        disabled={
                          DTO?.transitions?.buttonSettings?.btn_collect
                            ?.readOnly
                        }
                        variant="outlined"
                        onClick={downloadSign}
                      >
                        Загрузить ЭЦП
                      </Button>
                    </div>
                    <div className="tw-mt-8">
                      <EgovFilesAcceptedForm
                        uploadDisabled={
                          DTO?.transitions?.buttonSettings?.btn_collect
                            ?.readOnly
                        }
                        formik={formik2}
                        text="Word не более 10MB"
                      />
                      <div className="tw-self-end tw-flex tw-gap-4 tw-mt-6 tw-justify-end tw-mb-6">
                        <Button
                          disabled={
                            DTO?.transitions?.buttonSettings?.btn_collect
                              ?.readOnly
                          }
                          variant="outlined"
                          onClick={() => {
                            handles.addFiles({ id: id });
                          }}
                        >
                          Сохранить
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

              {/* Блок для sign, если нет readyText */}
              {!DTO?.readyDucementText?.readyText &&
                DTO?.readyDucementText?.sign && (
                  <>
                    <div className="tw-border-2 tw-w-[65%] tw-m-[auto] tw-mb-4">
                      <img
                        className="tw-m-[auto]"
                        src={`data:image/png;base64,${DTO?.readyDucementText?.sign}`}
                        alt="ЭЦП"
                      />
                    </div>
                  </>
                )}
              {DTO?.readyDucementText?.signedReadyFile && (
                <div className="tw-flex tw-gap-6 tw-justify-center">
                  <Button
                    endIcon={<FileDownloadOutlinedIcon />}
                    size="medium"
                    variant="outlined"
                    onClick={async () => {
                      // @ts-ignore
                      const fileUrl =
                        DTO?.readyDucementText?.signedReadyFileUrl;
                      if (fileUrl) {
                        try {
                          const response = await fetch(fileUrl);
                          const blob = await response.blob();
                          const link = document.createElement("a");
                          link.href = URL.createObjectURL(blob);
                          link.download = "signed_document.pdf";
                          link.click();
                        } catch (error) {
                          console.error("Ошибка при скачивании файла:", error);
                        }
                      }
                    }}
                  >
                    Сохранить
                  </Button>

                  <Button
                    endIcon={<LocalPrintshopOutlinedIcon />}
                    size="medium"
                    variant="outlined"
                    onClick={() => {
                      // Загружаем PDF по ссылке
                      const pdfUrl = DTO?.readyDucementText?.signedReadyFileUrl;

                      if (pdfUrl) {
                        const printWindow = window.open(pdfUrl, "_blank");
                        printWindow?.focus();
                      }
                    }}
                  >
                    Распечатать
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {isFilesCollectShow && (
          <Card title="Результат">
            <div
              style={{ paddingTop: 10 }}
              className="tw-flex tw-flex-col tw-gap-2 tw-py-4 tw-px-4 tw-mb-4 mf_block_bg tw-rounded-[26px]"
            >
              <EgovFilesAcceptedForm
                uploadDisabled={
                  DTO?.transitions?.buttonSettings?.btn_collect?.readOnly
                }
                formik={formik}
              />
              <div className="tw-self-end tw-flex tw-gap-4">
                <Button
                  disabled={
                    DTO?.transitions?.buttonSettings?.btn_collect?.readOnly
                  }
                  variant="outlined"
                  onClick={() => {
                    handles.createDoc();
                  }}
                >
                  Сохранить
                </Button>
                <Link to={`${pathname}`}>
                  <Button
                    disabled={
                      DTO?.transitions?.buttonSettings?.btn_acceptcollect
                        ?.readOnly
                    }
                    variant="contained"
                    onClick={() => {
                      handles.accept();
                    }}
                  >
                    Принять
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </form>
      <div id="modals">
        <Modal open={modal.show}>
          <modal.component
            onClose={handleCloseModal}
            onSubmit={modal.onSubmit}
            resolutionId={modal.resolutionId}
            forExecute={modal.forExecute}
            {...DTO}
            setDTO={setDTO}
          />
        </Modal>
        <Chat
          subject={"values?.content1"}
          mainFiles={DTO?.files}
          prefix="EgovServiceRequest_"
          open={chatOpen}
          discutionId={discutionId}
          incomingId={Number(DTO?.id) || 0}
          executorId={Number(DTO?.executor?.id) || 0}
          closeChat={closeChat}
          setMainDTO={setDTO}
          tree={treeFromExecutors}
        />
      </div>
    </>
  );
};

export default EgovFullServiceShow;
