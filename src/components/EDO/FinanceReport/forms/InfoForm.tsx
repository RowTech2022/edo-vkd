import { FormGroup } from "@mui/material";
import { FormikProps } from "formik";
import { FC, useState } from "react";
import { IFinanceReportsCreateRequest } from "@services/financeReport/models/create";
import { Card , FormTextField, FormAutocomplete } from "@ui";
import {
  useFetchGovernmentsQuery,
  useFetchIndustriesQuery,
  useFetchOrganisationListQuery,
  useFetchOwnershipTypesQuery,
} from "@services/generalApi";
import { getFieldErrors } from "@utils";

interface IInfoForm {
  formik: FormikProps<IFinanceReportsCreateRequest>;
}

type FinanceReportKeys = keyof IFinanceReportsCreateRequest;

const digitRegexp = /^[0-9]{0,}$/;
const innRegexp = /^[0-9]{9}$/;

export const InfoForm: FC<IInfoForm> = ({ formik }) => {
  const { values, errors, touched, setFieldValue } = formik;
  const [text, setText] = useState<string | undefined>();
  const { data: companyList } = useFetchOrganisationListQuery({ text });
  const { data: industryList } = useFetchIndustriesQuery();
  const { data: governmentList } = useFetchGovernmentsQuery();
  const { data: ownershipTypeList } = useFetchOwnershipTypesQuery();

  const onCompanyInputChange = (e: any, value: string) => {
    setText(value);
  };

  const getInputStyles = (name: FinanceReportKeys) => {
    if (touched[name] && errors[name])
      return {
        borderColor: "red",
      };
    return {};
  };

  return (
    <Card title="Основная информация">
      <div style={{ paddingTop: 10 }} className="tw-py-4 tw-px-4 mf_block_bg">
        <FormGroup>
          <div className="tw-grid tw-grid-cols-3 tw-gap-4">
            <FormAutocomplete
              disablePortal
              style={getInputStyles("company")}
              options={companyList?.items || []}
              getOptionLabel={(option: any) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              name="company"
              label="Компания*"
              value={values.company}
              isOptionEqualToValue={(option: any, value: any) =>
                option.id === value.id
              }
              onChange={(event, value: any) => {
                setFieldValue("company", value);
                setText(value?.value);
              }}
              {...getFieldErrors(formik, "company")}
              color="red"
              onInputChange={onCompanyInputChange}
            />

            <FormAutocomplete
              disablePortal
              options={industryList?.items || []}
              getOptionLabel={(option: any) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              name="industry"
              label="Отрасль*"
              value={values.industry}
              isOptionEqualToValue={(option: any, value: any) =>
                option.id === value.id
              }
              onChange={(event, value) => {
                setFieldValue("industry", value);
              }}
              {...getFieldErrors(formik, "industry")}
            />

            <FormAutocomplete
              disablePortal
              options={ownershipTypeList?.items || []}
              getOptionLabel={(option: any) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              name="ownershipType"
              label="Тип собственности*"
              value={values.ownershipType}
              isOptionEqualToValue={(option: any, value: any) =>
                option.id === value.id
              }
              onChange={(event, value) => {
                setFieldValue("ownershipType", value);
              }}
              {...getFieldErrors(formik, "ownershipType")}
            />

            <FormAutocomplete
              disablePortal
              options={governmentList?.items || []}
              getOptionLabel={(option: any) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              name="government"
              label="Орган управления*"
              value={values.government}
              isOptionEqualToValue={(option: any, value: any) =>
                option.id === value.id
              }
              onChange={(event, value) => {
                setFieldValue("government", value);
              }}
              {...getFieldErrors(formik, "government")}
            />
            <FormTextField
              label="ИНН*"
              value={values.inn}
              size="small"
              onChange={(event) => {
                const val = event.target.value;
                if (!digitRegexp.test(val) || val.length > 9) return;

                setFieldValue("inn", val);
              }}
              {...getFieldErrors(formik, "inn")}
            />
            <FormTextField
              label="Номер телефона*"
              value={values.phone}
              size="small"
              onChange={(event) => {
                const val = event.target.value;
                if (!digitRegexp.test(val) || val.length > 9) return;
                setFieldValue("phone", val);
              }}
              {...getFieldErrors(formik, "phone")}
            />
            <FormTextField
              label="Адрес*"
              value={values.address}
              size="small"
              onChange={(event) => {
                setFieldValue("address", event.target.value);
              }}
              {...getFieldErrors(formik, "address")}
            />
            <FormTextField
              label="Бухгалтер*"
              value={values.accountant}
              size="small"
              onChange={(event) => {
                setFieldValue("accountant", event.target.value);
              }}
              {...getFieldErrors(formik, "accountant")}
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
