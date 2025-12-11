import { Autocomplete, Card, FormGroup, TextField } from "@mui/material";
import { FC } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { FormikProps } from "formik";
import { ProxyListInitialValuesType } from "../../helpers/schema";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { newDateFormat } from "@utils";
import { useFetchUserPositionsQuery } from "@services/generalApi";

interface IProxyDetails {
  canSave?: boolean;
  formik: FormikProps<ProxyListInitialValuesType>;
}

export const ProxyDetails: FC<IProxyDetails> = ({ formik, canSave }) => {
  const { values, setFieldValue } = formik;

  const userPositionsQuery = useFetchUserPositionsQuery();

  return (
    <Card title="Детали доверенности">
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

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Действительна до"
                inputFormat={newDateFormat}
                disabled={!canSave}
                value={values.validUntil}
                onChange={(newValue) => {
                  setFieldValue("validUntil", newValue);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>

            <TextField
              label="Серия паспорта"
              value={values.passSeries}
              size="small"
              disabled={!canSave}
              onChange={(event) => {
                setFieldValue("passSeries", event.target.value);
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата выдачи паспорта*"
                inputFormat={newDateFormat}
                value={values.passIssued}
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
              label="Кем выдан паспорт"
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
