import {
  Autocomplete,
  Button,
  FormGroup,
  Modal,
  TextField,
  Stack,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import {
  Card,
  CheckIcon,
  DiskIcon,
  CrossCircleIcon,
  FileDeleteIcon,
  AngleDoubleLeftIcon,
  UploadFileCard,
  CustomTextField,
} from "@ui";
import { useNavigate, useParams } from "react-router";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  useSaveIncomingNewMutation,
  useUpdateIncomingNewMutation,
  useCloseIncomingNewMutation,
  IncomingNewLettersMainDTO,
  useExecuteResolutionMutation,
  useExecuteFirstResolutionMutation,
  useSaveChildResultMutation,
  useUpdateChildResultMutation,
  useApproveChildResultMutation,
  useSaveMainResultMutation,
  useUpdateMainResultMutation,
  useApproveMainResultMutation,
} from "@services/lettersNewApi";

import { useFetchUploadFilesMutation } from "@services/fileApi";

import {
  useFetchContragentQuery,
  useFetchSenderTypeQuery,
  useFetchPriorityTypeQuery,
  useFetchResolutionTextListQuery,
  useFetchResolutionPersonListQuery,
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
  ISendTreeExecutor,
} from "@root/shared/types/Tree";
import { ValueId } from "@services/api";
import FoldersPanel1 from "../File";
import { UploadFileLetters } from "@services/internal/incomingApi";
import { newDateFormat, ONLY_NUMERIC } from "@utils";
import { IncomingIndicator } from "@components";

type Props = {
  new?: boolean;
  short?: boolean;
  entry?: IncomingNewLettersMainDTO;
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

const NewIncomingCreate = (props: Props) => {
  const navigate = useNavigate();
  const params = useParams();

  let [addLettersFile, setAddLettersFile] = useState<UploadFileLetters[]>(
    props?.entry?.files || []
  );

  const [uploadFile] = useFetchUploadFilesMutation();

  const docType = 13; // enum for document and for creating folder for file.

  const contragents = useFetchContragentQuery({}).data?.items.map((el) => {
    return {
      id: el.id.toString(),
      value: el.value,
    };
  });

  const senderTypes = useFetchSenderTypeQuery();
  const person = useFetchResolutionPersonListQuery();
  const priorityTypes = useFetchPriorityTypeQuery();
  const resolutionList = useFetchResolutionTextListQuery();

  const [saveList] = useSaveIncomingNewMutation();
  const [updateList] = useUpdateIncomingNewMutation();

  const [modal, setModal] = useState<any>({
    show: false,
    component: Reject,
  });

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new ||
        (props.entry && props.entry.state === IncommingStatus.Registration)
    );
  }, [props]);

  const handleSave = (values: typeof INITIAL_VALUES) => {
    values.files = addLettersFile;

    toast.promise(
      async () => {
        const res = await saveList(values);
        if ("data" in res) {
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
        }
      },
      {
        pending: "Входящее письмо сохраняется",
        success: "Входящее письмо сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const [closeInc] = useCloseIncomingNewMutation();

  const closeLetter = () => {
    toast.promise(
      async () => {
        var res = await closeInc({
          id: props.entry?.id || 0,
          currentState: 1,
          timestamp: props.entry?.timestamp || "",
          approveBy: 0,
          comment: "",
        });
        if ("data" in res) {
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
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
    if (props.entry) {
      toast.promise(
        updateList({
          id: props.entry.id,
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
          timestamp: props.entry.timestamp,
        }),
        {
          pending: "Входящее письмо обновляется",
          success: "Входящее письмо обновлено",
          error: "Произошла ошибка",
        }
      );
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
    setModal({ ...modal, show: false });
  };

  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: props.new
      ? INITIAL_VALUES
      : ({
          incomeNumber: props.entry?.incomeNumber,
          outcomeNumber: props.entry?.outcomeNumber,
          receivedDate: props.entry?.receivedDate,
          senderType: props.entry?.senderType,
          contragent: props.entry?.contragent,
          contact: props.entry?.contact,
          executor: props.entry?.executor,
          content1: props.entry?.content1,
          term: props.entry?.term,
          body: props.entry?.body,
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

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  let executors = props.entry?.executors
    ? JSON.parse(JSON.stringify(props.entry?.executors))
    : [];
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

  const addUserRow = (parent: Array<IParentApi>, child: IParentApi) => {
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

  const AddUserLevel = () => {
    let newChild: any = {
      id: +Date.now(),
      mainParentId: undefined,
      avatar: "",
      type: null,
      priority: null,
      comment: null,
      canAdd: false,
      canEdit: true,
      state: 0,
      execType: 100,
      childs: [],
    };
    let newTree = [...apiTree, newChild];
    setApiTree([...newTree]);
  };

  const [saveExecutor] = useExecuteResolutionMutation();
  const [saveFirstExecutors] = useExecuteFirstResolutionMutation();

  const [saveChildResult] = useSaveChildResultMutation();
  const [updateChildResult] = useUpdateChildResultMutation();
  const [approveChildResult] = useApproveChildResultMutation();

  const [saveMainResult] = useSaveMainResultMutation();
  const [updateMainResult] = useUpdateMainResultMutation();
  const [approveMainResult] = useApproveMainResultMutation();

  const m_createMainResult = async (childData: IMainResultSend) => {
    const { incomingId } = params;

    toast.promise(
      async () => {
        const res = await saveMainResult({ data: childData });
        if ("data" in res) {
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
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
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
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
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
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
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
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
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
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
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
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
    let formData: ISendTreeExecutor = {
      id: null,
      incomingId: +(id as any),
      parentId: tree?.id,
      items: newTree,
    };
    toast.promise(
      async () => {
        const res = await saveExecutor({ data: formData } as any);
        if ("data" in res) {
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
        }
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
    let formData: ISendTreeExecutor = {
      id: null,
      operation: 1,
      incomingId: +(id as any),
      parentId: tree?.id,
      items: newTree,
    };
    toast.promise(
      async () => {
        const res = await saveExecutor({ data: formData } as any);
        if ("data" in res) {
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
        }
      },
      {
        pending: "Сохранение",
        success: "Сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const saveUsersFirstLevelRow = async () => {
    const { id } = params;
    let newTree = apiTree?.map((el) => {
      (el as any).id?.toString().length > 5 ? (el.id = null) : el.id;
      return el;
    });
    let formData: ISendTreeExecutor = {
      id: null,
      operation: 0,
      incomingId: +(id as any),
      parentId: null,
      items: newTree,
    };

    toast.promise(
      async () => {
        const res = await saveFirstExecutors({ data: formData } as any);
        if ("data" in res) {
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
        }
      },
      {
        pending: "Сохранение",
        success: "Сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const approveUsersFirstLevelRow = async () => {
    const { id } = params;
    let newTree = apiTree?.map((el) => {
      (el as any).id?.toString().length > 5 ? (el.id = null) : el.id;
      return el;
    });
    let formData: ISendTreeExecutor = {
      id: null,
      incomingId: +(id as any),
      operation: 1,
      parentId: null,
      items: newTree,
    };
    toast.promise(
      async () => {
        const res = await saveFirstExecutors({ data: formData } as any);
        if ("data" in res) {
          navigate(`/modules/latters/newIncoming/show/${res.data.id}`);
        }
      },
      {
        pending: "Сохранение",
        success: "Сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const routeBack = () => {
    navigate(`/modules/latters/corIncoming/`);
  };

  return (
    <>
      <form className="tw-flex tw-flex-col tw-gap-4" onSubmit={handleSubmit}>
        <Card title="Новое входящее письмо">
          <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
            <Button
              startIcon={
                <AngleDoubleLeftIcon
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
            <Button
              type="submit"
              disabled={
                props.entry?.transitions.buttonSettings.btn_save.readOnly ||
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
              disabled={
                props.new ||
                props.entry?.transitions.buttonSettings.btn_sendtoresolution
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
              disabled={
                props.new ||
                props.entry?.transitions.buttonSettings.btn_undo.readOnly
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
              disabled={
                props.new ||
                props.entry?.transitions.buttonSettings.btn_close.readOnly
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
          </div>
          <IncomingIndicator
            activeState={props.entry?.state || 1}
            endStatus={5}
          />
        </Card>

        <Card title="Детали письма">
          <div className="tw-p-4">
            <FormGroup className="tw-mb-4">
              <div className="tw-grid tw-grid-cols-3 tw-gap-4">
                <CustomTextField
                  name="incomeNumber"
                  disabled={!canSave}
                  label="Входящий номер"
                  value={values.incomeNumber}
                  size="small"
                  onChange={handleChange}
                  regexp={ONLY_NUMERIC}
                  required
                />
                <CustomTextField
                  name="outcomeNumber"
                  disabled={!canSave}
                  label="Исходящий номер"
                  value={values.outcomeNumber}
                  size="small"
                  onChange={handleChange}
                  regexp={ONLY_NUMERIC}
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
              </div>
            </FormGroup>
          </div>
        </Card>
        <Card title="Основная информация">
          <div className="tw-py-4 tw-px-4 tw-grid tw-grid-cols-3 tw-gap-4">
            <Autocomplete
              disablePortal
              options={senderTypes.isSuccess ? senderTypes.data.items : []}
              size="small"
              disabled={!canSave}
              getOptionLabel={(option) => option.value as string}
              value={values.senderType as ValueId}
              onChange={(event, value) => {
                setFieldValue("senderType", value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={handleChange}
                  label="Тип отправителя"
                  name="type"
                />
              )}
            />
            <Autocomplete
              disablePortal
              options={contragents || []}
              getOptionLabel={(option) => option.value as string}
              size="small"
              disabled={!canSave}
              value={values.contragent}
              onChange={(event, value) => {
                setFieldValue("contragent", value);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Контрагент" />
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
              required
            />
            <TextField
              value={values.content1}
              disabled={!canSave}
              label="Тема"
              className="tw-col-span-3"
              size="small"
              onChange={(event) => {
                setFieldValue("content1", event.target.value);
              }}
              required
            />
          </div>
        </Card>
        <Card title="Прикреплённые файлы" hidden={false}>
          <div>
            <UploadFileCard
              change={handleUploadFile}
              item={values.files as any}
            />
            <Stack className="tw-mb-4" spacing={2}>
              {values?.files && (
                <FoldersPanel1
                  onRemove={handleFileRemove}
                  items={addLettersFile as any}
                  type={docType}
                />
              )}
            </Stack>
          </div>
        </Card>
        <Card title="Комментарии">
          <div className="tw-my-5">
            <ReactQuill
              value={values?.body as string}
              modules={modules}
              onChange={(e) => {
                setFieldValue("body", e);
              }}
              theme="snow"
            />
          </div>
        </Card>
      </form>
      {props.short ? (
        ""
      ) : (
        <Card title="Активности по письму">
          <div>
            {person.isSuccess && person?.data?.items[0] ? (
              <>
                <Tree
                  incomingId={props.entry?.id || 0}
                  saveUsers={saveUsersRow}
                  approveUsers={approveUsersRow}
                  addRow={addUserRow}
                  data={apiTree}
                  changeVal={changeUserVal}
                  executorsLists={person?.data?.items || []}
                  priorityList={priorityTypes?.data?.items || []}
                  resolutionList={resolutionList?.data?.items || []}
                  createChildResult={m_createChildResult}
                  updateChildResult={m_updateChildResult}
                  approveChildResult={m_approveChildResult}
                  createMainResult={m_createMainResult}
                  updateMainResult={m_updateMainResult}
                  approveMainResult={m_approveMainResult}
                  haveMainResult={props.entry?.haveMainResult || false}
                  canSaveMainResolution={
                    props.entry?.canSaveMainResult || false
                  }
                  canApproveMainResolution={
                    props.entry?.canApproveMainResult || false
                  }
                  mainResult={props.entry?.resultMain?.text || ""}
                  mainResultId={props.entry?.resultMain?.id || 0}
                />
              </>
            ) : (
              ""
            )}
            {props.entry?.canAdd && (
              <div className="tw-my-4 tw-flex tw-gap-2">
                <Button onClick={() => AddUserLevel()} variant="text">
                  Добавить уровень
                </Button>
                <Button onClick={() => saveUsersFirstLevelRow()} variant="text">
                  Сохранить
                </Button>
                <Button
                  onClick={() => approveUsersFirstLevelRow()}
                  variant="text"
                >
                  Утвердить
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
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
    </>
  );
};

export default NewIncomingCreate;
