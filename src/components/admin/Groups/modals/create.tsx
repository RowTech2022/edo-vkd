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
import { useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  GroupSearchRequest,
  useCreateGroupMutation,
} from "@services/admin/groupApi";
import { useFetchGroupTypesQuery } from "@services/admin/groupTypesApi";
import { useFetchRoleListQuery } from "@services/admin/rolesApi";
import { ValueIDAutocomplete } from "@ui";

interface CreateGroupProps {
  onSuccess: () => void;
}

export default function CreateGroup({ onSuccess }: CreateGroupProps) {
  const [open, setOpen] = useState(false);
  const groupTypesQuery = useFetchGroupTypesQuery();
  const roleListQuery = useFetchRoleListQuery();
  const [createGroup, { isLoading, isError, isSuccess }] =
    useCreateGroupMutation();
  const { handleSubmit, handleChange, values, setFieldValue, resetForm } =
    useFormik<GroupSearchRequest>({
      initialValues: {},
      onSubmit(values) {
        createGroup(values as Required<GroupSearchRequest>);
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
      toast("Группа создана.", {
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
        sx={{ minWidth: 136 }}
        color="success"
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleToggleModal}
      >
        Создать
      </Button>
      <Modal open={open} onClose={handleToggleModal}>
        <StyledCard>
          <StyledCardHeader title="Новая группа" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  name="groupName"
                  label="Наименование группы"
                  value={values.groupName}
                  disabled={isLoading}
                  required
                  fullWidth
                  onChange={handleChange}
                />
                <ValueIDAutocomplete
                  name="groupType"
                  label="Тип группы"
                  value={values.groupType}
                  options={groupTypesQuery.data?.items}
                  loading={groupTypesQuery.isFetching}
                  required
                  onChange={setFieldValue}
                />
                <ValueIDAutocomplete
                  name="template"
                  label="Наименование роли"
                  value={values.template}
                  options={roleListQuery.data?.items}
                  loading={roleListQuery.isFetching}
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
