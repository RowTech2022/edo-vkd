import { FC, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  FormGroup,
  Modal,
  TextField,
} from "@mui/material";
import { Card } from "@ui";
import { Form, Formik } from "formik";

import { useFetchRejectReasonsQuery } from "@services/generalApi";
import { toast } from "react-toastify";
import { useRejectAccountantResponsibilitiesMutation } from "@services/accountantApi";
import { ValueId } from "@services/api";

interface IRejectModal {
  id?: number;
  timestamp?: string;
}

export const RejectModal: FC<IRejectModal> = ({ id, timestamp }) => {
  const [visibility, setVisiblity] = useState(false);

  // data queries
  const rejectReasonsQuery = useFetchRejectReasonsQuery({ type: 4 });

  // mutations
  const [rejectList] = useRejectAccountantResponsibilitiesMutation();

  const handleReject = ({
    reason = null,
    comment = "",
  }: {
    reason: ValueId | null;
    comment: string;
  }) => {
    if (id && timestamp) {
      toast.promise(
        rejectList({
          id: id,
          reason: parseInt(reason?.id as string),
          comment,
          timestamp,
        }),
        {
          pending: "Карточка отклоняется",
          success: "Карточка отклонена",
          error: "Произошла ошибка",
        }
      );
    }
  };

  const validate = ({ reason, comment }: any) => {
    const errors: any = {};
    if (comment === "") {
      errors.comment = "Обязательное поле";
    }

    if (!reason) {
      errors.reason = "Обязательное поле";
    }

    return errors;
  };

  const onSubmit = ({ reason, comment }: any) => {
    handleReject({ reason, comment });
    setVisiblity(false);
  };

  return (
    <div id="modals">
      <Modal open={visibility}>
        <Box className="tw-absolute sm:tw-w-fit tw-w-full tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2">
          <div className="lg:tw-w-[512px] md:tw-w-[400px] tw-w-full">
            <Card title="Причина отказа">
              <Formik
                initialValues={{ reason: null, comment: "" }}
                validate={validate}
                onSubmit={onSubmit}
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
                      <Button onClick={() => setVisiblity(false)}>
                        Отмена
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Card>
          </div>
        </Box>
      </Modal>
    </div>
  );
};
