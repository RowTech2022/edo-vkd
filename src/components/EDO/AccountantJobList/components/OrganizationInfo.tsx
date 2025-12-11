import { FormikProps } from "formik";
import { FC } from "react";
import { InitialValuesType } from "../helpers/schema";
import { Autocomplete, FormGroup, TextField } from "@mui/material";
import { Card , CustomTextField } from "@ui";
import { getFieldErrors } from "@utils";
import {
  useFetchUserSignaturesQuery,
  useFetchYearsQuery,
} from "@services/generalApi";

interface IOrganizationInfo {
  formik: FormikProps<InitialValuesType>;
  canSave: boolean;
}

export const OrganizationInfo: FC<IOrganizationInfo> = ({
  formik,
  canSave,
}) => {
  const { values, setFieldValue, handleBlur } = formik;

  // queries
  const yearsQuery = useFetchYearsQuery();
  const userSignaturesQuery = useFetchUserSignaturesQuery();

  return (
    <Card title="Информация организации">
      <div className="tw-py-4 tw-px-4 mf_block_bg">
        <FormGroup className="tw-mb-4">
          <div className="tw-grid tw-grid-cols-3 tw-gap-4">
            <Autocomplete
              disablePortal
              value={values.year}
              disabled={true}
              options={yearsQuery.data || []}
              getOptionLabel={(option) => option.toString()}
              size="small"
              renderInput={(params) => (
                <TextField
                  name="year"
                  label="Финансовый год *"
                  {...params}
                  {...getFieldErrors(formik, "year")}
                />
              )}
              onChange={(event, value) => {
                setFieldValue("year", value);
              }}
            />
            <Autocomplete
              id="receiver"
              disablePortal
              value={values.infoCartSignaturas as any}
              disabled={!canSave}
              options={userSignaturesQuery.data?.items || []}
              getOptionLabel={(option) => option.organizationName as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField
                  name="infoCartSignaturas"
                  label="Выберите карточку *"
                  {...params}
                  {...getFieldErrors(formik, "infoCartSignaturas")}
                />
              )}
              onChange={(event, value) => {
                setFieldValue("infoCartSignaturas", value);
              }}
              onBlur={handleBlur}
            />

            <TextField
              name="inn"
              label="ИНН организации *"
              value={values.infoCartSignaturas?.inn}
              disabled={values.infoCartSignaturas?.inn ? false : true}
              focused={values.infoCartSignaturas?.inn ? true : false}
              size="small"
            />

            <CustomTextField
              name="orgName"
              label="Название организации *"
              value={values.infoCartSignaturas?.inn}
              disabled={
                values.infoCartSignaturas?.organizationName ? false : true
              }
              focused={
                values.infoCartSignaturas?.organizationName ? true : false
              }
              size="small"
            />

            <CustomTextField
              name="address"
              label="Адрес *"
              value={values.infoCartSignaturas?.address}
              disabled={values.infoCartSignaturas?.address ? false : true}
              focused={values.infoCartSignaturas?.address ? true : false}
              size="small"
            />
          </div>
        </FormGroup>
        <object
          data="/account.pdf"
          type="application/pdf"
          width="100%"
          height="500px"
          style={{ borderRadius: 16 }}
        >
          <p>
            Alternative text - include a link{" "}
            <a href="/sample.pdf">to the PDF!</a>
          </p>
        </object>
      </div>
    </Card>
  );
};
