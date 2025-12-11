import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { FC, useState } from "react";
import { useCheckPaymentsEgovApplicationMutation } from "@services/egov/application-resident";
import { IEgovCheckPaymentsRequest } from "@services/egov/application-resident/models/actions";
import CloseIcon from "@mui/icons-material/Close";
import { newDateFormat } from "@utils";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const initialValues: IEgovCheckPaymentsRequest = {
  doc_No: "",
  doc_Date: new Date(),
  doc_Summ: 0,
  inn: "",
};

interface ICheckPaymentForm {
  onClose: () => void;
}
export const CheckPaymentForm: FC<ICheckPaymentForm> = ({ onClose }) => {
  const [checkPayment] = useCheckPaymentsEgovApplicationMutation();
  const [message, setMessage] = useState("");

  const formik = useFormik({
    initialValues,
    onSubmit(values) {
      const payload: IEgovCheckPaymentsRequest = {
        ...values,
        doc_Summ: Number(values.doc_Summ),
      };

      checkPayment(payload).then((res: any) => {
        if ("data" in res && !res.error) {
          setMessage(res.data.message);
        }
      });
    },
  });

  const { values, handleChange } = formik;

  const title = (
    <Box
      sx={{
        backgroundColor: "#607D8B",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "60px",
        padding: 1,
        mb: 3,
        boxShadow: "rgba(17, 17, 26, 0.1) 0px 1px 0px",
        textAlign: "center",
        position: "relative",
      }}
    >
      <Typography variant="h6" color="#fff" textAlign="center">
        Проверка оплаты
      </Typography>
      <CloseIcon
        onClick={onClose}
        sx={{
          color: "#fff",
          cursor: "pointer",
          position: "absolute",
          top: "50%",
          right: "20px",
          transform: "translateY(-50%)",
        }}
        fontSize="medium"
      />
    </Box>
  );

  return (
    <Box
      sx={{
        minWidth: "600px",
        minHeight: "400px",
      }}
    >
      {title}
      <Box
        sx={{
          minHeight: "230px",
          border: "2px solid #eee",
          borderRadius: 2,
          mx: 3,
        }}
      >
        <Box display={"flex"} bgcolor={"#eee"} gap={2} p={2}>
          <TextField
            name="doc_No"
            label="Номер документа"
            value={values.doc_No}
            size="small"
            onChange={handleChange}
            required
          />
          <DatePicker
            inputFormat={newDateFormat}
            label="Дата"
            value={values.doc_Date}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField size="small" {...params} required />
            )}
          />
          <TextField
            name="doc_Summ"
            label="Сумма"
            value={values.doc_Summ}
            size="small"
            onChange={handleChange}
            required
          />
          <TextField
            name="inn"
            label="ИНН"
            value={values.inn}
            size="small"
            onChange={handleChange}
            required
          />
        </Box>

        {message && (
          <Box
            sx={{
              pt: 5,
              mx: "auto",
              maxWidth: "500px",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            {message}
          </Box>
        )}
      </Box>
      <Box display="flex" justifyContent="center" pt={3}>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => formik.submitForm()}
        >
          Проверить
        </Button>
      </Box>
    </Box>
  );
};
