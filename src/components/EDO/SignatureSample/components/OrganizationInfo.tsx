import { FC } from "react";

import { FormikProps } from "formik";
import { InitialValuesType } from "../helpers/schema";
import { Card, CustomTextField } from "@ui";
import { getFieldErrors } from "@utils";
import {
  Autocomplete,
  FormGroup,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useFetchAccountQuery, useFetchYearsQuery } from "@services/generalApi";

interface IOrganizationInfo {
  formik: FormikProps<InitialValuesType>;
  canSave?: boolean;
}

export const OrganizationInfo: FC<IOrganizationInfo> = ({
  formik,
  canSave,
}) => {
  const yearsQuery = useFetchYearsQuery();
  const accountQuery = useFetchAccountQuery();

  return (
    <Card title="Информация организации">
      <div style={{ paddingTop: 10 }} className="tw-py-4 tw-px-4 mf_block_bg">
        <FormGroup className="tw-gap-4">
          <div className="tw-grid tw-grid-cols-3 tw-gap-4">
            <Autocomplete
              disablePortal
              value={formik.values.organisationInfo.year}
              disabled={true}
              options={yearsQuery.data || []}
              getOptionLabel={(option) => option.toString()}
              size="small"
              renderInput={(params) => (
                <TextField name="year" label="Финансовый год *" {...params} />
              )}
              onChange={formik.handleChange}
            />
            <TextField
              name="organisationInfo.orgPhone"
              label="Телефон организации *"
              value={formik.values.organisationInfo?.orgPhone}
              disabled={!canSave}
              size="small"
              onChange={formik.handleChange}
              onInput={(e) => {
                (e.target as HTMLInputElement).value = (
                  e.target as HTMLInputElement
                ).value.replace(/[^0-9]/g, "");
              }}
              onBlur={formik.handleBlur}
              {...getFieldErrors(formik, "organisationInfo.orgPhone")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+992</InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 9 }}
            />

            <TextField
              name="organisationInfo.inn"
              label="ИНН Организации *"
              value={formik.values.organisationInfo?.inn}
              disabled={!canSave}
              size="small"
              onChange={formik.handleChange}
              onInput={(e) => {
                (e.target as HTMLInputElement).value = (
                  e.target as HTMLInputElement
                ).value.replace(/[^0-9]/g, "");
              }}
              inputProps={{ maxLength: 9 }}
              onBlur={formik.handleBlur}
              {...getFieldErrors(formik, "organisationInfo.inn")}
            />
          </div>
          <div className="tw-grid tw-grid-cols-2 tw-gap-4">
            <CustomTextField
              name="organisationInfo.organizationName"
              label="Название организации *"
              value={formik.values.organisationInfo?.organizationName}
              disabled={!canSave}
              size="small"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              {...getFieldErrors(formik, "organisationInfo.organizationName")}
            />
            <CustomTextField
              name="organisationInfo.address"
              label="Адрес *"
              value={formik.values.organisationInfo?.address}
              disabled={!canSave}
              size="small"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              {...getFieldErrors(formik, "organisationInfo.address")}
            />
          </div>
          <Autocomplete
            id="accounts"
            disablePortal
            value={formik.values.organisationInfo?.accounts! || []}
            multiple
            size="small"
            disabled={!canSave}
            options={accountQuery.data || []}
            getOptionLabel={(option) => option?.toString()}
            renderInput={(params) => (
              <CustomTextField
                name="organisationInfo.accounts *"
                label="Счёт"
                {...params}
                onBlur={formik.handleBlur}
                {...getFieldErrors(formik, "organisationInfo.accounts")}
              />
            )}
            onChange={(event, value) => {
              formik.setFieldValue("organisationInfo.accounts", value);
            }}
          />
        </FormGroup>
      </div>
    </Card>
  );
};
