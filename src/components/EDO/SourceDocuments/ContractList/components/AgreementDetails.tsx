import { Autocomplete, Card, FormGroup, TextField } from "@mui/material";
import { FC } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { FormikProps } from "formik";
import { ContractListInitialValuesType } from "../../helpers/schema";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { newDateFormat } from "@utils";
import { useFetchTendersListQuery } from "@services/tenderApi";
import {
  useFetchCitiesQuery,
  useFetchDoctypesQuery,
} from "@services/generalApi";

interface IAgreementDetails {
  canSave?: boolean;
  formik: FormikProps<ContractListInitialValuesType>;
  setCurDoc: (value: number) => void;
}

export const AgreementDetails: FC<IAgreementDetails> = ({
  formik,
  canSave,
  setCurDoc,
}) => {
  const { values, setFieldValue } = formik;

  const tenderQuery = useFetchTendersListQuery();
  const cityQuery = useFetchCitiesQuery();
  const doctypeQuery = useFetchDoctypesQuery();

  return (
    <Card title="Детали договора">
      <div className="tw-p-4">
        <FormGroup className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-3 tw-gap-4">
            <TextField
              label="Номер*"
              disabled={!canSave}
              value={values.details?.docNo}
              size="small"
              onChange={(event) => {
                setFieldValue("details.docNo", event.target.value);
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата*"
                disabled={!canSave}
                inputFormat={newDateFormat}
                value={values.details?.docDate}
                onChange={(newValue) => {
                  setFieldValue("details.docDate", newValue);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>

            <Autocomplete
              id="tender"
              disablePortal
              options={tenderQuery.isSuccess ? tenderQuery.data.items : []}
              getOptionLabel={(option) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField {...params} name="details.tender" label="Тендер*" />
              )}
              value={values.details?.tender}
              disabled={!canSave}
              onChange={(event, value) => {
                let tt = { id: value?.id + "", value: value?.value };

                setFieldValue("details.tender", tt);
              }}
            />

            <Autocomplete
              id="city"
              disablePortal
              disabled={!canSave}
              options={cityQuery.isSuccess ? cityQuery.data.items : []}
              getOptionLabel={(option) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField {...params} name="details.city" label="Город*" />
              )}
              value={values.details?.city as any}
              onChange={(event, value) => {
                setFieldValue("details.city", value);
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Срок испольнения**"
                disabled={!canSave}
                inputFormat={newDateFormat}
                value={values.details?.term}
                onChange={(newValue) => {
                  setFieldValue("details.term", newValue);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>

            <Autocomplete
              id="dtype"
              disabled={!canSave}
              disablePortal
              options={doctypeQuery.isSuccess ? doctypeQuery.data.items : []}
              getOptionLabel={(option) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="details.docType"
                  label="Тип договора*"
                />
              )}
              value={values.details?.docType as any}
              onChange={(event, value) => {
                setCurDoc(value?.id || 1);
                setFieldValue("details.docType", value);
              }}
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
