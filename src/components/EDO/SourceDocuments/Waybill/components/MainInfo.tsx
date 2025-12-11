import { Card , FormGroup, TextField } from "@mui/material";
import { FC } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { FormikProps } from "formik";
import { WaybillInitialValuesType } from "../../helpers/schema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { newDateFormat } from "@utils";

interface IMainInfo {
  canSave?: boolean;
  formik: FormikProps<WaybillInitialValuesType>;
}

export const MainInfo: FC<IMainInfo> = ({ formik, canSave }) => {
  const { values, setFieldValue } = formik;

  return (
    <Card title="Основная информация">
      <div className="tw-p-4">
        <FormGroup className="tw-mb">
          <div className="tw-grid tw-grid-cols-4 tw-gap-4">
            <TextField
              id="pos1"
              defaultValue=""
              placeholder="Поставщик*"
              value={values.contract?.supplier?.info?.value}
              disabled
              size="small"
            />

            <TextField
              label="Через*"
              disabled={!canSave}
              value={values.through}
              size="small"
              onChange={(event) => {
                setFieldValue("through", event.target.value);
              }}
            />

            <TextField
              placeholder="Получатель*"
              value={values.contract?.receiver?.info?.value}
              disabled
              size="small"
            />

            <TextField
              label="Сумма*"
              type="number"
              value={values.summa}
              disabled
              size="small"
              onChange={(event) => {
                setFieldValue("summa", parseFloat(event.target.value));
              }}
            />

            <TextField
              label="Отпутсил*"
              value={values.letBy}
              disabled={!canSave}
              size="small"
              onChange={(event) => {
                setFieldValue("letBy", event.target.value);
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата отпуска*"
                inputFormat={newDateFormat}
                disabled={!canSave}
                value={values.letDate}
                onChange={(newValue) => {
                  setFieldValue("letDate", newValue);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>

            <TextField
              label="Принял*"
              value={values.acceptedBy}
              disabled={!canSave}
              size="small"
              onChange={(event) => {
                setFieldValue("acceptedBy", event.target.value);
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Дата приемки*"
                inputFormat={newDateFormat}
                disabled={!canSave}
                value={values.acceptedDate}
                onChange={(newValue) => {
                  setFieldValue("acceptedDate", newValue);
                }}
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
