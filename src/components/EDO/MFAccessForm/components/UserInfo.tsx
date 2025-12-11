import { FC } from "react";
import {
  Autocomplete,
  FormGroup,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Card, CustomTextField } from "@ui";
import { getFieldErrors, INN_REGEXP } from "@utils";
import {
  useFetchListTfmisLOginQuery,
  useFetchOrganisationListQuery,
  useFetchTreasureCodesQuery,
  useFetchUserPositionsQuery,
  useFetchUserTypesQuery,
  useFetchYearsQuery,
} from "@services/generalApi";
import { FormikProps } from "formik";
import { InitialValuesType } from "../helpers/schema";
import { docType } from "../helpers/constants";
import { ValueId } from "@services/api";

interface IUserInfo {
  formik: FormikProps<InitialValuesType>;
  canSave?: boolean;
  accessPageResponse: MF.PageAccessInfo[];
  setIsBudget: (val: boolean) => void;
  setPodBudget: (val: boolean) => void;
  setIsSupersivor: (val: boolean) => void;
  setAccessPage: (val: MF.PageAccessInfo[]) => void;
  setmDocType: (val: number) => void;
  setmTreasure: (val: ValueId) => void;
}
export const UserInfo: FC<IUserInfo> = ({
  formik,
  canSave,
  accessPageResponse,
  setIsBudget,
  setPodBudget,
  setIsSupersivor,
  setAccessPage,
  setmDocType,
  setmTreasure,
}) => {
  const yearsQuery = useFetchYearsQuery();
  const treasureCodesQuery = useFetchTreasureCodesQuery();
  const orgList = useFetchOrganisationListQuery({});
  const userTypesQuery = useFetchUserTypesQuery();
  const listTfmisLoginQuery = useFetchListTfmisLOginQuery();
  const userPositionsQuery = useFetchUserPositionsQuery();

  return (
    <Card title="Информация пользователя">
      <div className="tw-grid md:tw-grid-cols-2 tw-gap-6 tw-py-4 tw-px-4 mf_block_bg">
        <FormGroup className="tw-gap-4">
          <div className="tw-grid md:tw-grid-cols-3 tw-gap-4">
            <Autocomplete
              id="userInfo.year"
              disablePortal
              size="small"
              value={formik.values.userInfo?.year}
              options={yearsQuery.data || []}
              getOptionLabel={(option) => option.toString()}
              disabled={true}
              onBlur={formik.handleBlur}
              renderInput={(params) => (
                <TextField
                  name="userInfo.year"
                  label="Финансовый год *"
                  {...params}
                  {...getFieldErrors(formik, "userInfo.year")}
                />
              )}
              onChange={(event, value: any) => {
                formik.setFieldValue("userInfo.year", Number(value.id) || 0);
              }}
            />

            <Autocomplete
              id="userInfo.docType"
              disablePortal
              size="small"
              value={docType.find(
                (b: any) => b.id === formik.values.userInfo?.docType
              )}
              options={docType}
              getOptionLabel={(option) => option?.name}
              disabled={!canSave}
              onBlur={formik.handleBlur}
              renderInput={(params) => (
                <CustomTextField
                  params={params}
                  name="userInfo.docType"
                  label="Тип документа*"
                  onBlur={formik.handleBlur}
                  {...getFieldErrors(formik, "userInfo.docType")}
                />
              )}
              onChange={(event, value) => {
                if (!value) return;
                setIsBudget(value?.id === 1);
                setPodBudget(value?.id === 2);
                setIsSupersivor(value?.id === 3);
                setmDocType(value?.id || 3);
                formik.setFieldValue("userInfo.docType", value?.id);
                setAccessPage(
                  accessPageResponse?.filter((x) => x.type === value?.id)
                );
              }}
            />
            <Autocomplete
              disablePortal
              size="small"
              value={formik.values.userInfo?.treasureCode as any}
              options={treasureCodesQuery.data?.items || []}
              getOptionLabel={(option) => option.value as string}
              disabled={!canSave}
              onBlur={formik.handleBlur}
              renderInput={(params) => (
                <CustomTextField
                  name="userInfo.treasureCode"
                  label="Код казначейства *"
                  params={params}
                  onBlur={formik.handleBlur}
                  {...getFieldErrors(formik, "userInfo.treasureCode")}
                />
              )}
              onChange={(event, value) => {
                setmTreasure(value);
                formik.setFieldValue("userInfo.treasureCode", value);
              }}
            />
          </div>
          <Autocomplete
            id="organization"
            fullWidth
            disablePortal
            options={orgList.data?.items || []}
            getOptionLabel={(option) => option.value as string}
            size="small"
            noOptionsText="Нет данных"
            onBlur={formik.handleBlur}
            renderInput={(params) => (
              <CustomTextField
                name="userInfo.organization"
                label="Организация *"
                params={params}
                onBlur={formik.handleBlur}
                {...getFieldErrors(formik, "userInfo.organization")}
              />
            )}
            value={formik.values.userInfo?.organization as any}
            disabled={!canSave}
            onChange={(event, value) => {
              formik.setFieldValue("userInfo.organization", value);
            }}
          />

          <div className="tw-grid md:tw-grid-cols-2 tw-gap-4">
            <CustomTextField
              name="userInfo.fio"
              label="ФИО *"
              value={formik.values.userInfo?.fio}
              size="small"
              disabled={!canSave}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              {...getFieldErrors(formik, "userInfo.fio")}
            />
            <CustomTextField
              name="userInfo.passPortInfo"
              label="Серия и номер пасопрта *"
              value={formik.values.userInfo?.passPortInfo}
              size="small"
              disabled={!canSave}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              {...getFieldErrors(formik, "userInfo.passPortInfo")}
            />
            <Autocomplete
              id="userInfo.tfmisLogin"
              value={formik.values.userInfo?.tfmisLogin as any}
              disablePortal
              size="small"
              options={listTfmisLoginQuery.data || ([] as any)}
              getOptionLabel={(option) => option}
              disabled={!canSave}
              onBlur={formik.handleBlur}
              renderInput={(params) => (
                <CustomTextField
                  name="userInfo.tfmisLogin"
                  label="Логин *"
                  params={params}
                  onBlur={formik.handleBlur}
                  {...getFieldErrors(formik, "userInfo.tfmisLogin")}
                />
              )}
              onChange={(event, value) => {
                formik.setFieldValue("userInfo.tfmisLogin", value);
              }}
            />
            <CustomTextField
              className="tw-grid-10 "
              name="userInfo.inn"
              label="ИНН *"
              value={formik.values.userInfo?.inn}
              size="small"
              disabled={!canSave}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              {...getFieldErrors(formik, "userInfo.inn")}
              regexp={INN_REGEXP}
              onInput={(e) => {
                (e.target as HTMLInputElement).value = (
                  e.target as HTMLInputElement
                ).value.replace(/[^0-9]/g, "");
              }}
            />
          </div>
        </FormGroup>
        <FormGroup className="tw-gap-4">
          <Autocomplete
            value={formik.values.userInfo?.userType as any}
            disablePortal
            size="small"
            options={userTypesQuery.data?.items || []}
            getOptionLabel={(option) => option.value as string}
            disabled={!canSave}
            renderInput={(params) => (
              <CustomTextField
                name="userInfo.userType"
                label="Тип пользователя *"
                params={params}
                onBlur={formik.handleBlur}
                {...getFieldErrors(formik, "userInfo.userType")}
              />
            )}
            onChange={(event, value) => {
              formik.setFieldValue("userInfo.userType", value);
            }}
          />

          <Autocomplete
            value={formik.values.userInfo?.position as any}
            disablePortal
            size="small"
            options={userPositionsQuery.data?.items || []}
            getOptionLabel={(option) => option.value as string}
            disabled={!canSave}
            renderInput={(params) => (
              <CustomTextField
                name="userInfo.position"
                label="Должность *"
                params={params}
                onBlur={formik.handleBlur}
                {...getFieldErrors(formik, "userInfo.position")}
              />
            )}
            onChange={(event, value) => {
              formik.setFieldValue("userInfo.position", value);
            }}
          />
          <TextField
            name="userInfo.phone"
            label="Моб номер *"
            size="small"
            disabled={!canSave}
            onInput={(e) => {
              (e.target as HTMLInputElement).value = (
                e.target as HTMLInputElement
              ).value.replace(/[^0-9]/g, "");
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+992</InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 9 }}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.userInfo?.phone}
            {...getFieldErrors(formik, "userInfo.phone")}
          />
          <TextField
            name="userInfo.email"
            label="E-Mail *"
            value={formik.values.userInfo?.email}
            size="small"
            disabled={!canSave}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            {...getFieldErrors(formik, "userInfo.email")}
          />
        </FormGroup>
      </div>
    </Card>
  );
};
