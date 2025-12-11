import KeyIcon from "@mui/icons-material/Key";
import LoadingButton from "@mui/lab/LoadingButton";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import {
  StyledCard,
  StyledCardHeader,
} from "@root/components/EDO/Letters/Incoming/folders/modal";
import { ValueIDAutocomplete } from "@ui";
import { useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AcceptRoleRequestBody,
  useAcceptRoleMutation,
  useFetchRoleListQuery,
} from "@services/admin/rolesApi";
import {
  useFetchOrganisationTypeListQuery,
  useFetchUserTypesQuery,
} from "@services/generalApi";

export default function AcceptRole({ onSuccess }: { onSuccess: () => void }) {
  const roleListQuery = useFetchRoleListQuery();
  const userTypesQuery = useFetchUserTypesQuery();
  const organizationListQuery = useFetchOrganisationTypeListQuery();
  const [acceptRole, { isLoading, isError, isSuccess }] =
    useAcceptRoleMutation();
  const [open, setOpen] = useState(false);
  const { handleSubmit, values, setFieldValue, resetForm } = useFormik<
    Partial<AcceptRoleRequestBody>
  >({
    initialValues: {},
    onSubmit(values) {
      acceptRole(values as AcceptRoleRequestBody);
    },
  });
  const handleToggleModal = () => {
    if (!isLoading) {
      if (open) {
        resetForm();
      }
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
      toast("Роль назначена.", {
        type: "success",
        position: "bottom-right",
      });
      onSuccess();
      setOpen(false);
    }
  }, [isError, isSuccess, onSuccess]);

  return (
    <Fragment>
      <LoadingButton
        color="primary"
        variant="outlined"
        disabled={
          roleListQuery.isLoading ||
          userTypesQuery.isLoading ||
          organizationListQuery.isLoading
        }
        startIcon={<KeyIcon />}
        onClick={handleToggleModal}
      >
        Массовое назначение роли
      </LoadingButton>
      <Modal open={open} onClose={handleToggleModal}>
        <StyledCard>
          <StyledCardHeader title="Массовое назначение роли" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <ValueIDAutocomplete
                  name="role"
                  label="Роль"
                  value={values.role}
                  options={roleListQuery.data?.items}
                  loading={roleListQuery.isFetching}
                  disabled={isLoading}
                  required
                  onChange={setFieldValue}
                />
                <ValueIDAutocomplete
                  name="key"
                  label="Тип пользователя"
                  value={values.key}
                  options={userTypesQuery.data?.items}
                  loading={userTypesQuery.isFetching}
                  disabled={isLoading}
                  required
                  onChange={setFieldValue}
                />
                <ValueIDAutocomplete
                  name="type"
                  label="Тип организации"
                  value={values.type}
                  options={organizationListQuery.data?.items}
                  loading={organizationListQuery.isFetching}
                  disabled={isLoading}
                  required
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
