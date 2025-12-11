import AddIcon from "@mui/icons-material/Add";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import {
  StyledCard,
  StyledCardHeader,
} from "@root/components/EDO/Letters/Incoming/folders/modal";
import { Loading } from "@ui";
import { useFormik } from "formik";
import { Fragment, useEffect, useState } from "react";
import { AccessItem } from "@services/admin/rolesApi";
import { useFetchInterfaceListQuery } from "@services/generalApi";

interface AddProps {
  access: AccessItem[];
  onComplete?: (params: any) => void;
  disabled?: boolean;
}

interface FormProps {
  interface?: AccessItem;
  a1: boolean;
  a2: boolean;
  a3: boolean;
  a4: boolean;
  a5: boolean;
  a6: boolean;
  a7: boolean;
  a8: boolean;
}

export default function Add({
  access = [],
  onComplete,
  disabled = false,
}: AddProps) {
  const {
    data: interfaceListQuery,
    isLoading,
    isFetching,
  } = useFetchInterfaceListQuery();
  const interfaceList = (interfaceListQuery?.items || []).filter(
    (item) => access.findIndex((elm) => elm.interfaceId === item.id) === -1
  );
  const [open, setOpen] = useState(false);
  const { handleSubmit, handleChange, values, setFieldValue, resetForm } =
    useFormik<FormProps>({
      initialValues: {
        a1: true,
        a2: true,
        a3: true,
        a4: true,
        a5: true,
        a6: true,
        a7: true,
        a8: true,
      },
      onSubmit(values) {
        const params = [
          {
            ...values.interface!,
            interfaceId: values?.interface?.id,
            a1: values.a1,
            a2: values.a2,
            a3: values.a3,
            a4: values.a4,
            a5: values.a5,
            a6: values.a6,
            a7: values.a7,
            a8: values.a8,
          },
        ];
        if (onComplete) {
          setOpen(false);
          onComplete(params);
        }
      },
    });
  const handleToggleModal = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Fragment>
      <Button
        sx={{ minWidth: "auto" }}
        color="success"
        disabled={disabled}
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleToggleModal}
      >
        Добавить
      </Button>
      <Modal open={open} onClose={handleToggleModal}>
        <StyledCard>
          <StyledCardHeader title="Добавить раздел" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Autocomplete
                  value={values.interface as any}
                  options={interfaceList}
                  loading={isFetching}
                  disabled={isLoading}
                  renderInput={(params) => (
                    <TextField {...params} label="Раздел" />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.displayName}
                    </li>
                  )}
                  getOptionLabel={(option) => option.displayName}
                  onChange={(event, value) => {
                    setFieldValue("interface", value);
                  }}
                />
                <FormGroup>
                  <FormControlLabel
                    name="a1"
                    label="a1"
                    control={<Checkbox checked={values.a1} />}
                    disabled={isLoading}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    name="a2"
                    label="a2"
                    control={<Checkbox checked={values.a2} />}
                    disabled={isLoading}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    name="a3"
                    label="a3"
                    control={<Checkbox checked={values.a3} />}
                    disabled={isLoading}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    name="a4"
                    label="a4"
                    control={<Checkbox checked={values.a4} />}
                    disabled={isLoading}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    name="a5"
                    label="a5"
                    control={<Checkbox checked={values.a5} />}
                    disabled={isLoading}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    name="a6"
                    label="a6"
                    control={<Checkbox checked={values.a6} />}
                    disabled={isLoading}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    name="a7"
                    label="a7"
                    control={<Checkbox checked={values.a7} />}
                    disabled={isLoading}
                    onChange={handleChange}
                  />
                  <FormControlLabel
                    name="a8"
                    label="a8"
                    control={<Checkbox checked={values.a8} />}
                    disabled={isLoading}
                    onChange={handleChange}
                  />
                </FormGroup>
                <LoadingButton
                  type="submit"
                  variant="outlined"
                  loading={isLoading}
                  fullWidth
                >
                  Добавить
                </LoadingButton>
              </Stack>
            </form>
          </CardContent>
        </StyledCard>
      </Modal>
    </Fragment>
  );
}
