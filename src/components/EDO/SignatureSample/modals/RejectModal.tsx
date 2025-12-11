import { FC } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormGroup,
  Modal,
  TextField,
} from "@mui/material";
import { Card , CustomTextField } from "@ui";
import { Form, Formik } from "formik";
import { useFetchRejectReasonsQuery } from "@services/generalApi";
import { toast } from "react-toastify";
import { useRejectSignaturesSampleCardMutation } from "@services/signatureCardApi";

interface IRejectModal {
  entry?: SignatureSamples.Card;
  open: boolean;
  onClose: () => void;
}

export const RejectModal: FC<IRejectModal> = ({ entry, open, onClose }) => {
  // mutations
  const rejectReasonsQuery = useFetchRejectReasonsQuery({ type: 3 });
  const [rejectSignatureSampleCard] = useRejectSignaturesSampleCardMutation();

  const handleRejectForm = (payload: {
    reason: { id: string; value: string } | null;
    comment: string;
  }) => {
    if (entry && payload) {
      toast.promise(
        rejectSignatureSampleCard({
          id: entry.id,
          comment: payload.comment,
          reason: parseInt(payload.reason?.id!),
          timestamp: entry.timestamp,
        }),
        {
          pending: "Форма отклоняется",
          success: "Форма отклонена",
          error: "Произошла ошибка",
        }
      );
    }
  };

  return (
    <Modal open={open}>
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
                handleRejectForm({ reason, comment });
                onClose();
              }}
            >
              {({ values, setFieldValue, handleChange, touched, errors }) => (
                <Form className="tw-px-20 tw-py-10 tw-bg-white md:tw-rounded-lg tw-mt-2">
                  <FormGroup className="tw-gap-6">
                    <Autocomplete
                      id="v.reason"
                      disablePortal
                      options={rejectReasonsQuery.data?.items || []}
                      getOptionLabel={(option) => option.value.toString()}
                      value={values.reason}
                      renderInput={(params) => (
                        <CustomTextField
                          params={params}
                          label="Выберите причину отказа*"
                          error={touched.reason && Boolean(errors.reason)}
                          helperText={touched.reason && errors.reason}
                        />
                      )}
                      onChange={(event, value) => {
                        setFieldValue("reason", value);
                      }}
                    />
                    <TextField
                      name="comment"
                      label="Коменнтарий"
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
                    <Button onClick={() => onClose()}>Отмена</Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </Box>
    </Modal>
  );
};
