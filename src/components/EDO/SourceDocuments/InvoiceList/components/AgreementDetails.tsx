import { Autocomplete, Box, Card, FormGroup, TextField } from "@mui/material";
import { FC } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { FormikProps } from "formik";
import { InvoiceListInitialValuesType } from "../../helpers/schema";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { formatDate, newDateFormat } from "@utils";
import { useFetchListContractQuery } from "@services/contractsApi";

interface IAgreementDetails {
  canSave?: boolean;
  formik: FormikProps<InvoiceListInitialValuesType>;
}

export const AgreementDetails: FC<IAgreementDetails> = ({
  formik,
  canSave,
}) => {
  const { values, setFieldValue } = formik;
  const docList = useFetchListContractQuery();

  return (
    <Card title="Детали договора">
      <div className="tw-p-4">
        <FormGroup className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-5 tw-gap-4">
            <TextField
              label="Серия*"
              disabled={!canSave}
              value={values.serial}
              size="small"
              onChange={(event) => {
                setFieldValue("serial", event.target.value);
              }}
            />

            <TextField
              label="Номер*"
              disabled={!canSave}
              value={values.docNo}
              size="small"
              onChange={(event) => {
                setFieldValue("docNo", event.target.value);
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата*"
                inputFormat={newDateFormat}
                value={values.date}
                disabled={!canSave}
                onChange={(newValue) => {
                  setFieldValue("date", newValue);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>

            <Autocomplete
              id="contract"
              fullWidth
              disablePortal
              options={docList.isSuccess ? docList.data.items : []}
              getOptionLabel={(option) => option.docNo as string}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  № {option.docNo} от
                  {formatDate(option.docDate)}
                  на сумму {option.summa}
                </Box>
              )}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField {...params} name="contract" label="Договор*" />
              )}
              value={values.contract}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("contract", value);
              }}
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
