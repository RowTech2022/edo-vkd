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
import { Card } from "@ui";
import { useFetchLetterApproveListQuery } from "@services/generalApi";
import { useSendToResolutionMutation } from "@services/lettersApi";

const ResolutionSend = ({ onClose, id, ...props }: any) => {
  const [sendToResolution] = useSendToResolutionMutation();
  const handleSubmit = (values: {
    approveBy: { id: string; value: string } | null;
    comment: string;
  }) => {
    toast.promise(
      async () => {
        const res = await sendToResolution({
          comment: values.comment,
          approveBy: Number(values.approveBy?.id || 0),
          id: props.entry.id,
          currentState: props.entry.state,
          timestamp: props.entry.timestamp,
        });
        onClose && onClose();
      },
      {
        pending: "Входящее письмо отправка",
        success: "Входящее письмо отправлено",
        error: "Произошла ошибка",
      }
    );
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  const rejectReasonsQuery = useFetchLetterApproveListQuery();

  return (
    <Box className="tw-absolute sm:tw-w-fit tw-w-full tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2">
      <div className="lg:tw-w-[512px] md:tw-w-[400px] tw-w-full">
        <Card title="Отправить на резолюцию">
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
              <Form className="tw-px-16 tw-py-5 tw-bg-white md:tw-rounded-lg ">
                <Box className="tw-pt-4 tw-flex tw-gap-4" mb={3}>
                  <Button type="submit" variant="contained">
                    Отправить
                  </Button>
                  <Button onClick={handleCancel}>Отмена</Button>
                </Box>
                <FormGroup className="tw-gap-6">
                  <Autocomplete
                    disablePortal
                    options={rejectReasonsQuery.data?.items || []}
                    getOptionLabel={(option: any) => option.value.toString()}
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
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </Box>
  );
};

export default ResolutionSend;
