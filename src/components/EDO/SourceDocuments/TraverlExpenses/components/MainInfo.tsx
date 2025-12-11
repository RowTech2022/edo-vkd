import { Autocomplete, Card , FormGroup, TextField } from "@mui/material";
import { FC } from "react";

import "react-datepicker/dist/react-datepicker.css";
import { FormikProps } from "formik";
import { TravelExpensesInitialValuesType } from "../../helpers/schema";
import { useFetchOrganisationsQuery } from "@services/userprofileApi";

interface IMainInfo {
  canSave?: boolean;
  formik: FormikProps<TravelExpensesInitialValuesType>;
}

export const MainInfo: FC<IMainInfo> = ({ formik, canSave }) => {
  const { values, setFieldValue } = formik;

  const orgList = useFetchOrganisationsQuery().data?.items.map((el) => {
    return {
      id: el.id.toString(),
      value: el.displayName,
    };
  });

  return (
    <Card title="Основная информация">
      <div className="tw-p-4">
        <FormGroup className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-6 tw-gap-4">
            <div className="tw-col-span-2">
              <Autocomplete
                id="contract"
                fullWidth
                disablePortal
                options={orgList || []}
                getOptionLabel={(option) => option.value as string}
                size="small"
                noOptionsText="Нет данных"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="organisation"
                    label="Организация*"
                  />
                )}
                value={values.organisation}
                disabled={!canSave}
                onChange={(event, value) => {
                  setFieldValue("organisation", value);
                }}
              />
              <br />
              <TextField
                label="Командированному в*"
                fullWidth
                value={values.destination}
                disabled={!canSave}
                size="small"
                onChange={(event) => {
                  setFieldValue("destination", event.target.value);
                }}
              />
            </div>

            <TextField
              label="Цель командировки*"
              size="small"
              disabled={!canSave}
              className="tw-col-span-4"
              value={values.purpose}
              multiline
              minRows={4}
              onChange={(event) => {
                setFieldValue("purpose", event.target.value);
              }}
              required
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
