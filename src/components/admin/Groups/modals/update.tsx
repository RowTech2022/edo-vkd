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
import { ValueIDAutocomplete } from "@ui";
import { useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  GroupSearchRequest,
  UpdateGroupRequestBody,
  useUpdateGroupMutation,
} from "@services/admin/groupApi";
import { useFetchGroupTypesQuery } from "@services/admin/groupTypesApi";
import { useFetchRoleListQuery } from "@services/admin/rolesApi";

interface CreateGroupProps {
  data: UpdateGroupRequestBody;
  onSuccess: () => void;
}

export default function UpdateGroup({ data, onSuccess }: CreateGroupProps) {
  const [open, setOpen] = useState(false);
  const groupTypesQuery = useFetchGroupTypesQuery();
  const roleListQuery = useFetchRoleListQuery();
  const [createGroup, { isLoading, isError, isSuccess }] =
    useUpdateGroupMutation();
  const { handleSubmit, handleChange, values, setFieldValue } =
    useFormik<GroupSearchRequest>({
      initialValues: {
        groupType: data.groupType,
        groupName: data.groupName,
        template: data.template,
      },
      onSubmit(values) {
        createGroup({
          id: data.id,
          ...(values as Required<GroupSearchRequest>),
        });
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
      toast("Группа обновлена.", {
        type: "success",
        position: "bottom-right",
      });
      onSuccess();
      setOpen(false);
    }
  }, [isError, isSuccess, onSuccess]);

  return (
    <Fragment>
      <IconButton color="primary" onClick={handleToggleModal}>
        <EditIcon />
      </IconButton>
      <Modal open={open} onClose={handleToggleModal}>
        <StyledCard>
          <StyledCardHeader title="Редактирование группы" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  name="groupName"
                  label="Наименование группы"
                  value={values.groupName}
                  required
                  disabled={isLoading}
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
