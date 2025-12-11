import {
  Autocomplete,
  Button,
  IconButton,
  FormGroup,
  Modal,
  TextField,
  Box,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Chat } from "./components/Chat";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Formik, useFormik } from "formik";
import { Card, CheckIcon, DiskIcon, ChevronLeftIcon , CustomTextField } from "@ui";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { IncomingNewLettersMainDTO } from "@services/lettersNewApi";

import {
  useFetchContragentQuery,
  useFetchSenderTypeQuery,
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

import {
  OutcomingLettersMainDTO,
  useCloseOutcomingV3Mutation,
  useSaveOutcomingV3Mutation,
  useUpdateOutcomingV3Mutation,
} from "@services/outcomingApiV3";

import { reactQuillModules } from "./helpers/constants";
import { IUser, useGetAvailableUserMutation } from "@services/userprofileApi";
import { newDateFormat } from "@utils";
import { DocumentsForm } from "./components/forms/DocumentsForm";
import { initialValues, lettersV3FilesSchema } from "./schema";
import { useNavigate, useParams } from "react-router";
import { OutComeV3Indicator } from "@components";

type Props = {
  new?: boolean;
  short?: boolean;
  entry?: OutcomingLettersMainDTO;
  refetchData?: () => void;
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
  files: null,
};

enum IncommingStatus {
  Concelyariya = 1, //
  Done = 5, // Завершено - Отклонено
  Undo = 6, // Отклонено

  Delete = 100,
}

const OutcomingCreateV3 = (props: Props) => {
  const ref = useRef<HTMLObjectElement>(null);
  const navigate = useNavigate();
  const params = useParams();
  const [mainDTO, setMainDTO] = useState<any | undefined>(props.entry); // IncomingLettersV3MainDTO

  let [addLettersFile, setAddLettersFile] = useState<UploadFileLetters[]>(
    (props?.entry?.files as any) || []
  );

  const [byMainExecutor, setByMainExecutor] = useState<boolean>(
    (props.entry as any)?.prepareByMainExecutor ?? false
  );
  const [acquainted] = useAcquaintedLettersV3Mutation();

  const docType = 21; // enum for document LetterV3 and for creating folder for file.

  const contragents = useFetchContragentQuery({}).data?.items.map((el) => {
    return {
      id: el.id.toString(),
      value: el.value,
    };
  });

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [byMainExecutor]);

  const senderTypes = useFetchSenderTypeQuery();

  const [saveList] = useSaveOutcomingV3Mutation();
  const [updateList] = useUpdateOutcomingV3Mutation();
  const [uploadDocuments] = useUploadReadyDocumentMutation();

  const [modal, setModal] = useState<any>({
    show: false,
    component: Reject,
  });
  const [users, setUsers] = useState<IUser[]>([]);
  const [secretary, setSecretary] = useState<ValueId | null>(null);
  const [answerText, setAnswerText] = useState("");

  const [discutionId, setDiscutionId] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [treeFromExecutors, setTreeFromExecutors] = useState<IParentApi | null>(
    null
  );
  const [initialFileValues, setInitialFileValues] = useState(initialValues);

  const [getAvailableUsers] = useGetAvailableUserMutation();

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
      props.new || (mainDTO && mainDTO.state === IncommingStatus.Concelyariya)
    );
  }, [props]);

  const handleSave = (values: typeof INITIAL_VALUES) => {
    values.files = addLettersFile;

    toast.promise(
      async () => {
        const res = await saveList(values as any);
        if ("data" in res) {
          navigate(`/modules/latters-v3/outcomming/show/${res.data.id}`);
        }
      },
      {
        pending: "Входящее письмо сохраняется",
        success: "Входящее письмо сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const [closeInc] = useCloseOutcomingV3Mutation();

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
          navigate(`/modules/latters-v3/outcomming/`);
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
    contragent,
    contact,
    content1,
    body,
  }: any) => {
    if (mainDTO) {
      toast.promise(
        updateList({
          id: mainDTO.id,
          incomeNumber,
          outcomeNumber,
          receivedDate,
          senderType,
          contragent,
          contact,
          content1,
          body,
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
        } as typeof INITIAL_VALUES),
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

  const routeBack = () => {
    navigate(`/modules/latters-v3/incomming`);
  };

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
                onClick={routeBack}
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
            <OutComeV3Indicator
              activeState={mainDTO?.state || 1}
              endStatus={5}
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
                  <TextField
                    name="outcomeNumber"
                    disabled={!canSave}
                    label="Исходящий номер"
                    value={values.outcomeNumber}
                    size="small"
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    name="incomeNumber"
                    disabled={!canSave}
                    label="Входящий номер"
                    value={values.incomeNumber}
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
                      onChange={(newValue) => {
                        setFieldValue("receivedDate", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField size="small" {...params} />
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
                      />
                    )}
                  />
                </div>
              </FormGroup>
            </div>
            <div className="tw-px-4 tw-grid tw-grid-cols-3 tw-gap-4">
              <Autocomplete
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
                  <CustomTextField params={params} label="Отправитель" />
                )}
              />
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
                disabled={!canSave}
                label="Тема"
                className="tw-col-span-3"
                size="small"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setFieldValue("content1", event.target.value);
                }}
                required
              />
            </div>
          </div>
        </Card>
        <Card title="Комментарии">
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
        </Card>
      </form>
      <Card title="Готовый подписанный документ">
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
              validationSchema={lettersV3FilesSchema}
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
      <Chat
        mainFiles={mainDTO?.files}
        open={chatOpen}
        discutionId={discutionId}
        incomingId={Number(mainDTO?.id) || 0}
        executorId={Number(mainDTO?.mainExecutor?.id) || 0}
        setOpen={setChatOpen}
        setMainDTO={setMainDTO}
        tree={treeFromExecutors}
        acquainted={acquainted}
      />
    </div>
  );
};

export default OutcomingCreateV3;
