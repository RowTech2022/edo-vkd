import { Autocomplete, Card, FormGroup, TextField } from "@mui/material";
import { FC } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { FormikProps } from "formik";
import { TravelExpensesInitialValuesType } from "../../helpers/schema";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { newDateFormat } from "@utils";
import { useFetchUserPositionsQuery } from "@services/generalApi";

interface IAgreementDetails {
  canSave?: boolean;
  formik: FormikProps<TravelExpensesInitialValuesType>;
}

export const AgreementDetails: FC<IAgreementDetails> = ({
  formik,
  canSave,
}) => {
  const { values, setFieldValue } = formik;

  const userPositionsQuery = useFetchUserPositionsQuery();

  return (
    <Card title="Детали договора">
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
                label="Дата*"
                value={values.date}
                inputFormat={newDateFormat}
                disabled={!canSave}
                onChange={(newValue) => {
                  setFieldValue("date", newValue);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>

            <TextField
              label="Срок(дней)*"
              type="number"
              disabled={!canSave}
              value={values.term}
              size="small"
              onChange={(event) => {
                setFieldValue("term", Number(event.target.value));
              }}
            />

            <TextField
              label="Паспорт серия*"
              value={values.passSeries}
              size="small"
              disabled={!canSave}
              onChange={(event) => {
                setFieldValue("passSeries", event.target.value);
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Выдан*"
                value={values.passIssued}
                inputFormat={newDateFormat}
                disabled={!canSave}
                onChange={(newValue) => {
                  setFieldValue("passIssued", newValue);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>

            <TextField
              label="Выдана*"
              className="tw-col-span-2"
              value={values.fio}
              disabled={!canSave}
              size="small"
              onChange={(event) => {
                setFieldValue("fio", event.target.value);
              }}
            />

            <Autocomplete
              disablePortal
              options={
                userPositionsQuery.isSuccess
                  ? userPositionsQuery.data.items
                  : []
              }
              getOptionLabel={(option) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField {...params} name="position" label="Должность*" />
              )}
              value={values.position as any}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("position", value);
              }}
            />

            <TextField
              label="Кем выдан*"
              className="tw-col-span-2"
              disabled={!canSave}
              value={values.passIssuedBy}
              size="small"
              onChange={(event) => {
                setFieldValue("passIssuedBy", event.target.value);
              }}
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
