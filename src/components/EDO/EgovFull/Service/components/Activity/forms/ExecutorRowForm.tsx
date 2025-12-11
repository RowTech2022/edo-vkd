import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IParentApi } from "@root/shared/types/Tree";
import { FC, useEffect, useState } from "react";
import { ValueId } from "@services/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { newDateFormat } from "@utils";
import { reactQuillModules } from "@root/components/EDO/LettersV3/Incoming/helpers/constants";

interface IExecutorRowForm {
  data: IParentApi;
  parent: IParentApi;
  executorsList: ValueId[];
  priorityList: ValueId[];
  resolutionList: ValueId[];
  tree: IParentApi;
  users: ValueId[];
  changeVal: (val: any, data: IParentApi, type: string) => void;
  answerByOwn: (current: IParentApi) => void;
  onAnswer: (
    secretary: boolean,
    type: number,
    text: string,
    executorId: number
  ) => void;
  removeRow?: (parent: IParentApi, child: IParentApi) => void;
  onOpenDiscution: (exec: IParentApi) => void;
  onChooseSecretar: (tree: IParentApi, secretary: ValueId) => void;
  onSearchUsers: (value: string) => void;
}

export const ExecutorRowForm: FC<IExecutorRowForm> = ({
  data,
  executorsList,
  priorityList,
  resolutionList,
  tree,
  users,
  parent,
  changeVal,
  answerByOwn,
  onAnswer,
  onOpenDiscution,
  onChooseSecretar,
  removeRow,
  onSearchUsers,
}) => {
  const [text, setText] = useState("");

  const [secretary, setSecretary] = useState<ValueId | null>(null);

  useEffect(() => {
    if (data.secretary?.id !== secretary?.id) {
      setSecretary(data?.secretary || null);
    }

    setText(data.answerText || "");
  }, [data]);

  return (
    <Box
      className="tw-border-gray-200 tw-shadow-lg tw-rounded-md"
      sx={{
        border: 1,
        marginBottom: 1,
      }}
    >
      <Box>
        <div className="tw-bg-gray-200 tw-p-4 tw-rounded-md tw-flex tw-basis-20 tw-gap-4 tw-items-center">
          {data.avatar ? (
            <Avatar alt="Remy Sharp" src={data.avatar} />
          ) : (
            <Avatar>A</Avatar>
          )}
          <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              disabled={!data.canEdit ? true : !((data.result?.id || 0) === 0)}
              onChange={(event, value) => {
                changeVal(
                  executorsList?.find((el) => el.value == value) || value,
                  data,
                  "responsible"
                );
              }}
              value={data.responsible?.value}
              id="free-solo-demo"
              options={executorsList?.map((el) => el.value) || []}
              onInputChange={(e, value) => onSearchUsers(value)}
              renderInput={(params) => (
                <TextField {...params} label="Исполнитель" name="responsible" />
              )}
              size="small"
            />
          </Stack>
          <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              disabled={!data.canEdit ? true : !((data.result?.id || 0) === 0)}
              value={data.priority?.value}
              id="free-solo-demo"
              onChange={(event, value) => {
                changeVal(
                  priorityList?.find((el) => el.value == value) || value,
                  data,
                  "priority"
                );
              }}
              options={priorityList?.map((el) => el.value) || []}
              renderInput={(params) => (
                <TextField {...params} label="Приоритет" name="priority" />
              )}
              size="small"
            />
          </Stack>
          <Stack spacing={2} sx={{ width: 300 }}>
            <Autocomplete
              disabled={!data.canEdit ? true : !((data.result?.id || 0) === 0)}
              value={data.type?.value}
              id="free-solo-demo"
              onChange={(event, value) => {
                changeVal(
                  resolutionList?.find((el) => el.value == value) || value,
                  data,
                  "type"
                );
              }}
              options={resolutionList?.map((el) => el.value) || []}
              renderInput={(params) => (
                <TextField {...params} label="Виза" name="type" />
              )}
              size="small"
            />
          </Stack>
          <TextField
            disabled={!data.canEdit ? true : !((data.result?.id || 0) === 0)}
            value={data.comment}
            onChange={(event) => {
              changeVal(event.target.value, data, "comment");
            }}
            label="Комментарий"
            size="small"
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              disabled={!data.canEdit ? true : !((data.result?.id || 0) === 0)}
              label="Срок"
              inputFormat={newDateFormat}
              value={data.term}
              onChange={(newValue) => {
                changeVal(newValue, data, "term");
              }}
              renderInput={(params) => <TextField size="small" {...params} />}
            />
          </LocalizationProvider>
          {removeRow && (
            <Stack>
              <IconButton onClick={() => removeRow(parent, data)}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          )}
        </div>
      </Box>
      <Box
        sx={{
          justifyContent: data.showSecretary ? "space-between" : "end",
          paddingX: data.showSecretary ? 4 : 0,
          paddingY: 4,
        }}
        className="tw-flex tw-bg-zinc-50"
      >
        {data.showSecretary && (
          <div className="tw-flex tw-flex-col tw-gap-2 tw-items-start">
            <div className="tw-w-[300px]">
              <Autocomplete
                className="tw-bg-white"
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
              fullWidth
              disabled={!data?.canChangeSecretary}
              className="tw-mr-2"
              variant="outlined"
              onClick={() => secretary && onChooseSecretar(data, secretary)}
            >
              Сохранить
            </Button>
          </div>
        )}
        {data?.answerType === 3 && (
          <Box className="tw-flex tw-gap-3 tw-items-start">
            <Box className="tw-w-[510px] tw-relative">
              <div className="tw-h-[220px]">
                <ReactQuill
                  className="tw-h-[100%] toolbar-padding"
                  value={text}
                  modules={reactQuillModules}
                  onChange={(value) => {
                    setText(value);
                  }}
                  theme="snow"
                />
              </div>
              <Box
                sx={{
                  display: "flex",
                  gap: "5px",
                  position: "absolute",
                  top: "40px",
                  right: "0",
                }}
              >
                <IconButton
                  disabled={!data?.canSaveAnswer}
                  color="primary"
                  onClick={() => onAnswer(true, 0, text, data.id as number)}
                >
                  <SaveIcon fontSize="medium" />
                </IconButton>
                <IconButton
                  disabled={!data?.canApproveAnswer}
                  color="success"
                  onClick={() => onAnswer(true, 1, text, data.id as number)}
                >
                  <CheckCircleIcon fontSize="medium" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
        <div className="tw-flex tw-flex-col tw-gap-2 tw-items-start tw-min-w-[180px]">
          <Button
            fullWidth
            disabled={!data.canSaveAnswer}
            className="tw-mr-2"
            variant="outlined"
            onClick={() => answerByOwn(data)}
          >
            Ответит
          </Button>
          <Button
            fullWidth
            disabled={!Boolean(data?.canOpenDiscution || data.discutionId)}
            variant="outlined"
            onClick={() => onOpenDiscution(data)}
          >
            {data.discutionId ? "" : "Открыть "} Обсуждение
          </Button>
        </div>
      </Box>
    </Box>
  );
};
