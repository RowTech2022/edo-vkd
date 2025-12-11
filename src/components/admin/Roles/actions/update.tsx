import EditIcon from "@mui/icons-material/Edit";
import LoadingButton from "@mui/lab/LoadingButton";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  StyledCard,
  StyledCardHeader,
} from "@root/components/EDO/Letters/Incoming/folders/modal";
import { ValueIDAutocomplete, Loading } from "@ui";
import { useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Role,
  useFetchRoleListQuery,
  useUpdateRoleMutation,
} from "@services/admin/rolesApi";
import { ValueId } from "@services/api";
import {
  useFetchOrganisationTypeListQuery,
  useFetchUserTypesQuery,
} from "@services/generalApi";

interface UpdateProps {
  data: Role;
  onSuccess: () => void;
}

interface FormProps {
  organisationType?: ValueId;
  userType?: ValueId;
  roleName: string;
  template?: ValueId;
}

export default function Update({ data, onSuccess }: UpdateProps) {
  const userTypesQuery = useFetchUserTypesQuery();
  const organisationTypeListQuery = useFetchOrganisationTypeListQuery();
  const roleListQuery = useFetchRoleListQuery();
  const [updateRole, { isLoading, isError, isSuccess }] =
    useUpdateRoleMutation();
  const [open, setOpen] = useState(false);
  const { handleSubmit, handleChange, values, setFieldValue } =
    useFormik<FormProps>({
      initialValues: {
        organisationType: data.organisationType,
        userType: data.userType,
        roleName: data.roleName,
        template: data.template,
      },
      onSubmit(values) {
        const params = {
          id: data.id,
          ...(values as Required<FormProps>),
        };
        updateRole(params);
      },
    });
  const handleToggleModal = () => {
    if (!isLoading) {
      setOpen(!open);
    }
  };

  useEffect(() => {
    if (isError) {
      toast("Произошла ошибка. Попробуйте повторить позже.", {
        type: "error",
        position: "bottom-right",
      });
    }
    if (isSuccess) {
      toast("Роль обновлена.", {
        type: "success",
        position: "bottom-right",
      });
      onSuccess();
      setOpen(false);
    }
  }, [isError, isSuccess, onSuccess]);

  if (
    userTypesQuery.isLoading ||
    organisationTypeListQuery.isLoading ||
    roleListQuery.isLoading
  ) {
    return <Loading />;
  }
  return (
    <Fragment>
      <IconButton color="primary" onClick={handleToggleModal}>
        <EditIcon />
      </IconButton>
      <Modal open={open} onClose={handleToggleModal}>
        <StyledCard>
          <StyledCardHeader title="Редактирование роли" />
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
