import { Autocomplete, Card , FormGroup, TextField } from "@mui/material";
import { FC } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { FormikProps } from "formik";
import { ContractListInitialValuesType } from "../../helpers/schema";
import {
  useFetchRecieversQuery,
  useFetchSuppliersQuery,
} from "@services/userprofileApi";

interface IMainInfo {
  canSave?: boolean;
  formik: FormikProps<ContractListInitialValuesType>;
}

export const MainInfo: FC<IMainInfo> = ({ formik, canSave }) => {
  const { values, setFieldValue, handleChange } = formik;

  const suppliersQuery = useFetchSuppliersQuery();
  const receiversQuery = useFetchRecieversQuery();

  return (
    <Card title="Основная информация">
      <div className="tw-p-4">
        <FormGroup className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-3 tw-gap-4">
            <Autocomplete
              id="suplier"
              disablePortal
              options={
                suppliersQuery.isSuccess ? suppliersQuery.data.items : []
              }
              getOptionLabel={(option) => option.info?.value as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="mainInformation.supplier"
                  label="Поставщик*"
                />
              )}
              value={values.mainInformation?.supplier}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("mainInformation.supplier", value);
              }}
            />

            <Autocomplete
              id="receiver"
              disablePortal
              options={
                receiversQuery.isSuccess ? receiversQuery.data.items : []
              }
              getOptionLabel={(option) => option.info?.value as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="mainInformation.receiver"
                  label="Получатель*"
                />
              )}
              value={values.mainInformation?.receiver}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("mainInformation.receiver", value);
              }}
            />

            <TextField
              label="Сумма*"
              type="number"
              value={values.mainInformation?.summa}
              size="small"
              disabled={!canSave}
              onChange={(event) => {
                setFieldValue(
                  "mainInformation.summa",
                  parseFloat(event.target.value)
                );
              }}
            />

            <TextField
              name="supplier"
              label="Резвизиты поставщика*"
              value={values.mainInformation?.supplier?.requisites}
              disabled={
                values.mainInformation?.supplier?.requisites ? false : true
              }
              focused={
                values.mainInformation?.supplier?.requisites ? true : false
              }
              size="small"
              onChange={handleChange}
            />

            <TextField
              name="receiver"
              value={values.mainInformation?.receiver?.requisites}
              placeholder="Резвизиты получателя*"
              disabled
              size="small"
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
