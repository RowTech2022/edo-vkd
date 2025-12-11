import {
  Autocomplete,
  Box,
  Button,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { IParentApi } from "@root/shared/types/Tree";
import { ValueId } from "@services/api";
import { ExecutorRowForm } from "./ExecutorRowForm";
import {
  IAnswerByOwnRequest,
  IChooseSecretarReq,
  useChooseSecretaryMutation,
} from "@services/lettersApiV3";
import { IUser, useGetAvailableUserMutation } from "@services/userprofileApi";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ExecutorColor } from "..";
import { reactQuillModules } from "@root/components/EDO/LettersV3/Incoming/helpers/constants";

interface ISelectExecutorForm {
  data: IParentApi;
  executorsList: ValueId[];
  priorityList: ValueId[];
  resolutionList: ValueId[];
  tree: IParentApi;
  incomingId: number;
  canAdd: boolean;
  addRow: (parent: IParentApi, child: IParentApi) => void;
  removeRow?: (parent: IParentApi, child: IParentApi) => void;
  saveUsers: (tree: IParentApi) => void;
  changeVal: (val: any, data: IParentApi, type: string) => void;
  approveUsers: (tree: IParentApi) => void;
  onClose: () => void;
  answerByOwn: (current: IParentApi) => void;
  answerForm: (payload: IAnswerByOwnRequest) => void;
  onOpenDiscution: (exec: IParentApi) => void;
  onSearchUsers: (value: string) => void;
}

export const SelectExecutorForm: FC<ISelectExecutorForm> = (props) => {
  const {
    onClose,
    addRow,
    saveUsers,
    approveUsers,
    answerByOwn,
    answerForm,
    onOpenDiscution,
    onSearchUsers,
    data,
    tree,
    canAdd,
    ...otherProps
  } = props;

  const [users, setUsers] = useState<IUser[]>([]);
  const [getAvailableUsers] = useGetAvailableUserMutation();
  const [chooseSecretar] = useChooseSecretaryMutation();
  const [text, setText] = useState("");
  const [secretary, setSecretary] = useState<ValueId | null>(null);

  const [refetch, setRefetch] = useState(1);
  const refetchAvailableUsers = () => {
    setRefetch(refetch + 1);
  };

  useEffect(() => {
    if (data.secretary?.id !== secretary?.id) {
      setSecretary(data?.secretary || null);
    }
  }, [data]);

  const beforeAddRow = () => {
    const base: any = {
      mainParentId: data.id as number,
      parentId: (data as any)?.id,
      avatar: "children avatar",
      term: null,
      type: null,
      priority: null,
      comment: null,
      canAdd: false,
      canEdit: true,
      sign: null,
      color: ExecutorColor.White,
      result: null,
      state: 0,
      execType: 100,
      childs: [],
    };

    if (data.childs.length) {
      addRow(data, {
        ...data.childs[0],
        id: undefined,
        mainParentId: data.id as number,
        parentId: (data as any)?.id,
        canAdd: false,
        canEdit: true,
        sign: null,
        color: ExecutorColor.White,
        result: null,
        state: 0,
        execType: 100,
        childs: [],
      });
    } else {
      addRow(data, { ...base, id: undefined, childs: [] });
    }
  };

  useEffect(() => {
    getAvailableUsers("").then((res: any) => {
      if (res.error) return;
      setUsers(res.data.items || []);
    });

    if (data.secretary?.id !== secretary?.id) {
      setSecretary(data?.secretary || null);
    }

    setText(data.answerText || "");
  }, [getAvailableUsers, refetch]);

  const onAnswer = (
    secretary: boolean,
    type: number,
    text: string,
    executorId: number
  ) => {
    const payload: IAnswerByOwnRequest = {
      text,
      incomingId: props.incomingId,
      executorId,
      type,
      secretary,
    };
    payload.type = type;
    answerForm(payload);
  };

  const onChooseSecretar = (tree: IParentApi, secretary: IUser) => {
    const payload: IChooseSecretarReq = {
      executorId: tree.id || 0,
      incomingId: props.incomingId,
      secretary: {
        id: secretary.id,
        value: secretary.value,
      },
      mainSecretarChoose: false,
    };

    const promise = chooseSecretar(payload);

    toast.promise(promise, {
      pending: "Данные сохраняются",
      success: "Данные успешно сохранены",
      error: "Произошла ошибка",
    });
  };

  return (
    <Box minHeight={"400px"}>
      <DialogTitle
        className="tw-bg-primary"
        sx={{
          color: "#fff",
        }}
        textAlign={"center"}
        fontSize={25}
      >
        Выбрать испольнителя
      </DialogTitle>
      <Box
        sx={{
          minHeight: "350px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
        padding={3}
      >
        <Box>
          {data.childs.map((child) => (
            <ExecutorRowForm
              parent={data}
              onAnswer={onAnswer}
              answerByOwn={answerByOwn}
              onOpenDiscution={onOpenDiscution}
              onChooseSecretar={onChooseSecretar}
              onSearchUsers={onSearchUsers}
              key={child.id}
              data={child}
              tree={child}
              users={users}
              {...otherProps}
            />
          ))}
          {data.showSecretary && (
            <Box
              sx={{
                justifyContent: "space-between",
                paddingX: 4,
                gap: 5,
                paddingY: 4,
                marginTop: 4,
              }}
              className="tw-flex tw-border tw-border-zinc-400 tw-bg-zinc-100"
            >
              <div className="tw-flex tw-flex-col tw-gap-2 tw-items-start">
                <div className="tw-w-[300px]">
                  <Autocomplete
                    // className="tw-bg-white"
                    disablePortal
                    options={users || []}
                    getOptionLabel={(option: any) => option.value as string}
                    size="medium"
                    noOptionsText="Нет данных"
                    isOptionEqualToValue={(option: any, value: any) =>
                      option.id === value.id
                    }
                    value={secretary}
                    onChange={(event, value) => {
                      setSecretary(value);
                    }}
                    onInputChange={(e, value) => onSearchUsers(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        name={"secretary"}
                        label={"Испольнитель"}
                      />
                    )}
                  />
                </div>
                <Button
                  disabled={!data.canSaveSecretary}
                  fullWidth
                  className="tw-mr-2"
                  variant="outlined"
                  onClick={() => secretary && onChooseSecretar(data, secretary)}
                >
                  Сохранить
                </Button>
              </div>
              <Box className="tw-flex tw-flex-1 tw-gap-2 tw-items-start tw-px-2">
                <Box className="tw-w-[520px]">
                  <div className="tw-h-[250px]">
                    <ReactQuill
                      className="tw-h-[100%]"
                      value={text}
                      modules={reactQuillModules}
                      onChange={(value) => {
                        setText(value);
                      }}
                      theme="snow"
                    />
                  </div>
                </Box>
                <div className="tw-flex tw-flex-col tw-flex-1 tw-gap-3 tw-min-w-[180px]">
                  <Button
                    fullWidth
                    disabled={!data?.canSaveAnswer}
                    variant="outlined"
                    onClick={() => onAnswer(true, 0, text, data.id as number)}
                  >
                    Сохранить
                  </Button>
                  <Button
                    fullWidth
                    disabled={!data?.canApproveAnswer}
                    variant="outlined"
                    onClick={() => onAnswer(true, 1, text, data.id as number)}
                  >
                    Утвердить
                  </Button>
                </div>
              </Box>
            </Box>
          )}
          {data?.sign && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"start"}
              paddingRight={1}
            >
              <Typography color={"#888"} variant="h6">
                ЭЦП:
              </Typography>
              <Typography variant="body1">
                <img src={`data:image/png;base64,${data.sign.sign}`} />
              </Typography>
            </Box>
          )}
          <div
            id={(data.parentId ? data.parentId : data.id) as any}
            className="tw-mt-3 tw-flex tw-gap-2"
          >
            <Button onClick={beforeAddRow} variant="outlined" size="small">
              Добавить
            </Button>
            {data.childs.length > 0 && (
              <Button
                disabled={!data.canSaveChild}
                onClick={(e) => saveUsers(tree)}
                variant="outlined"
                size="small"
              >
                Сохранить
              </Button>
            )}
            {data.childs.length > 0 && (
              <Button
                disabled={!data.canApproveChild}
                onClick={(e) => approveUsers(tree)}
                size="small"
                variant="outlined"
              >
                Одобрить
              </Button>
            )}
            <Button
              sx={{}}
              variant="outlined"
              size="small"
              onClick={refetchAvailableUsers}
            >
              Обновить
            </Button>
          </div>
        </Box>

        <Box
          sx={{
            justifyContent: "end",
            display: "flex",
            gap: 2,
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Закрыть
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
