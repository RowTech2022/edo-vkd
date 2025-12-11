import { FC } from "react";
import { Box, FormGroup, TextField } from "@mui/material";

import { EgovFullFormikType } from "../helpers/schema";

import { getFieldErrors } from "@utils";

interface IEgovServiceForm {
  formik: EgovFullFormikType;
  disabled?: boolean;
}

export const EgovServiceForm: FC<IEgovServiceForm> = ({ formik, disabled }) => {
  const { values, handleChange, handleBlur } = formik

  return (
    <FormGroup className="tw-pt-4">
      <div className="tw-flex tw-flex-col tw-gap-4">
        <TextField
          label="Название услуги"
          size="small"
          type="text"
          onChange={handleChange}
          value={values.name}
          {...getFieldErrors(formik, "name")}
          name="name"
          onBlur={handleBlur}
          disabled={disabled}
          required
          fullWidth
        />
        <TextField
          sx={{
            ".MuiOutlinedInput-input": {
              maxHeight: "161px",
              overflow: "auto !important",
            },
          }}
          label="Описание"
          size="small"
          type="text"
          multiline
          onChange={handleChange}
          value={values.description}
          {...getFieldErrors(formik, "description")}
          name="description"
          onBlur={handleBlur}
          disabled={disabled}
          required
          fullWidth
        />
      </div>
      <Box display={"flex"} gap={2} sx={{ py: 2 }}>
        <TextField
          name="price"
          label="Сумма обработки завяления"
          value={values?.price}
          size="small"
          onChange={handleChange}
          required
        />

        <TextField
          name="treatmentPrice"
          label="Сумма получение услуги"
          value={values?.treatmentPrice}
          size="small"
          onChange={handleChange}
          required
        />

        <TextField
          name="term"
          type="number"
          label="Срок предоставление услуги"
          value={values?.term}
          size="small"
          onChange={handleChange}
          required
        />

        <TextField
          type="number"
          name="phoneNumber"
          label="Телефон для справки"
          value={values?.phoneNumber}
          size="small"
          onChange={handleChange}
          required
        />
      </Box>
    </FormGroup>
  );
};
