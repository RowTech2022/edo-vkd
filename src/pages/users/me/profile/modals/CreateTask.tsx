import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useCreateTaskMutation } from "@services/admin/rolesApi";
import { Close } from "@mui/icons-material";
import { CustomTextField } from "@ui";
import { useAvailableUserMutation } from "@services/admin/userApi";

interface Props {
  open: boolean;
  onClose: () => void;
  dater: any;
  onTaskCreate: () => void;
}

interface Create {
  title: string;
  description: string;
  date: Date | null;
  time: any;
  members: [];
}

const CreateTask = ({ open, onClose, dater, onTaskCreate }: Props) => {
  const [createTask] = useCreateTaskMutation();
  const [availableUser] = useAvailableUserMutation();

  const [formData, setFormData] = useState<Create>({
    title: "",
    description: "",
    date: dater,
    time: "",
    members: [],
  });
  const [errors, setErrors] = useState({
    title: false,
    time: false,
    description: false,
    members: false,
  });

  const [available, setAvailable] = useState({ items: [] });
  const [smart, setSmart] = useState("");

  const InputChange = (e: any, val) => {
    setSmart(val);
  };

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setErrors((prevErrors) => ({
    ...prevErrors,
    [name]: !value.trim() ? true : false,
  }));
};


  const getAvailableUser = async (param: string) => {
    try {
      const sendData = {
        smart: param,
      };
      const res = await availableUser(sendData);
      //@ts-ignore
      setAvailable(res);
    } catch (error) {
      console.log(error);
    }
  };

  

  const handleRequisitesChange = (e: any, value: any) => {
  const formattedRequisites = value
    .map((val: string) => {
      //@ts-ignore
      const selectedItem = available?.data?.items.find(
        (item: any) => item.value === val
      );
      return selectedItem ? { id: selectedItem.id, value: selectedItem.value } : null;
    })
    .filter((item: any) => item !== null);

  setFormData((prev) => ({
    ...prev,
    members: formattedRequisites.map((item) => item.id),
  }));

  setErrors((prevErrors) => ({
    ...prevErrors,
    members: formattedRequisites.length === 0,
  }));
};


  const handleSave = async () => {
    const { title, time, description, members } = formData;

    const newErrors = {
      title: !title.trim(),
      time: !time,
      description: !description.trim(),
      members: !members.length,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((val) => val);

    if (hasErrors) return;

    try {
      const response = await createTask({
        title,
        description,
        date: dater,
        time,
        members,
      });

      onTaskCreate();
      onClose();
      setFormData({
        title: "",
        description: "",
        date: dater,
        time: "",
        members: [],
      });

      setErrors({
        title: false,
        time: false,
        description: false,
        members: false,
      });
    } catch (error) {
      console.error("Ошибка при сохранении задачи:", error);
    }
  };

  useEffect(() => {
    getAvailableUser(smart);
  }, [smart]);

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
        }}
      >
        <Box>
          <Box
            sx={{
              mb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "600" }}>Добавить события</Typography>
            <IconButton aria-label="close" onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <TextField
              fullWidth
              sx={{ width: "400px" }}
              size="small"
              label="Заголовок"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              helperText={errors.title && "Поле обязательно для заполнения"}
            />
            <TextField
              fullWidth
              sx={{ width: "400px" }}
              size="small"
              id="time"
              label="Время"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              error={errors.time}
              helperText={errors.time && "Укажите время"}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              sx={{ width: "400px" }}
              multiline
              label="Описание"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              helperText={
                errors.description && "Поле обязательно для заполнения"
              }
              InputProps={{
                sx: {
                  resize: "vertical",
                  overflow: "auto",
                },
              }}
            />
          </Box>
          <Box mt={2}>
            <Autocomplete
              size="small"
              sx={{ maxWidth:'400px' }}
              multiple
              disablePortal
              // value={values?.additional?.parentUser?.map((item: any) => item?.value) || []}
              id="combo-box-demo"
              options={
                //@ts-ignore
                available?.data?.items?.map((item: any) => item.value) || []
              }
              onChange={handleRequisitesChange}
              onInputChange={InputChange}
              renderInput={(params) => (
                <CustomTextField
                  params={params}
                  label="Пользователь"
                  error={errors.members}
                  helperText={
                    errors.members && "Выберите хотя бы одного пользователя"
                  }
                />
              )}
            />
          </Box>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "end", gap: 2 }}>
            <Button variant="contained" onClick={handleSave}>
              Сохранить
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateTask;
