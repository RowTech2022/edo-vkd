import { FormGroup } from "@mui/material";
import { FormikProps } from "formik";
import { FC } from "react";
import { IFinanceReportsCreateRequest } from "@services/financeReport/models/create";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Card , FormAutocomplete, FormTextField } from "@ui";
import {
  useFetchCurrenciesQuery,
  useFetchReportTypesQuery,
} from "@services/generalApi";

import { getFieldErrors , newDateFormat } from "@utils";

interface IDetailsForm {
  formik: FormikProps<IFinanceReportsCreateRequest>;
}

export const DetailsForm: FC<IDetailsForm> = ({ formik }) => {
  const { values, setFieldValue } = formik;
  const { data: currencies } = useFetchCurrenciesQuery();
  const { data: reportTypes } = useFetchReportTypesQuery();

  return (
    <Card title="Детали отчета">
      <div style={{ paddingTop: 10 }} className="tw-py-4 tw-px-4 mf_block_bg">
        <FormGroup>
          <div className="tw-grid tw-grid-cols-4 tw-gap-4">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата*"
                inputFormat={newDateFormat}
                value={values.date}
                onChange={(newValue) => {
                  setFieldValue("date", newValue);
                }}
                renderInput={(params) => (
                  <FormTextField
                    size="small"
                    {...params}
                    {...getFieldErrors(formik, "date")}
                  />
                )}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Срок*"
                inputFormat={newDateFormat}
                value={values.term}
                onChange={(newValue) => {
                  setFieldValue("term", newValue);
                }}
                renderInput={(params) => (
                  <FormTextField
                    size="small"
                    {...params}
                    {...getFieldErrors(formik, "term")}
                  />
                )}
              />
            </LocalizationProvider>

            <FormAutocomplete
              disablePortal
              options={reportTypes?.items || []}
              getOptionLabel={(option: any) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              name="reportType"
              label="Тип*"
              value={values.reportType}
              isOptionEqualToValue={(option: any, value: any) =>
                option.id === value.id
              }
              {...getFieldErrors(formik, "reportType")}
              onChange={(event, value) => {
                setFieldValue("reportType", value);
              }}
            />

            <FormAutocomplete
              disablePortal
              options={currencies?.items || []}
              getOptionLabel={(option: any) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              name="measure"
              label="Валюта*"
              isOptionEqualToValue={(option: any, value: any) =>
                option.id === value.id
              }
              value={values.measure}
              {...getFieldErrors(formik, "measure")}
              onChange={(event, value) => {
                setFieldValue("measure", value);
              }}
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
