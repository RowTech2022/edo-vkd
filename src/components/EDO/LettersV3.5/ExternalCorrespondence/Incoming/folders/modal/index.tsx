import styled from "@emotion/styled";
import { FormikErrors, useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Modal from "@mui/material/Modal";
import { useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import { useCreateFolderMutation } from "@services/lettersApiV3";

interface ModalFormProps {
  open: boolean;
  onToggle: () => void;
  refreshDataTable: () => void;
}

export interface CreateFolderProps {
  name: string;
  prefix?: string;
}

export const StyledCard = styled(Card)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  max-width: 400px;
`;
export const StyledCardHeader = styled(CardHeader)`
  margin-bottom: 10px;
  background-color: #607d8b;

  .MuiTypography-root {
    color: white;
    font-size: 16px;
  }
`;

export default function ModalForm({
  open,
  onToggle,
  refreshDataTable,
}: ModalFormProps) {
  const [createFolder, { isLoading, isError, isSuccess }] =
    useCreateFolderMutation();
  const { values, handleSubmit, handleChange, errors, resetForm } =
    useFormik<CreateFolderProps>({
      initialValues: {
        name: "",
      },
      validate(values) {
        const errors: FormikErrors<CreateFolderProps> = {};
        if (!values.name) {
          errors.name = "Обязательное поле";
        } else if (values.name.length < 3) {
          errors.name = "Введите не менее 3 символов";
        }
        return errors;
      },
      onSubmit(values) {
        createFolder(values).then(() => {
          onToggle();
        });
      },
    });

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [open, resetForm]);

  useEffect(() => {
    if (isError) {
      toast("Произошла ошибка. Попробуйте повторить позже.", {
        type: "error",
        position: "bottom-right",
      });
    }
    if (isSuccess) {
      toast("Папка создана.", {
        type: "success",
        position: "bottom-right",
      });
      refreshDataTable();
    }
  }, [isError, isSuccess]);

  return (
    <Modal open={open} onClose={onToggle}>
      <StyledCard sx={{ borderRadius: "16px" }}>
        <StyledCardHeader title="Новая папка" />
        <CardContent>
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="tw-flex tw-flex-col tw-gap-5"
          >
            <TextField
              size="small"
              name="name"
              label="Название папки"
              value={values.name}
              error={!!errors.name}
              disabled={isLoading}
              autoFocus
              fullWidth
              onChange={handleChange}
              helperText={errors.name}
            />
            <TextField
              size="small"
              name="prefix"
              label="Префикс"
              value={values.prefix}
              error={!!errors.prefix}
              disabled={isLoading}
              autoFocus
              fullWidth
              onChange={handleChange}
              helperText={errors.prefix}
            />
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
              fullWidth
            >
              Создать
            </LoadingButton>
          </form>
        </CardContent>
      </StyledCard>
    </Modal>
  );
}
