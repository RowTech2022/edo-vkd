import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  Grid,
  Stack,
  TextField,
  Typography,
  debounce,
} from "@mui/material";
import { IParentApi } from "@root/shared/types/Tree";
import { FC, useState } from "react";
import { ValueId } from "@services/api";
import { AnswerForm } from "./forms/AnswerForm";
import { SelectExecutorForm } from "./forms/SelectExecutorForm";
import { FamiliarizeForm } from "./forms/FamiliarizeForm";
import {
  IAcquaintedRequest,
  IAnswerByOwnRequest,
} from "@services/lettersApiV3";
import { Chat } from "../Chat";
import { useOpenDiscutionMutation } from "@services/chatApi";

interface IActivity {
  apiTree: IParentApi[];
  executors?: ValueId[];
  incomingId: number;
  data: IParentApi[];
  executorsList: ValueId[];
  priorityList: ValueId[];
  resolutionList: ValueId[];
  canAdd: boolean;
  filesContent?: JSX.Element;
  addRow: (parent: IParentApi, child: IParentApi) => void;
  removeRow?: (parent: IParentApi, child: IParentApi) => void;
  saveUsers: (tree: IParentApi) => void;
  changeVal: (val: any, data: IParentApi, type: string) => void;
  approveUsers: (tree: IParentApi) => void;
  answerByOwn: (payload: IAnswerByOwnRequest) => void;
  acquainted: (payload: IAcquaintedRequest) => void;
  setMainDTO: (payload: any) => void;
  onSearchUsers: (value: string) => void;
}

export enum ModalTypes {
  answer = 1,
  selectExecutor,
  familiarize,
}

export enum ExecutorColor {
  White = 0,
  Green,
  Yellow,
  Red,
}

const statusColor = {
  [ExecutorColor.White]: "tw-bg-white",
  [ExecutorColor.Green]: "tw-bg-green-400",
  [ExecutorColor.Yellow]: "tw-bg-yellow-400",
  [ExecutorColor.Red]: "tw-bg-red-400",
};

export const Activity: FC<IActivity> = (props) => {
  const {
    apiTree,
    executorsList = [],
    incomingId,
    answerByOwn,
    acquainted,
    setMainDTO,
    removeRow,
    onSearchUsers,
  } = props;
  const { data, filesContent, ...otherProps } = props;
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalTypes | null>(null);
  const [currentTreeIdx, setCurrentTreeIdx] = useState<number>(-1);
  const [treeFromExecutors, setTreeFromExecutors] = useState<IParentApi | null>(
    null
  );
  const [answerFormOpen, setAnswerFormOpen] = useState(false);
  const [discutionId, setDiscutionId] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [openDiscution] = useOpenDiscutionMutation();

  const onAnswer = (idx: number) => {
    setCurrentTreeIdx(idx);
    setModalType(ModalTypes.answer);
    setOpen(true);
  };

  const onSelectExecutor = (idx: number) => {
    setCurrentTreeIdx(idx);
    setModalType(ModalTypes.selectExecutor);
    setOpen(true);
  };

  const onFamiliarize = (idx: number) => {
    setCurrentTreeIdx(idx);
    setModalType(ModalTypes.familiarize);
    setOpen(true);
  };

  const onBriefClick = (idx: number) => {
    const { answerType } = data[idx] || {};
    if (answerType === 1) onFamiliarize(idx);
    else if (answerType === 2 || answerType == 3) onSelectExecutor(idx);
    else if (answerType === 0) onAnswer(idx);
  };

  const onModalClose = () => setOpen(false);

  const fullWidth =
    modalType === ModalTypes.selectExecutor || modalType === ModalTypes.answer;
  const maxWidth =
    modalType === ModalTypes.selectExecutor || modalType === ModalTypes.answer
      ? "lg"
      : "sm";

  const currentTree = currentTreeIdx >= 0 ? apiTree[currentTreeIdx] : null;

  const onOpenDiscution = (tree: IParentApi) => {
    if (!tree.discutionId) {
      setTreeFromExecutors(tree);
      openDiscution({
        incomingId,
        executorId: tree.id || 0,
      }).then((res: any) => {
        if (res.error) return;
        setDiscutionId(res.data.discutionId);
        setChatOpen(true);
      });
    } else {
      setTreeFromExecutors(tree);
      setDiscutionId(tree.discutionId);
      setChatOpen(true);
    }
  };

  const debouncedSearch = debounce(
    (value: string) => onSearchUsers(value),
    400
  );

  return (
    <Box>
      <Grid container spacing={3}>
        {apiTree &&
          apiTree.map((parent, idx) => (
            <Grid sx={{}} key={parent.id} item xs={12} md={6} lg={4}>
              <Box
                className={`${statusColor[parent.color]}`}
                width={"100%"}
                height={"480px"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-between"}
                sx={{
                  border: "1px solid #EAECEE",
                  borderRadius: 4,
                }}
              >
                <div
                  className={`tw-p-4 tw-rounded-md tw-mt-1 tw-gap-4 tw-flex tw-flex-wrap tw-text-md tw-items-center`}
                >
                  {parent.avatar ? (
                    <Avatar alt="Remy Sharp" src={parent?.avatar || ""} />
                  ) : (
                    <Avatar>{parent.responsible?.value[0] || "A"}</Avatar>
                  )}
                  <Stack spacing={2} sx={{ width: 300 }}>
                    <Autocomplete
                      size="small"
                      readOnly={parent.canEdit}
                      disabled={parent.canEdit}
                      onChange={(event, value) => {}}
                      value={parent.responsible?.value}
                      id="free-solo-demo"
                      options={executorsList.map((el) => el.value)}
                      onInputChange={(e: any, value) => debouncedSearch(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Исполнитель"
                          name="responsible"
                        />
                      )}
                    />
                  </Stack>
                </div>
                {(parent.answerState === 1 || parent.state === 5) && (
                  <Box
                    className="tw-bg-white"
                    padding={2}
                    marginX={1}
                    borderRadius={1}
                    onClick={() => onBriefClick(idx)}
                  >
                    <>
                      {parent.answerType === 0 || parent.answerType === 1 ? (
                        <Box marginBottom={2}>
                          <Typography variant="h5">
                            {parent.answerType === 1
                              ? "Шинос шудам"
                              : "Подготовленный отчет"}
                          </Typography>
                          <Typography
                            color={"#888"}
                            variant="body1"
                            sx={{
                              paddingY: 1,
                              maxHeight: "60px",
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            dangerouslySetInnerHTML={{
                              __html:
                                parent.answerType === 1
                                  ? parent.comment || ""
                                  : parent.answerComment || "",
                            }}
                          ></Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Box
                            display="flex"
                            justifyContent={"center"}
                            marginBottom={1}
                          >
                            <Typography color={"#888"} variant="h6">
                              Исполнитель:
                            </Typography>
                            <Typography variant="body1">
                              {parent?.responsible?.value}
                            </Typography>
                          </Box>
                          <Typography variant="body1">
                            {parent.comment}
                          </Typography>
                        </Box>
                      )}
                    </>
                    {parent?.sign && (
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={"end"}
                        paddingRight={1}
                      >
                        <Typography color={"#888"} variant="h6">
                          ЭЦП:
                        </Typography>
                        <Typography variant="body1">
                          <img
                            src={`data:image/png;base64,${parent.sign.sign}`}
                          />
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
                <Box
                  sx={{
                    padding: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Button
                    disabled={!parent.canAnswerMain}
                    sx={{
                      flex: 1,
                      color: !parent.canSaveAnswer
                        ? "#0C1116 !important"
                        : undefined,
                    }}
                    variant="contained"
                    onClick={() => onAnswer(idx)}
                  >
                    Ответить
                  </Button>
                  <Button
                    disabled={!parent.canAcquainted}
                    sx={{
                      flex: 1,
                      color: !parent.canSaveAnswer
                        ? "#0C1116 !important"
                        : undefined,
                    }}
                    variant="contained"
                    onClick={() => onFamiliarize(idx)}
                  >
                    Ознакомиться
                  </Button>
                  <Button
                    disabled={!parent.canSaveChild}
                    sx={{
                      width: "100%",
                      color: !parent.canSaveAnswer
                        ? "#0C1116 !important"
                        : undefined,
                    }}
                    variant="contained"
                    color="primary"
                    onClick={() => onSelectExecutor(idx)}
                  >
                    Выбрать исполнителя
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
      </Grid>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={() => setOpen(false)}
      >
        {modalType === ModalTypes.answer ? (
          <AnswerForm
            tree={currentTree}
            incomingId={incomingId}
            executorId={currentTree?.id as number}
            type={currentTree?.execType as number}
            filesContent={filesContent}
            answerByOwn={answerByOwn}
            onClose={onModalClose}
          />
        ) : modalType === ModalTypes.selectExecutor && currentTree ? (
          <SelectExecutorForm
            tree={currentTree}
            data={currentTree}
            {...otherProps}
            answerByOwn={(current: IParentApi) => {
              setTreeFromExecutors(current);
              setAnswerFormOpen(true);
            }}
            answerForm={answerByOwn}
            onClose={onModalClose}
            onOpenDiscution={onOpenDiscution}
            removeRow={removeRow}
            onSearchUsers={debouncedSearch}
          />
        ) : (
          <FamiliarizeForm
            tree={currentTree}
            incomingId={incomingId}
            executorId={currentTree?.id as number}
            acquainted={acquainted}
            onClose={onModalClose}
          />
        )}
      </Dialog>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={answerFormOpen}
        onClose={() => {
          setTreeFromExecutors(null);
          setAnswerFormOpen(false);
        }}
      >
        <AnswerForm
          tree={treeFromExecutors}
          incomingId={incomingId}
          executorId={treeFromExecutors?.id as number}
          type={treeFromExecutors?.execType as number}
          filesContent={filesContent}
          answerByOwn={answerByOwn}
          onClose={() => {
            setTreeFromExecutors(null);
            setAnswerFormOpen(false);
          }}
        />
      </Dialog>
      <Chat
        open={chatOpen}
        discutionId={discutionId}
        incomingId={incomingId}
        executorId={treeFromExecutors?.id || 0}
        tree={treeFromExecutors}
        prefix="LattersV3__"
        closeChat={() => {}}
        setMainDTO={setMainDTO}
      />
    </Box>
  );
};
