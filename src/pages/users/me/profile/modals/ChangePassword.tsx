import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useChangePasswordMutation } from "@services/admin/rolesApi";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface ChangePassword {
  oldPassWord: string;
  newPassWord: string;
  passWordAgain: string;
}

const ChangePassword = ({ open, onClose }: Props) => {
  const [changePassword] = useChangePasswordMutation();

  const [formData, setFormData] = useState<ChangePassword>({
    oldPassWord: "",
    newPassWord: "",
    passWordAgain: "",
  });

  const [errors, setErrors] = useState({
    oldPassWord: false,
    newPassWord: false,
    passWordAgain: false,
    notMatching: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (name === "newPassWord") {
        newErrors.newPassWord = value.length > 0 && value.length < 8;
        newErrors.notMatching =
          updatedFormData.passWordAgain.length > 0 &&
          value !== updatedFormData.passWordAgain;
      }

      if (name === "passWordAgain") {
        newErrors.passWordAgain = value.length > 0 && value.length < 8;
        newErrors.notMatching =
          updatedFormData.newPassWord.length > 0 &&
          value !== updatedFormData.newPassWord;
      }

      if (name === "oldPassWord") {
        newErrors.oldPassWord = false;
      }

      return newErrors;
    });
  };

  const handleClose = () => {
    setFormData({
      oldPassWord: "",
      newPassWord: "",
      passWordAgain: "",
    });

    setErrors({
      oldPassWord: false,
      newPassWord: false,
      passWordAgain: false,
      notMatching: false,
    });

    onClose();
  };

  const handleSubmit = async () => {
    const { oldPassWord, newPassWord, passWordAgain } = formData;

    const newErrors = {
      oldPassWord: oldPassWord.trim() === "",
      newPassWord: newPassWord.trim() === "" || newPassWord.length < 8,
      passWordAgain: passWordAgain.trim() === "" || passWordAgain.length < 8,
      notMatching: newPassWord !== passWordAgain,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    try {
      await changePassword(formData).unwrap();
      toast.success("Пароль успешно изменён");
      handleClose();
    } catch (error) {
      console.error("Ошибка изменения пароля:", error);
      toast.error("Не удалось изменить пароль");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
          width: 500,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: "600" }}>Изменение пароля</Typography>
          <p onClick={handleClose} className="tw-cursor-pointer">
            X
          </p>
        </Box>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Старый пароль"
            name="oldPassWord"
            value={formData.oldPassWord}
            onChange={handleChange}
            error={errors.oldPassWord}
            autoComplete="current-password"
            helperText={errors.oldPassWord ? "Обязательное поле" : ""}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Новый пароль"
              name="newPassWord"
              type="password"
              autoComplete="new-password"
              value={formData.newPassWord}
              onChange={handleChange}
              error={errors.newPassWord || errors.notMatching}
              helperText={
                errors.newPassWord
                  ? formData.newPassWord.trim() === ""
                    ? "Обязательное поле"
                    : "Минимум 8 символов"
                  : errors.notMatching
                  ? "Пароли не совпадают"
                  : ""
              }
            />
            <TextField
              fullWidth
              size="small"
              label="Подтвердите пароль"
              name="passWordAgain"
              type="password"
              autoComplete="new-password"
              value={formData.passWordAgain}
              onChange={handleChange}
              error={errors.passWordAgain || errors.notMatching}
              helperText={
                errors.passWordAgain
                  ? formData.passWordAgain.trim() === ""
                    ? "Обязательное поле"
                    : "Минимум 8 символов"
                  : errors.notMatching
                  ? "Пароли не совпадают"
                  : ""
              }
            />
          </Box>

          <Button
            sx={{ float: "right", mt: 2 }}
            variant="contained"
            onClick={handleSubmit}
          >
            Сохранить изменения
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ChangePassword;
