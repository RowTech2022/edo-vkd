import { Autocomplete, Box, Button, FormGroup, TextField } from "@mui/material";
import { Form, useFormik } from "formik";
import { FC } from "react";
import { ValueId } from "@services/api";
import { IEgovUndoDocRequest } from "@services/egov/application-resident/models/actions";
import { useFetchRejectReasonsQuery } from "@services/generalApi";

interface IEgovUndoDoc {
  id: number;
  handleCancel: () => void;
  undoDocument: (payload: IEgovUndoDocRequest) => void;
}

interface IInitialValues {
  id: number;
  reason: ValueId | null;
  comment: string;
}

const initialValues: IInitialValues = {
  id: 0,
  reason: null,
  comment: "",
};

export const EgovUndoDoc: FC<IEgovUndoDoc> = ({
  id,
  handleCancel,
  undoDocument,
}) => {
  const rejectReasonsQuery = useFetchRejectReasonsQuery({ type: 10 });

  const formik = useFormik({
    initialValues,
    onSubmit(values) {
      const payload: IEgovUndoDocRequest = {
        id,
        reason: Number(values.reason?.id) || 0,
        comment: values.comment || "",
      };

      undoDocument(payload);
    },
  });

  const { values, touched, errors, setFieldValue, handleChange } = formik;
  return (
    <Box>
      <Form className="tw-px-8 tw-py-10 tw-bg-white md:tw-rounded-lg tw-mt-2">
        <FormGroup className="tw-gap-6">
          <Autocomplete
            id="v.reason"
            disablePortal
            options={rejectReasonsQuery.data?.items || []}
            getOptionLabel={(option) => option.value.toString()}
            value={values.reason}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Выберите причину отказа*"
                error={touched.reason && Boolean(errors.reason)}
                helperText={touched.reason && errors.reason}
              ></TextField>
            )}
            onChange={(event, value) => {
              setFieldValue("reason", value);
            }}
          />
          <TextField
            name="comment"
            label="Комментарий"
            value={values.comment}
            multiline
            minRows={4}
            error={touched.comment && Boolean(errors.comment)}
            helperText={touched.comment && errors.comment}
            onChange={handleChange}
          />
        </FormGroup>
        <Box className="tw-pt-4 tw-flex tw-gap-4">
          <Button type="submit" variant="contained">
            Сохранить
          </Button>
          <Button onClick={handleCancel}>Отмена</Button>
        </Box>
      </Form>
    </Box>
  );
};
