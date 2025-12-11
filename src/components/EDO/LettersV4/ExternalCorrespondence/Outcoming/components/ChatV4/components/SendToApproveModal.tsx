import { FC } from "react";
import { Box, Button, FormGroup, Modal, TextField } from "@mui/material";
import { Card } from "@ui";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";

interface IRejectModal {
  entry?: Act.Act;
  open: boolean;
  onClose: () => void;
  executeAction: (values: any) => Promise<any>;
  descriptions: {
    modalTitle: string;
    btnTitle: string;
  };
}

export const SendTopApproveOrDoneModal: FC<IRejectModal> = ({
  entry,
  open,
  onClose,
  executeAction,
  descriptions,
}) => {
  // mutations

  const handleRejectForm = (payload: {
    reason: { id: string; value: string } | null;
    comment: string;
  }) => {
    if (entry && payload) {
      toast.promise(
        executeAction({
          incomingId: entry.id,
          comment: payload.comment,
        }),
        {
          pending: "Форма сохраняется",
          success: "Форма сохранена",
          error: "Произошла ошибка",
        }
      );
    }
  };

  return (
    <Modal open={open}>
      <Box className="tw-absolute sm:tw-w-fit tw-w-full tw-bg-white tw-rounded-[40px] tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2">
        <div className="lg:tw-w-[512px] md:tw-w-[400px] tw-w-full">
          <Card title={descriptions.modalTitle}>
            <Formik
              initialValues={{ reason: null, comment: "" }}
              validate={({ reason, comment }) => {
                const errors: any = {};
                // if (comment === "") {
                //   errors.comment = "Обязательное поле";
                // }

                return errors;
              }}
              onSubmit={({ reason, comment }) => {
                handleRejectForm({ reason, comment });
                onClose();
              }}
            >
              {({ values, setFieldValue, handleChange, touched, errors }) => (
                <Form className="tw-px-8 tw-py-8 tw-bg-white md:tw-rounded-lg tw-mt-2">
                  <FormGroup className="tw-gap-6">
                    <TextField
                      name="comment"
                      label="Коменнтарий"
                      value={values.comment}
                      multiline
                      minRows={4}
                      // error={touched.comment && Boolean(errors.comment)}
                      // helperText={touched.comment && errors.comment}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <Box className="tw-pt-4 tw-flex tw-gap-4">
                    <Button type="submit" variant="contained">
                      {descriptions.btnTitle}
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
