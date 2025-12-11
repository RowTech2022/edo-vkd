import { useMemo, useState } from "react";
import {
  Autocomplete,
  Button,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import ReactQuill from "react-quill";
import { useFormik } from "formik";
import {
  AngleDoubleLeftIcon,
  Card,
  CrossCircleIcon,
  DiskIcon,
  FileDeleteIcon,
} from "@ui";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  OutcomingLettersMainDTO,
  useSaveOutcomingMutation,
  useUpdateOutcomingMutation,
  useSignOutcomingMutation,
} from "@services/outcomingApi";
import {
  useFetchContragentQuery,
  useFetchSenderTypeQuery,
} from "@services/generalApi";
import { ValueId } from "@services/api";
import { newDateFormat } from "@utils";
import { OutcomingIndicator } from "@components";

type Props = {
  new?: boolean;
  entry?: OutcomingLettersMainDTO;
};

const INITIAL_VALUES: Pick<
  Nullable<OutcomingLettersMainDTO>,
  | "outcomeNumber"
  | "senderDate"
  | "receiverType"
  | "contragent"
  | "executor"
  | "contact"
  | "content1"
  | "body"
  | "files"
> = {
  outcomeNumber: "",
  senderDate: null,
  receiverType: null,
  contragent: null,
  executor: null,
  contact: "",
  content1: "",
  body: "",
  files: null,
};

enum OutcomeStatus {
  Prepare = 1,
  Approving = 2,
  Approved = 3,
  Delete = 100,
}

const OutcomingCreate = (props: Props) => {
  const navigate = useNavigate();
  const contragents = useFetchContragentQuery({});
  const receiverTypes = useFetchSenderTypeQuery();
  const [saveList] = useSaveOutcomingMutation();
  const [updateList] = useUpdateOutcomingMutation();
  const [sign] = useSignOutcomingMutation();

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

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.new || (props.entry && props.entry?.state === OutcomeStatus.Prepare)
    );
  }, [props]);

  const handleSave = (values: typeof INITIAL_VALUES) => {
    values.files = addOutcomeFile;
    toast.promise(
      async () => {
        const res = await saveList(values);
        if ("data" in res) {
          navigate(`/modules/latters/corOutcomming/show/${res.data.id}`);
        }
      },
      {
        pending: "Лист сохраняется",
        success: "Лист сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const handleUpdate = ({
    outcomeNumber,
    senderDate,
    receiverType,
    contragent,
    executor,
    contact,
    content1,
    body,
  }: typeof INITIAL_VALUES) => {
    if (props.entry) {
      toast.promise(
        updateList({
          id: props.entry.id,
          outcomeNumber,
          senderDate,
          receiverType,
          contragent,
          executor,
          contact,
          content1,
          body,
          files: null,
          timestamp: props.entry.timestamp,
        }),
        {
          pending: "Лист обновляется",
          success: "Лист обновлён",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const Undo = () => {};
  const Sign = () => {
    if (props.entry) {
      toast.promise(
        sign({
          id: props.entry.id,
          currentState: props.entry.state,
          timestamp: props.entry.timestamp,
        }),
        {
          pending: "Исходящее письмо подписывается",
          success: "Исходящее письмо подписана",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const [addOutcomeFile, setAddOutcomeFile] = useState<
    Letters.OutcomeLetterFile[]
  >(props?.entry?.files || []);

  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: props.new
      ? INITIAL_VALUES
      : ({
          outcomeNumber: props.entry?.outcomeNumber,
          senderDate: props.entry?.senderDate,
          receiverType: props.entry?.receiverType,
          contragent: props.entry?.contragent,
          executor: props.entry?.executor,
          contact: props.entry?.contact,
          content1: props.entry?.content1,
          body: props.entry?.body,
          files: addOutcomeFile,
        } as typeof INITIAL_VALUES),
    onSubmit: (values) => {
      if (props.new) {
        handleSave(values);
      } else {
        handleUpdate(values);
      }
    },
  });

  return (
    <>
      <form className="tw-flex tw-flex-col tw-gap-4" onSubmit={handleSubmit}>
        <Card title="Новое исходящее письмо">
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
              onClick={() => navigate(-1)}
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
                props.entry?.transitions.buttonSettings.btn_sign.readOnly
              }
              startIcon={
                <FileDeleteIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={Sign}
            >
              Подписать
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
              onClick={Undo}
            >
              Отклонить
            </Button>
          </div>
          <OutcomingIndicator
            activeState={props.entry?.state || 1}
            endStatus={2}
          />
        </Card>
        <Card title="Детали письма">
          <div className="tw-p-4">
            <FormGroup>
              <div className="tw-grid tw-grid-cols-5 tw-gap-4">
                <TextField
                  name="outcomeNumber"
                  label="Исходящий номер"
                  value={values.outcomeNumber}
                  onChange={handleChange}
                  size="small"
                  disabled={!canSave}
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Начало"
                    inputFormat={newDateFormat}
                    disabled={!canSave}
                    onChange={(newValue) => {
                      setFieldValue("senderDate", newValue);
                    }}
                    value={values.senderDate}
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
          <div className="tw-p-4">
            <FormGroup className="tw-mb-4">
              <div className="tw-grid tw-grid-cols-5 tw-gap-2">
                <Autocomplete
                  disablePortal
                  options={
                    receiverTypes.isSuccess ? receiverTypes.data.items : []
                  }
                  size="small"
                  disabled={!canSave}
                  getOptionLabel={(option) => option.value as string}
                  value={values.receiverType as ValueId}
                  onChange={(event, value) => {
                    setFieldValue("receiverType", value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Тип получателя"
                      name="result"
                    />
                  )}
                />

                <Autocomplete
                  disablePortal
                  className="tw-col-span-2"
                  options={contragents.isSuccess ? contragents.data.items : []}
                  size="small"
                  disabled={!canSave}
                  getOptionLabel={(option) => option.value as string}
                  value={values?.contragent as ValueId}
                  onChange={(event, value) => {
                    setFieldValue("contragent", {
                      id: value?.id?.toString(),
                      value: value?.value,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Контрагент" name="result" />
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
                  name="execute"
                  label="Исполнитель"
                  value={values.executor?.value}
                  size="small"
                  disabled
                />
              </div>
            </FormGroup>
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
      <Card title="Подчиненные активности">
        <div className="tw-py-4 tw-px-4">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Текст резолюции</TableCell>
                  <TableCell>Ответственный</TableCell>
                  <TableCell>Дата резолюции</TableCell>
                  <TableCell>Утвердил</TableCell>
                  <TableCell>Состояние</TableCell>
                </TableRow>
              </TableHead>
              <TableBody></TableBody>
            </Table>
          </TableContainer>
        </div>
      </Card>
      <Card title="Визы пользователей">
        <div className="tw-py-4 tw-px-4">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Заголовок</TableCell>
                  <TableCell>Начало</TableCell>
                  <TableCell>Завершение</TableCell>
                  <TableCell>Приоритет</TableCell>
                  <TableCell>Ответственный</TableCell>
                  <TableCell>Состояние</TableCell>
                </TableRow>
              </TableHead>
              <TableBody></TableBody>
            </Table>
          </TableContainer>
        </div>
      </Card>
      <Card title="История состояний активности">
        <div className="tw-py-4 tw-px-4">
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
              <TableBody></TableBody>
            </Table>
          </TableContainer>
        </div>
      </Card>
    </>
  );
};

export default OutcomingCreate;
