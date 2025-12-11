import { Box, Button, TextField, FormGroup, DialogTitle } from "@mui/material";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSetTermV35Mutation } from "@services/lettersApiV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { newDateFormat } from "@utils";
import { useParams } from "react-router";

const ResolutionTerm = ({ onClose, id, ...props }: any) => {
  const [setTerm] = useSetTermV35Mutation();
  const params = useParams();
  const handleSubmit = (values: any) => {
    toast.promise(
      async () => {
        await setTerm({ ...values, id: Number(values.id) });
        onClose && onClose();
      },
      {
        pending: "Срок резолюции сохраняется",
        success: "Срок резолюции сохранено",
        error: "Произошла ошибка",
      }
    );
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  return (
    <Box className="tw-absolute sm:tw-w-fit tw-w-full tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2">
      <div className="lg:tw-w-[512px] md:tw-w-[400px] tw-w-full tw-rounded-2xl tw-overflow-hidden">
        <DialogTitle
          className="tw-bg-primary"
          sx={{
            color: "#fff",
          }}
          textAlign={"center"}
          fontSize={25}
        >
          Установить срок резолюции
        </DialogTitle>
        <Formik
          initialValues={{ id: params.id || "", date: null }}
          validate={({ date }) => {
            const errors: any = {};
            if (!date) {
              errors.date = "Обязательное поле";
            }

            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleChange, touched, errors }) => (
            <Form className="tw-px-12 tw-py-5 tw-bg-white">
              <FormGroup className="tw-gap-6 tw-pb-3">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Дата"
                    inputFormat={newDateFormat}
                    value={values.date}
                    onChange={(newValue) => {
                      setFieldValue("date", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </FormGroup>
              <Box className="tw-pt-4 tw-flex tw-gap-4 tw-justify-between">
                <Button
                  variant="outlined"
                  sx={{ background: "#e9e9e9 !important" }}
                  onClick={handleCancel}
                >
                  Отмена
                </Button>
                <Button type="submit" variant="outlined">
                  Сохранить
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </div>
    </Box>
  );
};

export default ResolutionTerm;
