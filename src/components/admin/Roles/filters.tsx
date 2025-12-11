import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { ValueIDAutocomplete } from "@ui";
import { useFormik } from "formik";
import { memo } from "react";
import { useFetchRoleListQuery } from "@services/admin/rolesApi";
import { ValueId } from "@services/api";

interface FiltersProps {
  onChange: (params?: FilterFormProps) => void;
}

export interface FilterFormProps {
  role?: ValueId;
}

export default memo(function Filters({ onChange }: FiltersProps) {
  const roleListQuery = useFetchRoleListQuery();
  const { handleSubmit, handleReset, setFieldValue, values } =
    useFormik<FilterFormProps>({
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
        <ValueIDAutocomplete
          sx={{ minWidth: "300px" }}
          name="role"
          size="small"
          label="Название роли"
          value={values.role}
          options={roleListQuery.data?.items}
          loading={roleListQuery.isFetching}
          onChange={setFieldValue}
        />
        <Button
          sx={{ minWidth: "auto" }}
          variant="outlined"
          disabled={roleListQuery.isFetching || !values.role}
          startIcon={<SearchIcon />}
          type="submit"
        >
          Найти
        </Button>
        <Button
          sx={{ minWidth: "auto" }}
          color="error"
          variant="outlined"
          disabled={roleListQuery.isFetching || !values.role}
          startIcon={<HighlightOffIcon />}
          onClick={handleReset}
        >
          Очистить
        </Button>
      </Stack>
    </form>
  );
});
