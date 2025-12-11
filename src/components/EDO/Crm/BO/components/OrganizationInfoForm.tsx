import { FC } from "react";
import { Card } from "@ui";

import { FormikProps } from "node_modules/formik/dist";
import { Autocomplete, FormGroup, TextField } from "@mui/material";
import {
  useFetchSeqnumsQuery,
  useFetchTreasureCodesQuery,
  useFetchYearsQuery,
} from "@services/generalApi";
import { useFetchPBSQuery } from "@services/pbsApi";

interface IProps {
  formik: FormikProps<any>;
  canSave?: boolean;
  LoadMfAccess: (obj: any) => void;
}

export const OrganizationInfoForm: FC<IProps> = ({
  formik,
  canSave,
  LoadMfAccess,
}) => {
  const yearsQuery = useFetchYearsQuery();
  const treasureCodesQuery = useFetchTreasureCodesQuery();
  const pbsQuery = useFetchPBSQuery({ filter: "" });
  const seqnumsQuery = useFetchSeqnumsQuery();

  const { values, setFieldValue, handleChange } = formik;

  return (
    <Card title="Информация организации">
      <div className="tw-flex tw-flex-col tw-gap-6 tw-px-4 tw-py-6">
        <FormGroup>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4">
            <Autocomplete
              id="year"
              disablePortal
              options={yearsQuery.isSuccess ? yearsQuery.data : []}
              getOptionLabel={(option) => option.toString()}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="organisation.year"
                  label="Финансовый год*"
                />
              )}
              value={values.organisation?.year}
              disabled={true}
              onChange={(event, value) => {
                setFieldValue("organisation.year", value);
              }}
            />
            <Autocomplete
              id="treasureCode"
              disablePortal
              options={
                treasureCodesQuery.isSuccess
                  ? treasureCodesQuery.data.items
                  : []
              }
              getOptionLabel={(option) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="organisation.treasureCode"
                  label="Код - Наименование*"
                />
              )}
              value={values.organisation?.treasureCode as any}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("organisation.treasureCode", value);
              }}
            />

            <TextField
              name="organisation.inn"
              label="ИНН Организации*"
              size="small"
              value={values.organisation?.inn}
              disabled={!canSave}
              onChange={handleChange}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <TextField
              name="organisation.orgName"
              label="Название организации"
              size="small"
              value={values.organisation?.orgName}
              disabled={!canSave}
              onChange={handleChange}
            />
            <TextField
              name="organisation.address"
              label="Адрес"
              size="small"
              value={values.organisation?.address}
              disabled={!canSave}
              onChange={handleChange}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
            <Autocomplete
              id="organisation.pbsCode"
              disablePortal
              options={pbsQuery.isSuccess ? pbsQuery.data.items : []}
              getOptionLabel={(option) => option.value as string}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="organisation.pbsCode"
                  label="Код ПБС*"
                />
              )}
              value={values.organisation?.pbsCode}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("organisation.pbsCode", value);
              }}
            />
            <Autocomplete
              multiple
              disablePortal
              options={seqnumsQuery.data?.items || []}
              getOptionLabel={(option) => option?.value!}
              size="small"
              noOptionsText="Нет данных"
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="organisation.seqnums"
                  label="Бюджетные заявки *"
                />
              )}
              value={values.organisation?.seqnums!}
              disabled={!canSave}
              onChange={(event, value) => {
                setFieldValue("organisation.seqnums", value);
                LoadMfAccess({ id: 1, seq: value });
              }}
            />
          </div>
        </FormGroup>
      </div>
    </Card>
  );
};
