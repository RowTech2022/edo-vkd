import {
  Autocomplete,
  Button,
  IconButton,
  FormGroup,
  Modal,
  TextField,
  Box,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useFormik } from "formik";

import dayjs from "dayjs";
import { File } from "./components/File";
import {
  Card,
  CheckIcon,
  DiskIcon,
  CrossCircleIcon,
  FileDeleteIcon,
  ChevronLeftIcon,
  CustomTextField,
  UploadFileCard,
} from "@ui";
import {
  ChangeEvent,
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ChatIcon from "@mui/icons-material/Chat";

import { IncomingNewLettersMainDTO } from "@services/lettersNewApi";

import {
  useFetchContragentQuery,
  useFetchSenderTypeQuery,
  useFetchOrganisationListQuery,
} from "@services/generalApi";
import { Reject, ResolutionSend } from "./modals";

import { IParentApi } from "@root/shared/types/Tree";
import { ValueId } from "@services/api";
import { UploadFileLetters } from "@services/internal/incomingApi";
import {
  IAnswerByOwnRequest,
  IChooseSecretarReq,
  IncomingLettersV4MainDTO,
  useAnswerByOwnMainLettersV4Mutation,
  useChooseSecretaryMutation,
  useCloseIncomingV4Mutation,
  useSaveIncomingLettersV4Mutation,
  useUpdateIncomingV4Mutation,
  useUploadReadyDocumentMutation,
  useFetchMakeVisaMutation,
  useFetchFolderListLetterV4Query,
  useFetchMakeSubVisaMutation,
  useFetchMakeThirdVisaMutation,
  useLazyGetExecutorsQuery,
  useLazyFetchLettersV4ById2Query,
  useChangeReadFlagMutation,
  useCreateAnswerLetterV4Mutation,
  useSignAnswerLetterV4Mutation,
  useLazyGetAnswerByIdQuery,
  useDeleteFileIncomingV4Mutation,
} from "@services/lettersApiV4";
import { IUser } from "@services/userprofileApi";
import { newDateFormat, formatDate, toastPromise } from "@utils";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useNavigate, useParams } from "react-router";
import { IncomingIndicatorV4 } from "@root/components";
import { validateLettersFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import FileService from "@root/shared/ui/Card/service/fileService";
import fileService from "@services/fileService";
import ChatV4 from "./components/ChatV4/ChatV4";
import DocumentPdf from "./components/ChatV4/components/DocumentPdf";
import { useDynamicSearchParams } from "@hooks";
import { AppRoutes } from "@configs";
import AnswerLetterV4Copy from "./components/ChatV4/AnswerLetterV4Copy";
import SelectOrgModal from "../components/SelectOrgModal";

type Props = {
  new?: boolean;
  short?: boolean;
  entry?: IncomingLettersV4MainDTO;
  refetchData?: () => void;
  refetchSearch?: () => void;
};

const INITIAL_VALUES: Pick<
  Nullable<IncomingNewLettersMainDTO>,
  | "incomeNumber"
  | "outcomeNumber"
  | "receivedDate"
  | "senderType"
  | "contragent"
  | "contact"
  | "haveMainResult"
  | "executor"
  | "content1"
  | "term"
  | "body"
  | "chatFolder"
  | "files"
> = {
  incomeNumber: "",
  outcomeNumber: "",
  receivedDate: null,
  senderType: null,
  contragent: null,
  contact: null,
  executor: null,
  haveMainResult: false,
  content1: null,
  term: null,
  body: null,
  chatFolder: null,
  files: null,
};

enum IncommingStatus {
  Registration = 1, //
  ToResolution = 2, // на резолюцию
  Execution = 3, // на испольнение
  Approved1 = 4, // конецелярия
  Done = 200, // Завершено - Отклонено
  Undo = 6, // Отклонено
  AwaitingSignature = 8,

  Delete = 100,
}

export const IncomingCreateV4Context = createContext<any>({});

const IncomingCreateV4 = (props: Props) => {
  const ref = useRef<HTMLObjectElement>(null);
  const navigate = useNavigate();
  const params = useParams();
  const { params: searchParams } = useDynamicSearchParams();

  const [mainDTO, setMainDTO] = useState<any | undefined>(props.entry); // IncomingLettersV3MainDTO
  const [isMinimize, setIsMinimize] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [pdfFilePreviewModal, setPdfFilePreviewModal] = useState(false);

  let [addLettersFile, setAddLettersFile] = useState<UploadFileLetters[]>(
    props?.entry?.files || []
  );

  const [byMainExecutor, setByMainExecutor] = useState<boolean>(
    props.entry?.prepareByMainExecutor ?? false
  );
  const [answerByOwnMain] = useAnswerByOwnMainLettersV4Mutation();

  const [deleteFile] = useDeleteFileIncomingV4Mutation();

  const docType = 21; // enum for document LetterV3 and for creating folder for file.

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [byMainExecutor]);

  const senderTypes = useFetchSenderTypeQuery();
  const folderList = useFetchFolderListLetterV4Query().data?.items.map(
    (el: any) => {
      return {
        id: el.id.toString(),
        value: el.name,
        prefix: el.prefix,
      };
    }
  );

  const [saveList] = useSaveIncomingLettersV4Mutation();
  const [updateList] = useUpdateIncomingV4Mutation();
  const [chooseSecretar] = useChooseSecretaryMutation();
  const [uploadDocuments] = useUploadReadyDocumentMutation();
  const [changeReadFlag] = useChangeReadFlagMutation();
  const [
    createLetterAnswer,
    { data: createAnswerData, isLoading: createAnswerLoading },
  ] = useCreateAnswerLetterV4Mutation();

  const [signAnswerLetter, { isLoading: isSignAnswerLoading }] =
    useSignAnswerLetterV4Mutation();

  const [getAnswerById, { data: singleAnswer }] = useLazyGetAnswerByIdQuery();

  const [fetchRecord] = useLazyFetchLettersV4ById2Query();

  const [fetchMakeVisa, { isSuccess: makeFirstVisaSuccess }] =
    useFetchMakeVisaMutation();
  const [fetchMakeSubVisa, { isSuccess: makeSubVIsaSuccess }] =
    useFetchMakeSubVisaMutation();

  const [fetchMakeThirdVisa, { isSuccess: makeThirdVisaSuccess }] =
    useFetchMakeThirdVisaMutation();

  const [getExecutors, { data: executorsResp }] = useLazyGetExecutorsQuery();

  const refetchGetExecutors = () => {
    getExecutors(Number(searchParams?.recordId || params?.id));
  };

  useEffect(() => {
    if (searchParams?.recordId || params?.id) {
      getExecutors(Number(searchParams?.recordId || params?.id));
    }
  }, [searchParams?.recordId, params?.id]);

  useEffect(() => {
    if (makeSubVIsaSuccess || makeThirdVisaSuccess) {
      getExecutors(Number(searchParams?.recordId || params?.id));
    }
  }, [makeSubVIsaSuccess, makeThirdVisaSuccess, getExecutors]);

  useEffect(() => {
    if (makeFirstVisaSuccess) {
      getExecutors(Number(searchParams?.recordId || params?.id));

      fetchRecord(+(searchParams?.recordId || params?.id)).then((res) => {
        if (res.data) {
          setMainDTO(res.data);
        }
      });
    }
  }, [makeFirstVisaSuccess, getExecutors]);

  useEffect(() => {
    if (mainDTO && mainDTO.isNew) {
      changeReadFlag({
        id: mainDTO.id,
        read: true,
      }).then(() => {
        props.refetchSearch?.();
      });
    }
  }, [mainDTO]);

  const makeVisaLetV4 = (body: any) => {
    toast.promise(
      async () => {
        const result: any = await fetchMakeVisa({
          ...body,
          incomingId: mainDTO?.id,
          files: addLettersFile?.map((el: any) => el.url),
        });

        if ("error" in result) {
          throw new Error(
            result.error?.data?.message || "Ошибка при визировании"
          );
        }

        return result;
      },
      {
        pending: "Загрузка...",
        success: "Документ визирован",
        error: "Произошла ошибка",
      }
    );
  };

  const makeSubVisaLetV4 = (body: any) => {
    console.log(6666);
    toast.promise(
      async () => {
        const result: any = await fetchMakeSubVisa({
          ...body,
          incomingId: mainDTO?.id,
          files: [],
          type: 1,
        });

        if ("error" in result) {
          throw new Error(
            result.error?.data?.message || "Ошибка при визировании"
          );
        }

        return result;
      },
      {
        pending: "Загрузка...",
        success: "Документ визирован",
        error: "Произошла ошибка",
      }
    );
  };

  const makeThirdVisaLetV4 = (body: any) => {
    fetchMakeThirdVisa({
      ...body,
      incomingId: mainDTO?.id,
    });
  };

  const [modal, setModal] = useState<any>({
    show: false,
    component: Reject,
  });
  const [secretary, setSecretary] = useState<ValueId | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [selectedFile, setSelectedFile] = useState<UploadFileLetters | null>(
    null
  );

  const [chatOpen, setChatOpen] = useState(false);
  const [chatAnswerOpen, setChatAnswerOpen] = useState(false);
  const [text, setText] = useState<string | undefined>();
  const [selectOrgVisible, setSelectOrgVisible] = useState(false);
  const organisationsList = useFetchOrganisationListQuery({
    text,
  }).data?.items.map((el: any) => {
    return {
      id: el.id.toString(),
      value: el.value,
    };
  });

  const createLetterAnswerSubmit = async ({
    isRefetchable,
    ...values
  }): Promise<boolean> => {
    try {
      const resp: any = await createLetterAnswer({
        ...values,
        incomingId: mainDTO?.id,
      });

      if (!resp.hasOwnProperty("error")) {
        isRefetchable &&
          getAnswerById(Number(searchParams?.recordId || params?.id));
        toast.success("Успешно сохранено");
        return true; // УСПЕХ
      } else {
        toast.error(resp?.error?.data?.Message);
        return false; // ОШИБКА
      }
    } catch (e) {
      toast.error("Ошибка при сохранении ответа");
      return false;
    }
  };

  const onContragentInputChange = (e: any, value: string) => {
    setText(value);
  };

  useEffect(() => {
    const data = mainDTO?.mainExecutor;
    if (data && mainDTO?.secretary?.id !== secretary?.id) {
      setSecretary(mainDTO?.secretary || null);
    }
  }, [mainDTO?.mainExecutor, mainDTO?.secretary]);

  useEffect(() => {
    if (mainDTO?.secretary?.id !== secretary?.id) {
      setSecretary(mainDTO?.secretary || null);
    }

    setAnswerText(mainDTO?.mainAnswerText || "");
  }, []);

  const onChooseSecretar = (secretary: IUser) => {
    const payload: IChooseSecretarReq = {
      executorId: Number(mainDTO?.mainExecutor?.id) || 0,
      incomingId: Number(mainDTO?.id),
      secretary: {
        id: secretary.id,
        value: secretary.value,
      },
      mainSecretarChoose: true,
    };

    const promise = chooseSecretar(payload);

    toast.promise(promise, {
      pending: "Данные сохраняются",
      success: "Данные успешно сохранены",
      error: "Произошла ошибка",
    });
  };

  const onAnswerMain = (type: number) => {
    const payload: IAnswerByOwnRequest = {
      text: answerText,
      incomingId: Number(mainDTO?.id),
      executorId: Number(mainDTO?.mainExecutor?.id) || 0,
      type,
      secretary: true,
    };
    payload.type = type;
    toast.promise(
      async () => {
        await answerByOwnMain(payload).then((res: any) => {
          if (res.data) {
            setMainDTO(res.data);
          }
        });
      },
      {
        pending: "Сохранение",
        success: "Сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new || (mainDTO && mainDTO.state === IncommingStatus.Registration)
    );
  }, [props]);

  const handleSave = (values: typeof INITIAL_VALUES) => {
    toast.promise(
      async () => {
        const res = await saveList(values);
        if ("data" in res) {
          navigate(`/modules/letters-v4/incomming/show/${res.data.id}`);
          return; // всё хорошо
        }
        // Если ошибки нет, но и data нет — считаем это ошибкой
        throw new Error("Ошибка при сохранении входящего письма");
      },
      {
        pending: "Входящее письмо сохраняется",
        success: "Входящее письмо сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const [closeInc] = useCloseIncomingV4Mutation();

  const closeLetter = () => {
    toast.promise(
      async () => {
        var res = await closeInc({
          id: mainDTO?.id || 0,
          currentState: mainDTO?.state || 1,
          timestamp: mainDTO?.timestamp || "",
          approveBy: 0,
          comment: "",
        });
        if ("data" in res) {
          navigate(AppRoutes.LETTERS_V4_INCOMING);
          props.refetchData();
        }
      },
      {
        pending: "Письмо отправка на закрытия",
        success: "Письмо закрыта",
        error: "Произошла ошибка",
      }
    );
  };

  const handleUpdate = ({
    incomeNumber,
    outcomeNumber,
    receivedDate,
    senderType,
    chatFolder,
    contragent,
    contact,
    executor,
    content1,
    term,
    body,
    files,
  }: typeof INITIAL_VALUES) => {
    if (mainDTO) {
      toast.promise(
        updateList({
          id: mainDTO.id,
          incomeNumber,
          outcomeNumber,
          receivedDate,
          senderType,
          chatFolder,
          contragent,
          contact,
          executor,
          content1,
          term,
          body,
          files,
          timestamp: mainDTO.timestamp,
        }),
        {
          pending: "Входящее письмо обновляется",
          success: "Входящее письмо обновлено",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const openChatModal = () => {
    // if (!mainDTO?.discutionId) {
    //   openDiscution({
    //     incomingId: mainDTO?.id || 0,
    //     executorId: Number(mainDTO?.mainExecutor?.id) || 0,
    //     letter_Type: formatOutcoming,
    //   }).then((res: any) => {
    //     if (res.error) return;
    //     setDiscutionId(res.data.discutionId);
    //     setChatOpen(true);
    //   });
    // } else {
    //   setDiscutionId(mainDTO?.discutionId);
    //   setChatOpen(true);
    // }
    setChatOpen(true);
  };

  const handleResolutionSendClick = () => {
    setModal({
      ...modal,
      show: true,
      component: ResolutionSend,
    });
  };

  const handleCloseModal = () => {
    props?.refetchData?.();
    setModal({ ...modal, show: false });
  };

  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    enableReinitialize: true,
    initialValues: props.new
      ? INITIAL_VALUES
      : ({
          incomeNumber: mainDTO?.incomeNumber,
          outcomeNumber: mainDTO?.outcomeNumber,
          receivedDate: mainDTO?.receivedDate,
          senderType: mainDTO?.senderType,
          contragent: mainDTO?.contragent,
          contact: mainDTO?.contact,
          executor: mainDTO?.executor,
          content1: mainDTO?.content1,
          term: mainDTO?.term,
          body: mainDTO?.body,
          files: addLettersFile,
          chatFolder: mainDTO?.chatFolder,
        } as typeof INITIAL_VALUES),
    onSubmit: (values) => {
      if (props.new) {
        handleSave({
          ...values,
          receivedDate: dayjs(values?.receivedDate).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        });
      } else {
        handleUpdate({
          ...values,
          receivedDate: dayjs(values?.receivedDate).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        });
      }
    },
  });

  let executors = useMemo(() => {
    return mainDTO?.executors
      ? JSON.parse(JSON.stringify(mainDTO?.executors))
      : [];
  }, [mainDTO]);

  if (executors.length > 0) {
    const findActiveParent = (executor: Array<IParentApi>) => {
      (executor as any).childs.map((el: any) => {
        el.canAdd
          ? el.childs.map((child: any) => (child.canEdit = true))
          : findActiveParent(el);
      });
    };
    executors.map((el: IParentApi) =>
      el.childs.length > 0 ? findActiveParent(el as any) : ""
    );
  }

  const onSelectFile = (file: UploadFileLetters) => {
    // if (file.fullUrl && myRef.current) {
    //   myRef.current.setAttribute("data", file.fullUrl);
    // }
    setSelectedFile(file);
    setPdfFilePreviewModal(true);
  };

  const handleFileRemove = (file: UploadFileLetters) => {
    if (!mainDTO) {
      const files = addLettersFile.filter((item) => item.url !== file.url);
      setAddLettersFile(files);
      setFieldValue("files", files);
    } else {
      const promise = deleteFile({ id: (file as any)?.urlId }).then(
        (res: any) => {
          if (res.error) return;
          const files = addLettersFile.filter((item) => item.url !== file.url);
          setAddLettersFile(files);
          setFieldValue("files", files);
        }
      );

      toastPromise(promise, {
        pending: "Файл удаляется",
        success: "Файл удален",
        error: "Произошла ошибка",
      });
    }
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
      setFieldValue("files", files);
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
      alert("Не удалось загрузить файл.");
    } finally {
      setIsUploading(false); // <-- сбросить флаг загрузки
    }
  };

  useEffect(() => {
    if (props.entry) {
      setMainDTO(props.entry);
    }
  }, [props.entry]);

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-mb-4">
      <form className="tw-flex tw-flex-col tw-gap-4" onSubmit={handleSubmit}>
        <Card title="Новое входящее письмо">
          <div className="mf_block_bg tw-overflow-hidden">
            <div className="tw-flex tw-justify-between tw-py-3 tw-px-4 tw-shadow-[0_0_4px_0_#00000025] tw-mb-4">
              <Button
                sx={{ fontWeight: 600, paddingX: 2 }}
                startIcon={
                  <ChevronLeftIcon
                    width="16px"
                    height="16px"
                    fill="currentColor"
                    stroke="none"
                  />
                }
                onClick={() => {
                  navigate(-1);
                  props.refetchSearch();
                }}
              >
                Назад
              </Button>
              <div className="tw-flex tw-flex-wrap tw-gap-4">
                <Button
                  sx={{ fontWeight: 600, paddingX: 2 }}
                  type="submit"
                  disabled={
                    mainDTO?.transitions?.buttonSettings.btn_save.readOnly ||
                    !canSave
                  }
                  startIcon={
                    <DiskIcon
                      width="16px"
                      height="16px"
                      fill="currentColor"
                      stroke="none"
                    />
                  }
                >
                  Сохранить
                </Button>
                <Button
                  sx={{ fontWeight: 600, paddingX: 2 }}
                  disabled={
                    props.new ||
                    mainDTO?.transitions?.buttonSettings.btn_sendtoresolution
                      .readOnly
                  }
                  startIcon={
                    <FileDeleteIcon
                      width="16px"
                      height="16px"
                      fill="currentColor"
                      stroke="none"
                    />
                  }
                  onClick={handleResolutionSendClick}
                >
                  Отправить на резолюцию
                </Button>
                <Button
                  sx={{ fontWeight: 600, paddingX: 2 }}
                  disabled={
                    props.new ||
                    mainDTO?.transitions?.buttonSettings.btn_undo.readOnly
                  }
                  startIcon={
                    <CrossCircleIcon
                      width="16px"
                      height="16px"
                      fill="currentColor"
                      stroke="none"
                    />
                  }
                  onClick={() => {
                    setModal({
                      show: true,
                      component: Reject,
                    });
                  }}
                >
                  Отклонить
                </Button>
                <Button
                  sx={{ fontWeight: 600, paddingX: 2 }}
                  disabled={
                    props.new ||
                    mainDTO?.transitions?.buttonSettings.btn_close.readOnly
                  }
                  startIcon={
                    <CheckIcon
                      width="16px"
                      height="16px"
                      fill="currentColor"
                      stroke="none"
                    />
                  }
                  onClick={closeLetter}
                >
                  Завершить
                </Button>
                <IconButton
                  color="primary"
                  className="cursor-pointer"
                  onClick={props?.refetchData}
                >
                  <RefreshIcon
                    width="16px"
                    height="16px"
                    fill="currentColor"
                    stroke="none"
                  />
                </IconButton>
              </div>
            </div>
            <IncomingIndicatorV4
              activeState={mainDTO?.state || 1}
              endStatus={200}
              documentHistories={mainDTO?.documentHistories}
              executors={mainDTO?.executors ?? []}
            />
          </div>
        </Card>

        <Card title="Детали письма">
          <div
            style={{ paddingTop: 10 }}
            className="tw-py-4 tw-px-4 mf_block_bg"
          >
            <div className="tw-p-4 tw-pb-0">
              <FormGroup className="tw-mb-4">
                <div className="tw-grid tw-grid-cols-3 tw-gap-4">
                  <Autocomplete
                    disablePortal
                    options={folderList?.length ? folderList : []}
                    size="small"
                    disabled={!canSave}
                    getOptionLabel={(option) => option.value as string}
                    value={values?.chatFolder as any}
                    onChange={(event, value) => {
                      setFieldValue("chatFolder", {
                        id: value.id,
                        value: value.value,
                      }),
                        setFieldValue("incomeNumber", value?.prefix);
                    }}
                    isOptionEqualToValue={(option: any, value: any) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <CustomTextField
                        required
                        params={params}
                        onChange={handleChange}
                        label="Выбрать папку"
                        name="type"
                      />
                    )}
                  />
                  <TextField
                    name="incomeNumber"
                    disabled={!canSave || true}
                    label="Входящий номер"
                    value={values.incomeNumber}
                    size="small"
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    name="outcomeNumber"
                    disabled={!canSave}
                    label="Исходящий номер"
                    value={values.outcomeNumber}
                    size="small"
                    onChange={handleChange}
                    required
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Дата получения"
                      disabled={!canSave}
                      inputFormat={newDateFormat}
                      value={values.receivedDate}
                      open={calendarOpen}
                      onClose={() => setCalendarOpen(false)}
                      onOpen={() => setCalendarOpen(true)}
                      onChange={(newValue) => {
                        setFieldValue("receivedDate", newValue);
                        setCalendarOpen(false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          {...params}
                          required
                          onClick={() => setCalendarOpen(true)}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <Autocomplete
                    disablePortal
                    options={
                      senderTypes.isSuccess ? senderTypes.data.items : []
                    }
                    size="small"
                    disabled={!canSave}
                    getOptionLabel={(option) => option.value as string}
                    value={values.senderType as ValueId}
                    onChange={(event, value) => {
                      setFieldValue("senderType", value);
                    }}
                    isOptionEqualToValue={(option: any, value: any) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <CustomTextField
                        params={params}
                        onChange={handleChange}
                        label="Тип отправителя"
                        name="type"
                        required
                      />
                    )}
                  />

                  <Button
                    disabled={!canSave}
                    variant="contained"
                    onClick={() => setSelectOrgVisible(true)}
                  >
                    Отправитель
                  </Button>
                </div>
              </FormGroup>
            </div>
            <div className="tw-px-4 tw-grid tw-grid-cols-3 tw-gap-4">
              <Autocomplete
                className="tw-col-span-2"
                disablePortal
                options={organisationsList || []}
                getOptionLabel={(option) => option.value as string}
                size="small"
                disabled={!canSave}
                value={values.contragent}
                onChange={(event, value) => {
                  console.log(value, "contragent");
                  setFieldValue("contragent", value);
                }}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.id === value.id
                }
                renderInput={(params) => (
                  <CustomTextField
                    params={params}
                    label="Отправитель"
                    required
                  />
                )}
                onInputChange={onContragentInputChange}
              />

              <CustomTextField
                name="contact"
                disabled={!canSave}
                label="Контакт"
                value={values.contact}
                size="small"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("contact", event.target.value);
                }}
              />
              <CustomTextField
                value={values.content1}
                disabled={!canSave}
                label="Тема"
                className="tw-col-span-3"
                size="small"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("content1", event.target.value);
                }}
              />
            </div>
          </div>
        </Card>
      </form>
      <Card title="Резолюция">
        <div
          style={{ paddingTop: 10 }}
          className="tw-py-4 tw-px-4 mf_block_bg tw-rounded-[26px]"
        >
          <Grid container>
            <div className="tw-w-full tw-flex tw-flex-row tw-justify-between">
              <div className="tw-w-[35%]">
                <Box>
                  <Typography
                    sx={{
                      borderRadius: "8px",
                      paddingX: 2,
                      paddingY: 3,
                    }}
                    variant="h6"
                  >
                    {" "}
                    {mainDTO?.mainExecutor?.value}
                  </Typography>
                </Box>
                <Box>
                  {mainDTO?.canAdd ||
                    (mainDTO && (
                      <>
                        <div className="tw-my-4 tw-flex tw-gap-2 tw-items-center">
                          <div>
                            <Button
                              variant="contained"
                              disabled={
                                mainDTO?.transitions?.buttonSettings
                                  ?.btn_canOpenExecution?.readOnly
                              }
                              onClick={() => {
                                openChatModal();
                                // setIsMinimize(false);
                              }}
                            >
                              {mainDTO?.state >= 3
                                ? "Исполнение"
                                : "Начать исполнение"}
                            </Button>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              disabled={
                                mainDTO?.transitions?.buttonSettings?.btn_answer
                                  ?.readOnly
                              }
                              onClick={() => {
                                getAnswerById(
                                  Number(searchParams?.recordId || params?.id)
                                ).then((resp) => {
                                  if (!resp.hasOwnProperty("error")) {
                                    setChatAnswerOpen(true);
                                  }
                                });
                              }}
                            >
                              Подготовить ответ
                            </Button>
                          </div>
                        </div>
                      </>
                    ))}
                </Box>
                <div className="tw-w-full">
                  {!(
                    mainDTO?.transitions?.buttonSettings.btn_save.readOnly ||
                    !canSave
                  ) && (
                    <UploadFileCard
                      change={handleUploadFile}
                      isLoading={isUploading}
                      item={values.files as any}
                    />
                  )}

                  <div className="tw-mb-4 tw-w-full tw-flex tw-flex-col tw-space-y-3">
                    {values?.files &&
                      values.files.map((item, idx) => (
                        <File
                          key={item?.url}
                          type={docType}
                          file={item as UploadFileLetters}
                          active={selectedFile?.url === item?.url}
                          onClick={onSelectFile}
                          onRemove={handleFileRemove}
                          removeDisabled={
                            mainDTO?.transitions?.buttonSettings
                              ?.btn_delete_file?.readOnly
                          }
                          index={idx}
                        />
                      ))}
                  </div>
                </div>
              </div>
              <div className="tw-w-[63%]">
                {pdfFilePreviewModal && selectedFile?.url && (
                  <DocumentPdf url={selectedFile?.url} />
                )}
              </div>
            </div>
          </Grid>
        </div>
      </Card>
      {/* {mainDTO?.showSecretary || byMainExecutor ? (
        <Card title="Готовый подписанный документ">
          <div className="tw-py-4 tw-px-4 mf_block_bg">
            {mainDTO?.showSecretary && (
              <Box
                sx={{
                  justifyContent: mainDTO?.showSecretary
                    ? "space-between"
                    : "end",
                  paddingX: 4,
                  gap: 5,
                  paddingY: 4,
                }}
                className="tw-flex tw-flex-col tw-bg-zinc-100 tw-rounded-2xl"
              >
                <div className="tw-flex tw-items-center tw-justify-between">
                  <div className="tw-w-[300px]">
                    <Autocomplete
                      disablePortal
                      options={users || []}
                      getOptionLabel={(option: any) => option.value as string}
                      size="small"
                      noOptionsText="Нет данных"
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.id === value.id
                      }
                      value={secretary}
                      onChange={(event, value) => {
                        setSecretary(value);
                      }}
                      onInputChange={(e, value) => handleSearchUsers(value)}
                      renderInput={(params) => (
                        <CustomTextField
                          params={params}
                          name={"secretary"}
                          label={"Испольнитель"}
                        />
                      )}
                    />
                  </div>
                  <Button
                    disabled={!mainDTO?.canSaveSecretary}
                    className="tw-mr-2 tw-w-[187px]"
                    variant="contained"
                    onClick={() => secretary && onChooseSecretar(secretary)}
                  >
                    Сохранить
                  </Button>
                </div>
                <Formik
                  enableReinitialize
                  initialValues={initialFileValues}
                  validationSchema={lettersV4FilesSchema}
                  validateOnChange
                  onSubmit={onSubmit}
                >
                  {(formik) => (
                    <DocumentsForm
                      formik={formik}
                      canSave={mainDTO?.canSaveMainResult}
                      readyFiles={mainDTO?.readyFiles}
                    />
                  )}
                </Formik>
              </Box>
            )}
            {byMainExecutor && (
              <Box
                ref={ref}
                className="tw-flex tw-flex-col tw-p-4 tw-gap-5 tw-mt-6 tw-border tw-border-zinc-400 tw-bg-zinc-100 tw-rounded-[16px]"
              >
                <Box className="tw-min-w-[520px]">
                  <div className="tw-h-[300px]">
                    <ReactQuill
                      className="tw-h-[100%]"
                      value={answerText}
                      modules={reactQuillModules}
                      onChange={(value) => {
                        setAnswerText(value);
                      }}
                      theme="snow"
                    />
                  </div>
                </Box>
                <div className="tw-flex tw-gap-3 tw-self-end">
                  <Button
                    disabled={!mainDTO?.canApproveMainResult}
                    variant="contained"
                    onClick={() => onAnswerMain(3)}
                  >
                    Утвердить
                  </Button>
                  <Button
                    disabled={!mainDTO?.canSaveMainResult}
                    variant="contained"
                    onClick={() => onAnswerMain(2)}
                  >
                    Сохранить
                  </Button>
                </div>
              </Box>
            )}
          </div>
        </Card>
      ) : (
        <></>
      )} */}
      <Card title="История документа">
        <div className="tw-py-4 tw-px-4 mf_block_bg">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Состояние</TableCell>
                  <TableCell>Начало</TableCell>
                  <TableCell>Завершение</TableCell>
                  <TableCell>Комментарий</TableCell>
                  <TableCell>Пользователь</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.entry &&
                  props.entry.documentHistories.map((dh: any) => (
                    <TableRow key={dh.startDate}>
                      <TableCell>{dh.state}</TableCell>
                      <TableCell>
                        {dh.startDate && formatDate(dh.startDate)}
                      </TableCell>
                      <TableCell>
                        {dh.endDate && formatDate(dh.endDate)}
                      </TableCell>
                      <TableCell>{dh.comment}</TableCell>
                      <TableCell>{dh?.userName || ""}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Card>
      <Box height={"100px"}></Box>
      <div id="modals">
        <Modal open={modal.show}>
          <modal.component
            onClose={handleCloseModal}
            onSubmit={modal.onSubmit}
            resolutionId={modal.resolutionId}
            forExecute={modal.forExecute}
            {...props}
          />
        </Modal>
      </div>
      {/* <Chat
        subject={values?.content1}
        mainFiles={mainDTO?.files}
        open={chatOpen}
        discutionId={discutionId}
        incomingId={Number(mainDTO?.id) || 0}
        executorId={Number(mainDTO?.mainExecutor?.id) || 0}
        closeChat={closeChat}
        mimimizeChat={() => {
          setIsMinimize(true);
          setChatOpen(false);
        }}
        setMainDTO={setMainDTO}
        tree={treeFromExecutors}
        acquainted={acquainted}
      /> */}

      <IncomingCreateV4Context.Provider
        value={{
          letterId: mainDTO?.id,
          mainDTO: executorsResp,
          refetchData: refetchGetExecutors,
          fileItem: values.files,
        }}
      >
        <ChatV4
          mainDTO={mainDTO}
          modalState={chatOpen}
          setModalState={(state: boolean) => setChatOpen(state)}
          executer={executorsResp?.responsible?.value}
          mainExecutor={executorsResp?.responsibleMain}
          fileItem={values.files as any}
          makeVisaClick={makeVisaLetV4}
          makeSubVisaClick={makeSubVisaLetV4}
          makeThirdVisaClick={makeThirdVisaLetV4}
          initialValues={executorsResp}
        />
      </IncomingCreateV4Context.Provider>

      <AnswerLetterV4Copy
        mainDTO={mainDTO}
        modalState={chatAnswerOpen}
        pdfResponse={
          singleAnswer?.finalFormUrl || createAnswerData?.finalFormUrl
        }
        itIsOutcomming={false}
        typeIdKey="incomingId"
        signAnswerLetter={signAnswerLetter}
        isSignAnswerLoading={isSignAnswerLoading}
        setModalState={(state: boolean) => setChatAnswerOpen(state)}
        handleSubmit={createLetterAnswerSubmit}
        loading={createAnswerLoading}
        initialValues={createAnswerData || singleAnswer}
        refetchData={() => {
          refetchGetExecutors();
          return getAnswerById(Number(searchParams?.recordId || params?.id));
        }}
        refetchAnswer={() => {
          return getAnswerById(Number(searchParams?.recordId || params?.id));
        }}
      />

      {mainDTO?.discutionId && isMinimize ? (
        <div className="tw-fixed tw-right-0 tw-bottom-[180px]">
          <ChatIcon
            fontSize="medium"
            onClick={() => {
              openChatModal();
              setIsMinimize(false);
            }}
            sx={{
              position: "fixed",
              right: 0,
              bottom: 0,
              color: "#607D8B",
              cursor: "pointer",
            }}
          />
        </div>
      ) : null}

      <SelectOrgModal
        open={selectOrgVisible}
        onClose={() => setSelectOrgVisible(false)}
        handleSave={(obj) => {
          setFieldValue("contragent", obj);
          setSelectOrgVisible(false);
        }}
      />
    </div>
  );
};

export default IncomingCreateV4;
