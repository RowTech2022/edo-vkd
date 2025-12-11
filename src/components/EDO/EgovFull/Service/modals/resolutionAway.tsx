import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Autocomplete,
  Box,
  Button,
  DialogTitle,
  FormGroup,
  IconButton,
  TextField,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { BaseSyntheticEvent, useState } from "react";
import { toast } from "react-toastify";
import {
  useFetchResolutionCategoryListQuery,
  useFetchResolutionPersonListQuery,
  useFetchResolutionTextListQuery,
} from "@services/generalApi";
import {
  useExecuteResolutionNewMutation,
  usePassResolutionMutation,
} from "@services/lettersApi";
import { newDateFormat } from "@utils";

const VALUE_TEMPLATE = {
  id: 0,
  to: {
    id: "0",
    value: "",
  },
  text: {
    id: "0",
    value: "",
  },
  type: {
    id: "0",
    value: "",
  },
  executeUntil: "",
  comment: "",
};
const INITIAL_VALUES = [VALUE_TEMPLATE];

const ResolutionAway = ({ onClose, ...props }: any) => {
  const [data, setData] = useState(INITIAL_VALUES);

  const [submitResolutionAway] = usePassResolutionMutation();
  const [executeResolution] = useExecuteResolutionNewMutation();

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const newData = {
      id: props.entry.id,
      resolutionId: props.resolutionId,
      currentState: props.entry.state,
      items: data,
      timestamp: props?.entry?.timestamp,
    };
    toast.promise(submitResolutionAway(newData), {
      pending: "Карточка отклоняется",
      success: "Карточка отклонена",
      error: "Произошла ошибка",
    });
    // }
  };

  const sendToExecute = () => {
    const newData = {
      id: props.entry.id,
      resolutionId: props.resolutionId,
      currentState: props.entry.state,
      items: data,
      timestamp: props?.entry?.timestamp,
    };
    toast.promise(executeResolution(newData), {
      pending: "Карточка отклоняется",
      success: "Карточка отклонена",
      error: "Произошла ошибка",
    });
  };
  const handleCancel = () => {
    onClose && onClose();
  };

  const handleChange = (name: string, value: any, id: number) => {
    const changedData: any = data.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          [name]: value,
        };
      } else return item;
    });
    setData(changedData);
  };

  const handleAddRow = () => {
    const lastRow = data.filter((item) => item.id === data.length - 1)[0];
    const newRow = {
      ...VALUE_TEMPLATE,
      id: lastRow.id + 1,
    };
    setData([...data, newRow]);
  };

  const handleDeleteRow = (id: number) => {
    const changedData = data.filter((item) => item.id !== id);
    setData(changedData);
  };
  const person = useFetchResolutionPersonListQuery();
  const resolutionText = useFetchResolutionTextListQuery();
  const resolutionCategory = useFetchResolutionCategoryListQuery();

  return (
    <Box className="tw-absolute tw-h-full tw-overflow-y-auto sm:tw-w-fit tw-w-full tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2">
      <div className="tw-w-full">
        <DialogTitle
          className="tw-bg-primary"
          sx={{
            color: "#fff",
          }}
          textAlign={"center"}
          fontSize={25}
        >
          Резолюция
        </DialogTitle>
        <form className="tw-px-8 tw-pt-3 tw-bg-white">
          <Box className="tw-flex tw-gap-4" mb={3}>
            <Button variant="contained" onClick={handleAddRow}>
              Добавить строку
            </Button>
            <Button variant="contained" disabled={true}>
              Заполнить по шаблону
            </Button>
            <Button variant="contained" disabled={true}>
              Сохранить в шаблон
            </Button>
            <Button variant="contained" onClick={sendToExecute}>
              Отправить на исполнение
            </Button>
          </Box>
          {data.map((item, index) => (
            <FormGroup key={index}>
              <div className="tw-mt-5 tw-gap-6 tw-grid tw-grid-cols-6 tw-items-center">
                <div className="tw-text-center tw-flex tw-justify-end tw-items-center">
                  <div>{index + 1}.</div>
                  {index > 0 && (
                    <IconButton onClick={() => handleDeleteRow(item.id)}>
                      <DeleteOutlineIcon style={{ color: "red" }} />
                    </IconButton>
                  )}
                </div>
                <Autocomplete
                  disablePortal
                  options={person.data?.items || []}
                  getOptionLabel={(option) => option.value.toString()}
                  value={item?.to}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Контакт/Группа"
                      required
                    ></TextField>
                  )}
                  onChange={(_, value) => handleChange("to", value, item.id)}
                />
                <Autocomplete
                  disablePortal
                  options={resolutionText.data?.items || []}
                  getOptionLabel={(option) => option.value.toString()}
                  value={item.text}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Текст резолюции"
                      required
                    ></TextField>
                  )}
                  onChange={(event, value) =>
                    handleChange("text", value, item.id)
                  }
                />
                <Autocomplete
                  disablePortal
                  options={resolutionCategory.data?.items || []}
                  getOptionLabel={(option) => option.value.toString()}
                  value={item?.type}
                  renderInput={(params) => (
                    <TextField {...params} label="Тип" required></TextField>
                  )}
                  onChange={(event, value) =>
                    handleChange("type", value, item.id)
                  }
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Исполнить до"
                    inputFormat={newDateFormat}
                    value={item.executeUntil}
                    onChange={(newValue) => {
                      handleChange("executeUntil", newValue, item.id);
                    }}
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  name="comment"
                  label="Комментарий"
                  value={item?.comment}
                  onChange={(event: BaseSyntheticEvent) =>
                    handleChange(event.target.name, event.target.value, item.id)
                  }
                />
              </div>
            </FormGroup>
          ))}
          <Box
            className="tw-flex tw-py-5 tw-gap-4 tw-full"
            justifyContent="center"
            mx="auto"
            my={10}
            mb={3}
          >
            <Button onClick={handleSubmit} variant="contained" disabled={false}>
              Вынести резолюцию
            </Button>
            <Button onClick={handleCancel}>Отмена</Button>
          </Box>
        </form>
      </div>
    </Box>
  );
};

export default ResolutionAway;
