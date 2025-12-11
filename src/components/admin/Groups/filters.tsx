import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";

import { GroupSearchRequest } from "@services/admin/groupApi";
import { useFetchGroupTypesQuery } from "@services/admin/groupTypesApi";
import { useFetchRoleListQuery } from "@services/admin/rolesApi";
import { ValueIDAutocomplete } from "@ui";

interface FiltersProps {
  onChange: (params?: GroupSearchRequest) => void;
}

export default function Filters({ onChange }: FiltersProps) {
  const groupTypesQuery = useFetchGroupTypesQuery();
  const roleListQuery = useFetchRoleListQuery();
  const { handleSubmit, handleReset, handleChange, values, setFieldValue } =
    useFormik<GroupSearchRequest>({
      initialValues: {},
      onSubmit(values) {
        onChange(values);
      },
      onReset() {
        onChange();
      },
    });

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction="row" spacing={3}>
        <TextField
          size="small"
          fullWidth
          name="groupName"
          label="Наименование группы"
          value={values.groupName}
          onChange={handleChange}
        />
        <ValueIDAutocomplete
          name="groupType"
          size="small"
          label="Тип группы"
          value={values.groupType}
          options={groupTypesQuery.data?.items}
          loading={groupTypesQuery.isFetching}
          onChange={setFieldValue}
        />
        <ValueIDAutocomplete
          name="template"
          size="small"
          label="Наименование роли"
          value={values.template}
          options={roleListQuery.data?.items}
          loading={roleListQuery.isFetching}
          onChange={setFieldValue}
        />
        <Button
          sx={{ minWidth: 136 }}
          variant="outlined"
          disabled={!(values.template || values.groupType || values.groupName)}
          startIcon={<SearchIcon />}
          type="submit"
        >
          Найти
        </Button>
        <Button
          sx={{ minWidth: 136 }}
          color="error"
          variant="outlined"
          disabled={!(values.template || values.groupType || values.groupName)}
          startIcon={<HighlightOffIcon />}
          onClick={handleReset}
        >
          Очистить
        </Button>
      </Stack>
    </form>
  );
}
