import {
  Box,
  Button,
  TextField,
  FormGroup,
  Autocomplete,
  DialogTitle,
} from "@mui/material";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import { useFetchLetterApproveListQuery } from "@services/generalApi";
import { useSendToResolutionEgovServiceRequestsMutation } from "@services/egovServiceRequests";

const saveAlerts = {
  pending: "Входящая заявка отправка",
  success: "Входящая заявка отправлена",
  error: "Произошла ошибка",
};

const ResolutionSend = ({ onClose, id, timestamp, setDTO }: any) => {
  const [sendToResolutionEgovServicesRequests] =
    useSendToResolutionEgovServiceRequestsMutation();

  const handleSubmit = (values: {
    approveBy: { id: string; value: string } | null;
    comment: string;
  }) => {
    const promise = sendToResolutionEgovServicesRequests({
      id: id || 0,
      approveBy: Number(values.approveBy?.id || 0),
      comment: values.comment,
      timestamp: timestamp,
    });

    promise
      .then((res: any) => {
        if (!res.error && "data" in res) {
          setDTO(res.data);
          onClose && onClose();
        }
      })
      .catch((err) => console.log(err));

    toast.promise(promise, saveAlerts);
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  const rejectReasonsQuery = useFetchLetterApproveListQuery();

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
          Отправить на резолюцию
        </DialogTitle>
        <Formik
          initialValues={{ approveBy: null, comment: "" }}
          validate={({ approveBy, comment }) => {
            const errors: any = {};
            if (comment === "") {
              errors.comment = "Обязательное поле";
            }

            if (!approveBy) {
              errors.approveBy = "Обязательное поле";
            }

            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, handleChange, touched, errors }) => (
            <Form className="tw-px-12 tw-py-5 tw-bg-white">
              <FormGroup className="tw-gap-6">
                <Autocomplete
                  size="small"
                  disablePortal
                  options={rejectReasonsQuery.data?.items || []}
                  getOptionLabel={(option) => option.value.toString()}
                  value={values.approveBy}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Утверждающий"
                      required
                      error={touched.approveBy && Boolean(errors.approveBy)}
                      helperText={touched.approveBy && errors.approveBy}
                    ></TextField>
                  )}
                  onChange={(event, value) => {
                    setFieldValue("approveBy", value);
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
              <Box className="tw-pt-4 tw-flex tw-gap-4 tw-justify-between">
                <Button
                  variant="outlined"
                  sx={{ background: "#e9e9e9 !important" }}
                  onClick={handleCancel}
                >
                  Отмена
                </Button>
                <Button type="submit" variant="outlined">
                  Отправить
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </div>
    </Box>
  );
};

export default ResolutionSend;
