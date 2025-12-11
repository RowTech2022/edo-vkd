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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Chat } from "./components/Chat";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import {
  Card,
  CheckIcon,
  DiskIcon,
  ChevronLeftIcon,
  CustomTextField,
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

import {
  IncomingNewLettersMainDTO,
  OutcomingNewLettersMainDTO,
} from "@services/lettersNewApi";

import {
  useFetchContragentQuery,
  useFetchSenderTypeQuery,
  useFetchOrganisationListQuery,
} from "@services/generalApi";
import { Reject } from "./modals";

import { IParentApi } from "@root/shared/types/Tree";
import { ValueId } from "@services/api";
import { UploadFileLetters } from "@services/internal/incomingApi";
import {
  ILettersV3CreateRequest,
  useAcquaintedLettersV3Mutation,
  useUploadReadyDocumentMutation,
} from "@services/lettersApiV3";

import { OutcomingLettersMainDTO } from "@services/outcomingApiV3";

import { IUser, useGetAvailableUserMutation } from "@services/userprofileApi";
import { newDateFormat } from "@utils";
import { initialValues } from "./schema";
import { useNavigate, useParams } from "react-router";
import {
  useCloseOutcomingLettersV4Mutation,
  useSaveOutcomingLettersV4Mutation,
  useUpdateOutcomingLettersV4Mutation,
  useCreateAnswerLetterV4OutcomingMutation,
  useLazyGetAnswerByIdOutcomingQuery,
  useSignAnswerLetterV4OutcomingMutation,
  useFetchFoldersListOutcomingLettersV4Query,
} from "@services/lettersApiV4";
import { AppRoutes } from "@configs";
import { useDynamicSearchParams } from "@hooks";
import Indicator2 from "./Indicator2";
import AnswerLetterV4 from "./components/ChatV4/AnswerLetterV4";
import SelectOrgModal from "../components/SelectOrgModal";

type Props = {
  new?: boolean;
  short?: boolean;
  entry?: OutcomingLettersMainDTO;
  refetchData?: () => void;
  refetchSearch?: () => void;
};

const INITIAL_VALUES: Pick<
  Nullable<OutcomingNewLettersMainDTO>,
  | "incomeNumber"
  | "outcomeNumber"
  | "receivedDate"
  | "sendDate"
  | "senderType"
  | "receiverOrg"
  | "folderInformation"
  | "contact"
  | "haveMainResult"
  | "executor"
  | "content1"
  | "term"
  | "body"
  | "files"
  | "addDateToBlank"
  | "autoGenerateIncoming"
> = {
  incomeNumber: "",
  outcomeNumber: "",
  receivedDate: null,
  sendDate: null,
  senderType: null,
  receiverOrg: null,
  folderInformation: null,
  contact: null,
  executor: null,
  haveMainResult: false,
  content1: null,
  term: null,
  body: null,
  files: null,
  addDateToBlank: true,
  autoGenerateIncoming: true,
};

enum OutCommingStatus {
  Concelyariya = 5, //
  ReadyToDone = 2, //
  Done = 200, // Завершено - Отклонено
  Undo = 6, // Отклонено
  Registration = 1,
  Delete = 100,
}

export const OutcomingCreateV4Context = createContext<any>({});

export const OutcomingCreateV4 = (props: Props) => {
  const ref = useRef<HTMLObjectElement>(null);
  const navigate = useNavigate();
  const params = useParams();
  const [mainDTO, setMainDTO] = useState<any | undefined>(props.entry); // IncomingLettersV3MainDTO
  const { params: searchParams } = useDynamicSearchParams();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [text, setText] = useState<string | undefined>();

  let [addLettersFile, setAddLettersFile] = useState<UploadFileLetters[]>(
    (props?.entry?.files as any) || []
  );

  const [byMainExecutor, setByMainExecutor] = useState<boolean>(
    (props.entry as any)?.prepareByMainExecutor ?? false
  );

  const docType = 21; // enum for document LetterV3 and for creating folder for file.

  const organisationsList = useFetchOrganisationListQuery({
    text,
  }).data?.items.map((el: any) => {
    return {
      id: el.id.toString(),
      value: el.value,
    };
  });

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [byMainExecutor]);

  const senderTypes = useFetchSenderTypeQuery();

  const [saveList] = useSaveOutcomingLettersV4Mutation();
  const [updateList] = useUpdateOutcomingLettersV4Mutation();
  const [uploadDocuments] = useUploadReadyDocumentMutation();

  const [
    createLetterAnswer,
    { data: createAnswerData, isLoading: createAnswerLoading },
  ] = useCreateAnswerLetterV4OutcomingMutation();

  const [signAnswerLetter, { isLoading: isSignAnswerLoading }] =
    useSignAnswerLetterV4OutcomingMutation();

  const [getAnswerById, { data: singleAnswer }] =
    useLazyGetAnswerByIdOutcomingQuery();

  const createLetterAnswerSubmit = async ({
    isRefetchable,
    ...values
  }): Promise<boolean> => {
    try {
      const resp: any = await createLetterAnswer({
        ...values,
        outComingId: mainDTO?.id,
      });

      if (!resp.hasOwnProperty("error")) {
        isRefetchable && getAnswerById(Number(searchParams?.recordId));
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

  const [modal, setModal] = useState<any>({
    show: false,
    component: Reject,
  });
  const [users, setUsers] = useState<IUser[]>([]);
  const [secretary, setSecretary] = useState<ValueId | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [selectOrgVisible, setSelectOrgVisible] = useState(false);

  const [chatAnswerOpen, setChatAnswerOpen] = useState(false);

  const [initialFileValues, setInitialFileValues] = useState(initialValues);

  const [getAvailableUsers] = useGetAvailableUserMutation();

  const { data: folders } = useFetchFoldersListOutcomingLettersV4Query({});

  const foldersList = folders?.items ?? [];

  const handleSearchUsers = (search: string) => {
    getAvailableUsers(search).then((res: any) => {
      if (res.error) return;
      setUsers(res.data.items || []);
    });
  };

  useEffect(() => {
    const data = mainDTO?.mainExecutor;
    if (data && mainDTO?.secretary?.id !== secretary?.id) {
      setSecretary(mainDTO?.secretary || null);
    }
  }, [mainDTO?.mainExecutor, mainDTO?.secretary]);

  useEffect(() => {
    handleSearchUsers("");

    if (mainDTO?.secretary?.id !== secretary?.id) {
      setSecretary(mainDTO?.secretary || null);
    }

    setAnswerText(mainDTO?.mainAnswerText || "");
  }, []);

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new ||
        (mainDTO && mainDTO.state === OutCommingStatus.Concelyariya) ||
        (mainDTO && mainDTO.state === OutCommingStatus.ReadyToDone) ||
        (mainDTO && mainDTO.state === OutCommingStatus.Registration)
    );
  }, [props]);

  const canEdit = useMemo(() => {
    return mainDTO?.state === OutCommingStatus.ReadyToDone;
  }, [mainDTO]);

  const handleSave = (values: typeof INITIAL_VALUES) => {
    values.files = addLettersFile;

    toast.promise(
      async () => {
        const res = await saveList({
          ...values,
          folderInformation: values.folderInformation,
          receiverOrg: values?.receiverOrg,
          executor: undefined,
          senderType: undefined,
          haveMainResult: undefined,
          incomeNumber: undefined,
          term: undefined,
        });
        if ("data" in res) {
          navigate(`${AppRoutes.LETTERS_V4_OUTCOMING}?recordId=${res.data.id}`);
        }
      },
      {
        pending: "Исходящее письмо сохраняется",
        success: "Исходящее письмо сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const [closeInc] = useCloseOutcomingLettersV4Mutation();

  const closeLetter = () => {
    toast.promise(
      async () => {
        var res = await closeInc({
          id: mainDTO?.id || 0,
          currentState: mainDTO?.state || 1,
          timestamp: mainDTO?.timestamp || "",
        } as any);
        if ("data" in res) {
          navigate(AppRoutes.LETTERS_V4_OUTCOMING);
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
    receiverOrg,
    contact,
    sendDate,
    folderInformation,
    folder,
    content1,
    body,
    addDateToBlank,
    autoGenerateIncoming,
  }: any) => {
    if (mainDTO) {
      toast.promise(
        updateList({
          id: mainDTO.id,
          incomeNumber,
          outcomeNumber,
          receivedDate,
          sendDate,
          senderType,
          receiverOrg,
          folderInformation: folder,
          folderId: folder?.id,
          contact,
          content1,
          body,
          addDateToBlank,
          autoGenerateIncoming,
          files: addLettersFile as any,
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
  const onContragentInputChange = (e: any, value: string) => {
    setText(value);
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
          sendDate: mainDTO?.sendDate,
          senderType: mainDTO?.senderType,
          receiverOrg: mainDTO?.receiverOrg,
          contact: mainDTO?.contact,
          executor: mainDTO?.executor,
          folderInformation: mainDTO?.folderInformation,
          folder: {
            id: mainDTO?.folderInformation?.id,
            name: mainDTO?.folderInformation?.value,
          },
          content1: mainDTO?.content1,
          term: mainDTO?.term,
          body: mainDTO?.body,
          files: addLettersFile,
          addDateToBlank: mainDTO?.addDateToBlank,
          autoGenerateIncoming: mainDTO?.autoGenerateIncoming,
        } as any),
    onSubmit: (values) => {
      if (props.new) {
        handleSave(values);
      } else {
        handleUpdate(values);
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
  let [apiTree, setApiTree] = useState<Array<IParentApi>>(executors);

  useEffect(() => {
    setApiTree(executors);
  }, [executors]);

  const onSubmit = (values: ILettersV3CreateRequest) => {
    const files = values.files.map(({ url, name, createAt }) => ({
      url,
      name,
      createAt,
    }));

    const IncomingId = Number(params.id);
    if (values) {
      setInitialFileValues(values);
      toast.promise(
        async () => {
          const res = await uploadDocuments({
            IncomingId,
            files,
          });
          if ("data" in res) {
          }
        },
        {
          pending: "Загрузка файлов",
          success: "Файлы загружены",
          error: "Произошла ошибка",
        }
      );
    }
  };

  return (
    <div className="tw-flex tw-flex-col tw-gap-4 tw-mb-4">
      <form className="tw-flex tw-flex-col tw-gap-4" onSubmit={handleSubmit}>
        <Card title="Новое исходящее письмо">
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
                  props?.refetchSearch?.();
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
                    mainDTO?.transitions?.buttonSettings?.btn_close?.readOnly
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
                  Отправить
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
            <Indicator2
              activeState={mainDTO?.state || 1}
              endStatus={200}
              letterType={mainDTO?.letterType}
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
                    options={foldersList || []}
                    getOptionLabel={(option) => option?.name as string}
                    size="small"
                    disabled={!(canSave || canEdit)}
                    value={(values as any).folder}
                    onChange={(event, value) => {
                      setFieldValue("folderId", value?.id);
                      setFieldValue("folder", value);
                      setFieldValue("outcomeNumber", value?.prefix || "");
                    }}
                    isOptionEqualToValue={(option: any, value: any) =>
                      option.id == value.id
                    }
                    renderInput={(params) => (
                      <CustomTextField params={params} label="Папка" />
                    )}
                  />
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Дата отправки"
                      disabled={!canSave}
                      inputFormat={newDateFormat}
                      value={values.sendDate}
                      open={calendarOpen}
                      onClose={() => setCalendarOpen(false)}
                      onOpen={() => setCalendarOpen(true)}
                      onChange={(newValue) => {
                        setFieldValue("sendDate", newValue);
                        setCalendarOpen(false);
                      }}
                      renderInput={(params) => (
                        <TextField
                          size="small"
                          {...params}
                          onClick={() => setCalendarOpen(true)}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <TextField
                    name="outcomeNumber"
                    disabled={!(canSave || canEdit)}
                    label="Исходящий номер"
                    value={values.outcomeNumber}
                    size="small"
                    onChange={handleChange}
                    required
                  />

                  <Button
                    disabled={!(canSave || canEdit)}
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
                value={values.receiverOrg}
                onChange={(event, value) => {
                  setFieldValue("receiverOrg", value);
                }}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.id === value.id
                }
                renderInput={(params) => (
                  <CustomTextField
                    params={params}
                    label="Получатель"
                    required
                  />
                )}
                onInputChange={onContragentInputChange}
              />
              {/* <Autocomplete
                disablePortal
                options={contragents || []}
                getOptionLabel={(option) => option.value as string}
                size="small"
                className="tw-col-span-2"
                disabled={!canSave}
                value={values.contragent}
                onChange={(event, value) => {
                  setFieldValue("contragent", value);
                }}
                isOptionEqualToValue={(option: any, value: any) =>
                  option.id === value.id
                }
                renderInput={(params) => (
                  <CustomTextField params={params} label="Получатель" />
                )}
              /> */}
              <TextField
                name="contact"
                disabled={!canSave}
                label="Контакт"
                value={values.contact}
                size="small"
                onChange={(event) => {
                  setFieldValue("contact", event.target.value);
                }}
              />
              <CustomTextField
                value={values.content1}
                disabled={!(canSave || canEdit)}
                label="Тема"
                className="tw-col-span-3"
                size="small"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("content1", event.target.value);
                }}
              />
            </div>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                mt: 4,
                px: "1rem",
              }}
            >
              <FormControlLabel
                className="tw-col-span-2"
                control={
                  <Checkbox
                    name="Добавить исходящий номер и дату на бланк"
                    checked={values.addDateToBlank}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setFieldValue("addDateToBlank", event.target.checked);
                    }}
                  />
                }
                label="Добавить исходящий номер и дату на бланк"
              />
              <FormControlLabel
                className="tw-col-span-2"
                control={
                  <Checkbox
                    name="Отправить письмо получателю электронно"
                    checked={values.autoGenerateIncoming}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setFieldValue(
                        "autoGenerateIncoming",
                        event.target.checked
                      );
                    }}
                  />
                }
                label="Отправить письмо получателю электронно"
              />
            </Box>
          </div>
        </Card>
        {/* <Card title="Комментарии">                  
          <div 
            style={{ paddingTop: 10 }}
            className="tw-py-4 tw-px-4 mf_block_bg tw-h-[250px]"
          >
            <ReactQuill   
              className="tw-h-[100%]"
              value={values?.body as string}
              modules={reactQuillModules}
              onChange={(e) => {
                setFieldValue("body", e);
              }}
              theme="snow"
              readOnly={!canSave}
            />
          </div>
        </Card> */}
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
                          <div className="tw-my-4 tw-flex tw-flex-wrap tw-gap-2">
                            <div>
                              <Button
                                disabled={
                                  mainDTO?.transitions?.buttonSettings
                                    ?.btn_answer?.readOnly
                                }
                                variant="contained"
                                onClick={() => {
                                  getAnswerById(
                                    Number(searchParams?.recordId)
                                  ).then((resp) => {
                                    if (!resp.hasOwnProperty("error")) {
                                      setChatAnswerOpen(true);
                                    }
                                  });
                                }}
                              >
                                Исполнение
                              </Button>
                            </div>
                          </div>
                        </>
                      ))}
                  </Box>
                </div>
              </div>
            </Grid>
          </div>
        </Card>
      </form>
      {/* <Card title="Готовый подписанный документ">
        <div className="tw-py-4 tw-px-4 mf_block_bg">
          <Box
            sx={{
              justifyContent: mainDTO?.showSecretary ? "space-between" : "end",
              paddingX: 4,
              gap: 5,
              paddingY: 4,
            }}
            className="tw-flex tw-flex-col tw-bg-zinc-100 tw-rounded-2xl"
          >
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
                  readyFiles={mainDTO?.readyFiles || []}
                />
              )}
            </Formik>
          </Box>
        </div>
      </Card> */}
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

      <AnswerLetterV4
        modalState={chatAnswerOpen}
        pdfResponse={
          singleAnswer?.finalFormUrl || createAnswerData?.finalFormUrl
        }
        outComingId={mainDTO?.id}
        signAnswerLetter={signAnswerLetter}
        isSignAnswerLoading={isSignAnswerLoading}
        setModalState={(state: boolean) => setChatAnswerOpen(state)}
        handleSubmit={createLetterAnswerSubmit}
        loading={createAnswerLoading}
        initialValues={createAnswerData || singleAnswer}
        refetchData={() => getAnswerById(Number(searchParams?.recordId))}
        mainDTO={singleAnswer}
      />
      <SelectOrgModal
        open={selectOrgVisible}
        onClose={() => setSelectOrgVisible(false)}
        handleSave={(obj) => {
          setFieldValue("receiverOrg", obj);
          setSelectOrgVisible(false);
        }}
      />
    </div>
  );
};

export default OutcomingCreateV4;
