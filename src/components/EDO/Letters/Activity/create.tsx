import { useMemo, useState } from "react";
import {
  Autocomplete,
  Button,
  FormGroup,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import {
  AngleDoubleLeftIcon,
  Card,
  CrossCircleIcon,
  DiskIcon,
  FileDeleteIcon,
  CheckIcon,
  UploadCard,
} from "@ui";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import {
  IActivityMainDTO,
  useSaveActivityMutation,
  useToApproveActivityMutation,
  useUpdateStatusActivityMutation,
  IValueId,
} from "@services/activityApi";

import {
  IFileResponce,
  useFetchUploadFilesMutation,
  useFetchDownloadFilesMutation,
} from "@services/fileApi";

import { useFetchActivityResultTypeListQuery } from "@services/generalApi";
import { newDateFormat, formatDate } from "@utils";
import { ActivityIndicator } from "@components";

type Props = {
  new?: boolean;
  entry?: IActivityMainDTO;
};

const INITIAL_VALUES: Pick<
  Nullable<IActivityMainDTO>,
  | "title"
  | "priority"
  | "author"
  | "startDate"
  | "endtDate"
  | "category"
  | "responsibility"
  | "type"
  | "result"
  | "detailsResult"
  | "incomeLatter"
  | "resolution"
  | "outCommingLatter"
  | "notes"
> = {
  title: null,
  priority: null,
  author: null,
  startDate: null,
  endtDate: null,
  category: null,
  responsibility: null,
  type: null,
  result: null,
  detailsResult: "",
  incomeLatter: null,
  resolution: null,
  outCommingLatter: null,
  notes: null,
};

enum AcitivityStatus {
  NoStart = 1,
  OnProcess = 2,
  Approved = 3,
  Done = 4,
  Delete = 100,
}

const ActivityCreate = (props: Props) => {
  const navigate = useNavigate();

  const reasonType = useFetchActivityResultTypeListQuery();

  const [saveList] = useSaveActivityMutation();
  const [toApproveC] = useToApproveActivityMutation();
  const [updateStatusC] = useUpdateStatusActivityMutation();
  const [addActivityFile, setAddActivityFile] = useState<
    Letters.IncomeLetterFile[]
  >(props?.entry?.files || []);

  const [modal, setModal] = useState<any>({
    show: false,
  });

  const canSave = useMemo<boolean>(() => {
    return Boolean(
      props.entry && props.entry?.state === AcitivityStatus.NoStart
    );
  }, [props]);

  const canSaveRes = useMemo<boolean>(() => {
    return Boolean(
      props.entry && props.entry.state === AcitivityStatus.OnProcess
    );
  }, [props]);

  const handleSave = (values: typeof INITIAL_VALUES) => {
    toast.promise(
      async () => {
        const res = await saveList(values);
        if ("data" in res) {
          navigate(`/modules/latters/activity/show/${res.data.id}`);
        }
      },
      {
        pending: "Лист сохраняется",
        success: "Лист сохранен",
        error: "Произошла ошибка",
      }
    );
  };

  const [result, setResult] = useState<IValueId | null>(
    props.entry?.result || null
  );
  const [resultText, setResultText] = useState<string>(
    props.entry?.detailsResult || ""
  );

  const OnProcess = () => {
    toast.promise(
      async () => {
        await updateStatusC({
          id: props.entry?.id || 0,
          status: 2,
          timestamp: props.entry?.timestamp || "",
        });
      },
      {
        pending: "Активность сохраняется",
        success: "Активность сохранена",
        error: "Произошла ошибка",
      }
    );
  };
  const Approve = () => {
    toast.promise(
      async () => {
        await updateStatusC({
          id: props.entry?.id || 0,
          status: 4,
          timestamp: props.entry?.timestamp || "",
        });
      },
      {
        pending: "Активность одобрение",
        success: "Активность одобрено",
        error: "Произошла ошибка",
      }
    );
  };

  const Undo = () => {};
  const Cancel = () => {};

  const addRow = () => {
    let newRow: Letters.IncomeLetterFile = {
      id: +addActivityFile.length + 1,
      url: "",
      name: "",
      description: "",
      createAt: null,
      createBy: "",
    };
    setAddActivityFile([...addActivityFile, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    const changedData = addActivityFile.filter((item) => item.id !== id);
    setAddActivityFile(changedData);
  };

  const [uploadFile] = useFetchUploadFilesMutation();

  const handleUploadFile = async (id: number, event: HTMLInputElement) => {
    const file = event.files;
    if (!file) {
      return;
    }

    let updatedList = addActivityFile.map((el) =>
      el.id === Number(id) ? { ...el, loading: true } : el
    );
    setAddActivityFile(updatedList);

    const formData = new FormData();
    formData.append(id.toString(), file[0]);

    await uploadFile({ data: formData }).then((e) => {
      let resp = e as { data: IFileResponce };
      let updatedList = addActivityFile.map((el) =>
        el.id === Number(id) ? { ...el, url: resp.data.url as string } : el
      );
      setAddActivityFile(updatedList);
    });
  };

  const [downloadMedia] = useFetchDownloadFilesMutation();

  const SetDownloadFile = async (fileName: string) => {
    if (fileName === "") return;
    await downloadMedia({ data: { fileName: fileName, type: 11 } }).then(
      (res) => {
        downloadFile(res);
      }
    );
  };

  const downloadFile = (res: any) => {
    const { file64, fileName } = res.data || {};
    const a = document.createElement("a");
    a.href = `data:application/pdf;base64,${file64}`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCloseModal = () => {
    setModal({ ...modal, show: false });
  };

  const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
    initialValues: props.new
      ? INITIAL_VALUES
      : ({
          title: props.entry?.title,
          priority: props.entry?.priority,
          author: props.entry?.author,
          startDate: props.entry?.startDate,
          endtDate: props.entry?.endtDate,
          category: props.entry?.category,
          responsibility: props.entry?.responsibility,
          type: props.entry?.type,
          result: props.entry?.result,
          detailsResult: props.entry?.detailsResult,
          incomeLatter: props.entry?.incomeLatter,
          resolution: props.entry?.resolution,
          outCommingLatter: props.entry?.outCommingLatter,
          notes: props.entry?.notes,
          files: addActivityFile,
        } as typeof INITIAL_VALUES),
    onSubmit: (values) => {
      toast.promise(
        async () => {
          await toApproveC({
            id: props.entry?.id || 0,
            result: result,
            detailsResult: resultText,
            timestamp: props.entry?.timestamp || "",
          });
        },
        {
          pending: "Активность отправка одобрение",
          success: "Активность отправлено на одобрение",
          error: "Произошла ошибка",
        }
      );
    },
  });

  return (
    <>
      <form className="tw-flex tw-flex-col tw-gap-4" onSubmit={handleSubmit}>
        <Card title="Новая активность">
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
              disabled={
                props.entry?.transitions.buttonSettings.btn_onprocess
                  .readOnly || !canSave
              }
              startIcon={
                <DiskIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={OnProcess}
            >
              В работе
            </Button>
            <Button
              disabled={
                props.entry?.transitions.buttonSettings?.btn_toapprove?.readOnly
              }
              startIcon={
                <DiskIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              type="submit"
            >
              Одобрение
            </Button>
            <Button
              disabled={
                props.new ||
                props.entry?.transitions.buttonSettings.btn_approve.readOnly
              }
              startIcon={
                <FileDeleteIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={Approve}
            >
              Одобрить
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
            <Button
              disabled={
                props.new ||
                props.entry?.transitions.buttonSettings.btn_delete.readOnly
              }
              startIcon={
                <CheckIcon
                  width="16px"
                  height="16px"
                  fill="currentColor"
                  stroke="none"
                />
              }
              onClick={Cancel}
            >
              Отменить
            </Button>
          </div>
          <ActivityIndicator
            activeState={props.entry?.state || 1}
            endStatus={4}
          />
        </Card>
        <Card title="Детали активности">
          <div className="tw-p-4">
            <FormGroup className="tw-mb-4">
              <div className="tw-grid tw-grid-cols-5 tw-gap-4">
                <TextField
                  name="incomeNumber"
                  className="tw-col-span-3"
                  label="Заголовок"
                  value={values.title}
                  size="small"
                  disabled={!canSave}
                />
                <Autocomplete
                  disablePortal
                  options={[]}
                  size="small"
                  disabled={!canSave}
                  getOptionLabel={(option) => option.value as string}
                  value={values.priority}
                  renderInput={(params) => (
                    <TextField {...params} label="Приоритет" name="type" />
                  )}
                />
                <Autocomplete
                  disablePortal
                  options={[]}
                  size="small"
                  disabled={!canSave}
                  getOptionLabel={(option) => option.value as string}
                  value={values.author}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={handleChange}
                      label="Автор"
                      name="type"
                    />
                  )}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Начало"
                    inputFormat={newDateFormat}
                    disabled={!canSave}
                    onChange={(newValue) => {}}
                    value={values.startDate}
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Завершение"
                    inputFormat={newDateFormat}
                    disabled={!canSave}
                    value={values.endtDate}
                    onChange={(newValue) => {}}
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>

                <Autocomplete
                  disablePortal
                  options={[]}
                  size="small"
                  getOptionLabel={(option) => option.value as string}
                  value={values.type}
                  disabled={!canSave}
                  onChange={(newValue) => {}}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={handleChange}
                      label="Категория"
                      name="category"
                    />
                  )}
                />
                <Autocomplete
                  disablePortal
                  options={[]}
                  size="small"
                  getOptionLabel={(option) => option.value as string}
                  value={values.responsibility}
                  disabled={!canSave}
                  onChange={(newValue) => {}}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={handleChange}
                      label="Ответственный"
                      name="responsible"
                    />
                  )}
                />
                <Autocomplete
                  disablePortal
                  options={[]}
                  disabled={!canSave}
                  size="small"
                  getOptionLabel={(option) => option.value as string}
                  value={values.type}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={handleChange}
                      label="Тип"
                      name="type"
                    />
                  )}
                />
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
                  options={reasonType?.data?.items || []}
                  size="small"
                  disabled={!canSaveRes}
                  getOptionLabel={(option) => option.value as string}
                  value={result}
                  onChange={(event, value) => {
                    setFieldValue("result", value);
                    setResult(value as IValueId);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Результат" name="result" />
                  )}
                />
                <TextField
                  label="Результат подробно"
                  size="small"
                  disabled={!canSaveRes}
                  className="tw-col-span-4"
                  value={resultText}
                  multiline
                  minRows={5}
                  onChange={(event) => {
                    setFieldValue("detailsResult", event.target.value);
                    setResultText(event.target.value);
                  }}
                  required
                />
              </div>
            </FormGroup>
          </div>
        </Card>
        <Card title="Связи активности">
          <div className="tw-py-4 tw-px-4 tw-grid tw-grid-cols-3 tw-gap-4">
            <TextField
              name="contact"
              label="Входящее письмо"
              value={values.incomeLatter}
              disabled={true}
              size="small"
              required
            />
            <TextField
              name="contact"
              label="Резолюция"
              value={values.resolution}
              disabled={true}
              size="small"
              required
            />
            <TextField
              name="contact"
              label="Исходящее письмо"
              value={values.outCommingLatter}
              disabled={true}
              size="small"
              required
            />
          </div>
        </Card>
        <Card title="Примечание">
          <div className="tw-my-5">
            <TextField
              name="incomeNumber"
              label="Текст"
              disabled={true}
              value={values.notes}
              size="small"
              className="tw-w-full"
              multiline
              minRows={10}
              onChange={handleChange}
            />
          </div>
        </Card>
      </form>
      <Card title="Файлы приложения к активности">
        <div className="tw-flex tw-flex-wrap tw-gap-4 tw-py-3 tw-px-4">
          <Button
            onClick={(e) => {
              addRow();
            }}
          >
            Добавить документ
          </Button>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={520}>Файл</TableCell>
                  <TableCell width={200}>Название </TableCell>
                  <TableCell width={400}>Описание</TableCell>
                  <TableCell width={200}>Дата Создания</TableCell>
                  <TableCell width={200}>Создал</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="closed__row">
                {addActivityFile &&
                  addActivityFile.map((item) => (
                    <TableRow key={`doc-${item.id}`}>
                      <TableCell sx={{ maxWidth: 400 }}>
                        <div className="fileUploadButton tw-flex">
                          {item.loading ? (
                            <Box display="flex" justifyContent="center">
                              <CircularProgress size={30} />
                            </Box>
                          ) : (
                            <></>
                          )}
                          <UploadCard
                            change={handleUploadFile}
                            download={SetDownloadFile}
                            item={item}
                          />
                        </div>
                      </TableCell>

                      <TableCell
                        contentEditable="true"
                        style={{ border: "solid 1px #E0E0E0" }}
                        onBlurCapture={(e) => {
                          let updatedListText = addActivityFile.map((el) =>
                            el.id === item.id
                              ? {
                                  ...el,
                                  name: e.currentTarget.textContent,
                                }
                              : el
                          );
                          setAddActivityFile(updatedListText);
                        }}
                      >
                        {item.name}
                      </TableCell>
                      <TableCell
                        contentEditable
                        title="jjkj"
                        style={{ border: "solid 1px #E0E0E0" }}
                        onBlurCapture={(e) => {
                          let updatedListText = addActivityFile.map((el) =>
                            el.id === item.id
                              ? {
                                  ...el,
                                  description: e.target.textContent,
                                }
                              : el
                          );
                          setAddActivityFile(updatedListText);
                        }}
                      >
                        {item.description}
                      </TableCell>
                      <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                        {item?.createAt && formatDate(item?.createAt)}
                      </TableCell>
                      <TableCell style={{ border: "solid 1px #E0E0E0" }}>
                        {item?.createBy && formatDate(item?.createBy)}
                      </TableCell>
                      <div className="tw-text-center tw-flex tw-justify-end tw-items-center">
                        {item.id > 0 && (
                          <IconButton onClick={() => handleDeleteRow(item.id)}>
                            <DeleteOutlineIcon style={{ color: "red" }} />
                          </IconButton>
                        )}
                      </div>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Card>
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
                  <TableCell>Визирующий</TableCell>
                  <TableCell>Состояние</TableCell>
                  <TableCell>Установил</TableCell>
                  <TableCell>Дата установки</TableCell>
                  <TableCell>Причина отказа</TableCell>
                  <TableCell>Комментарии</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.entry &&
                  props.entry.userVisas.map((visa) => (
                    <TableRow key={visa.date}>
                      <TableCell>{visa.signedBy}</TableCell>
                      <TableCell>{visa.state}</TableCell>
                      <TableCell>{visa.setBy}</TableCell>
                      <TableCell>{visa.date}</TableCell>
                      <TableCell>{visa.reason}</TableCell>
                      <TableCell>{visa.comment}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
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
              <TableBody>
                {props.entry &&
                  props.entry.documentHistories.map((dh) => (
                    <TableRow key={dh.startDate}>
                      <TableCell>{dh.state}</TableCell>
                      <TableCell>{dh.startDate}</TableCell>
                      <TableCell>{dh.endDate}</TableCell>
                      <TableCell>{dh.comment}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Card>
    </>
  );
};

export default ActivityCreate;
