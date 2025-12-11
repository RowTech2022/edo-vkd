import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import Close from "@mui/icons-material/Close";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@services/admin/rolesApi";
import { toastPromise } from "@utils";
import { Autocomplete } from "@mui/material";
import { CustomTextField } from "@ui";
import { useAvailableUserMutation } from "@services/admin/userApi";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any;
  onTaskUpdated: () => void;
}

interface TaskData {
  id?: number;
  title: string;
  description: string;
  date: string;
  time: string;
  members: string[]; // массив id
}

const EditTask = ({ open, onClose, data, onTaskUpdated }: Props) => {
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [availableUser] = useAvailableUserMutation();

  const [formData, setFormData] = useState<TaskData>({
    title: "",
    description: "",
    date: "",
    time: "",
    members: [],
  });

  const [available, setAvailable] = useState<{ data?: { items: any[] } }>({});
  const [smart, setSmart] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const getAvailableUser = async (param: string) => {
    try {
      const res = await availableUser({ smart: param });
      //@ts-ignore
      setAvailable(res);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMembersChange = (e: any, value: any[]) => {
    setSelectedUsers(value);
    setFormData((prev) => ({
      ...prev,
      members: value.map((item) => item.id),
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        id: data.id,
        ...formData,
      };
      //@ts-ignore
      await updateTask(payload);
      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error("Ошибка при обновлении задачи:", error);
    }
  };

  const handleDelete = async () => {
    const promise = deleteTask({ id: data.id! }).then(() => {
      onClose?.();
      onTaskUpdated();
    });

    await toastPromise(promise, {
      pending: "Задача удаляется",
      success: "Задача успешно удалена",
      error: "Произошла ошибка",
    });
  };

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title,
        description: data.description,
        date: dayjs(data.date).format("YYYY-MM-DD"),
        time: data.time ? dayjs(`1970-01-01T${data.time}`).format("HH:mm") : "",
        members: data.members?.map((m: any) => m.id) || [],
      });

      if (data.members) {
        const members = data.members;
        setSelectedUsers(members);
        setAvailable({ data: { items: members } });
      }
    }
  }, [data]);

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (smart !== "") {
      getAvailableUser(smart);
    }
  }, 200); // слишком много запросов шло поэтому это поставил чтобы не спамит запросами

  return () => clearTimeout(delayDebounce);
}, [smart]);

 useEffect(() => {
  if (open) {
    getAvailableUser("");
  }
}, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: 4,
          borderRadius: "8px",
          boxShadow: 24,
          width: "450px",
        }}
      >
        <Box>
          <Box
            sx={{
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "600" }}>Редактировать</Typography>
            <IconButton aria-label="close" onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <TextField
              label="Заголовок"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Описание"
              name="description"
              multiline
              fullWidth
              size="small"
              value={formData.description}
              onChange={handleChange}
              InputProps={{
                sx: {
                  resize: "vertical",
                  overflow: "auto",
                },
              }}
            />
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата"
                value={formData.date}
                onChange={(newDate) => {
                  setFormData((prev) => ({
                    ...prev,
                    date: newDate ? dayjs(newDate).format("YYYY-MM-DD") : "",
                  }));
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>

            <TextField
              size="small"
              label="Время"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Box>

          <Box mt={2}>
            <Autocomplete
              multiple
              size="small"
              sx={{ maxWidth: "400px" }}
              options={available?.data?.items || []}
              getOptionLabel={(option) => option?.value || ""}
              value={selectedUsers}
              inputValue={inputValue}
              onInputChange={(e, val) => {
                setInputValue(val);
                setSmart(val);
              }}
              onChange={handleMembersChange}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <CustomTextField params={params} label="Пользователи" />
              )}
            />
          </Box>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "end", gap: 2 }}>
            <Button onClick={handleDelete} variant="contained" color="error">
              Удалить
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Сохранить
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditTask;
