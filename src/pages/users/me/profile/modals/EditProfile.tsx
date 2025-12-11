import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import {
  useDeleteUserSignMutation,
  useUpdateProfileMutation,
} from "@services/admin/rolesApi";
import { useEffect, useRef, useState } from "react";
import fileService from "@services/fileService";
import { toast } from "react-toastify/dist";
import Close from "@mui/icons-material/Close";

interface Props {
  open: boolean;
  onClose: () => void;
  data?: any;
  onUpdates: () => void;
}

interface IUpdate {
  id: number;
  email: string;
  phone: string;
  userSign: string;
  telegramId : number
}

const EditProfile = ({ open, onClose, data, onUpdates }: Props) => {
  const [updateProfile] = useUpdateProfileMutation();
  const [deleteUserSign] = useDeleteUserSignMutation();
  const [formData, setFormData] = useState<IUpdate>({
    id: data?.id,
    email: "",
    phone: "",
    userSign: "",
    telegramId : null
  });
  const [newUserSign, setNewUserSign] = useState<File | null>(null);
  const [previewSign, setPreviewSign] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChange =
    (field: keyof IUpdate) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSave = async () => {
    try {
      const res = await updateProfile(formData);
      onClose();
      onUpdates();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const allowedFormats = [".jpg", ".jpeg", ".png", ".webp"];
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();
    const isRightFormat = allowedFormats.includes(fileExtension);

    if (!isRightFormat) {
      toast(
        "Можно загрузить только изображения в формате .jpg, .jpeg, .png, .webp",
        {
          type: "error",
          position: "top-right",
        }
      );
      return;
    }

    const formDataFile = new FormData();
    formDataFile.append("file", file);

    try {
      const response = await fileService.uploadFileV2(formDataFile);
      const uploaded = response as { data: { url: string } };

      setFormData((prev) => ({
        ...prev,
        userSign: uploaded.data.url,
      }));

      setPreviewSign(uploaded.data.url);
    } catch (error) {
      console.error(error);
      toast("Ошибка загрузки изображения", {
        type: "error",
        position: "top-right",
      });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (data) {
      setFormData({
        id: data.id,
        email: data.email || "",
        phone: data.phone || "",
        userSign: data.userSign || "",
        telegramId : data.telegramId || null 
      });
      setPreviewSign(null);
    }
  }, [data]);

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
              mb: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: "600" }}>
              Редактировать профиль
            </Typography>
            <IconButton aria-label="close" onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ cursor: "pointer" }} onClick={handleImageClick}>
              <img
                src={previewSign || formData.userSign || "/images/podpis.png"}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "contain",
                  backgroundColor: "#f0f0f0",
                }}
                alt="User Sign"
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              {!formData.userSign ? (
                <Button variant="outlined" onClick={handleImageClick}>
                  Добавить подпись
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={async () => {
                    try {
                      await deleteUserSign({});
                      setFormData((prev) => ({ ...prev, userSign: "" }));
                      setPreviewSign(null);
                      toast("Подпись успешно удалена", {
                        type: "success",
                        position: "top-right",
                      });
                    } catch (error) {
                      console.error(error);
                      toast("Ошибка при удалении подписи", {
                        type: "error",
                        position: "top-right",
                      });
                    }
                  }}
                >
                  Удалить подпись
                </Button>
              )}
            </Box>
          </Box>
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleUploadFile}
          />
          <Box />
          <TextField
            value={data?.displayName || ""}
            disabled
            fullWidth
            label="ФИО"
          />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              disabled
              value={formData.phone}
              onChange={handleChange("phone")}
              label="Телефон"
            />
            <TextField
              fullWidth
              value={formData.email}
              onChange={handleChange("email")}
              label="E-mail"
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              value={formData.telegramId}
              onChange={handleChange("telegramId")}
              label="Телеграм ID"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "end", mt: 2, gap: 2 }}>
          <Button onClick={handleSave} variant="contained">
            Сохранить
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProfile;
