import { useNavigate } from "react-router";
import { Box, Button, TextField, FormGroup, Autocomplete } from "@mui/material";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";
import { Card } from "@ui";
import { useFetchRejectReasonsQuery } from "@services/generalApi";
import {
  useRejectIncomingMutation,
  IOperationInfoForUndo,
} from "@services/lettersApi";

const Reject = ({ onClose, onSubmit, ...props }: any) => {
  const [submitRejectMutation] = useRejectIncomingMutation();
  const navigate = useNavigate();

  const handleReject = ({
    reason = null,
    comment = "",
  }: {
    reason: { id: string; value: string } | null;
    comment: string;
  }) => {
    toast.promise(
      async () => {
        await submitRejectMutation({
          id: props.entry.id,
          currentState: 1,
          reason: parseInt(reason?.id!),
          comment,
          timestamp: props.entry.timestamp,
        } as IOperationInfoForUndo);
        handleCancel();
      },
      {
        pending: "Входящее письмо отклоняется",
        success: "Входящее письмо отклонена",
        error: "Произошла ошибка",
      }
    );
  };

  const handleCancel = () => {
    onClose && onClose();
  };

  const rejectReasonsQuery = useFetchRejectReasonsQuery({ type: 10 });

  return (
    <Box className="tw-absolute sm:tw-w-fit tw-w-full tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2">
      <div className="lg:tw-w-[512px] md:tw-w-[400px] tw-w-full">
        <Card title="Причина отказа">
          <Formik
            initialValues={{ reason: null, comment: "" }}
            validate={({ reason, comment }) => {
              const errors: any = {};
              if (comment === "") {
                errors.comment = "Обязательное поле";
              }

              if (!reason) {
                errors.reason = "Обязательное поле";
              }

              return errors;
            }}
            onSubmit={({ reason, comment }) => {
              handleReject({ reason, comment });
            }}
          >
            {({ values, setFieldValue, handleChange, touched, errors }) => (
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
            )}
          </Formik>
        </Card>
      </div>
    </Box>
  );
};

export default Reject;
