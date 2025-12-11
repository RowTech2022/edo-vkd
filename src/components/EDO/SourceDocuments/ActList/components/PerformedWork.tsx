import { FC } from "react";
import { Autocomplete, Box, FormGroup, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Card } from "@ui";

import "react-datepicker/dist/react-datepicker.css";
import { newDateFormat , formatDate } from "@utils";
import { FormikProps } from "formik";
import { ActListInitialValuesType } from "../../helpers/schema";
import { useFetchListContractQuery } from "@services/contractsApi";

interface IPerformedWork {
  canSave?: boolean;
  formik: FormikProps<ActListInitialValuesType>;
}

export const PerformedWork: FC<IPerformedWork> = ({ canSave, formik }) => {
  const { values, setFieldValue } = formik;

  const docList = useFetchListContractQuery();
  return (
    <Card title="Детали выполненных работ">
      <div className="tw-p-4">
        <FormGroup className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-5 tw-gap-4">
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
                label="Дата выдачи"
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
              className="tw-col-span-2"
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

            <TextField
              label="Сумма"
              value={values.summa}
              size="small"
              disabled={!canSave}
              onChange={(event) => {
                setFieldValue("summa", Number(event.target.value));
              }}
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
