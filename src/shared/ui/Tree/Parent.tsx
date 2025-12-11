import { useState } from "react";
import {
  IParentApi,
  IExecutorList,
  IResultSend,
  IMainResultSend,
  IResultApprove,
  ITreeQueryList,
} from "@root/shared/types/Tree";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Children from "./Children";
import Stack from "@mui/material/Stack";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Card } from "@ui";
import { debounce, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { newDateFormat } from "@utils";

interface IParentProps {
  incomingId: number;
  data: IParentApi;
  addRow?: any;
  tree?: IParentApi;
  executorsList?: Array<IExecutorList>;
  priorityList?: Array<ITreeQueryList>;
  resolutionList?: Array<ITreeQueryList>;
  changeVal?: any;
  saveUsers?: any;
  approveUsers?: any;
  fristLevelOnly?: boolean;

  createChildResult?: any;
  updateChildResult?: any;
  approveChildResult?: any;

  createMainResult?: any;
  updateMainResult?: any;
  approveMainResult?: any;

  removeUserRow?: (child: IParentApi) => void;
  onSearchExecutor?: (value: string) => void;
}

const Parent: React.FC<IParentProps> = ({
  incomingId,
  data,
  addRow,
  tree,
  executorsList,
  priorityList,
  resolutionList,
  changeVal,

  fristLevelOnly,

  saveUsers,
  approveUsers,

  createChildResult,
  updateChildResult,
  approveChildResult,

  createMainResult,
  updateMainResult,
  approveMainResult,

  removeUserRow,
  onSearchExecutor,
}) => {
  const [open, setOpen] = useState(false);
  const [chilsResultText, setChilsResultText] = useState(
    data.result?.text || ""
  );
  const [mainResultText, setMainResultText] = useState(
    data.resultMain?.text || ""
  );
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const saveMainData = () => {
    var currentId = data.resultMain?.id || 0;
    let forSave: IMainResultSend = {
      id: currentId,
      incomingId: incomingId,
      text: mainResultText,
    };

    if (currentId === 0) {
      createMainResult(forSave);
    } else updateMainResult(forSave);
  };

  const approveMainData = () => {
    var currentId = data.resultMain?.id || 0;
    let forApprove: IResultApprove = {
      id: currentId,
      timestamp: data.result?.timestamp || "",
    };

    approveMainResult(forApprove);
  };

  const approveData = () => {
    let forApprove: IResultApprove = {
      id: data.result?.id || 0,
      timestamp: data.result?.timestamp || "",
    };

    approveChildResult(forApprove);
  };

  const saveData = () => {
    let forSave: IResultSend = {
      id: data.result?.id,
      executorId: data.id,
      text: chilsResultText,
    };

    if (data.result?.id === 0 || data.result?.id === null) {
      createChildResult(forSave);
    } else updateChildResult(forSave);
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: "1rem 0.8rem",
    borderRadius: "8px",
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

  const editable = !data.canEdit ? true : !((data.result?.id || 0) === 0);
  const disabled = fristLevelOnly ? false : editable;

  const debounceSearch = debounce(
    (value) => onSearchExecutor && onSearchExecutor(value),
    400
  );

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="tw-mt-4">
            <ReactQuill
              modules={modules}
              readOnly={!data.result?.canSave}
              value={chilsResultText}
              onChange={(e) => {
                setChilsResultText(e);
              }}
              theme="snow"
            />
          </div>
          <div className="tw-flex tw-justify-center tw-gap-3 tw-mt-4">
            <Button disabled={!data.result?.canSave} onClick={saveData}>
              Сохранить
            </Button>
            <Button disabled={!data.result?.canApprove} onClick={approveData}>
              Одобрить
            </Button>
            <Button onClick={handleClose}>Закрыт</Button>
          </div>
        </Box>
      </Modal>
      {data.childs && data.childs.length > 0 ? (
        <>
          <div className="tw-bg-gray-200 tw-p-4 tw-rounded-md tw-mt-1 tw-gap-4 tw-flex tw-text-md tw-items-center">
            {data.avatar ? (
              <Avatar alt="Remy Sharp" src={data.avatar} />
            ) : (
              <Avatar>{data.responsible?.value[0] || "A"}</Avatar>
            )}
            <Stack spacing={2} sx={{ width: 300 }}>
              <Autocomplete
                size="small"
                disabled={disabled}
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
                onInputChange={(e: any, val) => {
                  if (debounceSearch) {
                    debounceSearch(val);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Исполнитель"
                    name="responsible"
                  />
                )}
              />
            </Stack>
            <Stack spacing={2} sx={{ width: 300 }}>
              <Autocomplete
                size="small"
                disabled={disabled}
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
                  <TextField {...params} label="Приоритет" name="responsible" />
                )}
              />
            </Stack>
            <Stack spacing={2} sx={{ width: 300 }}>
              <Autocomplete
                size="small"
                disabled={disabled}
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
                  <TextField {...params} label="Виза" name="responsible" />
                )}
              />
            </Stack>
            <TextField
              size="small"
              disabled={disabled}
              value={data.comment}
              onChange={(event) => {
                changeVal(event.target.value, data, "comment");
              }}
              label="Комментарий"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disabled={disabled}
                label="Срок"
                inputFormat={newDateFormat}
                value={data.term}
                onChange={(newValue) => {
                  changeVal(newValue, data, "term");
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>
            <Button
              onClick={handleOpen}
              style={data.execType === 0 ? {} : { display: "none" }}
            >
              Результат{" "}
            </Button>
            {data.execType === 0 ? (
              <></>
            ) : data.execType === 1 ? (
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  p: 2,
                }}
              >
                Главный
              </Box>
            ) : data.execType === 2 ? (
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  color: "secondary.contrastText",
                  p: 2,
                }}
              >
                Формирующий
              </Box>
            ) : data.execType === 3 ? (
              <Box
                sx={{
                  bgcolor: "success.main",
                  color: "success.contrastText",
                  p: 2,
                }}
              >
                Отвествтвенный
              </Box>
            ) : data.execType === 4 ? (
              <Box
                sx={{
                  bgcolor: "text.secondary",
                  color: "background.paper",
                  p: 2,
                }}
              >
                Исполнитель
              </Box>
            ) : (
              <></>
            )}
          </div>
          {!fristLevelOnly &&
            data.childs.map((el, index) => (
              <Children
                incomingId={incomingId}
                saveUsers={saveUsers}
                approveUsers={approveUsers}
                changeVal={changeVal}
                resolutionList={resolutionList}
                priorityList={priorityList}
                executorsList={executorsList}
                tree={tree}
                addRow={addRow}
                key={index}
                data={el}
                createChildResult={createChildResult}
                updateChildResult={updateChildResult}
                approveChildResult={approveChildResult}
                createMainResult={createMainResult}
                updateMainResult={updateMainResult}
                approveMainResult={approveMainResult}
              />
            ))}
        </>
      ) : (
        <>
          <div className="tw-bg-gray-200 tw-p-4 tw-rounded-md tw-flex tw-basis-20 tw-gap-4 tw-items-center tw-mt-1">
            {data.avatar ? (
              <Avatar alt="Remy Sharp" src={data.avatar} />
            ) : (
              <Avatar>A</Avatar>
            )}
            <Stack spacing={2} sx={{ width: 300 }}>
              <Autocomplete
                size="small"
                disabled={disabled}
                onChange={(event, value) => {
                  changeVal(
                    executorsList?.find((el) => el.value == value) || value,
                    data,
                    "responsible"
                  );
                }}
                value={data.responsible?.value}
                id="free-solo-demo"
                onInputChange={(e: any, val) => {
                  if (debounceSearch) {
                    debounceSearch(val);
                  }
                }}
                options={executorsList?.map((el) => el.value) || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Исполнитель"
                    name="responsible"
                  />
                )}
              />
            </Stack>
            <Stack spacing={2} sx={{ width: 300 }}>
              <Autocomplete
                size="small"
                disabled={disabled}
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
              />
            </Stack>
            <Stack spacing={2} sx={{ width: 300 }}>
              <Autocomplete
                size="small"
                disabled={disabled}
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
              />
            </Stack>
            <TextField
              size="small"
              disabled={disabled}
              value={data.comment}
              onChange={(event) => {
                changeVal(event.target.value, data, "comment");
              }}
              label="Комментарий"
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                disabled={disabled}
                label="Срок"
                inputFormat={newDateFormat}
                value={data.term}
                onChange={(newValue) => {
                  changeVal(newValue, data, "term");
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>
            {removeUserRow && (
              <Stack>
                <IconButton onClick={() => removeUserRow(data)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            )}
            <Button
              onClick={handleOpen}
              style={
                data.execType === 0 || data.execType === 4
                  ? {}
                  : { display: "none" }
              }
            >
              Результат
            </Button>
            {data.execType === 0 ? (
              <></>
            ) : data.execType === 1 ? (
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  p: 2,
                }}
              >
                Главный
              </Box>
            ) : data.execType === 2 ? (
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  color: "secondary.contrastText",
                  p: 2,
                }}
              >
                Формирующий
              </Box>
            ) : data.execType === 3 ? (
              <Box
                sx={{
                  bgcolor: "success.main",
                  color: "success.contrastText",
                  p: 2,
                }}
              >
                Отвествтвенный
              </Box>
            ) : data.execType === 4 ? (
              <Box
                sx={{
                  bgcolor: "text.secondary",
                  color: "background.paper",
                  p: 2,
                }}
              >
                Исполнитель
              </Box>
            ) : (
              <></>
            )}
          </div>
        </>
      )}
      {data.canAdd && (
        <div
          id={(data.parentId ? data.parentId : data.id) as any}
          className="tw-mt-3 tw-ml-8 tw-flex tw-gap-2"
        >
          <Button onClick={(e) => addRow(tree, data)} variant="text">
            Добавить
          </Button>
          {data.childs.length > 0 && (
            <Button onClick={(e) => saveUsers(tree)} variant="text">
              Сохранить
            </Button>
          )}
          {data.childs.length > 0 && (
            <Button onClick={(e) => approveUsers(tree)} variant="text">
              Одобрить
            </Button>
          )}
        </div>
      )}
      {data.haveMainResult && (
        <div className="tw-mt-4 tw-pl-8">
          <Card
            title={
              data.execType === 0
                ? ""
                : data.execType === 1
                ? "Ответ от главного испольнителя"
                : data.execType === 2
                ? "Ответ от формирующего"
                : "Ответ от отвествтвенного"
            }
          >
            <ReactQuill
              readOnly={!data.canSaveMainResult}
              modules={modules}
              value={mainResultText}
              onChange={(e) => {
                setMainResultText(e);
              }}
              theme="snow"
            />
            <div className="tw-flex tw-justify-center tw-gap-3 tw-mt-4">
              <Button disabled={!data.canSaveMainResult} onClick={saveMainData}>
                Сохранить
              </Button>
              <Button
                disabled={!data.canApproveMainResult}
                onClick={approveMainData}
              >
                Одобрить
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Parent;
