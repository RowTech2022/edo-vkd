import {
  Button,
  IconButton,
  FormGroup,
  Modal,
  TextField,
  Box,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Chat } from "./components/Chat";
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import {
  Card,
  DiskIcon,
  CrossCircleIcon,
  ChevronLeftIcon,
  CustomTextField,
} from "@ui";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  useSaveChildResultMutation,
  useUpdateChildResultMutation,
  useApproveChildResultMutation,
  useSaveMainResultMutation,
  useUpdateMainResultMutation,
  useApproveMainResultMutation,
} from "@services/lettersNewApi";

import {
  useFetchPriorityTypeQuery,
  useFetchResolutionTextListQuery,
} from "@services/generalApi";
import { Reject } from "./modals";
import EmailIndicator from "@root/components/EDO/LettersV3.5/InternalCorrespondence/Email/indicator";

import {
  IParentApi,
  IResultSend,
  IMainResultSend,
  IResultApprove,
  ISendTreeExecutorV3,
} from "@root/shared/types/Tree";
import { ValueId } from "@services/api";
import {
  useAcquaintedLettersV3Mutation,
  useExecuteResolutionV3Mutation,
  useSetTermV35Mutation,
} from "@services/lettersApiV3";
import { IUser, useGetAvailableUserMutation } from "@services/userprofileApi";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { formatDate, ONLY_ALPHABETICAL, ONLY_NUMERIC } from "@utils";
import {
  EmailV35LettersMainDTO,
  useSaveEmailMutation,
  useUpdateEmailMutation,
} from "@services/lettersApiV35";
import { useOpenDiscutionMutation } from "@services/chatApiV35";
import { useSession } from "@hooks";
import { FileUploader } from "@root/components/EDO/widgets/FileUploader";
import { useNavigate, useParams } from "react-router";
import Tree from "@root/shared/ui/Tree";
import { useFetchUserDetailsQuery } from "@services/admin/userProfileApi";

type Props = {
  new?: boolean;
  short?: boolean;
  entry?: EmailV35LettersMainDTO;
  refetchData?: () => void;
};

const INITIAL_VALUES: Pick<
  Nullable<EmailV35LettersMainDTO>,
  "incomeNumber" | "subject" | "creator" | "files"
> = {
  incomeNumber: "",
  subject: "",
  creator: "",
  files: null,
};

enum EmailStatus {
  Registration = 1, //
  Execution = 3, // на испольнение
  Done = 5, // Завершено - Отклонено
  Undo = 6, // Отклонено

  Delete = 100,
}

const IncomingCreateV3 = (props: Props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [mainDTO, setMainDTO] = useState<any | undefined>(props.entry); // IncomingLettersV3MainDTO
  const { data: session, status } = useSession();
  const [acquainted] = useAcquaintedLettersV3Mutation();
  const [openDiscution] = useOpenDiscutionMutation();
  const docType = 21; // enum for document LetterV3 and for creating folder for file.
  const priorityTypes = useFetchPriorityTypeQuery();
  const resolutionList = useFetchResolutionTextListQuery();

  const { data: details, refetch } = useFetchUserDetailsQuery();

  const [saveList] = useSaveEmailMutation();
  const [updateList] = useUpdateEmailMutation();
  const [users, setUsers] = useState<IUser[]>([]);
  const [secretary, setSecretary] = useState<ValueId | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [formatOutcoming, setFormatOutcoming] = useState(mainDTO?.letterType);

  const [discutionId, setDiscutionId] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [treeFromExecutors, setTreeFromExecutors] = useState<IParentApi | null>(
    null
  );
  const [modal, setModal] = useState<any>({
    show: false,
    component: Reject,
  });

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
      props.new || (mainDTO && mainDTO.state === EmailStatus.Registration)
    );
  }, [props]);

  const handleSave = (values: typeof INITIAL_VALUES) => {
    toast.promise(
      async () => {
        const res = await saveList(values);
        if ("data" in res) {
          navigate(
            `/modules/letters-v3.5/InternalCorrespondence/chat/show/${res.data.id}`
          );
        }
      },
      {
        pending: "Входящее письмо сохраняется",
        success: "Входящее письмо сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const handleUpdate = ({
    incomeNumber,
    creator,
    subject,
    files,
  }: typeof INITIAL_VALUES) => {
    if (mainDTO) {
      toast.promise(
        updateList({
          id: mainDTO.id,
          incomeNumber,
          subject,
          creator,
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
          creator: mainDTO?.creator,
          subject: mainDTO?.subject,
          files: mainDTO.files,
        } as typeof INITIAL_VALUES),
    onSubmit: (values) => {
      if (!values.files?.length) {
        toast.error("Загрузите файл");
        return;
      }
      if (props.new) {
        handleSave(values);
      } else {
        handleUpdate(values);
      }
    },
  });

  useEffect(() => {
    if (session?.user?.displayName) {
      values.creator = session?.user?.displayName;
    }
  }, []);

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
            <EmailIndicator activeState={mainDTO?.state || 1} endStatus={5} />
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
                  <CustomTextField
                    name="creator"
                    label="От кого"
                    disabled={true}
                    value={details?.displayName}
                    size="small"
                    onChange={handleChange}
                    regexp={ONLY_ALPHABETICAL}
                    required
                  />
                  <CustomTextField
                    name="incomeNumber"
                    disabled={!canSave}
                    label="Номер"
                    value={values.incomeNumber}
                    size="small"
                    onChange={handleChange}
                    regexp={ONLY_NUMERIC}
                    required
                  />
                  <TextField
                    name="subject"
                    disabled={!canSave}
                    label="Тема"
                    value={values.subject}
                    size="small"
                    onChange={handleChange}
                    required
                  />
                </div>
              </FormGroup>
            </div>
            <div className="tw-px-4 tw-grid tw-grid-cols-3 tw-gap-4"></div>
          </div>
        </Card>
        <Card title="Чат">
          <div className="tw-py-4 tw-px-4 mf_block_bg tw-rounded-[26px]">
            <Grid container>
              <Grid item md={12} lg={12}>
                <Box>
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
                      <div className="tw-mb-4 tw-flex tw-gap-2">
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
                            {mainDTO?.discutionId
                              ? "Открыть чат"
                              : "Создать чат"}
                          </Button>
                        </div>
                      </div>
                    ))}
                </Box>
              </Grid>
              <Grid item md={12} lg={12}>
                <FileUploader
                  files={(values.files as any) || []}
                  onChange={(files) => {
                    setFieldValue("files", files);
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </Card>
      </form>
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
                        {dh.endDate
                          ? formatDate(dh.endDate)
                          : "-----------------"}
                      </TableCell>
                      <TableCell>
                        {dh.comment || "------------------"}
                      </TableCell>
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
        subject={values?.subject}
        mainFiles={mainDTO?.files}
        open={chatOpen}
        discutionId={discutionId}
        incomingId={Number(mainDTO?.id) || 0}
        executorId={Number(mainDTO?.mainExecutor?.id) || 0}
        setOpen={setChatOpen}
        setMainDTO={setMainDTO}
        tree={treeFromExecutors}
        acquainted={acquainted}
        refetchData={props?.refetchData}
      />
    </div>
  );
};

export default IncomingCreateV3;
