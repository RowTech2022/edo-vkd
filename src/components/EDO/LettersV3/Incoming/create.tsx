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
  FormControlLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Chat } from "./components/Chat";
import { useOpenDiscutionMutation } from "@services/chatApi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Formik, useFormik } from "formik";
import {
  Card,
  CheckIcon,
  DiskIcon,
  CrossCircleIcon,
  FileDeleteIcon,
  ChevronLeftIcon,
  CustomTextField,
  UploadFileCard,
  IOSSwitch,
} from "@ui";
import {
  ChangeEvent,
  SyntheticEvent,
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
  useSaveChildResultMutation,
  useUpdateChildResultMutation,
  useApproveChildResultMutation,
  useSaveMainResultMutation,
  useUpdateMainResultMutation,
  useApproveMainResultMutation,
} from "@services/lettersNewApi";

import {
  useFetchUploadFilesMutation,
  useFetchDownloadFilesMutation,
} from "@services/fileApi";

import {
  useFetchContragentQuery,
  useFetchSenderTypeQuery,
  useFetchPriorityTypeQuery,
  useFetchResolutionTextListQuery,
} from "@services/generalApi";
import { Reject, ResolutionSend } from "./modals";
import { validateLettersFileType } from "@root/shared/ui/Card/service/fileValidatorService";
import FileService from "@root/shared/ui/Card/service/fileService";

import Tree from "@root/shared/ui/Tree";
import {
  IParentApi,
  IResultSend,
  IMainResultSend,
  IResultApprove,
  ISendTreeExecutorV3,
} from "@root/shared/types/Tree";
import { ValueId } from "@services/api";
import { UploadFileLetters } from "@services/internal/incomingApi";
import {
  IAnswerByOwnRequest,
  IChooseSecretarReq,
  ILettersV3CreateRequest,
  IncomingLettersV3MainDTO,
  useAcquaintedLettersV3Mutation,
  useAnswerByOwnMainLettersV3Mutation,
  useChooseSecretaryMutation,
  useCloseIncomingV3Mutation,
  useExecuteResolutionV3Mutation,
  useSaveIncomingLettersV3Mutation,
  useSetTermV35Mutation,
  useUpdateIncomingV3Mutation,
  useUploadReadyDocumentMutation,
} from "@services/lettersApiV3";
import { reactQuillModules } from "./helpers/constants";
import { File } from "./components/File";
import { IUser, useGetAvailableUserMutation } from "@services/userprofileApi";
import { newDateFormat, formatDate } from "@utils";
import { DocumentsForm } from "./components/forms/DocumentsForm";
import { initialValues, lettersV3FilesSchema } from "./schema";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useNavigate, useParams } from "react-router";
import { IncomingIndicator } from "@root/components";
import { SDKEditor } from "@ui";

type Props = {
  new?: boolean;
  short?: boolean;
  entry?: IncomingLettersV3MainDTO;
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
  Registration = 1, //
  ToResolution = 2, // на резолюцию
  Execution = 3, // на испольнение
  Approved1 = 4, // конецелярия
  Done = 5, // Завершено - Отклонено
  Undo = 6, // Отклонено
  Delete = 100,
}

const IncomingCreateV35 = (props: Props) => {
  const ref = useRef<HTMLObjectElement>(null);
  const navigate = useNavigate();
  const params = useParams();
  const myRef = useRef<any>(null);
  const [mainDTO, setMainDTO] = useState<any | undefined>(props.entry); // IncomingLettersV3MainDTO

  let [addLettersFile, setAddLettersFile] = useState<UploadFileLetters[]>(
    props?.entry?.files || []
  );

  const [byMainExecutor, setByMainExecutor] = useState<boolean>(
    props.entry?.prepareByMainExecutor ?? false
  );

  const [uploadFile, { isLoading }] = useFetchUploadFilesMutation();
  const [uploadFormError, setUploadFormError] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<UploadFileLetters | null>(
    null
  );
  const [answerByOwnMain] = useAnswerByOwnMainLettersV3Mutation();
  const [acquainted] = useAcquaintedLettersV3Mutation();

  const [openDiscution] = useOpenDiscutionMutation();

  const docType = 21; // enum for document LetterV3 and for creating folder for file.

  const contragents = useFetchContragentQuery({}).data?.items.map((el: any) => {
    return {
      id: el.id.toString(),
      value: el.value,
    };
  });

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [byMainExecutor]);

  const senderTypes = useFetchSenderTypeQuery();
  const priorityTypes = useFetchPriorityTypeQuery();
  const resolutionList = useFetchResolutionTextListQuery();

  const [saveList] = useSaveIncomingLettersV3Mutation();
  const [updateList] = useUpdateIncomingV3Mutation();
  const [chooseSecretar] = useChooseSecretaryMutation();
  const [uploadDocuments] = useUploadReadyDocumentMutation();
  const [downloadMedia] = useFetchDownloadFilesMutation();

  const [modal, setModal] = useState<any>({
    show: false,
    component: Reject,
  });
  const [users, setUsers] = useState<IUser[]>([]);
  const [secretary, setSecretary] = useState<ValueId | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [formatOutcoming, setFormatOutcoming] = useState(mainDTO?.letterType);

  const [discutionId, setDiscutionId] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [treeFromExecutors, setTreeFromExecutors] = useState<IParentApi | null>(
    null
  );
  const [initialFileValues, setInitialFileValues] = useState(initialValues);

  const [fileUrl, setFileUrl] = useState("/");

  const [getAvailableUsers] = useGetAvailableUserMutation();

  const handleSearchUsers = (search: string) => {
    getAvailableUsers(search).then((res: any) => {
      if (res.error) return;
      setUsers(res.data.items || []);
    });
  };

  const handleChangeLetterType = (event: SyntheticEvent, checked: boolean) => {
    setFormatOutcoming(checked ? true : false);
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
    values.files = addLettersFile;

    toast.promise(
      async () => {
        const res = await saveList(values);
        if ("data" in res) {
          navigate(`/modules/latters-v3/incomming/show/${res.data.id}`);
        }
      },
      {
        pending: "Входящее письмо сохраняется",
        success: "Входящее письмо сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const [closeInc] = useCloseIncomingV3Mutation();

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
          navigate(`/modules/latters-v3/incomming/`);
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
    executor,
    content1,
    term,
    body,
  }: typeof INITIAL_VALUES) => {
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
          executor,
          content1,
          term,
          body,
          files: addLettersFile,
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
    if (!mainDTO?.discutionId) {
      openDiscution({
        incomingId: mainDTO?.id || 0,
        executorId: Number(mainDTO?.mainExecutor?.id) || 0,
        letter_Type: formatOutcoming,
      }).then((res: any) => {
        if (res.error) return;
        setDiscutionId(res.data.discutionId);
        setChatOpen(true);
      });
    } else {
      setDiscutionId(mainDTO?.discutionId);
      setChatOpen(true);
    }
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
        } as typeof INITIAL_VALUES),
    onSubmit: (values) => {
      if (props.new) {
        handleSave(values);
      } else {
        handleUpdate(values);
      }
    },
  });

  const handleUploadFile = async (id: string, event: HTMLInputElement) => {
    const file = event.files;
    if (!file) {
      return;
    }

    const validFileType = await validateLettersFileType(
      FileService.getFileExtension(file[0]?.name)
    );

    if (!validFileType.isValid) {
      setUploadFormError(validFileType.errorMessage);
      alert(validFileType.errorMessage);
      return;
    }

    const formData = new FormData();
    formData.append("file", file[0]);

    await uploadFile({ data: formData }).then((e) => {
      let resp = e as { data: UploadFileLetters };
      let files = addLettersFile.concat(resp.data).reverse();
      setAddLettersFile([...files]);
      setFieldValue("files", files);
    });
  };

  const handleFileRemove = (file: UploadFileLetters) => {
    const files = addLettersFile.filter((item) => item.url !== file.url);
    setAddLettersFile(files);
    setFieldValue("files", files);
  };

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

  const addUserRow = (parent: IParentApi, child: IParentApi) => {
    const TREE = JSON.parse(JSON.stringify(apiTree));
    let newTree = TREE.find((el: any) => el.id == child.mainParentId) || child;
    let newChild: any = {
      id: +Date.now(),
      mainParentId: newTree.id,
      parentId: (parent as any)?.id,
      avatar: "children avatar",
      term: null,
      type: null,
      priority: null,
      comment: null,
      canAdd: false,
      canEdit: true,
      state: 0,
      execType: 100,
      childs: [],
    };
    if (!child.mainParentId) {
      let firstLevelTree = JSON.parse(
        JSON.stringify(apiTree.find((el) => el.id == child.id))
      );
      firstLevelTree.childs.push(newChild);
      let newTree = TREE.map((obj: any) =>
        obj.id == firstLevelTree.id ? firstLevelTree : obj
      );
      setApiTree([...newTree]);
      return;
    }

    const findParent = (item: IParentApi) => {
      let newItem = Object.assign({}, newChild);
      item?.childs.map((tree) => {
        if (tree.id == child.id) {
          tree.childs?.push(newItem);
        } else {
          findParent(tree);
        }
      });
    };

    findParent(newTree);
    TREE.map((obj: any) => TREE.find((o: any) => o.id === newTree.id) || obj);
    setApiTree([...TREE]);
  };

  const removeUserRow = (child: IParentApi) => {
    setApiTree(
      apiTree.filter((item) => item.id !== child.id || child !== item)
    );
  };

  const changeUserVal = (val: any, data: IParentApi, type: string) => {
    const TREE = JSON.parse(JSON.stringify(apiTree));
    if (data.mainParentId == null) {
      let firstLevelTree = JSON.parse(
        JSON.stringify(apiTree.find((el) => el.id == data.id))
      );
      firstLevelTree[type] = val;
      let newTree = TREE.map((obj: any) =>
        obj.id == firstLevelTree.id ? firstLevelTree : obj
      );
      setApiTree([...newTree]);
      return;
    }
    const PARENT_TREE = JSON.parse(
      JSON.stringify(apiTree.find((el) => el.id == data.mainParentId))
    );
    const findParent = (item: IParentApi) => {
      item?.childs.map((el: IParentApi) => {
        if (el.id == data.id) {
          (el as any)[type] = val;
        } else {
          findParent(el);
        }
      });
    };
    findParent(PARENT_TREE);
    let newTree = TREE.map((obj: any) =>
      obj.id == PARENT_TREE.id ? PARENT_TREE : obj
    );
    setApiTree([...newTree]);
  };

  const [saveExecutor] = useExecuteResolutionV3Mutation();

  const [saveChildResult] = useSaveChildResultMutation();
  const [updateChildResult] = useUpdateChildResultMutation();
  const [approveChildResult] = useApproveChildResultMutation();

  const [saveMainResult] = useSaveMainResultMutation();
  const [updateMainResult] = useUpdateMainResultMutation();
  const [approveMainResult] = useApproveMainResultMutation();

  const [setTerm] = useSetTermV35Mutation();
  const handleSetTerm = (date: Date) => {
    toast.promise(
      async () => {
        const res = await setTerm({
          date: date.toISOString(),
          id: Number(mainDTO?.id || ""),
        });
        if (res) {
          setMainDTO({ ...mainDTO, term: date.toISOString().substring(0, 19) });
        }
      },
      {
        pending: "Срок резолюции сохраняется",
        success: "Срок резолюции сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const m_createMainResult = async (childData: IMainResultSend) => {
    const { incomingId } = params;

    toast.promise(
      async () => {
        const res = await saveMainResult({ data: childData });
        if ("data" in res) {
          setMainDTO(res.data);
        }
      },
      {
        pending: "Результат сохраняется",
        success: "Результат сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const m_updateMainResult = async (childData: IMainResultSend) => {
    const { incomingId } = params;

    toast.promise(
      async () => {
        const res = await updateMainResult({ data: childData });
        if ("data" in res) {
          setMainDTO(res.data);
        }
      },
      {
        pending: "Результат сохраняется",
        success: "Результат сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const m_approveMainResult = async (childData: IResultApprove) => {
    toast.promise(
      async () => {
        const res = await approveMainResult({ data: childData } as any);
        if ("data" in res) {
          setMainDTO(res.data);
        }
      },
      {
        pending: "Результат сохраняется",
        success: "Результат сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const m_createChildResult = async (childData: IResultSend) => {
    toast.promise(
      async () => {
        const res = await saveChildResult({ data: childData });
        if ("data" in res) {
          setMainDTO(res.data);
        }
      },
      {
        pending: "Результат сохраняется",
        success: "Результат сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const m_updateChildResult = async (childData: IResultSend) => {
    toast.promise(
      async () => {
        const res = await updateChildResult({ data: childData });
        if ("data" in res) {
          setMainDTO(res.data);
        }
      },
      {
        pending: "Результат сохраняется",
        success: "Результат сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const m_approveChildResult = async (childData: IResultApprove) => {
    toast.promise(
      async () => {
        const res = await approveChildResult({ data: childData } as any);
        if ("data" in res) {
          setMainDTO(res.data);
        }
      },
      {
        pending: "Результат сохраняется",
        success: "Результат сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const saveUsersRow = async (tree: IParentApi) => {
    const { id } = params;
    let newTree = tree.childs?.map((el) => {
      el.id?.toString().length > 5 ? (el.id = null) : el.id;
      return el;
    });
    let formData: any = {
      executorId: tree.id as number,
      type: 0,
      incomingId: +(id as any),
      parentId: tree?.id || 0,
      items: newTree,
    };

    toast.promise(
      async () => {
        const res = (await saveExecutor({ data: formData } as any)) as any;
        if (res.error) {
          throw res.error;
        }
        setMainDTO(res.data);
      },
      {
        pending: "Сохранение",
        success: "Сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const approveUsersRow = async (tree: IParentApi) => {
    const { id } = params;
    let newTree = tree.childs?.map((el) => {
      el.id?.toString().length > 5 ? (el.id = null) : el.id;
      return el;
    });
    let formData: ISendTreeExecutorV3 = {
      executorId: tree.id as number,
      type: 1,
      incomingId: +(id as any),
      parentId: tree?.id,
      items: newTree,
    };

    toast.promise(
      async () => {
        const res = await saveExecutor({ data: formData } as any);
        if ("data" in res) {
          setMainDTO(res.data);
        }
      },
      {
        pending: "Сохранение",
        success: "Сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const onSelectFile = (file: UploadFileLetters) => {
    if (file.fullUrl && myRef.current) {
      myRef.current.setAttribute("data", file.fullUrl);
      setFileUrl(file.fullUrl);
    }
    setSelectedFile(file);
  };

  const getFullUrlFromResponse = (res: any) => {
    const { file64, fileName } = res.data || {};

    return `data:application/pdf;base64,${file64}`;
  };

  const sliderBtnClick = (btn: string, files: any) => {
    let file: UploadFileLetters;
    if (selectedFile && btn === "prev") {
      let index = files.findIndex((el: any) => el.url === selectedFile?.url);
      index > 0 ? (file = files[index - 1]) : (file = files[files.length - 1]);
    } else if (selectedFile && btn === "next") {
      let index = files.findIndex((el: any) => el.url === selectedFile?.url);
      index === files.length - 1
        ? (file = files[0])
        : (file = files[index + 1]);
    } else {
      file = files[btn === "prev" ? files.length - 1 : 0];
    }

    const getFile = async (file: UploadFileLetters) => {
      onSelectFile({ ...file, loading: true });
      const type = 21;
      await downloadMedia({ data: { fileName: file.url, type } }).then(
        (res) => {
          onSelectFile({
            ...file,
            fullUrl: getFullUrlFromResponse(res),
            loading: false,
          });
        }
      );
    };
    getFile(file);
  };

  const filesContent = (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={4}>
        <UploadFileCard
          change={handleUploadFile}
          isLoading={isLoading}
          item={values.files as any}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            padding: 1,
          }}
          className="tw-mb-4"
        >
          {values?.files &&
            values.files.map((item, idx) => (
              <File
                key={item?.url}
                type={docType}
                file={item as UploadFileLetters}
                active={selectedFile?.url === item?.url}
                onClick={onSelectFile}
                onRemove={handleFileRemove}
                index={idx}
              />
            ))}
        </Box>
      </Grid>
      <Grid item xs={12} lg={8}>
        <Box
          style={{
            position: "relative",
            boxShadow: "rgba(0, 0, 0, 0.145) 0px 0px 4px 0px",
            borderRadius: "26px",
            paddingBottom: "1rem",
          }}
        >
          {values?.files && values.files.length > 0 && (
            <IconButton
              className="tw-absolute tw-left-2 tw-top-1/2 tw-rotate-180"
              onClick={() => sliderBtnClick("prev", values?.files)}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
          <object
            id={Math.random().toString()}
            ref={myRef}
            type="application/pdf"
            width="100%"
            height="100%"
            style={{
              minHeight: "400px",
              maxHeight: "500px",
              opacity: selectedFile && selectedFile.loading ? 0 : 1,
            }}
          ></object>
          {values?.files && values.files.length > 0 && (
            <IconButton
              className="tw-absolute tw-right-2 tw-top-1/2"
              onClick={() => sliderBtnClick("next", values?.files)}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          )}
        </Box>
      </Grid>
    </Grid>
  );

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
            navigate(`/modules/latters-v3/incomming/show/${IncomingId}`);
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
                onClick={() => navigate(-1)}
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
            <IncomingIndicator
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
                className="tw-col-span-2"
                disablePortal
                options={contragents || []}
                getOptionLabel={(option) => option.value as string}
                size="small"
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
                required
              />
            </div>
          </div>
        </Card>
        <Card title="Комментарии">
          {/* <div
            style={{ paddingTop: 10 }}
            className="tw-py-4 tw-px-4 mf_block_bg tw-h-[250px]"
          >
           
            <ReactQuill
              className="tw-h-[calc(100%-42px)]"
              value={values?.body as string}
              modules={reactQuillModules}
              onChange={(e) => {
                setFieldValue("body", e);
              }}
              theme="snow"
              readOnly={!canSave}
            />
          </div> */}
        </Card>

        <div>
          <SDKEditor />
        </div>
      </form>
      <Card title="Резолюция">
        <div
          style={{ paddingTop: 10 }}
          className="tw-py-4 tw-px-4 mf_block_bg tw-rounded-[26px]"
        >
          <Grid container>
            <Grid item md={12} lg={12}>
              <Box>
                <Typography
                  sx={{
                    borderRadius: "8px",
                    paddingX: 2,
                    paddingY: 3,
                  }}
                  variant="h6"
                >
                  {mainDTO?.mainExecutor?.value}
                </Typography>
              </Box>
              <Box paddingLeft={8}>
                {users ? (
                  <>
                    <Tree
                      incomingId={mainDTO?.id || 0}
                      saveUsers={saveUsersRow}
                      approveUsers={approveUsersRow}
                      addRow={addUserRow}
                      data={apiTree}
                      firstLevelOnly={true}
                      changeVal={changeUserVal}
                      executorsLists={users || []}
                      priorityList={priorityTypes?.data?.items || []}
                      resolutionList={resolutionList?.data?.items || []}
                      createChildResult={m_createChildResult}
                      updateChildResult={m_updateChildResult}
                      approveChildResult={m_approveChildResult}
                      createMainResult={m_createMainResult}
                      updateMainResult={m_updateMainResult}
                      approveMainResult={m_approveMainResult}
                      haveMainResult={mainDTO?.haveMainResult || false}
                      canSaveMainResolution={
                        !mainDTO?.transitions?.buttonSettings.btn_savechild
                          .readOnly || false
                      }
                      canApproveMainResolution={
                        mainDTO?.canApproveMainResolution || false
                      }
                      onSearchExecutor={handleSearchUsers}
                      mainResult={mainDTO?.resultMain?.text || ""}
                      mainResultId={mainDTO?.resultMain?.id || 0}
                      removeUserRow={
                        !mainDTO?.transitions?.buttonSettings.btn_savechild
                          .readOnly
                          ? removeUserRow
                          : undefined
                      }
                    />
                  </>
                ) : (
                  ""
                )}
                {mainDTO?.mainSign && (
                  <Box paddingX={2} paddingY={3}>
                    <img
                      src={`data:image/png;base64,${mainDTO?.mainSign.sign}`}
                    />
                  </Box>
                )}
                {mainDTO?.canAdd ||
                  (mainDTO && (
                    <div className="tw-my-4 tw-flex tw-gap-2">
                      <div style={{ order: "4", marginLeft: "8px" }}>
                        <Button
                          disabled={
                            !mainDTO.discutionId && !mainDTO.canOpenChat
                          }
                          variant="outlined"
                          onClick={() => {
                            openChatModal();
                          }}
                        >
                          {mainDTO?.discutionId ? "Открыть чат" : "Создать чат"}
                        </Button>
                      </div>
                      <div>
                        <Button
                          disabled={
                            mainDTO.transitions?.buttonSettings.btn_savechild
                              .readOnly
                          }
                          variant="outlined"
                          onClick={() => {
                            setByMainExecutor(true);
                          }}
                        >
                          Ответить
                        </Button>
                      </div>
                      <div>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            disabled={
                              !mainDTO ||
                              mainDTO?.transitions?.buttonSettings.btn_setterm
                                .readOnly
                            }
                            label="Срок резолюции"
                            inputFormat={newDateFormat}
                            value={mainDTO.term ? new Date(mainDTO.term) : null}
                            onChange={(newValue) => {
                              handleSetTerm(newValue as Date);
                            }}
                            renderInput={(params) => (
                              <TextField size="small" {...params} />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                      <FormControlLabel
                        sx={{
                          "&.MuiFormControlLabel-root": {
                            minWidth: "310px",
                            justifyContent: "space-between",
                            "& .MuiSwitch-track": {
                              background: "#ff0000c7",
                              opacity: 0.7,
                            },
                          },
                        }}
                        disabled={
                          !mainDTO ||
                          mainDTO?.transitions?.buttonSettings.btn_setterm
                            .readOnly
                        }
                        control={<IOSSwitch sx={{ m: 1 }} />}
                        label={
                          formatOutcoming
                            ? "оформлять исходящее письмо"
                            : "Не оформлять исходящее письмо"
                        }
                        labelPlacement="start"
                        checked={formatOutcoming ? true : false}
                        onChange={handleChangeLetterType}
                      />
                    </div>
                  ))}
              </Box>
            </Grid>
            <Grid item md={12} lg={12}>
              {filesContent}
            </Grid>
          </Grid>
        </div>
      </Card>

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
                validationSchema={lettersV3FilesSchema}
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
                </TableRow>
              </TableHead>
              <TableBody>
                {props.entry &&
                  props.entry.documentHistories.map((dh) => (
                    <TableRow key={dh.startDate}>
                      <TableCell>{dh.state}</TableCell>
                      <TableCell>
                        {dh.startDate && formatDate(dh.startDate)}
                      </TableCell>
                      <TableCell>
                        {dh.endDate && formatDate(dh.endDate)}
                      </TableCell>
                      <TableCell>{dh.comment}</TableCell>
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
      <Chat
        subject={values?.content1}
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

export default IncomingCreateV35;
