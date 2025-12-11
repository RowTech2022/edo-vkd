import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  StyledCard,
  StyledCardHeader,
} from "@root/components/EDO/Letters/Incoming/folders/modal";
import { ValueIDAutocomplete } from "@ui";
import { useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateRoleMutation,
  useFetchRoleListQuery,
} from "@services/admin/rolesApi";
import { ValueId } from "@services/api";
import {
  useFetchOrganisationTypeListQuery,
  useFetchUserTypesQuery,
} from "@services/generalApi";

interface FormProps {
  organisationType?: ValueId;
  userType?: ValueId;
  roleName: string;
  template?: ValueId;
}

export default function Create({ onSuccess }: { onSuccess: () => void }) {
  const userTypesQuery = useFetchUserTypesQuery();
  const organisationTypeListQuery = useFetchOrganisationTypeListQuery();
  const roleListQuery = useFetchRoleListQuery();
  const [createRole, { isLoading, isError, isSuccess }] =
    useCreateRoleMutation();
  const [open, setOpen] = useState(false);
  const { handleSubmit, handleChange, values, resetForm, setFieldValue } =
    useFormik<FormProps>({
      initialValues: {
        roleName: "",
      },
      onSubmit(values) {
        createRole(values as Required<FormProps>);
      },
    });
  const handleToggleModal = () => {
    if (!isLoading) {
      setOpen(!open);
    }
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  useEffect(() => {
    if (isError) {
      toast("Произошла ошибка. Попробуйте повторить позже.", {
        type: "error",
        position: "bottom-right",
      });
    }
    if (isSuccess) {
      toast("Роль создана.", {
        type: "success",
        position: "bottom-right",
      });
      onSuccess();
      setOpen(false);
    }
  }, [isError, isSuccess, onSuccess]);

  return (
    <Fragment>
      <Button
        sx={{ minWidth: "auto" }}
        color="success"
        variant="outlined"
        disabled={
          userTypesQuery.isLoading ||
          organisationTypeListQuery.isLoading ||
          roleListQuery.isLoading
        }
        startIcon={<AddIcon />}
        onClick={handleToggleModal}
      >
        Создать
      </Button>
      <Modal open={open} onClose={handleToggleModal}>
        <StyledCard>
          <StyledCardHeader title="Новая роль" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  name="roleName"
                  label="Название роли"
                  value={values.roleName}
                  disabled={isLoading}
                  required
                  fullWidth
                  onChange={handleChange}
                />
                <ValueIDAutocomplete
                  name="organisationType"
                  label="Тип организации"
                  value={values.organisationType}
                  options={organisationTypeListQuery.data?.items}
                  loading={organisationTypeListQuery.isFetching}
                  disabled={isLoading}
                  required
                  onChange={setFieldValue}
                />
                <ValueIDAutocomplete
                  name="userType"
                  label="Тип пользователя"
                  value={values.userType}
                  options={userTypesQuery.data?.items}
                  loading={userTypesQuery.isFetching}
                  disabled={isLoading}
                  required
                  onChange={setFieldValue}
                />
                <ValueIDAutocomplete
                  name="template"
                  label="Шаблон ролей"
                  value={values.template}
                  options={roleListQuery.data?.items}
                  loading={roleListQuery.isFetching}
                  disabled={isLoading}
                  onChange={setFieldValue}
                />
                <LoadingButton
                  type="submit"
                  variant="outlined"
                  loading={isLoading}
                  fullWidth
                >
                  Сохранить
                </LoadingButton>
              </Stack>
            </form>
          </CardContent>
        </StyledCard>
      </Modal>
    </Fragment>
  );
}
